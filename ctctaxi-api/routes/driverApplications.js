const express = require('express');
const router = express.Router();
const DriverApplication = require('../models/DriverApplication');

// POST /api/driver-applications
router.post('/', async (req, res) => {
  try {
    const app = await DriverApplication.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/driver-applications
router.get('/', async (req, res) => {
  try {
    const apps = await DriverApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
