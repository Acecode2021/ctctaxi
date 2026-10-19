import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type ChangeEvent,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from 'react';
import { Icon } from './primitives';
import { API_BASE_URL, CAPTURE, validate, type Errors } from '../lib/forms';
import { CONTACT, track } from '../lib/submit';

/* ================================================================
   TYPES
   ================================================================ */

type ServiceType = 'ride' | 'bike' | 'delivery' | 'bus' | 'corporate' | 'airport';
type AirportDirection = '' | 'from' | 'to';
type DeliveryVehicle = '' | 'car' | 'bike';

interface Values {
  readonly pickup: string;
  readonly dropoff: string;
  readonly date: string;
  readonly time: string;
  readonly service: ServiceType;
  readonly phone: string;
  readonly airportDirection: AirportDirection;
  readonly airport: string;
  readonly airportCustomName: string;
  readonly airportOtherLocation: string;
  readonly corporatePassengers: string;
  readonly corporateVehicle: string;
  readonly deliveryVehicle: DeliveryVehicle;
  readonly packageType: string;
  readonly notes: string;
}

type FieldKey = keyof Values;
type FieldErrors = Partial<Record<FieldKey, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

/* ================================================================
   CONSTANTS
   ================================================================ */

const STORAGE_KEY = 'ctc_quickbook_draft';
const MAX_FIELD_LENGTH = 500;
const MAX_NOTES_LENGTH = 1000;
const PHONE_REGEX = /^(\+?234|0)[789]\d{9}$/;
const DEBOUNCE_MS = 300;

const EMPTY: Values = Object.freeze({
  pickup: '',
  dropoff: '',
  date: '',
  time: '',
  service: 'ride',
  phone: '',
  airportDirection: '',
  airport: '',
  airportCustomName: '',
  airportOtherLocation: '',
  corporatePassengers: '',
  corporateVehicle: '',
  deliveryVehicle: '',
  packageType: '',
  notes: '',
});

const SERVICE_TYPES: readonly { value: ServiceType; label: string; icon: string }[] = [
  { value: 'ride', label: 'Car', icon: 'car' },
  { value: 'delivery', label: 'Delivery', icon: 'package' },
  { value: 'corporate', label: 'Corporate', icon: 'briefcase' },
  { value: 'airport', label: 'Airport', icon: 'plane' },
] as const;

const AIRPORTS: readonly {
  value: string;
  label: string;
  group: string;
  code: string;
}[] = [
  { value: 'los-intl', label: "Murtala Muhammed Int'l (LOS) — Ikeja, Lagos", group: 'International', code: 'LOS' },
  { value: 'abv-intl', label: "Nnamdi Azikiwe Int'l (ABV) — Abuja", group: 'International', code: 'ABV' },
  { value: 'phc-intl', label: "Port Harcourt Int'l (PHC) — Omagwa", group: 'International', code: 'PHC' },
  { value: 'kan-intl', label: "Mallam Aminu Kano Int'l (KAN) — Kano", group: 'International', code: 'KAN' },
  { value: 'enu-intl', label: "Akanu Ibiam Int'l (ENU) — Enugu", group: 'International', code: 'ENU' },
  { value: 'los-dom', label: 'MMA Domestic 1 (LOS) — Ikeja, Lagos', group: 'Local / Domestic', code: 'LOS' },
  { value: 'mma2', label: 'MMA2 Domestic (LOS) — Ikeja, Lagos', group: 'Local / Domestic', code: 'LOS' },
  { value: 'abv-dom', label: 'Abuja Domestic (ABV) — Abuja', group: 'Local / Domestic', code: 'ABV' },
  { value: 'phc-dom', label: 'Port Harcourt Domestic (PHC)', group: 'Local / Domestic', code: 'PHC' },
  { value: 'bni', label: 'Benin Airport (BNI) — Benin City', group: 'Local / Domestic', code: 'BNI' },
  { value: 'abb', label: "Asaba Int'l (ABB) — Asaba", group: 'Local / Domestic', code: 'ABB' },
  { value: 'iba', label: 'Ibadan Airport (IBA) — Ibadan', group: 'Local / Domestic', code: 'IBA' },
  { value: 'other-airport', label: 'Other airport / airstrip', group: 'Local / Domestic', code: '' },
] as const;

const AIRPORT_GROUPS = (() => {
  const seen = new Set<string>();
  const groups: { label: string; options: { value: string; label: string }[] }[] = [];
  for (const a of AIRPORTS) {
    if (!seen.has(a.group)) {
      seen.add(a.group);
      groups.push({
        label: a.group,
        options: AIRPORTS
          .filter((x) => x.group === a.group)
          .map(({ value, label }) => ({ value, label })),
      });
    }
  }
  return groups;
})();

const CORPORATE_VEHICLES = [
  { value: 'sedan', label: 'Sedan (4 seats)', maxPassengers: 4 },
  { value: 'hilux', label: 'Hilux (5 seats)', maxPassengers: 5 },
  { value: 'suv', label: 'SUV (6 seats)', maxPassengers: 6 },
  { value: 'van', label: 'Van (14 seats)', maxPassengers: 14 },
  { value: 'coaster', label: 'Coaster (30 seats)', maxPassengers: 30 },
  { value: 'staffbus', label: 'Staff bus (45 seats)', maxPassengers: 45 },
] as const;

const PACKAGE_TYPES = [
  'Documents',
  'Parcel',
  'Food',
  'Fragile items',
  'Bulk / cargo',
  'Other',
].map((p) => ({ value: p, label: p }));

const DIRECTION_OPTIONS = [
  { value: 'from' as const, label: 'Pick me up from the airport', icon: 'plane-landing' },
  { value: 'to' as const, label: 'Drop me at the airport', icon: 'plane-takeoff' },
] as const;

/* ================================================================
   HOOKS
   ================================================================ */

function useToday(): string {
  const [today, setToday] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const ms = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setToday(new Date().toISOString().slice(0, 10));
    }, ms + 100);

    return () => clearTimeout(timer);
  }, [today]);

  return today;
}

function useDraftPersistence(values: Values, setValues: (v: Values) => void): void {
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Values>;
        setValues({ ...EMPTY, ...parsed });
      }
    } catch {
      /* noop */
    }
    isInitialMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        /* noop */
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [values]);
}

function useTrackOnce() {
  const firedRef = useRef(false);

  return useCallback((service: ServiceType) => {
    if (!firedRef.current) {
      firedRef.current = true;
      track('booking_started', { service });
    }
  }, []);
}

/* ================================================================
   VALIDATION
   ================================================================ */

function sanitize(s: string, maxLen = MAX_FIELD_LENGTH): string {
  return s.trim().slice(0, maxLen);
}

function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, '');
}

function resolvePickupDropoff(v: Values): { pickup: string; dropoff: string } {
  if (v.service !== 'airport') {
    return { pickup: v.pickup, dropoff: v.dropoff };
  }

  const airportName =
    v.airport === 'other-airport'
      ? v.airportCustomName
      : AIRPORTS.find((a) => a.value === v.airport)?.label ?? v.airport;

  if (v.airportDirection === 'from') {
    return { pickup: airportName, dropoff: v.airportOtherLocation };
  }
  if (v.airportDirection === 'to') {
    return { pickup: v.airportOtherLocation, dropoff: airportName };
  }
  return { pickup: '', dropoff: '' };
}

function validateBooking(v: Values): FieldErrors {
  const errors: FieldErrors = {};
  const { pickup, dropoff } = resolvePickupDropoff(v);

  const corePayload = { pickup, dropoff, date: v.date, time: v.time, phone: v.phone };
  const coreErrors = validate(corePayload as Parameters<typeof validate>[0]) as Errors<typeof corePayload>;

  if (v.service === 'airport') {
    if (coreErrors.pickup) {
      if (v.airportDirection === 'from') errors.airport = coreErrors.pickup;
      else if (v.airportDirection === 'to') errors.airportOtherLocation = coreErrors.pickup;
    }
    if (coreErrors.dropoff) {
      if (v.airportDirection === 'from') errors.airportOtherLocation = coreErrors.dropoff;
      else if (v.airportDirection === 'to') errors.airport = coreErrors.dropoff;
    }
  } else {
    if (coreErrors.pickup) errors.pickup = coreErrors.pickup;
    if (coreErrors.dropoff) errors.dropoff = coreErrors.dropoff;
  }

  if (coreErrors.date) errors.date = coreErrors.date;
  if (coreErrors.time) errors.time = coreErrors.time;
  if (coreErrors.phone) errors.phone = coreErrors.phone;

  if (!errors.phone && v.phone.trim()) {
    const normalized = normalizePhone(v.phone);
    if (!PHONE_REGEX.test(normalized)) {
      errors.phone = 'Enter a valid Nigerian phone number.';
    }
  }

  if (!errors.date && v.date) {
    const selected = new Date(v.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (selected < now) {
      errors.date = 'Date cannot be in the past.';
    }
  }

  if (!errors.time && !errors.date && v.date && v.time) {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    if (v.date === todayStr) {
      const [h, m] = v.time.split(':').map(Number);
      if (h < now.getHours() || (h === now.getHours() && m < now.getMinutes())) {
        errors.time = 'Time has already passed for today.';
      }
    }
  }

  if (v.service === 'airport') {
    if (!v.airportDirection) {
      errors.airportDirection = 'Choose whether we pick you up or drop you off.';
    }
    if (!v.airport) {
      errors.airport = 'Select an airport.';
    }
    if (v.airport === 'other-airport' && !sanitize(v.airportCustomName)) {
      errors.airportCustomName = 'Enter the airport or airstrip name.';
    }
    if (!sanitize(v.airportOtherLocation)) {
      errors.airportOtherLocation =
        v.airportDirection === 'to'
          ? 'Where are we picking you from?'
          : 'Where should we take you?';
    }
  }

  if (v.service === 'corporate') {
    const n = Number(v.corporatePassengers);
    if (!v.corporatePassengers.trim()) {
      errors.corporatePassengers = 'How many people are travelling?';
    } else if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
      errors.corporatePassengers = 'Enter a whole number (at least 1).';
    } else if (n > 200) {
      errors.corporatePassengers = 'For groups over 200, please call us directly.';
    }

    if (!v.corporateVehicle) {
      errors.corporateVehicle = 'Choose the type of vehicle.';
    }

    if (v.corporateVehicle && n > 0) {
      const vehicle = CORPORATE_VEHICLES.find((cv) => cv.value === v.corporateVehicle);
      if (vehicle && n > vehicle.maxPassengers) {
        errors.corporatePassengers = `A ${vehicle.label.toLowerCase()} holds ${vehicle.maxPassengers} people. Choose a larger vehicle or reduce passengers.`;
      }
    }
  }

  if (v.service === 'delivery') {
    if (!v.deliveryVehicle) {
      errors.deliveryVehicle = 'Choose car or bike.';
    }
    if (!v.packageType) {
      errors.packageType = 'Tell us what you are sending.';
    }
  }

  if (v.notes.length > MAX_NOTES_LENGTH) {
    errors.notes = `Notes must be under ${MAX_NOTES_LENGTH} characters.`;
  }

  return errors;
}

/* ================================================================
   SUBMIT PAYLOAD
   ================================================================ */

function buildPayload(v: Values) {
  const { pickup, dropoff } = resolvePickupDropoff(v);

  const base = {
    pickup: sanitize(pickup),
    dropoff: sanitize(dropoff),
    date: v.date,
    time: v.time,
    phone: normalizePhone(v.phone),
    serviceType: v.service,
    notes: sanitize(v.notes, MAX_NOTES_LENGTH) || undefined,
  };

  switch (v.service) {
    case 'airport':
      return {
        ...base,
        airport: {
          direction: v.airportDirection,
          terminal: v.airport,
          customTerminalName:
            v.airport === 'other-airport' ? sanitize(v.airportCustomName) : undefined,
          location: sanitize(v.airportOtherLocation),
        },
      };

    case 'corporate':
      return {
        ...base,
        corporate: {
          passengers: Number(v.corporatePassengers),
          vehicleClass: v.corporateVehicle,
        },
      };

    case 'delivery':
      return {
        ...base,
        delivery: {
          vehicle: v.deliveryVehicle,
          packageType: v.packageType,
        },
      };

    default:
      return base;
  }
}

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const FADE_SLIDE = {
  initial: { opacity: 0, y: 12, height: 0 },
  animate: { opacity: 1, y: 0, height: 'auto' as const },
  exit: { opacity: 0, y: -8, height: 0 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};

const CARD_VARIANTS = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function QuickBook() {
  const reduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const submitCountRef = useRef(0);

  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<FieldKey>>(new Set());
  const [status, setStatus] = useState<Status>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const today = useToday();
  const trackStart = useTrackOnce();
  useDraftPersistence(v, setV);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (touched.size === 0) return;

    const timer = setTimeout(() => {
      const allErrors = validateBooking(v);
      const filtered: FieldErrors = {};
      for (const key of touched) {
        if (allErrors[key]) filtered[key] = allErrors[key];
      }
      setErrors(filtered);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [v, touched]);

  const set = useCallback(
    (k: FieldKey) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const rawValue = e.target.value;
        const clampedValue =
          k === 'notes'
            ? rawValue.slice(0, MAX_NOTES_LENGTH + 50)
            : rawValue.slice(0, MAX_FIELD_LENGTH);

        setV((prev) => ({ ...prev, [k]: clampedValue }));
        setTouched((prev) => new Set(prev).add(k));
        trackStart(v.service);
      },
    [v.service, trackStart],
  );

  const markTouched = useCallback(
    (k: FieldKey) => () => {
      setTouched((prev) => {
        if (prev.has(k)) return prev;
        return new Set(prev).add(k);
      });
    },
    [],
  );

  const pickService = useCallback(
    (s: ServiceType) => {
      if (s === v.service) return;
      setV((prev) => ({ ...prev, service: s }));
      setErrors({});
      setTouched(new Set());
      track('service_selected', { service: s });
    },
    [v.service],
  );

  const resetForm = useCallback(() => {
    setV(EMPTY);
    setErrors({});
    setTouched(new Set());
    setStatus('idle');
    setRetryCount(0);
    setShowNotes(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const focusFirstError = useCallback(() => {
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[data-invalid="true"]');
      if (el) {
        el.focus();
        el.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    });
  }, [reduced]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const allErrors = validateBooking(v);
    setErrors(allErrors);
    setTouched(new Set(Object.keys(v) as FieldKey[]));

    if (Object.keys(allErrors).length > 0) {
      track('form_error', {
        form: 'quick_book',
        count: Object.keys(allErrors).length,
        fields: Object.keys(allErrors).join(','),
        service: v.service,
      });
      focusFirstError();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('submitting');
    submitCountRef.current += 1;
    const thisSubmit = submitCountRef.current;

    track('booking_submitted', {
      service: v.service,
      attempt: retryCount + 1,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(v)),
        signal: controller.signal,
      });

      if (thisSubmit !== submitCountRef.current) return;

      if (res.ok) {
        setStatus('success');
        track('booking_success', { service: v.service });
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* noop */
        }
      } else {
        let reason = `http_${res.status}`;
        try {
          const data = await res.json();
          if (data.error) reason = data.error;
          if (data.fieldErrors && typeof data.fieldErrors === 'object') {
            setErrors((prev) => ({ ...prev, ...data.fieldErrors }));
          }
        } catch {
          /* noop */
        }

        setStatus('error');
        setRetryCount((c) => c + 1);
        track('booking_failed', { reason, attempt: retryCount + 1 });
      }
    } catch (err: unknown) {
      if (thisSubmit !== submitCountRef.current) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;

      setStatus('error');
      setRetryCount((c) => c + 1);
      track('booking_failed', { reason: 'network', attempt: retryCount + 1 });
    }
  }

  const busy = status === 'submitting';
  const isAirport = v.service === 'airport';
  const errorCount = Object.keys(errors).length;

  const greetingName = useMemo(() => {
    if (isAirport) return sanitize(v.airportOtherLocation).split(',')[0] || null;
    return sanitize(v.pickup).split(',')[0] || null;
  }, [isAirport, v.airportOtherLocation, v.pickup]);

  /* -------- SUCCESS STATE -------- */
  // 🔑 FIX: The success card is now wrapped in a full-width flex container
  // that centers it both horizontally AND vertically, so it no longer
  // inherits the two-column position from the form layout.
  if (status === 'success') {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <Card>
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="py-6 text-center"
            role="status"
            aria-live="polite"
          >
            <SuccessIcon />

            <h3 className="h3" style={{ marginTop: 20 }}>
              Booking request received
            </h3>

            <p className="lede mx-auto" style={{ marginTop: 12, maxWidth: '150  ch' }}>
              Thank you
              {greetingName
                ? `, heading ${isAirport && v.airportDirection === 'to' ? 'to' : 'from'} ${greetingName}`
                : ''}
              . We are confirming your {serviceWord(v.service)} now. You'll receive a call on{' '}
              <strong>{v.phone || 'your number'}</strong> shortly to confirm your driver and
              fare.
            </p>

            <BookingRef />

            {/* Responsive: stack full-width on mobile, side by side on sm+ */}
            <div
              className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3"
              style={{ marginTop: 24 }}
            >
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--dark btn--sm w-full sm:w-auto"
                onClick={() => track('whatsapp_click', { source: 'booking_success' })}
              >
                Confirm on WhatsApp
              </a>
              <a
                href={`tel:${CONTACT.phonePrimaryTel}`}
                className="btn btn--outline btn--sm w-full sm:w-auto"
                onClick={() => track('phone_click', { source: 'booking_success' })}
              >
                <Icon name="phone" size={15} /> Call us now
              </a>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="btn btn--ghost btn--sm"
              style={{ marginTop: 16, fontSize: '0.78rem' }}
            >
              Book another ride
            </button>
          </motion.div>
        </Card>
      </div>
    );
  }

  /* -------- FORM STATE -------- */

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="h3">Book your ride</h2>
          <p className="text-[0.82rem] mt-1.5" style={{ color: 'var(--color-fg-3)' }}>
            Instant or scheduled · Lagos-wide · 24 / 7
          </p>
        </div>
        <LiveBadge />
      </div>

      {/* Responsive: 2 cols on mobile, 4 on sm+ */}
      <fieldset
        className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-1.5"
        style={{ marginTop: 24, border: 'none', padding: 0 }}
        role="radiogroup"
        aria-label="Service type"
      >
        <legend className="sr-only">Choose a service type</legend>
        {SERVICE_TYPES.map((s) => {
          const on = v.service === s.value;
          return (
            <label
              key={s.value}
              className="relative flex items-center justify-center gap-1.5 text-center rounded-[10px] cursor-pointer select-none focus-within:ring-2 focus-within:ring-offset-2 min-w-0"
              style={{
                padding: '11px 6px',
                fontSize: '0.8rem',
                fontWeight: 560,
                border: `1.5px solid ${on ? 'var(--color-brand)' : 'var(--color-line)'}`,
                background: on ? 'var(--color-brand)' : '#fff',
                color: on ? '#fff' : 'var(--color-fg-2)',
                transition: 'all .18s var(--ease-out-expo)',
              }}
            >
              <input
                type="radio"
                name="service"
                value={s.value}
                checked={on}
                onChange={() => pickService(s.value)}
                className="sr-only"
                aria-label={s.label}
              />
              <Icon name={s.icon} size={15} />
              <span className="truncate">{s.label}</span>
            </label>
          );
        })}
      </fieldset>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        className="mt-5"
        style={{ marginTop: 20 }}
        aria-label={`Book a ${serviceWord(v.service)}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={v.service}
            initial={reduced ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {isAirport && (
              <AirportDirectionSelector
                value={v.airportDirection}
                onChange={set('airportDirection')}
                error={errors.airportDirection}
              />
            )}

            <div
              className="grid gap-3.5 sm:grid-cols-2"
              style={{ marginTop: isAirport ? 14 : 0 }}
            >
              {isAirport ? (
                <AirportFields
                  v={v}
                  errors={errors}
                  set={set}
                  markTouched={markTouched}
                />
              ) : (
                <>
                  <Field
                    id="qb-pickup"
                    label="Pickup location"
                    icon="pin"
                    placeholder="e.g. Ago Palace Way, Amuwo Odofin"
                    value={v.pickup}
                    onChange={set('pickup')}
                    onBlur={markTouched('pickup')}
                    error={errors.pickup}
                    autoComplete="street-address"
                    className="sm:col-span-2"
                    maxLength={MAX_FIELD_LENGTH}
                  />
                  <Field
                    id="qb-dropoff"
                    label="Drop-off location"
                    icon="pin"
                    placeholder="e.g. MMIA, Ikeja"
                    value={v.dropoff}
                    onChange={set('dropoff')}
                    onBlur={markTouched('dropoff')}
                    error={errors.dropoff}
                    autoComplete="street-address"
                    className="sm:col-span-2"
                    maxLength={MAX_FIELD_LENGTH}
                  />

                  {v.service === 'corporate' && (
                    <CorporateFields
                      v={v}
                      errors={errors}
                      set={set}
                      markTouched={markTouched}
                    />
                  )}

                  {v.service === 'delivery' && (
                    <DeliveryFields
                      v={v}
                      errors={errors}
                      set={set}
                      markTouched={markTouched}
                    />
                  )}
                </>
              )}

              <Field
                id="qb-date"
                label="Date"
                type="date"
                min={today}
                value={v.date}
                onChange={set('date')}
                onBlur={markTouched('date')}
                error={errors.date}
              />
              <Field
                id="qb-time"
                label="Time"
                type="time"
                value={v.time}
                onChange={set('time')}
                onBlur={markTouched('time')}
                error={errors.time}
              />
              <Field
                id="qb-phone"
                label="Phone number"
                type="tel"
                inputMode="tel"
                placeholder="0803 000 0000"
                value={v.phone}
                onChange={set('phone')}
                onBlur={markTouched('phone')}
                error={errors.phone}
                autoComplete="tel"
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2">
                {!showNotes ? (
                  <button
                    type="button"
                    onClick={() => setShowNotes(true)}
                    className="text-[0.78rem] font-medium flex items-center gap-1.5"
                    style={{
                      color: 'var(--color-brand)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 0',
                    }}
                  >
                    <Icon name="plus" size={14} />
                    Add special instructions
                  </button>
                ) : (
                  <motion.div {...FADE_SLIDE}>
                    <label className="field__label" htmlFor="qb-notes">
                      Special instructions{' '}
                      <span style={{ fontWeight: 400, color: 'var(--color-fg-3)' }}>
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="qb-notes"
                      className={`control ${errors.notes ? 'control--invalid' : ''}`}
                      rows={3}
                      placeholder="e.g. Gate code is 1234, pick up from the back entrance…"
                      value={v.notes}
                      onChange={set('notes')}
                      onBlur={markTouched('notes')}
                      maxLength={MAX_NOTES_LENGTH + 50}
                      aria-invalid={Boolean(errors.notes)}
                      aria-describedby={errors.notes ? 'qb-notes-err' : undefined}
                      style={{ resize: 'vertical', minHeight: 72 }}
                    />
                    <div
                      className="flex justify-between items-center"
                      style={{ marginTop: 4 }}
                    >
                      {errors.notes ? (
                        <p className="field__error" id="qb-notes-err" style={{ margin: 0 }}>
                          <Icon name="x" size={13} strokeWidth={2.6} />
                          {errors.notes}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span
                        className="text-[0.7rem]"
                        style={{
                          color:
                            v.notes.length > MAX_NOTES_LENGTH
                              ? 'var(--color-error, #d64545)'
                              : 'var(--color-fg-3)',
                        }}
                      >
                        {v.notes.length} / {MAX_NOTES_LENGTH}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {errorCount > 0 && (
          <div className="sr-only" role="alert" aria-live="assertive">
            {errorCount} {errorCount === 1 ? 'error' : 'errors'} found. Please correct{' '}
            {errorCount === 1 ? 'it' : 'them'} before submitting.
          </div>
        )}

        <button
          type="submit"
          className="btn btn--brand btn--block mt-5"
          style={{ marginTop: 20 }}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? (
            <>
              <Spinner /> Sending request…
            </>
          ) : (
            <>
              Get Started <Icon name="arrow-right" size={17} />
            </>
          )}
        </button>

        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              {...FADE_SLIDE}
              role="alert"
              className="field__error mt-3"
              style={{ marginTop: 12 }}
            >
              <Icon name="x" size={13} strokeWidth={2.6} />
              <span>
                We couldn't send that just now.{' '}
                {retryCount < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      requestAnimationFrame(() => formRef.current?.requestSubmit());
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      font: 'inherit',
                    }}
                  >
                    Try again
                  </button>
                ) : (
                  <>
                    Please call {CONTACT.phonePrimary} or message us on WhatsApp and we'll
                    book it for you.
                  </>
                )}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Responsive: stack on mobile, 2-col on sm+ */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5" style={{ marginTop: 16 }}>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
              buildWhatsAppMessage(v),
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline btn--sm"
            onClick={() => track('whatsapp_click', { source: 'quick_book' })}
          >
          </a>
          <a
            href={`tel:${CONTACT.phonePrimaryTel}`}
            className="btn btn--outline btn--sm"
            onClick={() => track('phone_click', { source: 'quick_book' })}
          >
            <Icon name="phone" size={15} /> Call instead
          </a>
        </div>
      </form>

      <p
        className="mt-4 text-[0.74rem] leading-relaxed"
        style={{ color: 'var(--color-fg-3)', marginTop: 16 }}
      >
        <Icon name="lock" size={12} className="inline align-[-2px] mr-1.5" />
        Your details are used only to arrange this journey. No card needed to request.
      </p>
    </Card>
  );
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

interface ServiceFieldProps {
  v: Values;
  errors: FieldErrors;
  set: (
    k: FieldKey,
  ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  markTouched: (k: FieldKey) => () => void;
}

function AirportDirectionSelector({
  value,
  onChange,
  error,
}: {
  value: AirportDirection;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <>
      <SectionLabel>Airport transfer</SectionLabel>
      {/* Responsive: stack on mobile, 2-col on sm+ */}
      <fieldset
        className="grid grid-cols-1 sm:grid-cols-2 gap-1.5"
        role="radiogroup"
        aria-label="Airport direction"
        style={{ border: 'none', padding: 0 }}
      >
        <legend className="sr-only">Are you going to or from the airport?</legend>
        {DIRECTION_OPTIONS.map((opt) => {
          const on = value === opt.value;
          return (
            <label
              key={opt.value}
              className="relative flex items-center justify-center gap-1.5 text-center rounded-[10px] cursor-pointer select-none focus-within:ring-2 focus-within:ring-offset-2"
              style={{
                padding: '12px 8px',
                fontSize: '0.8rem',
                fontWeight: 560,
                border: `1.5px solid ${
                  on
                    ? 'var(--color-brand)'
                    : error
                      ? 'rgba(214,69,69,.55)'
                      : 'var(--color-line)'
                }`,
                background: on ? 'var(--color-brand)' : '#fff',
                color: on ? '#fff' : 'var(--color-fg-2)',
                transition: 'all .18s var(--ease-out-expo)',
              }}
            >
              <input
                type="radio"
                name="airportDirection"
                value={opt.value}
                checked={on}
                onChange={onChange}
                className="sr-only"
                aria-label={opt.label}
              />
              <Icon name={opt.icon} size={15} />
              {opt.label}
            </label>
          );
        })}
      </fieldset>
      <AnimatePresence>
        {error && (
          <motion.p {...FADE_SLIDE} className="field__error" style={{ marginTop: 8 }}>
            <Icon name="x" size={13} strokeWidth={2.6} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

function AirportFields({ v, errors, set, markTouched }: ServiceFieldProps) {
  const isTo = v.airportDirection === 'to';

  const locationField = (
    <Field
      id={`qb-airport-${isTo ? 'origin' : 'destination'}`}
      label={isTo ? 'Where are we picking you from?' : 'Where should we take you?'}
      icon="pin"
      placeholder={
        isTo
          ? 'e.g. 12 Adeola Odeku, Victoria Island'
          : 'e.g. Ago Palace Way, Amuwo Odofin'
      }
      value={v.airportOtherLocation}
      onChange={set('airportOtherLocation')}
      onBlur={markTouched('airportOtherLocation')}
      error={errors.airportOtherLocation}
      autoComplete="street-address"
      className="sm:col-span-2"
      maxLength={MAX_FIELD_LENGTH}
    />
  );

  const airportSelect = (
    <>
      <SelectField
        id="qb-airport"
        label={isTo ? 'Departure airport' : 'Arrival airport'}
        placeholder="Select an airport…"
        groups={AIRPORT_GROUPS}
        value={v.airport}
        onChange={set('airport')}
        onBlur={markTouched('airport')}
        error={errors.airport}
        className="sm:col-span-2"
      />
      <AnimatePresence>
        {v.airport === 'other-airport' && (
          <motion.div {...FADE_SLIDE} className="sm:col-span-2">
            <Field
              id="qb-airport-custom"
              label="Airport / airstrip name"
              placeholder="e.g. Akure Airport"
              value={v.airportCustomName}
              onChange={set('airportCustomName')}
              onBlur={markTouched('airportCustomName')}
              error={errors.airportCustomName}
              maxLength={MAX_FIELD_LENGTH}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return isTo ? (
    <>
      {locationField}
      {airportSelect}
    </>
  ) : (
    <>
      {airportSelect}
      {locationField}
    </>
  );
}

function CorporateFields({ v, errors, set, markTouched }: ServiceFieldProps) {
  const selectedVehicle = CORPORATE_VEHICLES.find((cv) => cv.value === v.corporateVehicle);

  return (
    <>
      <Field
        id="qb-corp-passengers"
        label="No. of people travelling"
        type="number"
        inputMode="numeric"
        min={1}
        max={200}
        placeholder="e.g. 4"
        value={v.corporatePassengers}
        onChange={set('corporatePassengers')}
        onBlur={markTouched('corporatePassengers')}
        error={errors.corporatePassengers}
      />
      <SelectField
        id="qb-corp-vehicle"
        label="Type of vehicle"
        placeholder="Select vehicle…"
        options={CORPORATE_VEHICLES.map(({ value, label }) => ({ value, label }))}
        value={v.corporateVehicle}
        onChange={set('corporateVehicle')}
        onBlur={markTouched('corporateVehicle')}
        error={errors.corporateVehicle}
      />
      {selectedVehicle &&
        Number(v.corporatePassengers) > 0 &&
        !errors.corporatePassengers && (
          <p
            className="sm:col-span-2 text-[0.76rem]"
            style={{ color: 'var(--color-fg-3)', marginTop: -4 }}
          >
            <Icon name="info" size={13} className="inline align-[-2px] mr-1" />
            {selectedVehicle.label} fits up to {selectedVehicle.maxPassengers} passengers.
          </p>
        )}
    </>
  );
}

function DeliveryFields({ v, errors, set, markTouched }: ServiceFieldProps) {
  return (
    <>
      <div className="sm:col-span-2">
        <fieldset style={{ border: 'none', padding: 0 }}>
          <legend className="field__label">Vehicle</legend>
          <div
            className="grid grid-cols-2 gap-1.5"
            role="radiogroup"
            aria-label="Delivery vehicle"
          >
            {(
              [
                { value: 'car' as const, label: 'Car', icon: 'car' },
                { value: 'bike' as const, label: 'Bike', icon: 'bike' },
              ] as const
            ).map((opt) => {
              const on = v.deliveryVehicle === opt.value;
              return (
                <label
                  key={opt.value}
                  className="relative flex items-center justify-center gap-1.5 text-center rounded-[10px] cursor-pointer select-none focus-within:ring-2 focus-within:ring-offset-2"
                  style={{
                    padding: '11px 6px',
                    fontSize: '0.8rem',
                    fontWeight: 560,
                    border: `1.5px solid ${
                      on
                        ? 'var(--color-brand)'
                        : errors.deliveryVehicle
                          ? 'rgba(214,69,69,.55)'
                          : 'var(--color-line)'
                    }`,
                    background: on ? 'var(--color-brand)' : '#fff',
                    color: on ? '#fff' : 'var(--color-fg-2)',
                    transition: 'all .18s var(--ease-out-expo)',
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryVehicle"
                    value={opt.value}
                    checked={on}
                    onChange={set('deliveryVehicle')}
                    className="sr-only"
                    aria-label={opt.label}
                  />
                  <Icon name={opt.icon} size={15} />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <AnimatePresence>
          {errors.deliveryVehicle && (
            <motion.p {...FADE_SLIDE} className="field__error">
              <Icon name="x" size={13} strokeWidth={2.6} />
              {errors.deliveryVehicle}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <SelectField
        id="qb-package-type"
        label="Type of package"
        placeholder="Select package type…"
        options={PACKAGE_TYPES}
        value={v.packageType}
        onChange={set('packageType')}
        onBlur={markTouched('packageType')}
        error={errors.packageType}
        className="sm:col-span-2"
      />
    </>
  );
}

/* ================================================================
   REUSABLE FIELD COMPONENTS
   ================================================================ */

export function Field({
  id,
  label,
  error,
  icon,
  className = '',
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  icon?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const invalid = Boolean(error);
  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-fg-3)' }}
            aria-hidden="true"
          >
            <Icon name={icon} size={16} />
          </span>
        )}
        <input
          id={id}
          className={`control ${icon ? 'pl-10' : ''} ${invalid ? 'control--invalid' : ''}`}
          style={icon ? { paddingLeft: 40 } : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-err` : undefined}
          data-invalid={invalid ? 'true' : undefined}
          {...rest}
          {...CAPTURE}
        />
      </div>
      <AnimatePresence>
        {invalid && (
          <motion.p
            {...FADE_SLIDE}
            className="field__error"
            id={`${id}-err`}
            role="alert"
          >
            <Icon name="x" size={13} strokeWidth={2.6} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectField({
  id,
  label,
  error,
  placeholder,
  options,
  groups,
  className = '',
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  groups?: { label: string; options: { value: string; label: string }[] }[];
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const invalid = Boolean(error);
  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`control ${invalid ? 'control--invalid' : ''}`}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-err` : undefined}
        data-invalid={invalid ? 'true' : undefined}
        {...rest}
        {...CAPTURE}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {groups?.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <AnimatePresence>
        {invalid && (
          <motion.p
            {...FADE_SLIDE}
            className="field__error"
            id={`${id}-err`}
            role="alert"
          >
            <Icon name="x" size={13} strokeWidth={2.6} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   SMALL HELPERS
   ================================================================ */

function serviceWord(s: ServiceType): string {
  const map: Record<ServiceType, string> = {
    ride: 'ride',
    delivery: 'delivery',
    airport: 'airport transfer',
    corporate: 'corporate booking',
    bike: 'bike ride',
    bus: 'bus booking',
  };
  return map[s] ?? 'ride';
}

function buildWhatsAppMessage(v: Values): string {
  const { pickup, dropoff } = resolvePickupDropoff(v);
  const parts = [
    `Hello CTC Taxi, I'd like to book a ${serviceWord(v.service)}.`,
    pickup && `From: ${pickup}`,
    dropoff && `To: ${dropoff}`,
    v.date && `Date: ${v.date}`,
    v.time && `Time: ${v.time}`,
    v.notes && `Notes: ${v.notes}`,
  ].filter(Boolean);
  return parts.join('\n');
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[0.72rem] font-semibold uppercase"
      style={{
        color: 'var(--color-fg-3)',
        letterSpacing: '.08em',
        marginTop: 22,
        marginBottom: 10,
      }}
      aria-hidden="true"
    >
      {children}
    </p>
  );
}

/* ================================================================
   CARD
   ================================================================ */

function Card({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : CARD_VARIANTS.initial}
      animate={CARD_VARIANTS.animate}
      transition={CARD_VARIANTS.transition}
      className="relative z-20 rounded-xl bg-white p-5 sm:p-6 md:p-8"
      style={{
        boxShadow: 'var(--shadow-float)',
        border: '1px solid var(--color-line)',
        maxWidth: 980,
        marginInline: 'auto',
        width: '100%',
      }}
    >
      {children}
    </motion.div>
  );
}

function LiveBadge() {
  return (
    <span
      className="tag inline-flex items-center gap-1.5 shrink-0"
      style={{ background: 'rgba(122,193,67,.14)', color: '#3F6B17' }}
      aria-label="Bookings are currently open"
    >
      <span
        className="inline-block rounded-full"
        style={{
          width: 6,
          height: 6,
          background: '#7AC143',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      Bookings open
    </span>
  );
}

function SuccessIcon() {
  return (
    <span
      className="mx-auto grid place-items-center rounded-full"
      style={{
        width: 62,
        height: 62,
        background: 'rgba(122,193,67,.16)',
        border: '1px solid rgba(122,193,67,.4)',
        color: '#7AC143',
      }}
      aria-hidden="true"
    >
      <Icon name="check" size={28} strokeWidth={2.6} />
    </span>
  );
}

function BookingRef() {
  const ref = useMemo(
    () => `CTC-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    [],
  );

  return (
    <p
      className="text-[0.76rem]"
      style={{ color: 'var(--color-fg-3)', marginTop: 8 }}
    >
      Reference: <code style={{ fontWeight: 600 }}>{ref}</code>
    </p>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="42"
        strokeDashoffset="30"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}