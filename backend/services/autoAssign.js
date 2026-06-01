const User      = require('../models/pg/User');
const Task      = require('../models/pg/Task');
const Container = require('../models/pg/Container');
const Driver = require('../models/pg/Driver');
const { sendTaskAssignedEmail } = require('./email');
const { emitTaskToDriver, emitTaskUpdate } = require('./Socket');
const { hasValidCoordinates, isValidLatitude, isValidLongitude } = require('../utils/containerValidation');

function haversine(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function setDriverAvailable(driverUserId, available) {
  const { setDriverAvailable: setRedis } = require('./redis');
  await User.update({ isAvailable: available }, { where: { id: driverUserId } });
  const driverRecord = await Driver.findOne({ where: { userId: driverUserId } });
  if (driverRecord) await setRedis(driverRecord.id, available);
}

async function autoAssignDriver(containerId, fullness = 0) {
  const container = await Container.findByPk(containerId);
  if (!container) throw new Error('Container not found');
  if (!container.companyId) {
    console.warn(`⚠️ Container ${container.qrCode} has no companyId — cannot auto-assign`);
    return null;
  }

  const drivers = await User.findAll({
    where: {
      role: 'driver',
      isAvailable: true,
      companyId: container.companyId,
    },
  });
  if (drivers.length === 0) {
    console.warn(`⚠️ No available drivers for company ${container.companyId}`);
    return null;
  }

  let chosen = drivers[0];
  if (hasValidCoordinates(container)) {
    const withDistance = drivers
      .filter(d => isValidLatitude(d.lastLat) && isValidLongitude(d.lastLon))
      .map(d => ({
        driver: d,
        dist:   haversine(d.lastLat, d.lastLon, container.lat, container.lon),
      }))
      .sort((a, b) => a.dist - b.dist);

    if (withDistance.length > 0) {
      chosen = withDistance[0].driver;
      console.log(`📍 Nearest driver: ${chosen.email} (${withDistance[0].dist.toFixed(1)} km away)`);
    }
  }
  const driverRecord = await Driver.findOne({ where: { userId: chosen.id, status: 'approved' } });
  if (!driverRecord) {
    console.warn(`⚠️ No driver record for user ${chosen.email}`);
    return null;
  }

  const task = await Task.create({
    containerId: container.qrCode,
    companyId:   container.companyId,
    driverId:    chosen.id,
    status:      'assigned',
    assignedAt:  new Date(),
  });

  await chosen.update({ isAvailable: false });
  await setDriverAvailable(chosen.id, false);
  emitTaskToDriver(chosen.id, task);
  emitTaskUpdate(task);
  console.log(`✅ Auto-assigned driver ${chosen.email} to ${container.qrCode}`);

  await sendTaskAssignedEmail(
    chosen.email,
    chosen.fullName || chosen.email,
    container.qrCode,
    container.location,
    fullness
  );

  return task;
}

async function autoAssignUtilizer(taskId) {
  const task = await Task.findByPk(taskId);
  if (!task) throw new Error('Task not found');
  if (task.utilizerId) return task;

  const utilizer = await User.findOne({
    where: {
      role: 'utilizer',
      isAvailable: true,
      companyId: task.companyId,
    },
  });

  if (!utilizer) {
    console.warn(`⚠️ No available utilizer for company ${task.companyId}`);
    return null;
  }

  await task.update({ utilizerId: utilizer.id });
  await utilizer.update({ isAvailable: false });
  emitTaskUpdate(task);
  console.log(`✅ Auto-assigned utilizer ${utilizer.email} to task ${taskId}`);
  return task;
}

module.exports = { autoAssignDriver, autoAssignUtilizer, setDriverAvailable };
