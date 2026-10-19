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
   LEADERSHIP — the About section

   Scope, by request: no personal background, no upbringing, no career
   history. One photograph. The focus is what the chairman has done for
   CTC Taxi and the group around it.

   Every line below is sourced. Do not embellish:

     • Chairman & Group CEO, Countryside Group .... ctctaxi.com release;
       Vanguard 23 Feb 2026; Punch 23 Feb 2026; Guardian NG 27 Jun 2026
     • "High Chief Dr. Ndubisi George Ugo" ........ Guardian NG / Vanguard, Jun 2026
     • "Dr. Blow Money" ........................... all of the above; IG @blowmoney001
     • Own rider + driver apps .................... Play com.countryside.taxiuser,
       com.countryside.taxidriver; App Store id1671325522
     • B-Red group ambassador, 14 Feb 2026 ........ ctctaxi.com; Vanguard; Punch
     • Fakepoco ambassador, Jun 2026 — named for
       BlowPay, CTC Taxi and Countryside Travels .. Guardian NG; Vanguard; The Sun
     • Laud Award, 13 May 2022, Lead City Univ. ... Vanguard, 10 May 2022
     • 33rd National President, IMAN, Aug 2026 .... Vanguard 4 Oct 2026; The Sun
     • WADA Ambassador (NDLEA) .................... Vanguard, 4 Oct 2026
     • The pull quote ............................. ctctaxi.com; Vanguard; Punch

   Deliberately absent: birth year, education, the body that awarded the
   doctorate, and any founding date. Not found in any source — omitted
   rather than guessed. Do not add them without a citation.

   PHOTOGRAPH: cc ceo-chairman-*.webp is a crop of a two-person press photo
   (he is holding a signed agreement with another party at the edge of
   frame). It is the only real solo image of him in the public record —
   there is no posed portrait. Swap in the company's own original before
   launch; the shoot happened in CTC's own boardroom.
   ========================================================================== */

type LeadershipItem = { label: string; body: string; icon: string };

const LEADERSHIP_ACHIEVEMENTS: LeadershipItem[] = [
  {
    label: 'Two apps, built in-house',
    body: 'CTC Taxi ships its own rider and driver apps — published under the company\u2019s own developer accounts on Google Play, with the rider app live on the App Store.',
    icon: 'download',
  },
  {
    label: 'Real names on the brand',
    body: 'Signed Afrobeats artist B-Red as Countryside Group\u2019s brand ambassador in February 2026, then entertainer Fakepoco in June 2026 — with CTC Taxi named in that deal.',
    icon: 'star',
  },
  {
    label: 'Recognised for building people',
    body: 'Honoured at the Laud Awards in May 2022 for outstanding contributions to talent development and youth empowerment.',
    icon: 'user',
  },
  {
    label: 'A national voice',
    body: 'Elected 33rd National President of the Importers Association of Nigeria in August 2026, and serves as a WADA Ambassador in the NDLEA\u2019s War Against Drug Abuse campaign.',
    icon: 'globe',
  },
];

const LEADERSHIP_GROUP: string[] = [
  'CTC Taxi',
  'BlowPay',
  'CTC Autos',
  'Countryside Travels & Tours',
  'Blow Money Records',
  'Countryside Marine',
];

export function CeoAbout() {
  return (
    <section
      id="leadership"
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
          eyebrow="Leadership"
          title={
            <>
              The Chairman
              <br />
              Behind CTC Taxi.
            </>
          }
          lede="CTC Taxi belongs to Countryside Group. The chairman who runs that group sets the direction for the fleet, the apps and the standards behind them."
        />

        <div
          className="grid gap-12 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] lg:items-center"
          style={{ marginTop: 56 }}
        >
          {/* ---------------- The one photograph ---------------- */}
          <Reveal>
            <figure className="m-0 relative">
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: 28,
                  background: '#0b0b12',
                  border: '1px solid rgba(219,20,123,.35)',
                }}
              >
                <img
                  src="/ceo.webp"
                  alt="High Chief Dr. Ndubisi George Ugo, Chairman and Group Chief Executive Officer of Countryside Group, at the group headquarters in Lagos"
                  loading="lazy"
                  decoding="async"
                  className="w-full block object-cover"
                  style={{ aspectRatio: '4 / 5', objectPosition: '50% 12%' }}
                />
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(8,8,12,.88), rgba(8,8,12,0))',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div
                    className="inline-flex items-center gap-2.5 px-4 py-2"
                    style={{ borderRadius: 999, background: 'var(--color-brand)' }}
                  >
                    <Icon name="briefcase" size={14} className="text-white" />
                    <span className="text-white text-[0.72rem] font-bold tracking-[0.1em] uppercase">
                      Chairman &amp; Group CEO
                    </span>
                  </div>
                </div>
              </div>

              <figcaption
                className="mt-4 text-[0.8rem] leading-relaxed"
                style={{ color: 'rgba(255,255,255,.44)' }}
              >
                Dr. Ndubisi at the Countryside Group headquarters, Lagos, June 2026.
              </figcaption>
            </figure>
          </Reveal>

          {/* ---------------- Name + intro + quote ---------------- */}
          <div>
            <Reveal>
              <h3
                className="text-white font-semibold tracking-tight"
                style={{
                  fontSize: 'clamp(1.6rem, 3.1vw, 2.7rem)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.034em',
                }}
              >
                High Chief Dr. Ndubisi George Ugo
              </h3>

              <p className="mt-3 text-[0.95rem] font-semibold" style={{ color: 'var(--color-brand)' }}>
                Chairman &amp; Group Chief Executive Officer, Countryside Group
              </p>

              <p className="mt-2 text-[0.85rem]" style={{ color: 'rgba(255,255,255,.5)' }}>
                Also known as <em>Dr. Blow Money</em>
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p
                className="mt-8 text-[1.05rem] leading-relaxed"
                style={{ color: 'rgba(255,255,255,.74)', maxWidth: '58ch', marginTop: 32 }}
              >
                High Chief Dr. Ndubisi George Ugo — Dr. Blow Money to the people who
                follow the group — is the Chairman and Group Chief Executive Officer of
                Countryside Group, the parent company of CTC Taxi. He leads a portfolio
                that runs from e-hailing and fintech to vehicle dealership, travel,
                entertainment and marine logistics. CTC Taxi is the arm of it that
                moves Lagos.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <blockquote
                style={{
                  borderLeft: '3px solid var(--color-brand)',
                  paddingLeft: 24,
                  marginTop: 36,
                }}
              >
                <p
                  className="text-white font-medium"
                  style={{
                    fontSize: 'clamp(1.12rem, 1.9vw, 1.5rem)',
                    lineHeight: 1.38,
                    letterSpacing: '-0.02em',
                  }}
                >
                  &ldquo;Countryside Group is building a global African brand rooted in
                  innovation, credibility, and excellence.&rdquo;
                </p>
                <cite
                  className="mt-4 block not-italic text-[0.78rem] font-semibold tracking-[0.08em] uppercase"
                  style={{ color: 'rgba(255,255,255,.5)', marginTop: 16 }}
                >
                  Chief Dr. George Ndubisi — Chairman &amp; Group CEO
                </cite>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* ---------------- What he has done for CTC Taxi ---------------- */}
        <div style={{ marginTop: 80 }}>
          <Reveal>
            <span className="eyebrow text-white/60">On his watch</span>
            <h3
              className="text-white font-semibold mt-4"
              style={{
                fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginTop: 16,
              }}
            >
              What he has built here.
            </h3>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2" style={{ marginTop: 32 }}>
            {LEADERSHIP_ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.label} delay={0.05 + i * 0.06}>
                <article
                  className="h-full flex gap-5"
                  style={{
                    border: '1px solid rgba(255,255,255,.11)',
                    background:
                      'linear-gradient(150deg, rgba(219,20,123,.10), rgba(255,255,255,.03) 55%)',
                    borderRadius: 22,
                    padding: 26,
                  }}
                >
                  <span
                    className="inline-grid place-items-center shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'var(--color-brand)',
                      color: '#fff',
                    }}
                  >
                    <Icon name={a.icon} size={20} />
                  </span>
                  <div>
                    <h4
                      className="text-white font-semibold"
                      style={{ fontSize: '1.06rem', letterSpacing: '-0.022em' }}
                    >
                      {a.label}
                    </h4>
                    <p
                      className="mt-2.5 text-[0.88rem] leading-relaxed"
                      style={{ color: 'rgba(255,255,255,.62)', marginTop: 10 }}
                    >
                      {a.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---------------- The group he leads ---------------- */}
        <Reveal delay={0.08}>
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,.1)',
              paddingTop: 28,
              marginTop: 56,
            }}
          >
            <p className="text-[0.8rem] font-semibold" style={{ color: 'rgba(255,255,255,.5)' }}>
              The group he leads
            </p>
            <ul
              className="flex flex-wrap gap-2.5"
              style={{ listStyle: 'none', padding: 0, marginTop: 14 }}
            >
              {LEADERSHIP_GROUP.map((g) => (
                <li
                  key={g}
                  className="text-[0.84rem] font-medium"
                  style={{
                    color: g === 'CTC Taxi' ? '#fff' : 'rgba(255,255,255,.66)',
                    background: g === 'CTC Taxi' ? 'var(--color-brand)' : 'rgba(255,255,255,.06)',
                    border:
                      g === 'CTC Taxi'
                        ? '1px solid transparent'
                        : '1px solid rgba(255,255,255,.12)',
                    borderRadius: 999,
                    padding: '9px 16px',
                  }}
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { isPhone };