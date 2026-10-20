// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Base fields
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    phone: { type: String, required: true },
    serviceType: { type: String, required: true },
    status: { type: String, default: 'pending' },

    // 👇 THIS IS YOUR SPECIAL INSTRUCTIONS 👇
    notes: { type: String },

    // 👇 NESTED OBJECTS FOR THE OTHER TABS 👇
    corporate: {
      passengers: { type: Number },
      vehicleClass: { type: String }
    },
    airport: {
      direction: { type: String },
      terminal: { type: String },
      customTerminalName: { type: String },
      location: { type: String }
    },
    delivery: {
      vehicle: { type: String },
      packageType: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);