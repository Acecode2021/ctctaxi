/**
 * Analytics — a tiny, dependency-free event layer.
 *
 * Pushes to `window.dataLayer` (Google Tag Manager) and forwards to
 * `window.gtag` / `window.fbq` when present. Nothing is loaded until a real
 * tag manager is added to index.html, so the site ships zero tracking bytes.
 */

export type AnalyticsEvent =
  | 'booking_started'
  | 'booking_submitted'
  | 'booking_failed'
  | 'phone_click'
  | 'whatsapp_click'
  | 'driver_application_started'
  | 'driver_application_submitted'
  | 'app_download_click'
  | 'service_card_open'
  | 'faq_open'
  | 'cta_click'
  | 'form_error';

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  const detail = { event, ...payload, ts: Date.now() };

  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(detail);

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, payload);
  }
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', event, payload);
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, payload);
  }
}

/* ------------------------------------------------------------------ config
 * Single source of truth for contact + app destinations. Every CTA on the
 * site reads from here, so a number change is a one-line change.
 * ---------------------------------------------------------------------- */

export const CONTACT = {
  phonePrimary: '08039304425',
  phonePrimaryTel: '+2348039304425',
  phoneSecondary: '07016363355',
  phoneSecondaryTel: '+2347016363355',
  whatsapp: '2348039304425',
  email: 'info@ctctaxi.com',
  addressLines: [
    'Plot 25 Ojefia Crescent, Victory Estate,',
    'Amuwo Odofin, Ago Palace Way,',
    'Lagos, Nigeria',
  ],
  hours: 'Open 24 hours, 7 days',
} as const;

export const APPS = {
  riderPlay:
    'https://play.google.com/store/apps/details?id=com.countryside.taxiuser',
  riderAppStore: 'https://apps.apple.com/ng/app/ctc-taxi-ride-with-ease/id1671325522',
  driverPlay:
    'https://play.google.com/store/apps/details?id=com.countryside.taxidriver',
} as const;

/**
 * The office, geocoded and verified.
 *
 * Coordinates resolve to Ojefia Crescent, Victory Estate, Ago Palace,
 * Oshodi/Isolo, Lagos — confirmed against OpenStreetMap (Nominatim) on
 * 11 September 2026. Update these three values if the office moves and the
 * map, the directions links and the structured data all follow.
 */
export const MAP = {
  lat: 6.4878594,
  lng: 3.3040911,
  zoom: 16,
  label: 'Plot 25 Ojefia Crescent, Victory Estate, Ago Palace, Lagos',
  verifiedOn: '11 September 2026',
  /** Interactive OpenStreetMap embed — no API key, no cookie wall. */
  get embed() {
    const d = 0.006; // degrees of padding around the pin
    const bbox = [this.lng - d, this.lat - d / 1.6, this.lng + d, this.lat + d / 1.6].join('%2C');
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${this.lat}%2C${this.lng}`;
  },
  /** Opens the native maps app on mobile, Google Maps on desktop. */
  get directions() {
    return `https://www.google.com/maps/dir/?api=1&destination=${this.lat},${this.lng}`;
  },
  get place() {
    return `https://www.google.com/maps/search/?api=1&query=${this.lat},${this.lng}`;
  },
  get geo() {
    return `geo:${this.lat},${this.lng}?q=${this.lat},${this.lng}(${encodeURIComponent('CTC Taxi')})`;
  },
  get osmLink() {
    return `https://www.openstreetmap.org/?mlat=${this.lat}&mlon=${this.lng}#map=${this.zoom}/${this.lat}/${this.lng}`;
  },
} as const;

export const SOCIAL = {
  facebook: 'https://facebook.com/ctctaxiofficial',
  instagram: 'https://instagram.com/ctctaxiofficial',
  x: 'https://x.com/ctctaxiofficial',
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
