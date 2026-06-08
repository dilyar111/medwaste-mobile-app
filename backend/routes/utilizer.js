const router      = require('express').Router();
const { Op }      = require('sequelize');
const Task        = require('../models/pg/Task');
const Container   = require('../models/pg/Container');
const DisposalLog = require('../models/mongo/DisposalLog');
const User        = require('../models/pg/User');
const { authRole } = require('../middleware/authRole');

router.use(authRole(['utilizer']));

// GET /api/utilizer/history — completed disposals archive
router.get('/history', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, { attributes: ['companyId'] });
    if (!user?.companyId) {
      return res.status(400).json({ error: 'User is not linked to a company' });
    }

    const userLogs = await DisposalLog.find({ utilizerId: req.user.userId })
      .sort({ completedAt: -1 })
      .lean();
    const loggedTaskIds = userLogs.map((log) => log.taskId).filter(Boolean);

    const tasks = await Task.findAll({
      where: {
        status: 'completed',
        companyId: user.companyId,
        [Op.or]: [
          { utilizerId: req.user.userId },
          ...(loggedTaskIds.length ? [{ id: { [Op.in]: loggedTaskIds } }] : []),
        ],
      },
      include: [{ model: Container, as: 'container' }],
      order: [['completedAt', 'DESC']],
      limit: 50,
    });

    const taskIds = tasks.map((t) => t.id);
    const logs = await DisposalLog.find({ taskId: { $in: taskIds } }).lean();
    const logsMap = Object.fromEntries(logs.map((l) => [l.taskId, l]));

    const result = tasks.map((t) => ({
      ...t.toJSON(),
      disposalLog: logsMap[t.id] || null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
