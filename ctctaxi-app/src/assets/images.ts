// Auto-generated image manifest.
// Importing through Vite gives hashed, cache-busting URLs in production,
// and inline data URIs in the single-file review build.

import airport_1280 from './img/airport-768.webp';
import airport_768 from './img/airport-768.webp';
import corporate_1280 from './img/corporate-1280.webp';
import corporate_768 from './img/corporate-768.webp';
import delivery_1280 from './img/delivery-1280.webp';
import delivery_768 from './img/delivery-768.webp';
import driver_1280 from './img/driver-1280.webp';
import driver_768 from './img/driver-768.webp';
import final_cta_1280 from './img/final-cta-1280.webp';
import final_cta_768 from './img/final-cta-768.webp';
import hero_main_1280 from './img/hero-main-1280.webp';
import hero_main_768 from './img/hero-main-768.webp';
import icon_driver from './img/icon_driver.png';
import icon_rider from './img/icon_rider.png';
import lagos_map_office_1400 from './img/lagos-map-office-1400.webp';
import lagos_map_office_900_square from './img/lagos-map-office-900-square.webp';
import lagos_map_office_900 from './img/lagos-map-office-900.webp';
import logo_ink from './img/logo-ink.png';
import logo_white from './img/logo-white.png';
import rides_1280 from './img/rides-1280.webp';
import rides_768 from './img/rides-768.webp';
import safety_1280 from './img/safety-1280.webp';
import safety_768 from './img/safety-768.webp';
import scheduled_1280 from './img/scheduled-1280.webp';
import scheduled_768 from './img/scheduled-768.webp';
import shot_driver_1 from './img/shot_driver_1.jpg';
import shot_rider_1 from './img/shot_rider_1.jpg';
import shot_rider_2 from './img/shot_rider_2.jpg';

import blog_uganda_760 from './img/ytq_awNtgGnWYhE.jpg';
import blog_sierraleone_760 from './img/ctc-sierraleone (1).jpg';
import blog_dashcam_760 from './img/dashcam (1).jpg';
import blog_bred_760 from './img/Countryside-Group-CEO-and-B-Red-768x512.jpg';
import blog_fakepoco_760 from './img/guardian-fakepoco.webp';
import blog_blowpay_760 from './img/blowpay (1).png';
import blog_travels_760 from './img/travels (1).jpg';
import blog_support_760 from './img/roadsafety (1).jpg';

import social_fleet_760 from './img/shot_0.png';
import social_support_760 from './img/ytq_netW-89fw5U.jpg';
import social_office_760 from './img/ytq_6n7e7Y87Q1Y.jpg';
import social_staff_760 from './img/ytq_JSr_6l0ZZ5k.jpg';
import social_brand_760 from './img/yt_ptC2RIPt6Ug.jpg';

export const IMG = {
  airport_1280,
  airport_768,
  corporate_1280,
  corporate_768,
  delivery_1280,
  delivery_768,
  driver_1280,
  driver_768,
  final_cta_1280,
  final_cta_768,
  hero_main_1280,
  hero_main_768,
  icon_driver,
  icon_rider,
  lagos_map_office_1400,
  lagos_map_office_900_square,
  lagos_map_office_900,
  logo_ink,
  logo_white,
  rides_1280,
  rides_768,
  safety_1280,
  safety_768,
  scheduled_1280,
  scheduled_768,
  shot_driver_1,
  shot_rider_1,
  shot_rider_2,
  blog_uganda_760,
  blog_sierraleone_760,
  blog_dashcam_760,
  blog_bred_760,
  blog_fakepoco_760,
  blog_blowpay_760,
  blog_travels_760,
  blog_support_760,
  social_fleet_760,
  social_support_760,
  social_office_760,
  social_staff_760,
  social_brand_760,
  social_uganda_760: blog_uganda_760,
};

// Named maps for the srcset helper.
const SETS: Record<string, string[]> = {
  hero_main: [IMG.hero_main_768, IMG.hero_main_1280],
  airport: [IMG.airport_768, IMG.airport_1280],
  corporate: [IMG.corporate_768, IMG.corporate_1280],
  rides: [IMG.rides_768, IMG.rides_1280],
  scheduled: [IMG.scheduled_768, IMG.scheduled_1280],
  delivery: [IMG.delivery_768, IMG.delivery_1280],
  safety: [IMG.safety_768, IMG.safety_1280],
  driver: [IMG.driver_768, IMG.driver_1280],
  final_cta: [IMG.final_cta_768, IMG.final_cta_1280],
  lagos_map_office: [IMG.lagos_map_office_900, IMG.lagos_map_office_1400],
  blog_uganda: [IMG.blog_uganda_760],
  blog_sierraleone: [IMG.blog_sierraleone_760],
  blog_dashcam: [IMG.blog_dashcam_760],
  blog_bred: [IMG.blog_bred_760],
  blog_fakepoco: [IMG.blog_fakepoco_760],
  blog_blowpay: [IMG.blog_blowpay_760],
  blog_travels: [IMG.blog_travels_760],
  blog_support: [IMG.blog_support_760],
  social_fleet: [IMG.social_fleet_760],
  social_support: [IMG.social_support_760],
  social_office: [IMG.social_office_760],
  social_staff: [IMG.social_staff_760],
  social_brand: [IMG.social_brand_760],
  social_uganda: [IMG.social_uganda_760],
};

/** Responsive srcset from the generated widths. */
export function srcset(base: string): string {
  const set = SETS[base];
  if (!set) return '';
  const widths = set.length === 1 ? [760] : base === 'lagos_map_office' ? [900, 1400] : [768, 1280];
  return set.map((u, i) => `${u} ${widths[Math.min(i, widths.length - 1)]}w`).join(', ');
}