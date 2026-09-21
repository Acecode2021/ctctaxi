const express = require('express');
const router = express.Router();
const ContactInquiry = require('../models/ContactInquiry');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;