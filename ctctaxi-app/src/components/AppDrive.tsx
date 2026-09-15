import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { Icon, PlayGlyph, Reveal, SectionHead } from './primitives';
import { IMG, srcset } from '../assets/images';
import { AREAS, DRIVER_BENEFITS } from '../lib/data';
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
   LAGOS SERVICE AREA MAP
   ========================================================================== */

export function LagosMap() {
  const [hover, setHover] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // Illustrative positions only — NOT a coverage guarantee.
  const PINS = [
    { n: 'Ikeja', x: 118, y: 74 },
    { n: 'Magodo', x: 92, y: 52 },
    { n: 'Yaba', x: 176, y: 156 },
    { n: 'Victoria Island', x: 268, y: 208 },
    { n: 'Ikoyi', x: 246, y: 190 },
    { n: 'Lekki', x: 330, y: 236 },
    { n: 'Ajah', x: 392, y: 268 },
    { n: 'Festac', x: 96, y: 250 },
    { n: 'Apapa', x: 150, y: 258 },
    { n: 'Amuwo Odofin', x: 74, y: 232 },
    { n: 'Ago Palace Way', x: 66, y: 262 },
    { n: 'Ikorodu Road', x: 250, y: 82 },
    { n: 'Mushin', x: 148, y: 130 },
    { n: 'Oshodi', x: 126, y: 116 },
  ];

  return (
    <section id="about" className="section" style={{ background: 'var(--color-ink)' }}>
      <div className="shell">
        <SectionHead
          dark
          eyebrow="CTC in Lagos"
          title={
            <>
              Moving Lagos.
              <br />
              One Journey At A Time.
            </>
          }
          lede="We operate across Lagos State. These are the areas we move through most — if you are outside them, call and we will tell you honestly whether we can reach you."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start" style={{ marginTop: 56 }}>
          <Reveal>
            <div
              className="relative overflow-hidden rounded-lg"
              style={{ borderRadius: 24, background: '#0b0b12' }}
            >
              <svg viewBox="0 0 460 320" className="w-full block" role="img" aria-label="Illustrative map of Lagos showing areas CTC Taxi serves">
                <defs>
                  <linearGradient id="lg-water" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#12121b" />
                    <stop offset="1" stopColor="#0d0d15" />
                  </linearGradient>
                  <pattern id="lg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.035)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="460" height="320" fill="#0b0b12" />
                <rect width="460" height="320" fill="url(#lg-grid)" />

                {/* lagoon / water */}
                <path
                  d="M0 196 C86 178 150 212 230 224 C312 236 384 216 460 228 L460 320 L0 320 Z"
                  fill="url(#lg-water)"
                />
                {/* land */}
                <path
                  d="M0 0 H460 V182 C384 198 318 172 246 178 C176 184 128 166 58 172 C38 174 18 176 0 178 Z"
                  fill="#15151f"
                />

                {/* routes */}
                <g stroke="rgba(255,255,255,.06)" strokeWidth="7" fill="none" strokeLinecap="round">
                  <path d="M20 120 C140 96 280 130 440 100" />
                  <path d="M150 20 C176 90 196 140 216 180" />
                </g>

                {/* animated route lines between key nodes */}
                <g className="route-anim" fill="none" stroke="var(--color-brand)" strokeWidth="1.9" opacity=".8">
                  <path d="M118 74 C170 110 220 160 268 208" />
                  <path d="M176 156 C220 184 280 214 330 236" />
                </g>
                <g className="route-anim" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.4" style={{ animationDelay: '-2.4s' }}>
                  <path d="M74 232 C110 200 140 150 176 156" />
                  <path d="M250 82 C246 130 250 170 268 208" />
                </g>

                {/* area pins */}
                {PINS.map((p, i) => (
                  <g
                    key={p.n}
                    onMouseEnter={() => setHover(p.n)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {!reduced && (
                      <circle
                        className="ping"
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        fill="var(--color-brand)"
                        opacity=".45"
                        style={{ animationDelay: `${i * 0.24}s` }}
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hover === p.n ? 6 : 4.5}
                      fill={hover === p.n ? '#fff' : 'var(--color-brand)'}
                      style={{ transition: 'r .2s, fill .2s' }}
                    />
                    <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
                  </g>
                ))}

                {/* active label */}
                {hover && (
                  <g>
                    {(() => {
                      const p = PINS.find((x) => x.n === hover)!;
                      const w = hover.length * 7.4 + 22;
                      const lx = Math.min(Math.max(p.x - w / 2, 6), 460 - w - 6);
                      return (
                        <>
                          <rect x={lx} y={p.y - 34} width={w} height={24} rx="7" fill="#fff" opacity=".95" />
                          <text
                            x={lx + w / 2}
                            y={p.y - 17}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight="650"
                            fill="#0b0b0f"
                          >
                            {hover}
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>

              <div className="absolute top-5 left-5">
                <span className="glass tag" style={{ borderRadius: 999, padding: '7px 13px', color: '#fff' }}>
                  <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: '#7AC143' }} />
                  Lagos State
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="h3 text-white">Areas we move through</h3>
            <ul className="mt-6 flex flex-wrap gap-2" style={{ marginTop: 24 }}>
              {AREAS.map((a) => (
                <li
                  key={a}
                  className="text-[0.82rem] px-3.5 py-2 rounded-full transition-colors"
                  style={{
                    border: '1px solid rgba(15, 15, 15, 0.14)',
                    background: hover === a ? 'var(--color-brand)' : 'rgba(255,255,255,.04)',
                    color: hover === a ? '#f7f5f5' : 'rgba(255,255,255,.72)',
                    borderColor: hover === a ? 'var(--color-brand)' : 'rgba(255,255,255,.14)',
                  }}
                  onMouseEnter={() => setHover(a)}
                  onMouseLeave={() => setHover(null)}
                >
                  {a}
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-[0.79rem] leading-relaxed mt-7" style={{ marginTop: 28 }}>
              The map is illustrative of the corridor we serve, not a coverage guarantee.
              Pickup availability depends on cars on shift at the time — call us and we
              will confirm before you commit.
            </p>
            <div className="mt-7 flex flex-wrap gap-3" style={{ marginTop: 28 }}>
              <a href="#book" className="btn btn--brand btn--sm">Check my area</a>
              <a
                href={`tel:${CONTACT.phonePrimaryTel}`}
                className="btn btn--ghost btn--sm"
                onClick={() => track('phone_click', { source: 'lagos_map' })}
              >
                <Icon name="phone" size={15} /> {CONTACT.phonePrimary}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

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

export { isPhone };