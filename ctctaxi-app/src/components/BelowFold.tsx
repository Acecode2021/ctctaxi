import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Icon, Reveal, SectionHead, useParallax } from './primitives';
import { IMG, srcset } from '../assets/images';
import { SAFETY_ITEMS, STEPS } from '../lib/data';
import { track } from '../lib/analytics';

/* ==========================================================================
   AIRPORT TRANSFER — cinematic parallax band
   ========================================================================== */

const AIRPORT_FARES = [
  { route: 'MMIA — International', detail: 'Ikeja, Lagos', fare: 'N/A' },
  { route: 'MMIA — Domestic', detail: 'Ikeja, Lagos', fare: 'N/A' },
  { route: 'Lekki / Ajah ↔ MMIA', detail: 'Via Lekki–Ikoyi Link Bridge', fare: 'N/A' },
  { route: 'Ikeja ↔ Victoria Island', detail: 'Executive saloon', fare: 'N/A' },
];

export function Airport() {
  const { ref, y } = useParallax(46);

  return (
    <section
      id="airport"
      ref={ref}
      className="relative overflow-hidden isolate"
      style={{ background: 'var(--color-ink)' }}
    >
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <img
          src={IMG.airport_1280}
          srcSet={srcset('airport')}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,8,12,.96) 0%, rgba(8,8,12,.86) 42%, rgba(8,8,12,.55) 100%)',
        }}
      />

      <div className="relative section shell">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <span className="eyebrow text-white/60">Airport &amp; Intercity</span>
              <h2 className="h2 text-white mt-5" style={{ marginTop: 20 }}>
                Your Airport Ride.
                <br />
                Already Taken Care Of.
              </h2>
              <p className="lede lede--dark mt-5" style={{ marginTop: 20 }}>
                Give us your flight number when you book and we work to your real landing
                time, not the timetable. If your flight slips, your car adjusts — you do
                not need to call.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-9 grid gap-3.5 sm:grid-cols-2" style={{ marginTop: 36 }}>
                {[
                  'Scheduled pickup',
                  'Professional drivers',
                  'Luggage assistance',
                  'Reliable transportation',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-white/80 text-[0.9rem]">
                    <span
                      className="grid place-items-center rounded-full shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        background: 'rgba(122,193,67,.16)',
                        border: '1px solid rgba(122,193,67,.34)',
                        color: '#9BE065',
                      }}
                    >
                      <Icon name="check" size={12} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-3" style={{ marginTop: 40 }}>
                <a
                  href="QuickBook.tsx"
                  className="btn btn--brand"
                  onClick={() => track('cta_click', { cta: 'airport_book' })}
                >
                  Book an Airport Transfer
                  <Icon name="arrow-right" size={17} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Fare panel */}
          <Reveal delay={0.16}>
            <div className="glass rounded-lg overflow-hidden" style={{ borderRadius: 24 }}>
              <div
                className="px-6 py-5 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,.12)' }}
              >
                <span className="text-white font-semibold text-[0.95rem]">
                  Indicative airport fares
                </span>
                <span className="tag" style={{ background: 'rgba(219,20,123,.2)', color: '#F7A9D0' }}>
                  Fixed
                </span>
              </div>
              <ul>
                {AIRPORT_FARES.map((f) => (
                  <li
                    key={f.route}
                    className="flex items-center justify-between gap-5 px-6 py-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}
                  >
                    <div>
                      <div className="text-white text-[0.9rem] font-medium">{f.route}</div>
                      <div className="text-white/42 text-[0.74rem] mt-0.5">{f.detail}</div>
                    </div>
                    <div className="text-white font-bold text-[1rem] whitespace-nowrap">
                      {f.fare}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-5">
                <p className="text-white/45 text-[0.74rem] leading-relaxed">
                  Waiting after landing is free for the first 60 minutes. Fares are
                  indicative and confirmed at booking.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CORPORATE
   ========================================================================== */

const CORP = [
  { t: 'Companies', b: 'One account covering every vehicle your organisation books.' },
  { t: 'Employees', b: 'Reliable daily movement for staff on fixed shifts.' },
  { t: 'Executives', b: 'Discreet, comfortable cars for senior movement.' },
  { t: 'Business trips', b: 'Client pickups and site visits, arranged in advance.' },
  { t: 'Scheduled staff transport', b: 'Standing rosters, same time, every working day.' },
];

export function Corporate() {
  return (
    <section
      id="corporate"
      className="section"
      style={{ background: 'var(--color-ink-2)' }}
    >
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-lg" style={{ borderRadius: 28 }}>
              <img
                src={IMG.corporate_1280}
                srcSet={srcset('corporate')}
                sizes="(max-width: 1024px) 100vw, 55vw"
                alt="Nigerian business professionals walking to a CTC Taxi vehicle outside a Lagos office tower"
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
                style={{ aspectRatio: '4 / 3' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(200deg, rgba(8,8,12,0) 40%, rgba(8,8,12,.72) 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                <div
                  className="glass inline-flex items-center gap-3 rounded-full px-4 py-2.5"
                  style={{ borderRadius: 999 }}
                >
                  <span
                    className="inline-block rounded-full"
                    style={{ width: 7, height: 7, background: '#7AC143' }}
                  />
                  <span className="text-white text-[0.78rem] font-medium">
                    Monthly accounts · invoiced in arrears
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="eyebrow text-white/60">Corporate &amp; Staff Transport</span>
              <h2 className="h2 text-white mt-5" style={{ marginTop: 20 }}>
                Transportation That Keeps Business Moving.
              </h2>
              <p className="lede lede--dark mt-5" style={{ marginTop: 20 }}>
                When your team is late, your business is late. CTC runs transport for
                organisations that cannot afford that — with named drivers, scheduled
                rosters and a record of every journey for your finance team.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-9" style={{ marginTop: 36 }}>
                {CORP.map((c, i) => (
                  <li
                    key={c.t}
                    className="grid gap-1.5 py-4"
                    style={{
                      borderTop: i === 0 ? '1px solid rgba(255,255,255,.1)' : undefined,
                      borderBottom: '1px solid rgba(255,255,255,.1)',
                    }}
                  >
                    <span className="text-white font-semibold text-[0.95rem]">{c.t}</span>
                    <span className="text-white/48 text-[0.85rem] leading-relaxed">{c.b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-3" style={{ marginTop: 36 }}>
                <a
                  href="QuickBook.tsx"
                  className="btn btn--brand"
                  onClick={() => track('cta_click', { cta: 'corporate_team' })}
                >
                  Get Your Team Moving
                  <Icon name="arrow-right" size={17} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SAFETY — interactive cards + live route visual
   ========================================================================== */

export function Safety() {
  const [activeId, setActiveId] = useState<string>(SAFETY_ITEMS[0].id);
  const reduced = useReducedMotion();
  const active = SAFETY_ITEMS.find((s) => s.id === activeId) ?? SAFETY_ITEMS[0];

  return (
    <section id="safety" className="section" style={{ background: '#fff' }}>
      <div className="shell">
        <SectionHead
          eyebrow="Safety & Standards"
          title="Every Journey Starts With Trust."
          lede="You are getting into a stranger's car. Everything below exists to make sure that stranger has been checked, the car has been inspected, and the journey is on record."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start" style={{ marginTop: 64 }}>
          {/* Visual: animated route panel */}
          <Reveal>
            <div
              className="relative overflow-hidden rounded-lg"
              style={{ background: 'var(--color-ink)', borderRadius: 24, aspectRatio: '1 / 1' }}
            >
              <svg viewBox="0 0 460 460" className="h-full w-full" role="img" aria-label="Illustration of a monitored CTC journey across Lagos">
                <defs>
                  <linearGradient id="sf-water" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#13131c" />
                    <stop offset="1" stopColor="#0e0e16" />
                  </linearGradient>
                  <pattern id="sf-grid" width="46" height="46" patternUnits="userSpaceOnUse">
                    <path d="M46 0H0V46" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="460" height="460" fill="#0b0b12" />
                <rect width="460" height="460" fill="url(#sf-grid)" />
                <path
                  d="M0 300 C90 282 150 318 230 330 C310 342 380 320 460 330 L460 460 L0 460 Z"
                  fill="url(#sf-water)"
                />
                <path
                  d="M0 0 H460 V268 C380 286 320 254 250 262 C180 270 130 248 60 256 C40 258 20 260 0 262 Z"
                  fill="#15151f"
                />

                {/* roads */}
                <g stroke="rgba(255,255,255,.07)" strokeWidth="7" fill="none" strokeLinecap="round">
                  <path d="M30 170 C130 140 260 186 440 140" />
                  <path d="M110 40 C150 120 176 180 208 240" />
                  <path d="M330 40 C316 120 306 180 298 250" />
                </g>

                {/* animated route */}
                <path
                  id="sf-route"
                  className="route-anim"
                  d="M92 196 C170 178 214 226 268 250 C318 272 350 296 386 306"
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />

                {/* pickup */}
                <circle cx="92" cy="196" r="7" fill="none" stroke="#fff" strokeWidth="2.2" />
                <circle cx="92" cy="196" r="2.6" fill="#fff" />
                {/* dropoff */}
                <circle cx="386" cy="306" r="7" fill="none" stroke="#fff" strokeWidth="2.2" />
                <circle cx="386" cy="306" r="2.6" fill="#fff" />
                {/* vehicle */}
                <g>
                  <circle className="ping" cx="268" cy="250" r="7" fill="var(--color-brand)" opacity=".5" />
                  <circle cx="268" cy="250" r="7" fill="var(--color-brand)" />
                </g>

                <g
                  fontFamily="ui-monospace, monospace"
                  fontSize="11"
                  fill="rgba(255,255,255,.35)"
                  letterSpacing="1.6"
                >
                  <text x="112" y="186">PICKUP</text>
                  <text x="306" y="298">DROP-OFF</text>
                </g>
              </svg>

              {/* Overlay status chip */}
              <div className="absolute left-5 right-5 bottom-5">
                <div className="glass rounded-[14px] px-5 py-4" style={{ borderRadius: 14 }}>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-block rounded-full shrink-0"
                      style={{ width: 8, height: 8, background: '#7AC143' }}
                    />
                    <span className="text-white text-[0.78rem] font-semibold tracking-wide uppercase">
                      {active.stat}
                    </span>
                  </div>
                  <p className="text-white/55 text-[0.78rem] leading-relaxed mt-2">
                    {active.id === 'gps'
                      ? 'Route, distance and timings are logged for every trip, so any query can be answered with facts rather than recollection.'
                      : active.id === 'drivers'
                        ? 'Documents are checked in person before a driver takes a single trip on the platform.'
                        : active.id === 'monitoring'
                          ? 'Vehicles are inspected and serviced on a schedule, with the dashcam checked each time.'
                          : active.id === 'driver-support'
                            ? 'Drivers can reach our team mid-trip, so problems are solved while they are still small.'
                            : 'A real person answers day or night. If a journey goes wrong, you reach a human — not a bot.'}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Interactive list */}
          <Reveal delay={0.1}>
            <ul className="grid gap-2.5">
              {SAFETY_ITEMS.map((s) => {
                const on = s.id === activeId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveId(s.id)}
                      onFocus={() => setActiveId(s.id)}
                      onClick={() => setActiveId(s.id)}
                      aria-expanded={on}
                      className="w-full text-left rounded-md p-5 transition-all duration-300"
                      style={{
                        border: `1px solid ${on ? 'var(--color-ink)' : 'var(--color-line)'}`,
                        background: on ? 'var(--color-sand)' : '#fff',
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className="grid place-items-center rounded-[11px] shrink-0 transition-colors"
                          style={{
                            width: 40,
                            height: 40,
                            background: on ? 'var(--color-ink)' : 'var(--color-sand)',
                            color: on ? '#fff' : 'var(--color-fg-2)',
                          }}
                        >
                          <Icon name={s.icon} size={19} />
                        </span>
                        <span className="font-semibold text-[1rem] tracking-tight flex-1">
                          {s.title}
                        </span>
                        <span
                          className="tag shrink-0 hidden sm:inline-flex"
                          style={{
                            background: on ? 'rgba(122,193,67,.18)' : 'var(--color-sand-2)',
                            color: on ? '#3F6B17' : 'var(--color-fg-3)',
                          }}
                        >
                          {s.stat}
                        </span>
                        <Icon
                          name="chevron-down"
                          size={17}
                          className="shrink-0 transition-transform duration-300"
                        />
                      </div>

                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            initial={reduced ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[0.89rem] leading-relaxed mt-3.5 pl-[54px] pr-2" style={{ color: 'var(--color-fg-2)', marginTop: 14 }}>
                              {s.body}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-[0.78rem] leading-relaxed" style={{ color: 'var(--color-fg-3)', marginTop: 24 }}>
              We publish only what we can stand behind. If you would like the detail
              behind any of these — how drivers are verified, what the dashcams record,
              or how a complaint is handled — ask us and we will walk you through it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   HOW IT WORKS — horizontal journey with an animated connector line
   ========================================================================== */

export function HowItWorks() {
  return (
    <section className="section" style={{ background: 'var(--color-sand)' }}>
      <div className="shell">
        <SectionHead
          eyebrow="How it works"
          title="Four steps. No guesswork."
          lede="From deciding to move, to arriving. This is the whole process."
        />

        <div className="mt-16 relative" style={{ marginTop: 64 }}>
          {/* connector — desktop only */}
          <div
            className="hidden lg:block absolute left-0 right-0 top-[38px]"
            style={{ height: 2 }}
            aria-hidden="true"
          >
            <div style={{ position: 'absolute', inset: 0, background: 'var(--color-line-strong)' }} />
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'var(--color-brand)', originX: 0 }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-7">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.12} className="relative">
                <div className="flex lg:block items-start gap-5">
                  <span
                    className="relative z-10 grid place-items-center rounded-full font-mono text-[0.78rem] font-semibold shrink-0"
                    style={{
                      width: 78,
                      height: 78,
                      background: '#fff',
                      border: '2px solid var(--color-ink)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {s.n}
                  </span>
                  <div className="lg:mt-7">
                    <h3 className="h3">{s.title}</h3>
                    <p
                      className="text-[0.89rem] leading-relaxed mt-2.5"
                      style={{ color: 'var(--color-fg-2)', marginTop: 10 }}
                    >
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
