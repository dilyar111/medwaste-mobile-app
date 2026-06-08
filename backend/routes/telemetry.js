const router = require('express').Router();
const History = require('../models/mongo/History');
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const Container = require('../models/pg/Container');
const Task = require('../models/pg/Task');
const User = require('../models/pg/User');
const { autoAssignDriver } = require('../services/autoAssign');
const { checkTelemetryRateLimit } = require('../services/redis');
const { sendEmailAlert } = require('../services/email');
const { emitTelemetry, emitAlert, emitNotification } = require('../services/Socket');
const { Op } = require('sequelize');
const { hasValidCoordinates, normalizeQrCode } = require('../utils/containerValidation');

async function notifyAlertSubscribers(container, alert) {
  console.log(`Creating dashboard notifications for alert ${alert._id} container=${alert.containerId}`);
  const recipients = await User.findAll({
    attributes: ['id'],
    where: {
      companyId: container.companyId,
      role: { [Op.in]: ['admin', 'personnel'] },
    },
  });

  if (!recipients.length) {
    console.warn(`No admin/personnel notification recipients for company=${container.companyId}`);
    return;
  }

  const docs = await Notification.insertMany(
    recipients.map((user) => ({
      userId: user.id,
      title: alert.title,
      message: alert.message,
      type: 'error',
      read: false,
      createdAt: new Date(),
    })),
    { ordered: false },
  );

  docs.forEach((doc) => emitNotification(doc.userId, doc));
  console.log(`Dashboard notifications created: ${docs.length} for container=${alert.containerId}`);
}

// POST /api/telemetry
router.post('/', async (req, res) => {
  try {
    const binId = normalizeQrCode(req.body.binId);
    const fullness = Number(req.body.fullness);
    console.log(`Telemetry received: ${binId} = ${fullness}%`);

    if (!binId || req.body.fullness === undefined) {
      console.warn('Telemetry rejected: missing binId or fullness');
      return res.status(400).json({ error: 'binId and fullness are required' });
    }

    if (!Number.isFinite(fullness) || fullness < 0 || fullness > 100) {
      console.warn(`Telemetry rejected for qrCode=${binId || 'unknown'}: invalid_fullness value=${req.body.fullness}`);
      return res.status(400).json({ error: 'fullness must be a number between 0 and 100' });
    }

    console.log(`Looking up container qrCode=${binId}`);
    const container = await Container.findOne({ where: { qrCode: binId } });
    if (!container) {
      console.warn(`Ignoring telemetry for unknown container qrCode=${binId}`);
      return res.status(202).json({ ok: false, ignored: true, reason: 'unknown_container' });
    }
    console.log(`Container found qrCode=${binId} id=${container.id} companyId=${container.companyId}`);

    if (!hasValidCoordinates(container)) {
      console.warn(`Ignoring telemetry for container without valid coordinates qrCode=${binId}`);
      return res.status(202).json({ ok: false, ignored: true, reason: 'invalid_container_coordinates' });
    }
    console.log(`Container coordinates valid qrCode=${binId} lat=${container.lat} lon=${container.lon}`);

    console.log(`Checking telemetry rate limit qrCode=${binId}`);
    const allowed = await checkTelemetryRateLimit(binId);
    if (!allowed) {
      console.warn(`Telemetry rejected for qrCode=${binId}: rate_limited`);
      return res.status(429).json({ message: 'Rate limited' });
    }
    console.log(`Telemetry rate limit passed qrCode=${binId}`);

    let recordedAt = new Date();
    if (req.body.timestamp != null && req.body.timestamp !== '') {
      const parsed = new Date(req.body.timestamp);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ error: 'timestamp must be a valid ISO date string' });
      }
      recordedAt = parsed;
    }

    console.log(`Saving telemetry qrCode=${binId} fullness=${fullness}`);
    const entry = await new History({ binId, fullness, timestamp: recordedAt }).save();
    emitTelemetry(binId, fullness, entry.timestamp);
    console.log(`Telemetry stored: ${binId} fullness=${fullness} timestamp=${entry.timestamp.toISOString()}`);

    if (fullness >= 80) {
      console.log(`Alert threshold reached qrCode=${binId} fullness=${fullness}`);
      const existingAlert = await Alert.findOne({ containerId: binId, resolved: false });
      if (!existingAlert) {
        console.log(`No unresolved alert found qrCode=${binId}; creating critical alert`);
        const alert = await Alert.create({
          containerId: binId,
          fullness,
          severity: 'critical',
          title: `Critical: Container ${binId} is ${fullness}% full`,
          message: `Container ${binId} has reached ${fullness}% capacity. Immediate collection required.`,
          timestamp: new Date(),
        });
        console.log(`Critical alert created qrCode=${binId} alertId=${alert._id}`);
        emitAlert(alert);
        await notifyAlertSubscribers(container, alert);
        console.log(`Attempting alert email qrCode=${binId} recipient=${process.env.ALERT_RECIPIENT || process.env.EMAIL_USER || 'not_configured'}`);
        await sendEmailAlert(binId, fullness);
      } else {
        console.warn(`Unresolved alert already exists qrCode=${binId} alertId=${existingAlert._id}; skipping alert/email creation`);
      }

      console.log(`Checking active task qrCode=${binId}`);
      const existing = await Task.findOne({
        where: {
          containerId: binId,
          status: { [Op.in]: ['assigned', 'in_transit', 'at_utilization'] },
        },
      });

      if (!existing) {
        const assignedTask = await autoAssignDriver(container.id, fullness);
        if (assignedTask) {
          console.log(`Auto-assigned driver for ${binId} at ${fullness}% taskId=${assignedTask.id}`);
        } else {
          console.warn(`No driver task assigned for ${binId} at ${fullness}%`);
        }
      } else {
        console.log(`Active task already exists qrCode=${binId} taskId=${existing.id}`);
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Telemetry error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
