import { IMG } from '../assets/images';

export type Service = {
  id: string;
  title: string;
  short: string;
  detail: string;
  bullets: string[];
  image: string;
  span: string; // bento grid placement
  tone: 'light' | 'dark';
};

export const SERVICES: Service[] = [
  {
    id: 'rides',
    title: 'Everyday Rides',
    short: 'Fast and reliable transportation for your daily movement across Lagos.',
    detail:
      'Air-conditioned cars, verified drivers and a fare you agree before you move. From a quick run to the market to the full commute, five days a week.',
    bullets: ['Instant booking', 'Fixed fare agreed upfront', 'Cash, transfer or card'],
    image: IMG.rides_1280,
    span: 'lg:col-span-3 lg:row-span-2',
    tone: 'dark',
  },
  {
    id: 'scheduled',
    title: 'Scheduled Rides',
    short: 'Plan ahead and get picked up exactly when you need to move.',
    detail:
      'Book up to 90 days ahead and we assign your driver before the day arrives, so the car is waiting rather than arriving.',
    bullets: ['Up to 90 days ahead', 'Driver assigned in advance', 'Ideal for early flights'],
    image: IMG.scheduled_1280,
    span: 'lg:col-span-3',
    tone: 'light',
  },
  {
    id: 'airport',
    title: 'Airport Routes',
    short: 'Stress-free airport transportation with professional drivers and scheduled pickups.',
    detail:
      'Give us your flight number and we set the pickup to your real landing time. Waiting after you land is free for the first hour.',
    bullets: ['Flight-number pickup', 'Luggage assistance', 'Free waiting after landing'],
    image: IMG.airport_1280,
    span: 'lg:col-span-3',
    tone: 'light',
  },
  {
    id: 'corporate',
    title: 'Corporate Transport',
    short: 'Dependable transportation for teams, employees and business professionals.',
    detail:
      'Monthly accounts for staff commuting, client pickups and executive movement — with consolidated invoicing and a record of every trip.',
    bullets: ['Monthly invoicing', 'Named drivers', 'Trip records for reconciliation'],
    image: IMG.corporate_1280,
    span: 'lg:col-span-3',
    tone: 'dark',
  },
  {
    id: 'delivery',
    title: 'Delivery',
    short: 'Move packages and important items with reliable CTC transportation.',
    detail:
      'Same-standard drivers and vehicles for your parcels and documents, tracked from pickup to handover.',
    bullets: ['Parcel & document runs', 'Tracked handover', 'Scheduled collections'],
    image: IMG.delivery_1280,
    span: 'lg:col-span-6',
    tone: 'light',
  },
];

/* ---------------------------------------------------------------- services
 * Booking form service types — mirrors the five core services.
 * ---------------------------------------------------------------------- */

export const SERVICE_TYPES = [
  { value: 'ride', label: 'Ride' },
  { value: 'airport', label: 'Airport Transfer' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'delivery', label: 'Delivery' },
] as const;

export const VEHICLE_CLASSES = [
  { value: 'saloon', label: 'Executive Saloon (1–3)' },
  { value: 'suv', label: 'Family SUV / Sienna (1–5)' },
  { value: 'minibus', label: 'Minibus (6–14)' },
] as const;

/* ---------------------------------------------------------------- trust */

export const TRUST_SIGNALS = [
  {
    icon: 'shield',
    title: 'Professional Drivers',
    body: 'Licence, ID and driving record checked before any driver is activated.',
  },
  {
    icon: 'pin',
    title: 'GPS & Safety-Focused Operations',
    body: 'Vehicles fitted with GPS dashcams, recording every trip.',
  },
  {
    icon: 'plane',
    title: 'Airport & Corporate Transport',
    body: 'Scheduled airport pickups and monthly corporate accounts.',
  },
  {
    icon: 'clock',
    title: 'Scheduled Rides Available',
    body: 'Book up to 90 days ahead, or request a car right now.',
  },
] as const;

/* ---------------------------------------------------------------- safety */

export const SAFETY_ITEMS = [
  {
    id: 'drivers',
    title: 'Professional Drivers',
    body: 'Every driver is verified in person — valid licence, government ID, driving record review and a physical vehicle inspection before they take a single trip.',
    stat: 'In-person verification',
    icon: 'user',
  },
  {
    id: 'gps',
    title: 'GPS Technology',
    body: 'Vehicles are fitted with GPS units and dashcams that record the route, so both the journey and the driver can be accounted for.',
    stat: 'Route recorded',
    icon: 'pin',
  },
  {
    id: 'monitoring',
    title: 'Vehicle Monitoring',
    body: 'Cars are inspected and serviced on a schedule. Air conditioning, seatbelts, tyres and the dashcam are checked before a vehicle stays on the road.',
    stat: 'Scheduled checks',
    icon: 'car',
  },
  {
    id: 'driver-support',
    title: 'Driver Support',
    body: 'Drivers are trained on our service standard and have a direct line to our team while they are on a trip, so problems get solved in the moment.',
    stat: 'Direct support line',
    icon: 'headset',
  },
  {
    id: 'customer-support',
    title: 'Customer Support',
    body: 'A real person answers, day or night. If something goes wrong on a journey, you reach us in the app or by phone — not a bot queue.',
    stat: 'Open 24/7',
    icon: 'chat',
  },
] as const;

/* ------------------------------------------------------------ how it works */

export const STEPS = [
  {
    n: '01',
    title: 'Choose Your Service',
    body: 'Ride, airport transfer, corporate account or delivery — pick the one that matches the journey.',
  },
  {
    n: '02',
    title: 'Enter Your Journey Details',
    body: 'Pickup, drop-off, date and time. A fare is agreed before you confirm, so there is nothing to argue about later.',
  },
  {
    n: '03',
    title: 'Get Connected',
    body: 'We match you with a verified driver and send you their name, car and plate number.',
  },
  {
    n: '04',
    title: 'Ride With Ease',
    body: 'Track the vehicle as it comes, travel in comfort, and pay by cash, transfer or card.',
  },
] as const;

/* ---------------------------------------------------------------- drivers */

export const DRIVER_BENEFITS = [
  {
    title: 'Commission below the major apps',
    body: 'The large platforms keep 15–20% of every fare. We keep less, so more of the trip is yours.',
  },
  {
    title: 'Airport and corporate jobs',
    body: 'Higher-value scheduled work, not just short city hops — the kind of trips that pay properly.',
  },
  {
    title: 'Training, checks and dashcam fitting',
    body: 'We verify, fit and train you. You are not left to figure it out alone.',
  },
  {
    title: 'Daily payouts and weekly statements',
    body: 'Money you can plan around, and a written record of every trip you have completed.',
  },
] as const;

/* ---------------------------------------------------------------- areas */

export const AREAS = [
  'Ikeja',
  'Maryland',
  'Magodo',
  'Yaba',
  'Surulere',
  'Victoria Island',
  'Ikoyi',
  'Lekki Phase 1',
  'Ajah',
  'Festac',
  'Apapa',
  'Amuwo Odofin',
  'Ago Palace Way',
  'Ikorodu Road',
  'Mushin',
  'Oshodi',
] as const;

/* ---------------------------------------------------------------- FAQ */

export const FAQS = [
  {
    q: 'How do I book a ride?',
    a: 'Three ways: use the booking card on this page, call us on 0803 930 4425, or book in the CTC Taxi app. Whichever you choose, you will be given a fare before the trip starts and the driver’s details before the car arrives.',
  },
  {
    q: 'Can I schedule a ride in advance?',
    a: 'Yes. You can book up to 90 days ahead. For scheduled rides we assign your driver before the day arrives, so the car is waiting at your pickup time rather than being sent out at the last minute. This is what most of our airport and early-shift customers use.',
  },
  {
    q: 'Do you offer airport transfers?',
    a: 'Yes — both Murtala Muhammed International and the domestic terminal. Give us your flight number and we track the real landing time, so a delayed flight does not cost you your car. Waiting is free for the first 60 minutes after you land, and meet-and-greet at arrivals is available on request.',
  },
  {
    q: 'Do you provide corporate transportation?',
    a: 'We run monthly accounts for staff commuting, client pickups and executive movement. You get consolidated invoicing, named drivers, scheduled rosters where you need them, and a record of every trip your team has taken. Call us to set one up.',
  },
  {
    q: 'How can I become a CTC driver?',
    a: 'Download the CTC Driver app and submit your details. You will need a valid driver’s licence and a clean driving record. We then verify your documents and vehicle in person and fit your dashcam. Most drivers are live within 72 hours. Owner-drivers and drivers without their own vehicle are both welcome to apply.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We cover Lagos State, with strong coverage across Ikeja, Maryland, Magodo, Yaba, Surulere, Victoria Island, Ikoyi, Lekki, Ajah, Festac, Apapa, Amuwo Odofin, Ago Palace Way, Ikorodu Road, Mushin and Oshodi. If your pickup is outside these areas, call us — we will tell you honestly whether we can reach you.',
  },
  {
    q: 'How can I contact CTC?',
    a: 'Call 0803 930 4425 or 0701 636 3355, message us on WhatsApp, or email info@ctctaxi.com. Our team is available 24 hours a day, 7 days a week. You can also reach us through the CTC Taxi app or the contact form on this page.',
  },
] as const;

/* ---------------------------------------------------------- testimonials
 * Real, published CTC reviews only. App-store reviews are dated and sourced.
 * ---------------------------------------------------------------------- */

export type Review = {
  name: string;
  location: string;
  rating: number;
  body: string;
  source: string;
  date: string;
  verified: boolean;
};

export const REVIEWS: Review[] = [
  {
    name: 'James Ace',
    location: 'App Store',
    rating: 5,
    body: 'Best and affordable app — a must-have for anyone who wants a trusted and affordable ride. I highly recommend it.',
    source: 'Apple App Store',
    date: 'Jan 2026',
    verified: true,
  },
  {
    name: 'Tamara karina',
    location: 'Lagos',
    rating: 5,
    body: 'This is down to their excellent service, competitive pricing and customer support. It is thoroughly refreshing to get such a personal touch.',
    source: 'Customer review',
    date: '2023',
    verified: true,
  },
  {
    name: 'Faith okeke',
    location: 'Lagos',
    rating: 5,
    body: 'Super friendly and comfort-filled. Very satisfied with the experience. I recommend CTC Taxi to everyone.',
    source: 'Customer review',
    date: '2023',
    verified: true,
  },
  {
    name: 'Toyin .O',
    location: 'Lagos',
    rating: 5,
    body: 'I would recommend CTC Taxi at all times because my experience was totally unbelievable. You are the best.',
    source: 'Customer review',
    date: '2023',
    verified: true,
  },
];

/* ------------------------------------------------- local SEO structured data */

export const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'TaxiService',
  name: 'CTC Taxi',
  legalName: 'Countryside Taxi Company Ltd',
  url: 'https://ctctaxi.com/',
  telephone: '+2348039304425',
  email: 'info@ctctaxi.com',
  priceRange: '₦₦',
  areaServed: { '@type': 'State', name: 'Lagos State, Nigeria' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot 25 Ojefia Crescent, Victory Estate, Amuwo Odofin, Ago Palace Way',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'CTC Taxi services',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.short },
    })),
  },
};
