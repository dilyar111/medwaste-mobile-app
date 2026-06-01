const router = require('express').Router();
const Company = require('../models/pg/Company');
const User = require('../models/pg/User');
const { authRole } = require('../middleware/authRole');

const PLAN_LIMITS = {
  free: { maxUsers: 10, label: 'Free' },
  premium: { maxUsers: null, label: 'Premium' },
};

function serializeCompany(company, userCount = 0) {
  const plan = company.subscriptionPlan || 'free';
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return {
    id: company.id,
    name: company.name,
    subscriptionPlan: plan,
    paymentStatus: company.paymentStatus,
    userCount,
    maxUsers: limits.maxUsers,
    planLabel: limits.label,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
  };
}

// GET /api/companies — list all tenants (platform admin)
router.get('/', authRole(['admin']), async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [['name', 'ASC']],
    });

    const counts = await User.findAll({
      attributes: ['companyId', [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']],
      group: ['companyId'],
      raw: true,
    });
    const countMap = Object.fromEntries(
      counts.map((row) => [row.companyId, Number(row.count)]),
    );

    res.json(companies.map((c) => serializeCompany(c, countMap[c.id] || 0)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/companies — create tenant (platform admin)
router.post('/', authRole(['admin']), async (req, res) => {
  try {
    const { name, subscriptionPlan, paymentStatus } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    const plan = ['free', 'premium'].includes(subscriptionPlan) ? subscriptionPlan : 'free';

    const company = await Company.create({
      name: String(name).trim(),
      subscriptionPlan: plan,
      paymentStatus: paymentStatus ? String(paymentStatus).trim() : 'active',
    });

    res.status(201).json(serializeCompany(company, 0));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/companies/:id — update plan / billing status
router.patch('/:id', authRole(['admin']), async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });

    const updates = {};
    if (req.body.name != null && String(req.body.name).trim()) {
      updates.name = String(req.body.name).trim();
    }
    if (['free', 'premium'].includes(req.body.subscriptionPlan)) {
      updates.subscriptionPlan = req.body.subscriptionPlan;
    }
    if (req.body.paymentStatus != null) {
      updates.paymentStatus = String(req.body.paymentStatus).trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    await company.update(updates);

    const userCount = await User.count({ where: { companyId: company.id } });
    res.json(serializeCompany(company, userCount));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
