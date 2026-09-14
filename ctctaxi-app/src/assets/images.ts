// Auto-generated image manifest.
// Importing through Vite gives hashed, cache-busting URLs in production,
// and inline data URIs in the single-file review build.

import airport_1280 from './img/airport-1280.webp';
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
};

/** Responsive srcset from the generated widths. */
export function srcset(base: string): string {
  const set = SETS[base];
  if (!set) return '';
  const widths = base === 'lagos_map_office' ? [900, 1400] : [768, 1280];
  return set.map((u, i) => `${u} ${widths[i]}w`).join(', ');
}