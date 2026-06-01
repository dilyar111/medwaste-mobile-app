const router = require('express').Router();
const { Op } = require('sequelize');
const Task = require('../models/pg/Task');
const User = require('../models/pg/User');
const Driver = require('../models/pg/Driver');
const Container = require('../models/pg/Container');
const Alert = require('../models/Alert');
const { authRole } = require('../middleware/authRole');
const { setDriverAvailable } = require('../services/redis');
const { emitAlert, emitTaskUpdate } = require('../services/Socket');
const { completeTaskDisposal } = require('../services/disposal');

const INCIDENT_REASONS = [
  'Container Blocked',
  'Container Broken',
  'Road Closed',
];

// GET /api/tasks/inbound — company-scoped transport queue for utilizers
router.get('/inbound', authRole(['utilizer']), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, { attributes: ['companyId'] });
    if (!user?.companyId) {
      return res.status(400).json({ error: 'User is not linked to a company' });
    }

    const tasks = await Task.findAll({
      where: {
        companyId: user.companyId,
        status: 'at_utilization',
      },
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: Container,
          as: 'container',
          attributes: ['qrCode', 'location', 'wasteType'],
        },
      ],
      order: [['assignedAt', 'DESC']],
    });

    res.json(tasks.map((task) => ({
      id: task.id,
      containerId: task.containerId,
      status: task.status,
      assignedAt: task.assignedAt,
      driverName: task.driver?.fullName || task.driver?.email || '—',
      driverEmail: task.driver?.email || null,
      location: task.container?.location || null,
      wasteType: task.container?.wasteType || null,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks/:id/complete — accept disposal with actual weight (utilizer)
router.post('/:id/complete', authRole(['utilizer']), async (req, res) => {
  try {
    const { actualWeight, method, notes } = req.body;

    const user = await User.findByPk(req.user.userId, { attributes: ['companyId'] });
    if (!user?.companyId) {
      return res.status(400).json({ error: 'User is not linked to a company' });
    }

    const task = await Task.findOne({
      where: {
        id: req.params.id,
        companyId: user.companyId,
        status: 'at_utilization',
      },
      include: [{ model: Container, as: 'container' }],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found in your company queue' });
    }

    const { task: updatedTask, disposalLog } = await completeTaskDisposal(
      task,
      req.user.userId,
      { actualWeight, method, notes },
    );

    res.json({
      ok: true,
      task: updatedTask,
      disposalLog,
      driverAvailable: true,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id/incident
router.patch('/:id/incident', authRole(['driver']), async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !INCIDENT_REASONS.includes(reason)) {
      return res.status(400).json({
        error: `reason must be one of: ${INCIDENT_REASONS.join(', ')}`,
      });
    }

    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    const driverIds = driver
      ? [driver.id, req.user.userId]
      : [req.user.userId];

    const task = await Task.findOne({
      where: {
        id: req.params.id,
        driverId: { [Op.in]: driverIds },
        status: { [Op.in]: ['assigned', 'in_transit'] },
      },
      include: [{ model: Container, as: 'container' }],
    });

    if (!task) {
      return res.status(404).json({ error: 'Active task not found or not assigned to you' });
    }

    await task.update({
      status: 'failed_incident',
      incidentReason: reason,
    });

    await User.update(
      { isAvailable: true },
      { where: { id: req.user.userId } },
    );

    if (driver) await setDriverAvailable(driver.id, true);

    const location = task.container?.location || '—';
    const alert = await Alert.create({
      type: 'incident',
      severity: 'critical',
      title: `Incident: ${task.containerId}`,
      message: `Driver reported "${reason}" for task #${task.id}. Manual reassignment required.`,
      containerId: task.containerId,
      location,
      timestamp: new Date(),
    });

    emitAlert(alert);
    emitTaskUpdate(task);

    res.json({
      ok: true,
      task,
      isAvailable: true,
      alertId: alert._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
