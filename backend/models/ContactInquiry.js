const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
  source: { type: String, default: 'landing' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

contactInquirySchema.pre('save', function setUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
