const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, default: '' },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  message: { type: String, required: true },
  page: { type: String, default: '' },
  referrer: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);