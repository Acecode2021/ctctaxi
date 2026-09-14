const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
