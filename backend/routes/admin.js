const router       = require('express').Router();
const bcrypt       = require('bcryptjs');
const { Op }       = require('sequelize');
const Driver       = require('../models/pg/Driver');
const Task         = require('../models/pg/Task');
const Container    = require('../models/pg/Container');
const Company      = require('../models/pg/Company');
const Notification = require('../models/Notification');
const { isAdmin }  = require('../middleware/auth');
const { authRole } = require('../middleware/authRole');
const User         = require('../models/pg/User');
const { setDriverAvailable } = require('../services/redis');
const { emitTaskToDriver, emitTaskUpdate } = require('../services/Socket');
const { validateProfilePayload } = require('../services/profile');

const ALLOWED_ROLES = ['admin', 'personnel', 'driver', 'utilizer'];
const PLAN_USER_LIMITS = { free: 10, premium: null };

// POST /api/admin/assign-task — manual reassignment (dispatchers / personnel only)
router.post('/assign-task', authRole(['personnel']), async (req, res) => {
  try {
    const { driverId, containerId } = req.body;

    if (!driverId || !containerId) {
      return res.status(400).json({ error: 'driverId and containerId are required' });
    }

    const normalizedContainerId = String(containerId).trim();

    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    if (driver.status !== 'approved') {
      return res.status(400).json({ error: 'Driver is not approved' });
    }

    const container = await Container.findOne({ where: { qrCode: normalizedContainerId } });
    if (!container) {
      return res.status(404).json({ error: 'Container must exist before assigning a task' });
    }

    const driverUser = await User.findByPk(driver.userId, { attributes: ['id', 'companyId', 'role'] });
    if (!driverUser || driverUser.role !== 'driver') {
      return res.status(400).json({ error: 'Selected profile is not a driver account' });
    }
    if (driverUser.companyId !== container.companyId) {
      return res.status(403).json({ error: 'Driver must belong to the same company as the container' });
    }

    const dispatchUser = await User.findByPk(req.user.userId, { attributes: ['companyId'] });
    if (dispatchUser?.companyId && dispatchUser.companyId !== container.companyId) {
      return res.status(403).json({ error: 'Cannot assign tasks outside your company' });
    }

    const activeTasks = await Task.findAll({
      where: {
        containerId: normalizedContainerId,
        status: { [Op.in]: ['assigned', 'in_transit', 'at_utilization'] },
      },
    });

    for (const activeTask of activeTasks) {
      await activeTask.update({ status: 'cancelled' });
      if (activeTask.driverId) {
        await User.update({ isAvailable: true }, { where: { id: activeTask.driverId } });
        const prevDriver = await Driver.findOne({ where: { userId: activeTask.driverId } });
        if (prevDriver) await setDriverAvailable(prevDriver.id, true);
      }
    }

    const newTask = await Task.create({
      driverId: driver.userId,
      containerId: normalizedContainerId,
      companyId: container.companyId,
      status: 'assigned',
      assignedAt: new Date(),
    });

    await User.update({ isAvailable: false }, { where: { id: driver.userId } });
    await setDriverAvailable(driver.id, false);

    await Notification.create({
      userId:  driver.userId,
      title:   'New Task Assigned! 🚛',
      message: `Container ${normalizedContainerId} is ready for collection.`,
      type:    'info',
    });

    emitTaskToDriver(driver.userId, newTask);
    emitTaskUpdate(newTask);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All platform admin routes require admin role
router.use(isAdmin);

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'fullName', 'username', 'role', 'isAvailable', 'companyId', 'createdAt'],
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'subscriptionPlan'],
      }],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/users — provision account in a company
router.post('/users', async (req, res) => {
  try {
    const { fullName, username, email, password, role, companyId } = req.body;

    if (!fullName || !username || !email || !password || !role || !companyId) {
      return res.status(400).json({
        error: 'fullName, username, email, password, role and companyId are required',
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${ALLOWED_ROLES.join(', ')}` });
    }

    const validationError = validateProfilePayload({ fullName, username, department: '' });
    if (validationError) return res.status(400).json({ error: validationError });

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ error: 'Company not found' });

    const limit = PLAN_USER_LIMITS[company.subscriptionPlan];
    if (limit != null) {
      const currentCount = await User.count({ where: { companyId: company.id } });
      if (currentCount >= limit) {
        return res.status(403).json({
          error: `User limit reached for ${company.subscriptionPlan} plan (${limit} users)`,
        });
      }
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ error: 'User with this email already exists' });

    const existingUser = await User.findOne({
      where: User.sequelize.where(
        User.sequelize.fn('lower', User.sequelize.col('username')),
        username.trim().toLowerCase(),
      ),
    });
    if (existingUser) return res.status(400).json({ error: 'Username is already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName: fullName.trim(),
      username: username.trim(),
      email,
      password: hashed,
      role,
      companyId: company.id,
      phoneNumber: null,
    });

    const withCompany = await User.findByPk(newUser.id, {
      attributes: ['id', 'email', 'fullName', 'username', 'role', 'isAvailable', 'companyId', 'createdAt'],
      include: [{ model: Company, as: 'company', attributes: ['id', 'name', 'subscriptionPlan'] }],
    });

    res.status(201).json(withCompany);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'This email or username is already registered' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role, companyId } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updates = {};
    if (role != null) {
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ error: `role must be one of: ${ALLOWED_ROLES.join(', ')}` });
      }
      updates.role = role;
    }
    if (companyId != null) {
      const company = await Company.findByPk(companyId);
      if (!company) return res.status(404).json({ error: 'Company not found' });
      updates.companyId = company.id;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'role or companyId is required' });
    }

    await user.update(updates);
    res.json({ ok: true, email: user.email, role: user.role, companyId: user.companyId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/drivers/pending
router.get('/drivers/pending', async (req, res) => {
  try {
    const drivers = await Driver.findAll({
       where: { status: 'pending' },
       include: [{ model: User, as: 'user', attributes: ['email', 'fullName'] }],
     });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/drivers/approved
router.get('/drivers/approved', async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      where: { status: 'approved' },
      include: [{ model: User, as: 'user', attributes: ['email', 'fullName'] }],
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/drivers/:id/status
router.patch('/drivers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    await driver.update({ status });

    await Notification.create({
      userId:  driver.userId,
      title:   status === 'approved' ? 'Application Approved! 🎉' : 'Application Update',
      message: status === 'approved'
        ? 'Congratulations! You are now an official MedWaste driver.'
        : 'Your application was declined. Please check details.',
      type: status === 'approved' ? 'success' : 'error',
    });

    res.json({ message: `Status updated to ${status}`, driver });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/tasks/all
router.get('/tasks/all', async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [['assignedAt', 'DESC']] });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
