import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon, Magnetic, Reveal, SectionHead, Stars } from './primitives';
import { IMG, srcset } from '../assets/images';
import { FAQS, REVIEWS } from '../lib/data';
import { APPS, CONTACT, MAP, SOCIAL, track } from '../lib/analytics';
import { CAPTURE, isEmail, isPhone, submitForm } from '../lib/forms';

/* ==========================================================================
   SCROLL PROGRESS — a thin brand bar at the very top of the viewport
   ========================================================================== */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.3 });
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] origin-left"
      style={{ height: 2.5, background: 'var(--color-brand)', scaleX: width }}
    />
  );
}

/* ==========================================================================
   TESTIMONIALS — sourced, dated, verifiable
   ========================================================================== */

export function Testimonials() {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  useEffect(() => {
    update();
    const el = scroller.current;
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="shell">
        <SectionHead
          eyebrow="Reviews"
          title="What people say after the ride"
          lede="These are published CTC reviews with their source and date. We show the 4.6 alongside the 5.0s — cherry-picking five stars would tell you nothing useful."
          action={
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => nudge(-1)}
                disabled={atStart}
                aria-label="Previous reviews"
                className="grid place-items-center rounded-full transition-opacity"
                style={{
                  width: 46,
                  height: 46,
                  border: '1px solid var(--color-line-strong)',
                  opacity: atStart ? 0.35 : 1,
                }}
              >
                <Icon name="chevron-right" size={18} className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                disabled={atEnd}
                aria-label="Next reviews"
                className="grid place-items-center rounded-full transition-opacity"
                style={{
                  width: 46,
                  height: 46,
                  border: '1px solid var(--color-line-strong)',
                  opacity: atEnd ? 0.35 : 1,
                }}
              >
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
          }
        />

        <div
          ref={scroller}
          className="mt-14 flex gap-5 overflow-x-auto pb-4"
          style={{
            marginTop: 56,
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {REVIEWS.map((r, i) => (
            <Reveal
              key={`${r.name}-${i}`}
              delay={i * 0.05}
              className="shrink-0 w-[86vw] sm:w-[420px]"
            >
              <figure
                data-card
                className="h-full flex flex-col rounded-md p-7"
                style={{
                  border: '1px solid var(--color-line)',
                  background: 'var(--color-sand)',
                  scrollSnapAlign: 'start',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <Stars value={r.rating} />
                  {r.verified && (
                    <span className="tag shrink-0" style={{ background: 'rgba(122,193,67,.16)', color: '#487A17' }}>
                      <Icon name="shield-check" size={11} strokeWidth={2.6} /> Verified
                    </span>
                  )}
                </div>

                <blockquote className="mt-5 flex-1" style={{ marginTop: 20 }}>
                  <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--color-fg)' }}>
                    “{r.body}”
                  </p>
                </blockquote>

                <figcaption
                  className="mt-6 pt-5 flex items-center gap-3.5"
                  style={{ borderTop: '1px solid var(--color-line)', marginTop: 24 }}
                >
                  <span
                    className="grid place-items-center rounded-full font-bold text-[0.82rem] shrink-0"
                    style={{
                      width: 42,
                      height: 42,
                      background: '#fff',
                      border: '1px solid var(--color-line)',
                      color: 'var(--color-fg-2)',
                    }}
                  >
                    {r.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[0.9rem] truncate">{r.name}</span>
                    <span className="block text-[0.75rem] mt-0.5" style={{ color: 'var(--color-fg-3)' }}>
                      {r.source} · {r.date}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Aggregate ratings — published store figures only */}
        <Reveal delay={0.1}>
          <div
            className="mt-10 flex flex-wrap items-center gap-4 pt-8"
            style={{ borderTop: '1px solid var(--color-line)', marginTop: 40 }}
          >
            {[
              { v: '4.6★', l: 'Google Play · CTC Taxi rider app' },
              { v: '5.0★', l: 'App Store · CTC Taxi rider app' },
              { v: '5.0★', l: 'Google Play · CTC Driver app' },
            ].map((b) => (
              <div
                key={b.l}
                className="flex items-center gap-3 px-4 py-3 rounded-full"
                style={{ border: '1px solid var(--color-line)' }}
              >
                <strong className="text-[1.02rem] tracking-tight">{b.v}</strong>
                <span className="text-[0.75rem]" style={{ color: 'var(--color-fg-3)' }}>
                  {b.l}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   FAQ — accessible accordion
   ========================================================================== */

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section" style={{ background: 'var(--color-sand)' }}>
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <SectionHead
              eyebrow="Questions"
              title={
                <>
                  Before you
                  <br />
                  book.
                </>
              }
              lede="The questions people ask us most. If yours is not here, call — a real person will answer."
            />
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-3" style={{ marginTop: 32 }}>
                <a
                  href={`tel:${CONTACT.phonePrimaryTel}`}
                  className="btn btn--dark btn--sm"
                  onClick={() => track('phone_click', { source: 'faq' })}
                >
                  <Icon name="phone" size={15} /> {CONTACT.phonePrimary}
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline btn--sm"
                  onClick={() => track('whatsapp_click', { source: 'faq' })}
                >
                  WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <ul>
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li
                    key={f.q}
                    style={{
                      borderTop: i === 0 ? '1px solid var(--color-line-strong)' : undefined,
                      borderBottom: '1px solid var(--color-line-strong)',
                    }}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(isOpen ? null : i);
                          if (!isOpen) track('faq_open', { question: f.q });
                        }}
                        aria-expanded={isOpen}
                        aria-controls={`faq-${i}`}
                        className="w-full flex items-center justify-between gap-6 text-left py-6 group"
                      >
                        <span className="font-semibold text-[1.02rem] tracking-tight pr-2">
                          {f.q}
                        </span>
                        <span
                          className="grid place-items-center rounded-full shrink-0 transition-all duration-300"
                          style={{
                            width: 32,
                            height: 32,
                            border: '1px solid',
                            borderColor: isOpen ? 'var(--color-brand)' : 'var(--color-line-strong)',
                            background: isOpen ? 'var(--color-brand)' : 'transparent',
                            color: isOpen ? '#fff' : 'var(--color-fg-2)',
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                          }}
                        >
                          <Icon name="chevron-down" size={15} strokeWidth={2.4} />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-${i}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p
                            className="pb-7 pr-12 text-[0.93rem] leading-relaxed"
                            style={{ color: 'var(--color-fg-2)' }}
                          >
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CONTACT — office details, live map, and the corporate enquiry form
   ========================================================================== */

export function Contact() {
  const [v, setV] = useState({ name: '', company: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [mapLive, setMapLive] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!v.name.trim()) errs.name = 'Please enter your name.';
    if (!v.phone.trim()) errs.phone = 'We need a number to call you back.';
    else if (!isPhone(v.phone)) errs.phone = 'Enter a valid Nigerian number.';
    if (v.email.trim() && !isEmail(v.email)) errs.email = 'That email looks incorrect.';
    if (!v.message.trim()) errs.message = 'Tell us briefly what you need.';

    setErrors(errs);
    if (Object.keys(errs).length) {
      track('form_error', { form: 'contact', count: Object.keys(errs).length });
      document.querySelector<HTMLElement>('[data-invalid="true"]')?.focus();
      return;
    }

    setStatus('submitting');
    const res = await submitForm('contact', v);
    setStatus(res.ok ? 'success' : 'error');
  }

  return (
    <section id="contact" className="section" style={{ background: '#fff' }}>
      <div className="shell">
        <SectionHead
          eyebrow="Find us"
          title="Talk To Our Team."
          lede="Corporate accounts, standing staff transport, or a one-off question. You are also welcome at the office during working hours."
        />

        {/* ------------------------------- live map ------------------------------- */}
        <Reveal>
          <div
            className="mt-14 overflow-hidden rounded-lg"
            style={{ marginTop: 56, border: '1px solid var(--color-line)', borderRadius: 24, background: 'var(--color-ink)' }}
          >
            <div className="relative" style={{ aspectRatio: '16 / 9', minHeight: 320 }}>
              {/* Static, brand-treated map poster — renders instantly and offline */}
              <img
                src={IMG.lagos_map_office_1400}
                srcSet={srcset('lagos_map_office')}
                sizes="(max-width: 1024px) 100vw, 1180px"
                alt="Map showing the CTC Taxi office on Ojefia Crescent, Victory Estate, Ago Palace, Lagos"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                style={{ opacity: mapLive ? 0 : 1, transition: 'opacity .6s var(--ease-out-expo)' }}
              />

              {/* Live interactive map — loaded only when the visitor asks for it */}
              {mapLive && (
                <iframe
                  title="Interactive map of the CTC Taxi office in Lagos"
                  src={MAP.embed}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}

              {!mapLive && (
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3"
                     style={{ background: 'linear-gradient(0deg, rgba(8,8,12,.88), transparent)' }}>
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: '#7AC143' }} />
                    <span className="text-white/75 text-[0.78rem]">
                      Office location · verified {MAP.verifiedOn}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      setMapLive(true);
                      track('cta_click', { cta: 'load_live_map' });
                    }}
                  >
                    <Icon name="globe" size={15} /> Open interactive map
                  </button>
                </div>
              )}
            </div>

            {/* Map action bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-5"
                 style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
              <div className="flex items-start gap-3.5">
                <span className="grid place-items-center rounded-[11px] shrink-0 mt-0.5"
                      style={{ width: 40, height: 40, background: 'rgba(219,20,123,.16)', color: '#F7A9D0' }}>
                  <Icon name="pin" size={18} />
                </span>
                <div>
                  <div className="text-white font-semibold text-[0.92rem]">{MAP.label}</div>
                  <div className="text-white/45 text-[0.78rem] mt-1 font-mono">
                    {MAP.lat.toFixed(5)}° N, {MAP.lng.toFixed(5)}° E
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href={MAP.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--brand btn--sm"
                  onClick={() => track('cta_click', { cta: 'map_directions' })}
                >
                  <Icon name="pin" size={15} /> Get directions
                </a>
                <a
                  href={MAP.osmLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost btn--sm"
                  onClick={() => track('cta_click', { cta: 'map_osm' })}
                >
                  Open in OpenStreetMap
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------------------------- details + form ---------------------------- */}
        <div className="mt-14 grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-start" style={{ marginTop: 56 }}>
          <div>
            <Reveal>
              <h3 className="h3">Office &amp; contact details</h3>
            </Reveal>
            <Reveal delay={0.08}>
              <address className="mt-7 not-italic grid gap-5" style={{ marginTop: 28 }}>
                <ContactRow
                  icon="pin"
                  label="Office"
                  value={CONTACT.addressLines.join(' ')}
                  href={MAP.directions}
                />
                <ContactRow
                  icon="phone"
                  label="Phone"
                  value={CONTACT.phonePrimary}
                  href={`tel:${CONTACT.phonePrimaryTel}`}
                  secondary={{ value: CONTACT.phoneSecondary, href: `tel:${CONTACT.phoneSecondaryTel}` }}
                  onClick={() => track('phone_click', { source: 'contact_details' })}
                />
                <ContactRow
                  icon="chat"
                  label="WhatsApp"
                  value="Message us anytime"
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  onClick={() => track('whatsapp_click', { source: 'contact_details' })}
                />
                <ContactRow
                  icon="mail"
                  label="Email"
                  value={CONTACT.email}
                  href={`mailto:${CONTACT.email}`}
                />
                <ContactRow icon="clock" label="Opening hours" value={CONTACT.hours} />
              </address>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 rounded-md p-6" style={{ background: 'var(--color-sand)', border: '1px solid var(--color-line)', marginTop: 32 }}>
                <div className="flex items-center gap-2.5">
                  <Icon name="globe" size={16} className="text-brand shrink-0" />
                  <span className="font-semibold text-[0.9rem]">Coming to the office?</span>
                </div>
                <p className="text-[0.86rem] leading-relaxed mt-2.5" style={{ color: 'var(--color-fg-2)', marginTop: 10 }}>
                  We are in Victory Estate, just off Ago Palace Way. Tap “Get directions”
                  above and your phone will open the route in the maps app you already use.
                  If you are driving yourself, call ahead so we can tell you where to park.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div
              className="rounded-xl p-6 sm:p-8"
              style={{ background: 'var(--color-sand)', border: '1px solid var(--color-line)', borderRadius: 24 }}
            >
              {status === 'success' ? (
                <div className="py-10 text-center" role="status" aria-live="polite">
                  <span
                    className="mx-auto grid place-items-center rounded-full"
                    style={{
                      width: 60,
                      height: 60,
                      background: 'rgba(122,193,67,.16)',
                      border: '1px solid rgba(122,193,67,.4)',
                      color: '#487A17',
                    }}
                  >
                    <Icon name="check" size={26} strokeWidth={2.6} />
                  </span>
                  <h3 className="h3 mt-5" style={{ marginTop: 20 }}>Message sent</h3>
                  <p className="mt-3 text-[0.92rem]" style={{ color: 'var(--color-fg-2)', marginTop: 12 }}>
                    Thank you, {v.name.split(' ')[0]}. A member of the CTC team will be in
                    touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <h3 className="h3">Send us a message</h3>
                  <p className="text-[0.85rem] mt-2" style={{ color: 'var(--color-fg-2)' }}>
                    For corporate accounts and standing transport, tell us roughly how many
                    people and how often.
                  </p>
                  <div className="mt-6 grid gap-3.5" style={{ marginTop: 24 }}>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <CText id="c-name" label="Your name" value={v.name} error={errors.name}
                             onChange={(e) => setV({ ...v, name: e.target.value })} autoComplete="name" />
                      <CText id="c-company" label="Company (optional)" value={v.company}
                             onChange={(e) => setV({ ...v, company: e.target.value })} autoComplete="organization" />
                    </div>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <CText id="c-phone" label="Phone" type="tel" inputMode="tel" value={v.phone} error={errors.phone}
                             onChange={(e) => setV({ ...v, phone: e.target.value })} autoComplete="tel" />
                      <CText id="c-email" label="Email (optional)" type="email" inputMode="email" value={v.email} error={errors.email}
                             onChange={(e) => setV({ ...v, email: e.target.value })} autoComplete="email" />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="c-msg">How can we help?</label>
                      <textarea
                        id="c-msg"
                        rows={5}
                        className={`control ${errors.message ? 'control--invalid' : ''}`}
                        value={v.message}
                        onChange={(e) => setV({ ...v, message: e.target.value })}
                        aria-invalid={Boolean(errors.message)}
                        data-invalid={errors.message ? 'true' : undefined}
                        {...CAPTURE}
                      />
                      {errors.message && (
                        <p className="field__error">
                          <Icon name="x" size={13} strokeWidth={2.6} /> {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn--brand btn--block mt-6" style={{ marginTop: 24 }} disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending…' : 'Send message'}
                  </button>

                  {status === 'error' && (
                    <p className="field__error mt-3" role="alert" style={{ marginTop: 12 }}>
                      <Icon name="x" size={13} strokeWidth={2.6} />
                      Could not send. Please call {CONTACT.phonePrimary} instead.
                    </p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  secondary,
  onClick,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
  secondary?: { value: string; href: string };
  onClick?: () => void;
}) {
  const Body = (
    <div className="flex gap-4">
      <span
        className="grid place-items-center rounded-[12px] shrink-0"
        style={{
          width: 42,
          height: 42,
          background: 'var(--color-sand)',
          border: '1px solid var(--color-line)',
          color: 'var(--color-brand)',
        }}
      >
        <Icon name={icon} size={18} />
      </span>
      <div>
        <div className="text-[0.7rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--color-fg-3)' }}>
          {label}
        </div>
        <div className="text-[0.92rem] mt-1" style={{ color: 'var(--color-fg)' }}>
          {value}
          {secondary && (
            <>
              {' · '}
              <a href={secondary.href} className="hover:underline underline-offset-4">
                {secondary.value}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (!href) return <div>{Body}</div>;
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onClick={onClick} className="block hover:opacity-80 transition-opacity">
      {Body}
    </a>
  );
}

function CText({
  id,
  label,
  error,
  ...rest
}: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`control ${error ? 'control--invalid' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-e` : undefined}
        data-invalid={error ? 'true' : undefined}
        {...rest}
        {...CAPTURE}
      />
      {error && (
        <p className="field__error" id={`${id}-e`}>
          <Icon name="x" size={13} strokeWidth={2.6} /> {error}
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   FINAL CTA
   ========================================================================== */

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden" style={{ background: 'var(--color-ink)' }}>
      <img
        src={IMG.final_cta_1280}
        srcSet={srcset('final_cta')}
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,12,.86) 0%, rgba(8,8,12,.62) 40%, rgba(8,8,12,.92) 100%)',
        }}
      />

      <div className="relative section shell text-center">
        <Reveal>
          <span className="eyebrow text-white/60" style={{ justifyContent: 'center' }}>
            Ready when you are
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            className="display text-white mx-auto mt-6"
            style={{ marginTop: 24, maxWidth: '16ch' }}
          >
            Ready When You Are.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            className="lede lede--dark mx-auto mt-6 text-center"
            style={{ marginTop: 24, maxWidth: '52ch' }}
          >
            From everyday movement to your most important journeys, CTC is ready to move
            with you.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div
            className="mt-10 flex flex-wrap justify-center gap-3"
            style={{ marginTop: 40 }}
          >
            <Magnetic>
              <a
                href="#book"
                className="btn btn--brand"
                onClick={() => track('cta_click', { cta: 'final_book' })}
              >
                Book Your Ride <Icon name="arrow-right" size={17} />
              </a>
            </Magnetic>
            <a
              href="#apps"
              className="btn btn--ghost"
              onClick={() => track('cta_click', { cta: 'final_app' })}
            >
              <Icon name="download" size={16} /> Download the App
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   FOOTER
   ========================================================================== */

const FOOT_NAV = [
  { h: 'Services', links: [
    { l: 'Everyday Rides', href: '#services' },
    { l: 'Scheduled Rides', href: '#services' },
    { l: 'Airport Transfer', href: '#airport' },
    { l: 'Corporate Transport', href: '#corporate' },
    { l: 'Delivery', href: '#services' },
  ]},
  { h: 'Apps', links: [
    { l: 'Rider app', href: '#apps' },
    { l: 'Driver app', href: '#apps' },
    { l: 'Download for Android', href: APPS.riderPlay },
    { l: 'Download for iPhone', href: APPS.riderAppStore },
  ]},
  { h: 'Company', links: [
    { l: 'About Us', href: '#about' },
    { l: 'Safety & Standards', href: '#safety' },
    { l: 'Drive With CTC', href: '#drive' },
    { l: 'Contact', href: '#contact' },
    { l: 'FAQ', href: '#faq' },
  ]},
];

export function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)', color: 'rgba(255,255,255,.62)' }}>
      <div className="shell" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          {/* brand */}
          <div>
            <img
              src={IMG.logo_white}
              alt="CTC Taxi"
              width={52}
              height={52}
              style={{ width: 52, height: 52 }}
              loading="lazy"
            />
            <p className="mt-5 text-[0.87rem] leading-relaxed max-w-[34ch]" style={{ marginTop: 20, color: 'rgba(255,255,255,.48)' }}>
              Countryside Taxi Company Ltd — a Lagos mobility company running verified
              drivers, a GPS-monitored fleet and our own rider and driver apps.
            </p>
            <div className="flex gap-2.5 mt-6" style={{ marginTop: 24 }}>
              {[
                ['Facebook', SOCIAL.facebook, 'M14 9h3V5.5h-3c-2.2 0-4 1.8-4 4V12H7.5v3.5H10V22h3.5v-6.5H16l.5-3.5h-3V9.7c0-.4.3-.7.5-.7Z'],
                ['Instagram', SOCIAL.instagram, ''],
                ['X', SOCIAL.x, 'M18.2 2H21l-6.4 7.3L22 22h-6l-4.7-6.2L5.6 22H2.8l6.9-7.9L2 2h6.2l4.3 5.7L18.2 2Zm-1 18h1.6L7.9 3.8H6.2L17.2 20Z'],
              ].map(([label, href, d]) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid place-items-center rounded-full transition-colors hover:bg-white hover:text-ink"
                  style={{
                    width: 38,
                    height: 38,
                    border: '1px solid rgba(255,255,255,.16)',
                  }}
                >
                  {label === 'Instagram' ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={d} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {FOOT_NAV.map((col) => (
            <nav key={col.h} aria-label={col.h}>
              <h2 className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-white">
                {col.h}
              </h2>
              <ul className="mt-5 grid gap-3" style={{ marginTop: 20 }}>
                {col.links.map((l) => (
                  <li key={l.l}>
                    <a href={l.href} className="text-[0.87rem] hover:text-white transition-colors">
                      {l.l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* contact + apps */}
          <div>
            <h2 className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-white">
              Contact
            </h2>
            <address className="not-italic mt-5 text-[0.87rem] leading-relaxed" style={{ marginTop: 20 }}>
              {CONTACT.addressLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
            <ul className="mt-4 grid gap-2.5" style={{ marginTop: 16 }}>
              <li>
                <a
                  href={`tel:${CONTACT.phonePrimaryTel}`}
                  className="text-[0.87rem] hover:text-white transition-colors"
                  onClick={() => track('phone_click', { source: 'footer' })}
                >
                  {CONTACT.phonePrimary}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phoneSecondaryTel}`}
                  className="text-[0.87rem] hover:text-white transition-colors"
                >
                  {CONTACT.phoneSecondary}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-[0.87rem] hover:text-white transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li style={{ color: 'rgba(255,255,255,.4)' }} className="text-[0.87rem]">
                {CONTACT.hours}
              </li>
            </ul>

            <div className="mt-6 grid gap-2.5" style={{ marginTop: 24 }}>
              <a
                href={APPS.riderAppStore}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--sm"
                onClick={() => track('app_download_click', { platform: 'appstore', source: 'footer' })}
              >
                App Store
              </a>
              <a
                href={APPS.riderPlay}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--sm"
                onClick={() => track('app_download_click', { platform: 'play', source: 'footer' })}
              >
                Google Play
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-14 pt-7 flex flex-wrap items-center justify-between gap-4 text-[0.8rem]"
          style={{ borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 56, color: 'rgba(255,255,255,.4)' }}
        >
          <span>© 2026 Countryside Taxi Company Ltd. All rights reserved.</span>
          <span className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   MOBILE ACTION BAR — Book / Call / WhatsApp, always one tap away
   ========================================================================== */

export function MobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Quick actions"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="lg:hidden fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-2 px-3 py-2.5"
          style={{
            background: 'rgba(8,8,12,.94)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderTop: '1px solid rgba(255,255,255,.12)',
            paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
          }}
        >
          <a
            href={`tel:${CONTACT.phonePrimaryTel}`}
            className="flex items-center justify-center gap-2 rounded-[10px] text-white text-[0.82rem] font-semibold py-3.5"
            style={{ border: '1px solid rgba(255,255,255,.22)' }}
            onClick={() => track('phone_click', { source: 'mobile_bar' })}
          >
            <Icon name="phone" size={15} /> Call
          </a>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hello CTC Taxi, I would like to book a ride.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-[10px] text-white text-[0.82rem] font-semibold py-3.5"
            style={{ border: '1px solid rgba(255,255,255,.22)' }}
            onClick={() => track('whatsapp_click', { source: 'mobile_bar' })}
          >
            WhatsApp
          </a>
          <a
            href="#book"
            className="flex items-center justify-center rounded-[10px] text-white text-[0.82rem] font-semibold py-3.5"
            style={{ background: 'var(--color-brand)' }}
            onClick={() => track('cta_click', { cta: 'mobile_bar_book' })}
          >
            Book
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
