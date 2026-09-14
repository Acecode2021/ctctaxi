const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  phone: { type: String, required: true },
  serviceType: { type: String, default: 'everyday_ride' },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
