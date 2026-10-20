require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const servicesRoute = require('./routes/services');
const bookingsRoute = require('./routes/bookings');
const driverApplicationsRoute = require('./routes/driverApplications');
const contactRoute = require('./routes/contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Because you are mounting them here with '/api/...', 
// the route files themselves must only use '/' for the main POST/GET.
app.use('/api/services', servicesRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/driver-applications', driverApplicationsRoute);
app.use('/api/contact', contactRoute);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CTC Taxi API',
    time: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('CTC Taxi API is running');
});

// Catch-all 404 handler (helps debug typos)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://192.168.2.136:${PORT}`);
  });
}

start();