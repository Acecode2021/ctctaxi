require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const servicesRoute = require('./routes/services');
const bookingsRoute = require('./routes/bookings');
const driverApplicationsRoute = require('./routes/driverApplications');

const app = express();

// 🚨 THIS IS THE FIX FOR YOUR CORS ERROR 🚨
// This explicitly allows your Vercel frontend to talk to your Render backend.
app.use(cors({
  origin: '*', // Allows any website (including your Vercel app) to connect
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/services', servicesRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/driver-applications', driverApplicationsRoute);

// Health Check Endpoint (Render uses this to check if the server is alive)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CTC Taxi API',
    time: new Date().toISOString()
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('CTC Taxi API is running');
});

// Use Render's PORT if available, otherwise fall back to 5050
const PORT = process.env.PORT || 5050;

async function start() {
  await connectDB();
  
  // Listen on '0.0.0.0' so both your local network and Render can access it
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://192.168.2.136:${PORT}`);
  });
}

start();