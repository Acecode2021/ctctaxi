require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const servicesRoute = require('./routes/services');
const bookingsRoute = require('./routes/bookings');
const driverApplicationsRoute = require('./routes/driverApplications');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/services', servicesRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/driver-applications', driverApplicationsRoute);
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CTC Taxi API',
    time: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('CTC Taxi API is running');
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

start();
