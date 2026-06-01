const User = require('../models/pg/User');
const Alert = require('../models/Alert');
const DisposalLog = require('../models/mongo/DisposalLog');
const History = require('../models/mongo/History');
const { emitRouteStatus, emitTaskUpdate, emitTelemetry } = require('./Socket');
const { setDriverAvailable: releaseDriver } = require('./autoAssign');

async function resetContainerAfterDisposal(qrCode) {
  if (!qrCode) return;

  const timestamp = new Date();
  await new History({ binId: qrCode, fullness: 0, timestamp }).save();
  emitTelemetry(qrCode, 0, timestamp);

  await Alert.updateMany(
    { containerId: qrCode, resolved: false },
    { $set: { resolved: true } },
  );
}

async function completeTaskDisposal(task, utilizerUserId, { actualWeight, method = 'incineration', notes = '' }) {
  const weightKg = Number(actualWeight);
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    const err = new Error('actualWeight must be a positive number');
    err.status = 400;
    throw err;
  }

  if (task.status !== 'at_utilization') {
    const err = new Error('Waste must be delivered to the station before disposal (status: at_utilization)');
    err.status = 400;
    throw err;
  }

  const container = task.container;
  const qrCode = container?.qrCode || task.containerId;

  await task.update({
    status: 'completed',
    completedAt: new Date(),
    utilizerId: task.utilizerId || utilizerUserId,
  });

  emitRouteStatus(task.id, {
    routeId: task.id,
    taskId: task.id,
    status: 'completed',
    rawStatus: task.status,
  });

  // Driver should already be free after delivery; release if legacy task skipped that step
  if (task.driverId) {
    await releaseDriver(task.driverId, true);
  }

  await User.update({ isAvailable: true }, { where: { id: utilizerUserId } });

  const lastReading = qrCode
    ? await History.findOne({ binId: qrCode }).sort({ timestamp: -1 })
    : null;

  const disposalLog = await DisposalLog.create({
    taskId: task.id,
    containerId: task.containerId,
    driverId: task.driverId,
    utilizerId: utilizerUserId,
    wasteType: container?.wasteType,
    weightKg,
    actualWeight: weightKg,
    fullness: lastReading?.fullness ?? null,
    method,
    notes,
    completedAt: new Date(),
  });

  await resetContainerAfterDisposal(qrCode);

  emitTaskUpdate(task);

  return { task, disposalLog };
}

module.exports = { completeTaskDisposal, resetContainerAfterDisposal };
