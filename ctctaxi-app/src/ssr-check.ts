import { render } from './ssr-entry';

const html = render();

const checks: [string, boolean][] = [
  ['renders output', html.length > 5000],
  ['hero headline', html.includes('Your Journey')],
  ['rotating keyword', html.includes('With Ease')],
  ['eyebrow', html.includes('Lagos moves with CTC')],
  ['booking card', html.includes('Book your ride')],
  ['service types', html.includes('Airport Transfer') && html.includes('Delivery')],
  ['nav', html.includes('Drive With CTC')],
  ['trust strip', html.includes('Professional Drivers')],
  ['services heading', html.includes('Many Ways To Move')],
  ['cta buttons', html.includes('Book a Ride') && html.includes('Explore Our Services')],
  ['tel link', html.includes('tel:+2348039304425')],
  ['whatsapp link', html.includes('wa.me/2348039304425')],
  ['app store link', html.includes('apps.apple.com')],
  ['play store link', html.includes('play.google.com')],
  ['aria labels present', html.includes('aria-label')],
  ['no unrendered tokens', !/__[A-Z_]+__/.test(html)],
  ['booking form inputs', (html.match(/<input/g) || []).length >= 5],
  ['app download strip', html.includes('There are two CTC apps')],
  ['two apps section', html.includes('One sends the ride')],
  ['rider app explained', html.includes('The passenger app')],
  ['driver app explained', html.includes('The driver app')],
  ['app store CTA in hero', html.includes('App Store')],
  ['contact map poster', html.includes('lagos-map-office') || html.includes('Map showing the CTC Taxi office')],
  ['map coordinates', html.includes('6.48786')],
  ['directions link', html.includes('google.com/maps/dir')],
  ['office address on map', html.includes('Ojefia Crescent')],
];

let fail = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? ' PASS' : ' FAIL'}  ${name}`);
  if (!ok) fail++;
}
console.log(`\nRendered ${html.length.toLocaleString()} bytes. ${checks.length - fail}/${checks.length} checks passed.`);
if (fail) process.exitCode = 1;
