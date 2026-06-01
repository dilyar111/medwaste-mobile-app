const router = require('express').Router();
const ContactInquiry = require('../models/ContactInquiry');
const { isAdmin } = require('../middleware/auth');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact — public landing form
router.post('/', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const message = String(req.body.message || '').trim();

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Name is required (at least 2 characters)' });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!message || message.length < 10) {
      return res.status(400).json({ error: 'Message is required (at least 10 characters)' });
    }

    const inquiry = await ContactInquiry.create({
      name,
      email,
      message,
      source: req.body.source || 'landing',
    });

    res.status(201).json({
      ok: true,
      id: inquiry._id,
      message: 'Thank you. We will get back to you soon.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use(isAdmin);

// GET /api/contact — list inquiries (platform admin)
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const inquiries = await ContactInquiry.find(filter)
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/contact/:id — update status (contacted / closed)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'status must be new, contacted, or closed' });
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true },
    );
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
