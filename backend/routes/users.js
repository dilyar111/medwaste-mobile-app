const router = require('express').Router();
const User = require('../models/pg/User');
const Driver = require('../models/pg/Driver');
const { authRole } = require('../middleware/authRole');
const { setDriverAvailable } = require('../services/redis');

// PATCH /api/users/toggle-shift — invert isAvailable for the current driver
router.patch('/toggle-shift', authRole(['driver']), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isAvailable = !user.isAvailable;
    await user.update({ isAvailable });

    const driver = await Driver.findOne({ where: { userId: user.id } });
    if (driver) await setDriverAvailable(driver.id, isAvailable);

    res.json({ ok: true, isAvailable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
