const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/api/bookings', async (req, res) => {
  try {
    // ✅ THIS IS THE FIX: Pass the entire req.body directly to Mongoose.
    // This automatically includes corporate, airport, delivery, and notes.
    const newBooking = new Booking(req.body); 
    
    const savedBooking = await newBooking.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully', 
      data: savedBooking 
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create booking',
      details: error.message 
    });
  }
});

module.exports = router;