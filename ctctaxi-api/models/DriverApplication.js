const mongoose = require('mongoose');

const driverApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  location: { type: String, required: true },
  licence: { type: String, required: true },
  ownVehicle: { type: String, required: true },
  experience: { type: String, required: true },
  status: { type: String, default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('DriverApplication', driverApplicationSchema);
