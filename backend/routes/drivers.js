const router   = require('express').Router();
const Driver   = require('../models/pg/Driver');
const User     = require('../models/pg/User');
const Task     = require('../models/pg/Task');
const { authenticate } = require('../middleware/auth');
const { authRole } = require('../middleware/authRole');
const { emitRouteStatus, emitTaskUpdate } = require('../services/Socket');
const { autoAssignUtilizer, setDriverAvailable: releaseDriver } = require('../services/autoAssign');
const { Op } = require('sequelize');

// ── POST /api/drivers/register ────────────────────────────────
router.post('/register', authenticate, async (req, res) => {
  try {
    const {
      licenseNumber, licenseExpiry, company,
      plateNumber, vehicleModel, vehicleYear, capacity,
      emergencyName, emergencyPhone, emergencyRelation,
    } = req.body;

    if (new Date(licenseExpiry) < new Date()) {
      return res.status(400).json({ message: 'Cannot register with an expired license.' });
    }

    const existing = await Driver.findOne({ where: { userId: req.user.userId } });
    if (existing) return res.status(400).json({ message: 'You already have a registration.' });

    const newDriver = await Driver.create({
      userId: req.user.userId,
      licenseNumber,
      licenseExpiry,
      company,
      plateNumber,
      vehicleModel,
      vehicleYear,
      capacity,
      emergencyContact: { name: emergencyName, phone: emergencyPhone, relation: emergencyRelation },
      status: 'pending',
    });

    res.status(201).json({ message: 'Application sent! Waiting for admin approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/drivers/available — approved, on-shift drivers for dispatcher's company
router.get('/available', authRole(['personnel']), async (req, res) => {
  try {
    const dispatchUser = await User.findByPk(req.user.userId, { attributes: ['companyId'] });
    if (!dispatchUser?.companyId) {
      return res.status(400).json({ error: 'User is not linked to a company' });
    }

    const drivers = await Driver.findAll({
      where: { status: 'approved' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'isAvailable', 'companyId'],
        where: {
          role: 'driver',
          isAvailable: true,
          companyId: dispatchUser.companyId,
        },
        required: true,
      }],
      order: [[{ model: User, as: 'user' }, 'fullName', 'ASC']],
    });

    res.json(drivers.map((driver) => ({
      id: driver.id,
      userId: driver.userId,
      fullName: driver.user?.fullName || driver.user?.email || `Driver #${driver.id}`,
      email: driver.user?.email || null,
      plateNumber: driver.plateNumber,
      vehicleModel: driver.vehicleModel,
      isAvailable: driver.user?.isAvailable ?? false,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/drivers/my-status ────────────────────────────────
router.get('/my-status', authenticate, async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    res.json(driver || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/drivers/tasks ────────────────────────────────────
// Driver sees all their own tasks
router.get('/tasks', authenticate, async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

    const tasks = await Task.findAll({
      where: { driverId: { [Op.in]: [driver.id, req.user.userId] } },
      order: [['assignedAt', 'DESC']],
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver updates task: assigned → in_transit (pickup) → at_utilization (delivered)
router.patch('/tasks/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['in_transit', 'at_utilization', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    }

    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

    const task = await Task.findOne({
      where: { id: req.params.id, driverId: { [Op.in]: [driver.id, req.user.userId] } },
    });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours' });

    if (status === 'in_transit' && task.status !== 'assigned') {
      return res.status(400).json({ error: 'Only assigned tasks can be picked up' });
    }
    if (status === 'at_utilization' && task.status !== 'in_transit') {
      return res.status(400).json({ error: 'Only in-transit tasks can be delivered to the station' });
    }

    const updates = { status };
    await task.update(updates);

    emitRouteStatus(task.id, {
      routeId: task.id,
      taskId: task.id,
      status: status === 'cancelled' ? 'cancelled' : 'active',
      rawStatus: task.status,
    });

    if (status === 'at_utilization') {
      await autoAssignUtilizer(task.id);
      await releaseDriver(req.user.userId, true);
      emitTaskUpdate(task);
    }

    if (status === 'cancelled') {
      await releaseDriver(req.user.userId, true);
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/drivers/availability ──────────────────────────
// Driver toggles their own availability
router.patch('/availability', authenticate, async (req, res) => {
  try {
    const { isAvailable } = req.body;

    await User.update(
      { isAvailable },
      { where: { id: req.user.userId } }
    );

    // Also update Redis cache
    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    if (driver) await setDriverAvailable(driver.id, isAvailable);

    res.json({ ok: true, isAvailable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
