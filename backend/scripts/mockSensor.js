#!/usr/bin/env node
/**
 * Mock IoT sensors:
 * - loads MED-* containers from PostgreSQL
 * - writes warmup telemetry directly to MongoDB for ML training history
 * - sends live telemetry to the backend API when available so alerts/tasks fire
 * - falls back to direct MongoDB writes when the backend API is unavailable
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const axios = require('axios');
const { ensureMedContainers, loadMedBinsFromDb } = require('./ensureMedContainers');
const { closeConnections, initMongo, History } = require('./seed/utils');

const base = (process.env.BACKEND_BASE_URL || 'http://127.0.0.1:5000').trim().replace(/\/+$/, '');
const intervalMs = Number(process.env.MOCK_SENSOR_INTERVAL_MS) || 5000;
const binCount = Number(process.env.MOCK_BIN_COUNT) || 60;
const stepHours = Number(process.env.MOCK_HISTORY_STEP_HOURS) || 0.5;
const mlWarmupPoints = Number(process.env.MOCK_ML_WARMUP_POINTS) || 12;
const API = `${base}/api/telemetry`;
const PREDICT_API = `${base}/api/bins/predict`;

const FILL_PROFILES = [
  { fullness: 15, fillRatePerHour: 2.5 },
  { fullness: 60, fillRatePerHour: 1.0 },
  { fullness: 40, fillRatePerHour: 3.5 },
  { fullness: 78, fillRatePerHour: 0.8 },
  { fullness: 25, fillRatePerHour: 1.8 },
];

let bins = [];
let tickCount = 0;
let ticking = false;
let intervalHandle = null;

function shortLabel(location, qrCode) {
  if (!location) return qrCode;
  const parts = location.split(',').map((s) => s.trim());
  if (parts.length >= 2) return `${parts[0]} - ${parts[1]}`;
  return location.length > 48 ? `${location.slice(0, 45)}...` : location;
}

function initVirtualClock(bin) {
  const spanHours = mlWarmupPoints * stepHours;
  bin.historyStep = 0;
  bin.virtualStartMs = Date.now() - spanHours * 3600000;
}

function resumeVirtualClock(bin, latestTimestamp) {
  const latestMs = new Date(latestTimestamp).getTime();
  if (!Number.isFinite(latestMs)) {
    initVirtualClock(bin);
    return;
  }

  bin.historyStep = 0;
  bin.virtualStartMs = latestMs + stepHours * 3600000;
  bin.hasExistingTelemetry = true;
}

function nextTimestamp(bin) {
  const ts = new Date(bin.virtualStartMs + bin.historyStep * stepHours * 3600000);
  bin.historyStep += 1;
  return ts.toISOString();
}

function attachSimulationState(containers) {
  return containers.map((container, index) => {
    const profile = FILL_PROFILES[index % FILL_PROFILES.length];
    const jitter = (Math.random() - 0.5) * 8;
    const bin = {
      id: container.id,
      location: container.location,
      wasteType: container.wasteType,
      label: shortLabel(container.location, container.id),
      fullness: Math.max(8, Math.min(88, profile.fullness + jitter)),
      fillRatePerHour: profile.fillRatePerHour * (0.85 + Math.random() * 0.3),
    };
    initVirtualClock(bin);
    return bin;
  });
}

async function hydrateBinsFromHistory() {
  let hydrated = 0;

  for (const bin of bins) {
    const latest = await History.findOne({ binId: bin.id }).sort({ timestamp: -1 }).lean();
    const latestFullness = Number(latest?.fullness);

    if (!latest || !Number.isFinite(latestFullness)) continue;

    bin.fullness = Math.max(0, Math.min(96, latestFullness));
    resumeVirtualClock(bin, latest.timestamp);
    hydrated += 1;
  }

  console.log(`Hydrated ${hydrated}/${bins.length} bins from existing MongoDB telemetry`);
}

function logHeader() {
  console.log(`Mock sensor: ${bins.length} bins | step=${stepHours}h | ML warmup=${mlWarmupPoints} points`);
  console.log(`Backend telemetry API: ${API}`);
  console.log(`Prediction sample API: ${PREDICT_API}/:qrCode`);
  console.log(`Tick interval: ${intervalMs / 1000}s`);
  console.log('-'.repeat(72));
  bins.slice(0, 3).forEach((b) => {
    console.log(`  ${b.id} [${b.wasteType}] ${b.label} @ ${b.fullness.toFixed(1)}%`);
  });
  if (bins.length > 3) console.log(`  ... +${bins.length - 3} more MED-* containers`);
  console.log('-'.repeat(72));
}

async function storeHistoryReading(bin, timestamp, { quiet = false, source = 'mongo' } = {}) {
  const fullness = Number(bin.fullness.toFixed(1));
  await new History({ binId: bin.id, fullness, timestamp }).save();

  if (!quiet) {
    console.log(`Stored ${bin.id} [${bin.wasteType}] -> ${fullness}% via ${source} (${bin.label})`);
  }

  return true;
}

async function sendReading(bin, { quiet = false, preferApi = true } = {}) {
  const timestamp = nextTimestamp(bin);
  const fullness = Number(bin.fullness.toFixed(1));

  if (!preferApi) {
    return storeHistoryReading(bin, timestamp, { quiet, source: 'mongo' });
  }

  try {
    const { data, status } = await axios.post(
      API,
      { binId: bin.id, fullness, timestamp },
      { timeout: 10000 },
    );

    if (data?.ignored) {
      if (!quiet) console.warn(`${bin.id} ignored by backend: ${data.reason}`);
      return false;
    }

    if (!quiet) {
      console.log(`Sent ${bin.id} [${bin.wasteType}] -> ${fullness}% via backend (${bin.label})`);
    }

    return status === 200;
  } catch (err) {
    const msg = err.response?.data?.error || err.response?.data?.message || err.code || err.message;
    if (!quiet) console.warn(`${bin.id} backend telemetry failed (${msg}); storing in MongoDB directly`);
    return storeHistoryReading(bin, timestamp, { quiet, source: 'mongo fallback' });
  }
}

async function warmupMlHistory() {
  console.log(`Warming ML history: ${mlWarmupPoints} points / ${(mlWarmupPoints * stepHours).toFixed(1)}h per bin`);
  let ok = 0;

  for (const bin of bins) {
    initVirtualClock(bin);
    const startFull = Math.max(8, bin.fullness - bin.fillRatePerHour * stepHours * mlWarmupPoints);
    bin.fullness = startFull;

    for (let i = 0; i < mlWarmupPoints; i += 1) {
      const noise = (Math.random() - 0.3) * 0.25;
      bin.fullness += bin.fillRatePerHour * stepHours + noise;
      bin.fullness = Math.max(0, Math.min(96, bin.fullness));
      if (await sendReading(bin, { quiet: true, preferApi: false })) ok += 1;
    }
  }

  console.log(`Warmup done: ${ok} readings inserted into MongoDB`);
}

async function sampleMlPredictions() {
  const samples = [bins[0], bins[Math.floor(bins.length / 2)], bins[bins.length - 1]].filter(Boolean);

  for (const bin of samples) {
    try {
      const { data } = await axios.get(`${PREDICT_API}/${bin.id}`, { timeout: 12000 });
      const hours = data?.predictedHoursToFull;
      const confidence = data?.confidence;

      if (hours != null) {
        console.log(`ML ${bin.id}: ~${hours}h to full (confidence ${confidence ?? '-'}%)`);
      } else {
        console.log(`ML ${bin.id}: ${data?.note || data?.status || 'waiting for history'}`);
      }
    } catch (err) {
      console.warn(`ML ${bin.id}: ${err.response?.data?.error || err.message}`);
    }
  }
}

async function tick() {
  if (ticking) {
    console.warn('Previous mock sensor tick is still running; skipping overlapping tick');
    return;
  }

  ticking = true;
  tickCount += 1;
  let ok = 0;

  try {
    for (const bin of bins) {
      const noise = (Math.random() - 0.3) * 0.25;
      bin.fullness += bin.fillRatePerHour * stepHours + noise;

      if (bin.fullness >= 99) {
        const resetLevel = 12 + Math.random() * 12;
        console.log(`${bin.id} collected; reset to ${resetLevel.toFixed(1)}%`);
        bin.fullness = resetLevel;
      }

      bin.fullness = Math.max(0, Math.min(100, bin.fullness));
      if (await sendReading(bin)) ok += 1;
    }

    console.log(`Tick #${tickCount}: ${ok}/${bins.length} readings stored`);

    if (tickCount === 1 || tickCount % 6 === 0) {
      await sampleMlPredictions();
    }
  } catch (err) {
    console.error(`Mock sensor tick failed: ${err.message}`);
  } finally {
    ticking = false;
  }
}

async function main() {
  console.log('Starting mock sensors...');
  console.log(`Config: bins=${binCount}, intervalMs=${intervalMs}, warmupPoints=${mlWarmupPoints}, stepHours=${stepHours}`);

  if (process.env.MOCK_ENSURE_CONTAINERS !== 'false') {
    await ensureMedContainers(binCount);
  }

  await initMongo();

  const fromDb = await loadMedBinsFromDb(binCount);
  if (!fromDb || fromDb.length === 0) {
    throw new Error('No MED-* containers found in PostgreSQL. Run npm run mock:containers or set MOCK_ENSURE_CONTAINERS=true.');
  }

  bins = attachSimulationState(fromDb);
  console.log(`Loaded ${fromDb.length} containers from PostgreSQL`);
  await hydrateBinsFromHistory();
  logHeader();

  if (process.env.MOCK_ML_WARMUP !== 'false') {
    await warmupMlHistory();
    await sampleMlPredictions();
  }

  await tick();
  intervalHandle = setInterval(tick, intervalMs);
  console.log(`Mock sensors running. Press Ctrl+C to stop. Next tick in ${intervalMs / 1000}s.`);
}

main().catch(async (err) => {
  console.error(`Mock sensor failed: ${err.message}`);
  await closeConnections();
  process.exit(1);
});

process.on('SIGINT', async () => {
  if (intervalHandle) clearInterval(intervalHandle);
  console.log('\nStopping mock sensors...');
  await closeConnections();
  process.exit(0);
});
