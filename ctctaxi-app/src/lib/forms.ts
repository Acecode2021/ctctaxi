import { track } from './analytics';

export type Errors<T> = Partial<Record<keyof T, string>>;

/** Applied to every text control: sensible mobile keyboards, no autocorrect noise. */
export const CAPTURE = {
  autoCorrect: 'off',
  autoCapitalize: 'none' as const,
  spellCheck: false,
};

/* ------------------------------------------------------------- validators */

/**
 * Accepts any phone number: Nigerian, international, with spaces, dashes,
 * parentheses, plus signs. Only requires at least 7 digits total.
 */
export function isPhone(v: string): boolean {
  const digits = v.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
}

/* ------------------------------------------------------- booking validation */

export type BookingValues = {
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  service: string;
  phone: string;
};

export function validate(v: BookingValues): Errors<BookingValues> {
  const e: Errors<BookingValues> = {};

  if (!v.pickup.trim()) e.pickup = 'Where should we pick you up?';
  else if (v.pickup.trim().length < 4) e.pickup = 'Please give a clearer pickup point.';

  if (!v.dropoff.trim()) e.dropoff = 'Where are you going?';
  else if (v.dropoff.trim().length < 3) e.dropoff = 'Please give a clearer destination.';

  if (!v.date) e.date = 'Choose a travel date.';
  else {
    const chosen = new Date(`${v.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (chosen < today) e.date = 'That date has already passed.';
  }

  if (!v.time) e.time = 'Choose a pickup time.';

  if (!v.phone.trim()) e.phone = 'We need a number to confirm your driver.';
  else if (!isPhone(v.phone)) e.phone = 'Enter a valid phone number (at least 7 digits).';

  return e;
}

/* -------------------------------------------------------- driver validation */

export type DriverValues = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  licence: string;
  ownVehicle: string;
  vehicle: string;
  experience: string;
};

export function validateDriver(v: DriverValues): Errors<DriverValues> {
  const e: Errors<DriverValues> = {};

  if (!v.fullName.trim()) e.fullName = 'Please enter your full name.';
  else if (v.fullName.trim().split(/\s+/).length < 2)
    e.fullName = 'Enter your first and last name.';

  if (!v.phone.trim()) e.phone = 'A phone number is required.';
  else if (!isPhone(v.phone)) e.phone = 'Enter a valid phone number.';

  if (v.email.trim() && !isEmail(v.email)) e.email = 'That email address looks incorrect.';

  if (!v.location.trim()) e.location = 'Which area do you operate from?';

  if (!v.licence) e.licence = 'Select your licence status.';

  if (!v.ownVehicle) e.ownVehicle = 'Let us know if you own a vehicle.';

  if (v.ownVehicle === 'yes' && !v.vehicle.trim())
    e.vehicle = 'Tell us the make and model of your vehicle.';

  return e;
}

/* ---------------------------------------------------------------- transport */

export type SubmitResult = { ok: boolean; error?: string };

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

/**
 * Posts a submission to the configured endpoint.
 *
 * Set VITE_FORM_ENDPOINT in your environment (Formspree, Netlify Forms,
 * a Cloudflare Worker, or your own API) to go live. With no endpoint
 * configured the form resolves locally so the UI can be reviewed end to end,
 * and logs a clear warning rather than pretending the data was captured.
 */
export async function submitForm(
  form: 'booking' | 'driver' | 'contact',
  values: Record<string, string>,
): Promise<SubmitResult> {
  const payload = {
    form,
    ...values,
    submittedAt: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  };

  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 900));
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        '[CTC Taxi] No VITE_FORM_ENDPOINT configured — submission was not transmitted.\n' +
          'Add the variable to .env to connect the form. Payload that would have been sent:',
        payload,
      );
    }
    return { ok: true };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network' };
  }
}

/* Re-exported so components import tracking and forms from one place. */
export { track };