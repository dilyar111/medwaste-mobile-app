#!/usr/bin/env node
/**
 * Upserts MED-001 … MED-N containers in Postgres for mock sensors + ML predict.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const {
  initPostgres,
  closeConnections,
  readJson,
  pick,
  rand,
  getDefaultCompanyId,
} = require('./seed/utils');

const Container = require('../models/pg/Container');

const WASTE_TYPES = ['A', 'B', 'C', 'D'];

function validateCoordinate(lat, lon) {
  return Number.isFinite(lat) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

function generateMedContainers(count = 60) {
  const config = readJson('containers.json');
  const locations = config.locations || [];

  return Array.from({ length: count }, (_, index) => {
    const location = pick(locations, index);
    const offset = Math.floor(index / Math.max(locations.length, 1));
    const lat = Number((location.lat + rand(-0.0022, 0.0022)).toFixed(6));
    const lon = Number((location.lon + rand(-0.0022, 0.0022)).toFixed(6));
    if (!validateCoordinate(lat, lon)) {
      throw new Error(`Invalid coordinates for bin ${index + 1}`);
    }

    return {
      qrCode: `MED-${String(index + 1).padStart(3, '0')}`,
      wasteType: pick(WASTE_TYPES, index),
      location: `${location.name}, ${location.department}, Floor ${offset + 1}`,
      lat,
      lon,
    };
  });
}

async function ensureMedContainers(count = Number(process.env.MOCK_BIN_COUNT) || 60) {
  await initPostgres();
  const companyId = await getDefaultCompanyId();
  const safeCount = Math.max(1, Math.min(80, count));
  const containers = generateMedContainers(safeCount);
  let created = 0;

  for (const container of containers) {
    const [, wasCreated] = await Container.upsert({
      ...container,
      companyId,
    });
    if (wasCreated) created += 1;
  }

  console.log(`[ensureMedContainers] ${containers.length} bins ready (MED-001 … MED-${String(safeCount).padStart(3, '0')}), ${created} new`);
  return containers.length;
}

async function loadMedBinsFromDb(count = Number(process.env.MOCK_BIN_COUNT) || 60) {
  await initPostgres();
  const safeCount = Math.max(1, Math.min(80, Number(count) || 60));
  const containers = await Container.findAll({
    attributes: ['qrCode', 'location', 'wasteType', 'lat', 'lon'],
    order: [['qrCode', 'ASC']],
  });

  const medContainers = containers
    .map((container) => container.get({ plain: true }))
    .filter((container) => /^MED-\d{3}$/i.test(String(container.qrCode || '')))
    .slice(0, safeCount)
    .map((container) => ({
      id: container.qrCode,
      location: container.location,
      wasteType: container.wasteType,
      lat: container.lat,
      lon: container.lon,
    }));

  return medContainers.length ? medContainers : null;
}

if (require.main === module) {
  ensureMedContainers()
    .then(() => closeConnections())
    .catch(async (err) => {
      console.error('[ensureMedContainers] failed:', err.message);
      await closeConnections();
      process.exit(1);
    });
}

module.exports = { ensureMedContainers, generateMedContainers, loadMedBinsFromDb };
