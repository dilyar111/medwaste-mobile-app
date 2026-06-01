const router      = require('express').Router();
const Task        = require('../models/pg/Task');
const Container   = require('../models/pg/Container');
const DisposalLog = require('../models/mongo/DisposalLog');
const { authRole } = require('../middleware/authRole');

router.use(authRole(['utilizer']));

// GET /api/utilizer/history — completed disposals archive
router.get('/history', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { status: 'completed', utilizerId: req.user.userId },
      include: [{ model: Container, as: 'container' }],
      order: [['completedAt', 'DESC']],
      limit: 50,
    });

    const taskIds = tasks.map((t) => t.id);
    const logs = await DisposalLog.find({ taskId: { $in: taskIds } });
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
