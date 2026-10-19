/* ==========================================================================
   NEWSROOM CONTENT

   Every post below reports something that actually happened and is
   published somewhere. Sources are stored alongside each item and shown on
   the card, so a reader can check us.

   RULE: do not add a post here without a source URL. If it cannot be
   sourced, it does not go on the site. Never invent a date, a figure or an
   announcement.

   Sourced from: ctctaxi.com and countrysidegroup.com.ng (first-party
   releases), plus Vanguard, Punch, The Guardian NG and The Sun for the
   third-party coverage. The Uganda post is sourced to the group's own
   YouTube channel announcement.

   SOCIAL MEDIA: images in the newsroom come from CTC's own channels —
   youtube.com/@ctctaxii (verified: the channel is named "CTCTaxi") and the
   group's Blow Money Records channel. Instagram (@ctctaxi) and Facebook
   (facebook.com/Ctctaxi) are login-walled and could not be scraped, so no
   images are claimed from them.
   ========================================================================== */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;      // published, as displayed
  iso: string;       // machine-readable
  tag: 'Company' | 'Safety' | 'Fleet' | 'Expansion' | 'Travel' | 'Payments';
  img: string;       // key into assets/images SETS
  featured?: boolean;
  source: { label: string; url: string };
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: 'ctc-taxi-uganda',
    title: 'CTC Taxi and BlowPay set to launch in Uganda',
    excerpt:
      'A strategic partnership to take the ride-hailing and payments platforms into Uganda \u2014 announced on the group\u2019s own channel.',
    date: '13 September 2024',
    iso: '2024-09-13',
    tag: 'Expansion',
    img: 'uganda',
    source: {
      label: 'Blow Money Records (YouTube)',
      url: 'https://www.youtube.com/watch?v=awNtgGnWYhE',
    },
    body: [
      'A strategic partnership announcement from Countryside Group set out plans to launch CTC Taxi and BlowPay in Uganda together \u2014 the ride-hailing platform and the payments platform arriving as a pair rather than one behind the other.',
      'That pairing is the point. A ride-hailing business in a new market needs a way to settle payments that works locally, and a payments platform needs merchants and everyday use cases to be worth opening. Launching them together gives each one a reason to exist on day one.',
      'The announcement was published on the group\u2019s Blow Money Records channel. It reflects the same regional strategy that later took the group\u2019s taxi, travel and payments businesses toward Sierra Leone.',
      'As with the other expansion announcements, a firm launch date and the details of service coverage are still to be confirmed.',
    ],
  },
  {
    slug: 'ctc-taxi-expands-to-sierra-leone',
    title: 'CTC Taxi expands to Sierra Leone',
    excerpt:
      'The group announced a Freetown launch — its first market outside Nigeria — with a liaison office at 7 Bah Drive, Off Spur Road.',
    date: 'March 2026',
    iso: '2026-03',
    tag: 'Expansion',
    img: 'sierraleone',
    featured: true,
    source: {
      label: 'Countryside Group',
      url: 'https://countrysidegroup.com.ng/ctc-taxi-expands-to-sierra-leone-a-new-era-of-safe-reliable-and-smart-transportation/',
    },
    body: [
      'Countryside Group announced that CTC Taxi is preparing to launch operations in Sierra Leone, its first market outside Nigeria. The company framed the move as part of a wider ambition to build mobility solutions across West Africa rather than in one city.',
      'The service is pitched at the things that make informal transport frustrating: drivers go through a structured screening and onboarding process before they can take trips, fares are agreed before the journey rather than negotiated inside it, and vehicles are maintained to a set standard. A support desk sits behind all of it so passengers can report an issue and get an answer.',
      'Beyond the rides, the group said the launch will create work for drivers, fleet partners, customer service staff and local operational teams. In the Freetown market the company has already opened a liaison office at 7 Bah Drive, Off Spur Road, and published two local contact lines.',
      'Launch details — service coverage, booking options and the opening date — are still to be announced.',
    ],
  },
  {
    slug: '4g-gps-dashcams-across-the-fleet',
    title: '4G GPS dashcams fitted across the fleet',
    excerpt:
      'Dual-lens cameras recording the road and the cabin, with live GPS tracking and 4G remote monitoring, now run in every operational vehicle.',
    date: '19 May 2026',
    iso: '2026-05-19',
    tag: 'Safety',
    img: 'dashcam',
    featured: true,
    source: {
      label: 'CTC Taxi',
      url: 'https://ctctaxi.com/ctc-taxi-raises-the-standard-of-passenger-safety-with-advanced-4g-gps-dashcams-across-all-vehicles/',
    },
    body: [
      'CTC Taxi announced that every operational vehicle is now fitted with a 4G GPS dual-lens dash camera. It records two views at once — the road ahead and the vehicle interior — so a trip can be reviewed end to end rather than pieced together from one angle.',
      'The GPS element feeds trip monitoring and route tracking. In practice that means driver accountability, faster incident review, and a fleet team that can see where a car is when something goes wrong. The 4G connection lets that footage and location data reach the office without anyone having to physically retrieve a memory card.',
      'The company was direct about the second half of the benefit: the cameras protect drivers too. Recorded evidence settles disputes and false claims, which is one of the quieter costs of driving for a living in Lagos.',
      'It is a meaningful upgrade for the two people in the car. A passenger heading home late, a parent booking a ride for a child, someone racing to a meeting — all of them are now on a monitored trip rather than an unwitnessed one.',
    ],
  },
  {
    slug: 'bred-brand-ambassador',
    title: 'B-Red signs on as Countryside Group brand ambassador',
    excerpt:
      'Afrobeats artist B-Red — Adebayo Adeleke — put his name to the group at its Lagos headquarters in February 2026.',
    date: '14 February 2026',
    iso: '2026-02-14',
    tag: 'Company',
    img: 'bred',
    source: {
      label: 'Vanguard',
      url: 'https://www.vanguardngr.com/2026/02/afrobeats-star-b-red-becomes-countryside-groups-brand-ambassador/',
    },
    body: [
      'Countryside Group signed Afrobeats artist B-Red, real name Adebayo Adeleke, as its brand ambassador at the company headquarters at Plot 25 Ojefia Crescent, Victory Estate, Ago Palace Way, Lagos.',
      'Group Chief Executive Officer Chief Dr. George Ndubisi described the partnership as deliberate rather than decorative: \u201cB-Red represents influence, resilience, and international recognition. As we expand across FinTech with BlowPay, mobility through CTC Taxi, automobile sales, air ticketing and global travel services, marine logistics, and entertainment, we require ambassadors who reflect our ambition and global outlook.\u201d',
      'The signing was covered by Vanguard, Punch and syndicated outlets. Under the agreement B-Red fronts corporate campaigns and digital activations across the group\u2019s portfolio — of which taxi and ride-hailing is one arm.',
      'The group said the appointment was part of positioning itself as a multi-sector African brand rather than a single-service operator.',
    ],
  },
  {
    slug: 'fakepoco-brand-ambassador',
    title: 'Fakepoco becomes ambassador for CTC Taxi',
    excerpt:
      'Entertainer and influencer Fakepoco signed for three group brands by name — with CTC Taxi one of them.',
    date: 'June 2026',
    iso: '2026-06',
    tag: 'Company',
    img: 'fakepoco',
    source: {
      label: 'The Guardian NG',
      url: 'https://guardian.ng/business-services/fake-poco-emerges-countryside-ambassador/',
    },
    body: [
      'Countryside Group signed entertainer and social media personality Omotore Adebayo Barry — known as Whiteman, or Fakepoco — as its newest brand ambassador, at a ceremony at the group head office.',
      'Unlike a general group endorsement, this one named three businesses: BlowPay Global Services, CTC Taxi (Countryside Taxi Company Ltd) and Countryside Travels & Tours. For CTC Taxi that means a recognisable face attached directly to the ride-hailing brand.',
      'The group chairman, High Chief Dr. Ndubisi George Ugo, called it \u201ca strategic investment in brand growth and public engagement,\u201d and said the partnership was aimed at elevating \u201cCTC Taxi, Countryside Travels & Tours, and BlowPay to greater heights.\u201d',
      'Under the deal Fakepoco will appear in marketing campaigns, digital promotions, community outreach and live events across the three brands. The Guardian, Vanguard and The Sun all carried the announcement.',
    ],
  },
  {
    slug: 'blowpay-sierra-leone',
    title: 'BlowPay heads for Sierra Leone',
    excerpt:
      'The group\u2019s payments platform is being prepared for launch in Sierra Leone, with wallet, transfers and merchant payments.',
    date: '16 March 2026',
    iso: '2026-03-16',
    tag: 'Payments',
    img: 'blowpay',
    source: {
      label: 'Countryside Group',
      url: 'https://countrysidegroup.com.ng/blowpay-set-to-launch-in-sierra-leone-advancing-digital-payments-and-financial-accessibility/',
    },
    body: [
      'BlowPay, the digital payments platform built by Countryside Group, is preparing to launch in Sierra Leone. The stated aim is financial inclusion — services that work for people inside the banking system and for those who have never been in it.',
      'The platform covers digital wallet services, peer-to-peer transfers, merchant payment tools, and bill payments for everyday things like electricity, airtime, cable TV and betting. For small businesses the pitch is narrower and more practical: take payments more efficiently, depend less on cash, keep a record of what came in.',
      'It matters to CTC Taxi because payments are the plumbing underneath every ride. Countryside Group describes its companies as an ecosystem rather than a set of separate businesses, and a ride-hailing service that can settle trips digitally in more than one country is a materially different product from one that cannot.',
      'Merchant partnerships, user onboarding and the official launch date are still to be confirmed.',
    ],
  },
  {
    slug: 'travels-sierra-leone',
    title: 'CountrySide Travels & Tours expands into Sierra Leone',
    excerpt:
      'The group\u2019s travel arm is preparing to launch in Sierra Leone across tours, corporate travel, holidays and group bookings.',
    date: 'March 2026',
    iso: '2026-03',
    tag: 'Travel',
    img: 'travels',
    source: {
      label: 'Countryside Group',
      url: 'https://countrysidegroup.com.ng/countryside-travels-tours-announces-expansion-into-sierra-leones-tourism-and-travel-market/',
    },
    body: [
      'CountrySide Travels & Tours, the group\u2019s travel subsidiary, is preparing to launch operations in Sierra Leone. The company will run tour packages, corporate travel management, holiday and vacation planning, group travel coordination for schools and organisations, and travel advisory for people who would rather not plan a trip alone.',
      'The corporate side is where the overlap with CTC Taxi sits. Business travel is rarely just a flight — it is a flight, a pickup, a hotel and someone to call when the schedule moves. The group is positioning the travel arm and the transport arm as one answer to that.',
      'CountrySide Travels & Tours also said it intends to work with local tour guides, hotels, hospitality providers, transport companies and event organisers, and to help promote Sierra Leone as a destination in its own right rather than a stopover.',
      'Service details, packages and partnerships are to be announced as the launch approaches.',
    ],
  },
  {
    slug: 'road-safety-tips',
    title: 'Ten road safety habits we hold our drivers to',
    excerpt:
      'Seatbelts, safe following distance, no phone in hand, no drinking and driving — the basics, and why they are not optional here.',
    date: 'Guide',
    iso: '',
    tag: 'Safety',
    img: 'support',
    source: {
      label: 'CTC Taxi',
      url: 'https://ctctaxi.com/top-10-road-safety-tips-for-our-passengers-and-drivers/',
    },
    body: [
      'Most of what keeps a journey safe is not clever. Wear the seatbelt. Follow the speed limit and the signals. Keep both hands and your attention off your phone. Leave a sensible gap to the car in front so that a sudden brake is not your problem. Check the brakes, tyres and lights before they become an emergency.',
      'The rest applies outside the car as much as inside it: be visible on foot or on two wheels at night, signal your intentions, slow down at intersections, and watch for children — they move first and decide later.',
      'The last one is not a tip so much as a line we do not cross: never drink and drive. It impairs the one thing a driver cannot afford to lose.',
      'These are simple rules and they are exactly the rules that get skipped when someone is running late. Our expectation is that drivers on the CTC network run late rather than run a risk.',
    ],
  },
];

export const TAGS = ['All', 'Company', 'Safety', 'Expansion', 'Travel', 'Payments'] as const;
export type TagFilter = (typeof TAGS)[number];
