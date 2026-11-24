import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { Icon, PlayGlyph, Reveal, SectionHead } from './primitives';
import { IMG, srcset } from '../assets/images';
import { DRIVER_BENEFITS } from '../lib/data';
import {
  API_BASE_URL,
  CAPTURE,
  isPhone,
  validateDriver,
  type DriverValues,
  type Errors,
} from '../lib/forms';
import { APPS, CONTACT, track } from '../lib/analytics';

/* ==========================================================================
   DRIVE WITH CTC — recruitment + application form
   ========================================================================== */

const BLANK: DriverValues = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  licence: '',
  ownVehicle: '',
  vehicle: '',
  experience: '',
};

export function DriveWithCTC() {
  const [v, setV] = useState<DriverValues>(BLANK);
  const [errors, setErrors] = useState<Errors<DriverValues>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [touched, setTouched] = useState(false);

  const set =
    (k: keyof DriverValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const next = { ...v, [k]: e.target.value };
      setV(next);
      if (touched) setErrors(validateDriver(next));
      if (!touched) {
        setTouched(true);
        track('driver_application_started');
      }
    };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateDriver(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      track('form_error', { form: 'driver', count: Object.keys(errs).length });
      document.querySelector<HTMLElement>('[data-invalid="true"]')?.focus();
      return;
    }
    setStatus('submitting');

    try {
      const res = await fetch(`${API_BASE_URL}/api/driver-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: v.fullName,
          phone: v.phone,
          email: v.email || '',
          location: v.location,
          licence: v.licence,
          ownVehicle: v.ownVehicle,
          vehicle: v.vehicle || '',
          experience: v.experience,
        }),
      });

      if (res.ok) {
        setStatus('success');
        track('driver_application_submitted');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <section id="drive" className="section" style={{ background: 'var(--color-sand)' }}>
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1.02fr_.98fr] lg:items-start">
          {/* Left: pitch */}
          <div>
            <Reveal>
              <span className="eyebrow text-brand">Drive with CTC</span>
              <h2 className="h2 mt-5" style={{ marginTop: 20 }}>
                Turn Your Car
                <br />
                Into Opportunity.
              </h2>
              <p className="lede mt-5" style={{ marginTop: 20 }}>
                Join a professional mobility network designed to support drivers and help
                them grow. Whether you already own a vehicle or want to drive one of ours,
                there is a place for you.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-9 overflow-hidden rounded-lg" style={{ borderRadius: 24, marginTop: 36 }}>
                <img
                  src={IMG.driver_1280}
                  srcSet={srcset('driver')}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt="A professional Nigerian CTC Taxi driver standing beside his vehicle"
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                  style={{ aspectRatio: '16 / 11' }}
                />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-9 grid gap-5" style={{ marginTop: 36 }}>
                {DRIVER_BENEFITS.map((b) => (
                  <li key={b.title} className="flex gap-4">
                    <span
                      className="grid place-items-center rounded-full shrink-0 mt-0.5"
                      style={{
                        width: 26,
                        height: 26,
                        background: 'rgba(122,193,67,.16)',
                        border: '1px solid rgba(122,193,67,.34)',
                        color: '#487A17',
                      }}
                    >
                      <Icon name="check" size={13} strokeWidth={3} />
                    </span>
                    <div>
                      <div className="font-semibold text-[0.95rem]">{b.title}</div>
                      <div className="text-[0.86rem] leading-relaxed mt-1" style={{ color: 'var(--color-fg-2)' }}>
                        {b.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Right: application form */}
          <Reveal delay={0.12}>
            <div
              className="rounded-xl bg-white p-6 sm:p-8"
              style={{ boxShadow: 'var(--shadow-lift)', border: '1px solid var(--color-line)', borderRadius: 24 }}
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
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
                        color: '#487A17',
                      }}
                    >
                      <Icon name="check" size={28} strokeWidth={2.6} />
                    </span>
                    <h3 className="h3 mt-5" style={{ marginTop: 20 }}>
                      Application received
                    </h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed" style={{ color: 'var(--color-fg-2)', marginTop: 12 }}>
                      Thank you, {v.fullName.split(' ')[0] || 'driver'}. Our team will call
                      you on {v.phone} to arrange verification and your vehicle check. Most
                      drivers are live within 72 hours.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3" style={{ marginTop: 24 }}>
                      <a
                        href={APPS.driverPlay}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--dark btn--sm"
                        onClick={() => track('app_download_click', { platform: 'play', app: 'driver' })}
                      >
                        <PlayGlyph /> Get the Driver app
                      </a>
                      <a
                        href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hello CTC Taxi, I just applied to drive.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline btn--sm"
                        onClick={() => track('whatsapp_click', { source: 'driver_success' })}
                      >
                        Message the team
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    initial={false}
                  >
                    <h3 className="h3" style={{ color: '#000' }}>Apply to drive</h3>
                    <p className="text-[0.85rem] mt-2" style={{ color: 'var(--color-fg-2)' }}>
                      Takes about two minutes.
                    </p>

                    <div className="mt-6 grid gap-3.5" style={{ marginTop: 24 }}>
                      <DText id="d-name" label="Full name" value={v.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="e.g. Adebayo Ogunlana" autoComplete="name" />
                      <div className="grid gap-3.5 sm:grid-cols-2">
                        <DText id="d-phone" label="Phone number" type="tel" inputMode="tel" value={v.phone} onChange={set('phone')} error={errors.phone} placeholder="0803 000 0000" autoComplete="tel" />
                        <DText id="d-email" label="Email (optional)" type="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} placeholder="you@email.com" autoComplete="email" />
                      </div>
                      <DText id="d-loc" label="Area you operate from" value={v.location} onChange={set('location')} error={errors.location} placeholder="e.g. Yaba, Lagos" />

                      <div className="grid gap-3.5 sm:grid-cols-2">
                        <DSelect id="d-lic" label="Driver's licence status" value={v.licence} onChange={set('licence')} error={errors.licence}
                          options={[
                            { v: 'full', l: 'Full Nigerian licence' },
                            { v: 'temporary', l: 'Temporary licence' },
                            { v: 'foreign', l: 'Foreign / out-of-state' },
                            { v: 'applying', l: 'Currently applying' },
                          ]}
                        />
                        <DSelect id="d-own" label="Do you own a vehicle?" value={v.ownVehicle} onChange={set('ownVehicle')} error={errors.ownVehicle}
                          options={[
                            { v: 'yes', l: 'Yes, I own a vehicle' },
                            { v: 'no', l: 'No, I need one' },
                          ]}
                        />
                      </div>

                      {v.ownVehicle === 'yes' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="overflow-hidden"
                        >
                          <DText id="d-veh" label="Vehicle make, model and year" value={v.vehicle} onChange={set('vehicle')} error={errors.vehicle} placeholder="e.g. Toyota Sienna 2016" />
                        </motion.div>
                      )}

                      <DSelect id="d-exp" label="Driving experience" value={v.experience} onChange={set('experience')} error={errors.experience}
                        options={[
                          { v: 'lt1', l: 'Less than 1 year' },
                          { v: '1-3', l: '1 – 3 years' },
                          { v: '3-5', l: '3 – 5 years' },
                          { v: '5+', l: 'More than 5 years' },
                        ]}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn--brand btn--block mt-6"
                      style={{ marginTop: 24 }}
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? 'Sending application…' : 'Submit application'}
                    </button>

                    {status === 'error' && (
                      <p className="field__error mt-3" role="alert" style={{ marginTop: 12 }}>
                        <Icon name="x" size={13} strokeWidth={2.6} />
                        Could not send. Please call {CONTACT.phonePrimary} or apply in the
                        CTC Driver app.
                      </p>
                    )}

                    <p className="text-[0.75rem] leading-relaxed mt-4" style={{ color: 'var(--color-fg-3)', marginTop: 16 }}>
                      You will need a valid driver's licence and a clean driving record. We
                      verify documents and inspect the vehicle in person before you start.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- form controls */

function DText({
  id,
  label,
  error,
  ...rest
}: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const invalid = Boolean(error);
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`control ${invalid ? 'control--invalid' : ''}`}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-e` : undefined}
        data-invalid={invalid ? 'true' : undefined}
        {...rest}
        {...CAPTURE}
      />
      {invalid && (
        <p className="field__error" id={`${id}-e`}>
          <Icon name="x" size={13} strokeWidth={2.6} />
          {error}
        </p>
      )}
    </div>
  );
}

function DSelect({
  id,
  label,
  error,
  options,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  options: { v: string; l: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const invalid = Boolean(error);
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`control ${invalid ? 'control--invalid' : ''}`}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-e` : undefined}
        data-invalid={invalid ? 'true' : undefined}
        {...rest}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
      {invalid && (
        <p className="field__error" id={`${id}-e`}>
          <Icon name="x" size={13} strokeWidth={2.6} />
          {error}
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   ABOUT CTC TAXI — the About section
   ========================================================================== */

const CTC_VALUES: { label: string; body: string; icon: string }[] = [
  {
    label: 'Innovation',
    body: 'A technology-driven platform built to make movement easier for everyone.',
    icon: 'zap',
  },
  {
    label: 'Integrity',
    body: 'Transparent pricing, verified drivers and a service you can trust.',
    icon: 'shield',
  },
  {
    label: 'Customer focus',
    body: 'Comfort, safety and flexibility for every rider, every trip.',
    icon: 'user',
  },
];

export function CeoAbout() {
  return (
    <section
      id="about"
      className="section relative isolate overflow-hidden"
      style={{ background: 'var(--color-ink-2)' }}
    >
      {/* ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: '-12%',
          left: '-8%',
          width: '58%',
          height: '78%',
          background:
            'radial-gradient(circle at 40% 40%, rgba(219,20,123,.30), rgba(219,20,123,0) 68%)',
          filter: 'blur(24px)',
        }}
      />

      <div className="shell relative">
        <SectionHead
          dark
          eyebrow="About us"
          title="The CTC Taxi" 
        />

        {/* ---------------- Mission & Vision — the centerpiece ---------------- */}
        <div className="grid gap-5 md:grid-cols-2" style={{ marginTop: 56 }}>
          <Reveal delay={0.05}>
            <article
              className="h-full flex flex-col"
              style={{
                border: '1px solid rgba(255,255,255,.12)',
                background:
                  'linear-gradient(155deg, rgba(219,20,123,.16), rgba(255,255,255,.03) 62%)',
                borderRadius: 24,
                padding: 34,
              }}
            >
              <span
                className="inline-grid place-items-center"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: 'var(--color-brand)',
                  color: '#fff',
                }}
              >
                <Icon name="flag" size={20} />
              </span>
              <span className="eyebrow text-white/60" style={{ marginTop: 22 }}>
                Our Mission
              </span>
              <p
                className="text-white font-medium"
                style={{
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.018em',
                  marginTop: 14,
                }}
              >
                To provide accessible and affordable ride-hailing services anywhere, at
                any time, with ease; becoming Nigeria’s most reliable social business
                partner through technology, transparency, and exceptional customer
                service.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.12}>
            <article
              className="h-full flex flex-col"
              style={{
                border: '1px solid rgba(255,255,255,.12)',
                background:
                  'linear-gradient(155deg, rgba(219,20,123,.16), rgba(255,255,255,.03) 62%)',
                borderRadius: 24,
                padding: 34,
              }}
            >
              <span
                className="inline-grid place-items-center"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: 'var(--color-brand)',
                  color: '#fff',
                }}
              >
                <Icon name="globe" size={20} />
              </span>
              <span className="eyebrow text-white/60" style={{ marginTop: 22 }}>
                Our Vision
              </span>
              <p
                className="text-white font-medium"
                style={{
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.018em',
                  marginTop: 14,
                }}
              >
                To become one of Africa’s top five leading e-hailing companies by the
                year 2030, expanding our footprint across the continent while empowering
                drivers, supporting communities, and delivering world-class mobility
                experiences.
              </p>
            </article>
          </Reveal>
        </div>

        {/* ---------------- Values strip ---------------- */}
        <Reveal delay={0.08}>
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,.1)',
              paddingTop: 40,
              marginTop: 56,
            }}
          >
            <span className="eyebrow text-white/60">What we stand on</span>
            <div className="grid gap-4 md:grid-cols-3" style={{ marginTop: 24 }}>
              {CTC_VALUES.map((val, i) => (
                <Reveal key={val.label} delay={0.05 + i * 0.06}>
                  <div
                    className="flex gap-4"
                    style={{
                      border: '1px solid rgba(255,255,255,.11)',
                      background: 'rgba(255,255,255,.03)',
                      borderRadius: 18,
                      padding: 22,
                      height: '100%',
                    }}
                  >
                    <span
                      className="inline-grid place-items-center shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: 'rgba(219,20,123,.18)',
                        border: '1px solid rgba(219,20,123,.4)',
                        color: 'var(--color-brand)',
                      }}
                    >
                      <Icon name={val.icon} size={18} />
                    </span>
                    <div>
                      <h4
                        className="text-white font-semibold"
                        style={{ fontSize: '0.98rem', letterSpacing: '-0.02em' }}
                      >
                        {val.label}
                      </h4>
                      <p
                        className="mt-1.5 text-[0.85rem] leading-relaxed"
                        style={{ color: 'rgba(255,255,255,.6)', marginTop: 6 }}
                      >
                        {val.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { isPhone };