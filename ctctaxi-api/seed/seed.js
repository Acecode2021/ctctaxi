require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');

const services = [
  {
    slug: 'everyday-rides',
    title: 'Everyday Rides',
    description: 'Fast and reliable transportation for your daily movement across Lagos.',
    order: 1
  },
  {
    slug: 'scheduled-rides',
    title: 'Scheduled Rides',
    description: 'Plan ahead and get picked up exactly when you need to move.',
    order: 2
  },
  {
    slug: 'airport-transfers',
    title: 'Airport Transfers',
    description: 'Stress-free airport transportation with professional drivers and scheduled pickups.',
    order: 3
  },
  {
    slug: 'corporate-transport',
    title: 'Corporate Transport',
    description: 'Dependable transportation for teams, employees and business professionals.',
    order: 4
  },
  {
    slug: 'delivery',
    title: 'Delivery',
    description: 'Move packages and important items with reliable CTC transportation.',
    order: 5
  }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to ctc_taxi');

    await Service.deleteMany({});
    console.log('🧹 Cleared existing services');

    const inserted = await Service.insertMany(services);
    console.log(`✅ Inserted ${inserted.length} services`);

    await mongoose.disconnect();
    console.log('👋 Done');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

run();
