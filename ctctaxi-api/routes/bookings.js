const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ✅ Notice it is '/' and NOT '/api/bookings'
router.post('/', async (req, res) => {
  try {
    // ✅ Pass the whole body so Mongoose saves corporate, notes, etc.
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