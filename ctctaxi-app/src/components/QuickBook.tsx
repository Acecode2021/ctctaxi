import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState, type FormEvent } from 'react';
import { Icon } from './primitives';
import { CAPTURE, validate, type Errors } from '../lib/forms';
import { CONTACT, SERVICE_TYPES_LABELS, track } from '../lib/submit';

type Values = {
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  service: string;
  phone: string;
};

const EMPTY: Values = {
  pickup: '',
  dropoff: '',
  date: '',
  time: '',
  service: 'ride',
  phone: '',
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function QuickBook() {
  const reduced = useReducedMotion();
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [status, setStatus] = useState<Status>('idle');

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (errors[k]) setErrors(validate(next));
    if (status === 'idle') track('booking_started', { field: k });
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      track('form_error', { form: 'quick_book', count: Object.keys(errs).length });
      const first = document.querySelector<HTMLElement>('[data-invalid="true"]');
      first?.focus();
      return;
    }

    setStatus('submitting');
    track('booking_submitted', { service: v.service });

    try {
      const res = await fetch('http://localhost:5050/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup: v.pickup,
          dropoff: v.dropoff,
          date: v.date,
          time: v.time,
          phone: v.phone,
          serviceType: v.service,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        track('booking_failed', { reason: data.error ?? `http_${res.status}` });
      }
    } catch (err) {
      setStatus('error');
      track('booking_failed', { reason: 'network' });
    }
  }

  if (status === 'success') {
    return (
      <Card>
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="py-6 text-center"
          role="status"
          aria-live="polite"
        >
          <span
            className="mx-auto grid place-items-center rounded-full"
            style={{
              width: 62,
              height: 62,
              background: 'rgba(122,193,67,.16)',
              border: '1px solid rgba(122,193,67,.4)',
              color: '#7AC143',
            }}
          >
            <Icon name="check" size={28} strokeWidth={2.6} />
          </span>
          <h3 className="h3 mt-5" style={{ marginTop: 20 }}>
            Booking request received
          </h3>
          <p className="lede mt-3 mx-auto" style={{ marginTop: 12, maxWidth: '46ch' }}>
            Thank you, {v.pickup || 'there'}. We are confirming a car for you now. You will
            receive a call on {v.phone || 'your number'} shortly to confirm your driver and
            fare.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3" style={{ marginTop: 24 }}>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--dark btn--sm"
              onClick={() => track('whatsapp_click', { source: 'booking_success' })}
            >
              Confirm on WhatsApp
            </a>
            <a
              href={`tel:${CONTACT.phonePrimaryTel}`}
              className="btn btn--outline btn--sm"
              onClick={() => track('phone_click', { source: 'booking_success' })}
            >
              <Icon name="phone" size={15} /> Call us now
            </a>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => {
                setV(EMPTY);
                setStatus('idle');
              }}
            >
              Book another ride
            </button>
          </div>
        </motion.div>
      </Card>
    );
  }

  const busy = status === 'submitting';

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="h3">Book your ride</h2>
          <p className="text-[0.82rem] mt-1.5" style={{ color: 'var(--color-fg-3)' }}>
            Instant or scheduled · Lagos-wide · 24/7
          </p>
        </div>
        <span
          className="tag"
          style={{ background: 'rgba(122,193,67,.14)', color: '#3F6B17' }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: '#7AC143' }}
          />
          Bookings open
        </span>
      </div>

      {/* Service type — segmented control */}
      <div
        className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-1.5"
        style={{ marginTop: 24 }}
        role="radiogroup"
        aria-label="Service type"
      >
        {SERVICE_TYPES_LABELS.map((s) => {
          const on = v.service === s.value;
          return (
            <label
              key={s.value}
              className="relative flex items-center justify-center text-center rounded-[10px] cursor-pointer select-none"
              style={{
                padding: '11px 6px',
                fontSize: '0.8rem',
                fontWeight: 560,
                border: `1px solid ${on ? 'var(--color-brand)' : 'var(--color-line)'}`,
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
                onChange={set('service')}
                className="sr-only"
              />
              {s.label}
            </label>
          );
        })}
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-5" style={{ marginTop: 20 }}>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field
            id="qb-pickup"
            label="Pickup location"
            icon="pin"
            placeholder="e.g. Ago Palace Way, Amuwo Odofin"
            value={v.pickup}
            onChange={set('pickup')}
            error={errors.pickup}
            autoComplete="street-address"
            className="sm:col-span-2"
          />
          <Field
            id="qb-dropoff"
            label="Drop-off location"
            icon="pin"
            placeholder="e.g. MMIA, Ikeja"
            value={v.dropoff}
            onChange={set('dropoff')}
            error={errors.dropoff}
            className="sm:col-span-2"
          />
          <Field
            id="qb-date"
            label="Date"
            type="date"
            min={today}
            value={v.date}
            onChange={set('date')}
            error={errors.date}
          />
          <Field
            id="qb-time"
            label="Time"
            type="time"
            value={v.time}
            onChange={set('time')}
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
            error={errors.phone}
            autoComplete="tel"
            className="sm:col-span-2"
          />
        </div>

        <button
          type="submit"
          className="btn btn--brand btn--block mt-5"
          style={{ marginTop: 20 }}
          disabled={busy}
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
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              role="alert"
              className="field__error mt-3"
              style={{ marginTop: 12 }}
            >
              <Icon name="x" size={13} strokeWidth={2.6} />
              We could not send that just now. Please call {CONTACT.phonePrimary} or
              message us on WhatsApp and we will book it for you.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-4 grid grid-cols-2 gap-2.5" style={{ marginTop: 16 }}>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hello CTC Taxi, I would like to book a ride.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline btn--sm"
            onClick={() => track('whatsapp_click', { source: 'quick_book' })}
          >
            WhatsApp us
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

/* ---------------------------------------------------------------- helpers */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl bg-white p-6 sm:p-8"
      style={{
        boxShadow: 'var(--shadow-float)',
        border: '1px solid var(--color-line)',
        maxWidth: 980,
        marginInline: 'auto',
      }}
    >
      {children}
    </motion.div>
  );
}

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
} & React.InputHTMLAttributes<HTMLInputElement>) {
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
          >
            <Icon name={icon} size={16} />
          </span>
        )}
        <input
          id={id}
          className={`control ${icon ? 'pl-10' : ''} ${invalid ? 'control--invalid' : ''}`}
          style={icon ? { paddingLeft: 40 } : undefined}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-err` : undefined}
          data-invalid={invalid ? 'true' : undefined}
          {...rest}
          {...CAPTURE}
        />
      </div>
      {invalid && (
        <p className="field__error" id={`${id}-err`}>
          <Icon name="x" size={13} strokeWidth={2.6} />
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
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