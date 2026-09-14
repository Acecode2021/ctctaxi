import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Icon, Reveal, SectionHead } from './primitives';
import { SERVICES, TRUST_SIGNALS } from '../lib/data';
import { srcset } from '../assets/images';
import { track } from '../lib/analytics';

/* ==========================================================================
   TRUST STRIP
   ========================================================================== */

export function TrustStrip() {
  return (
    <section
      aria-label="Why customers trust CTC Taxi"
      style={{ background: 'var(--color-ink-2)', borderBottom: '1px solid rgba(255,255,255,.07)' }}
    >
      <div className="shell">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_SIGNALS.map((t, i) => (
            <Reveal
              as="li"
              key={t.title}
              delay={i * 0.07}
              className="flex gap-4 py-7 lg:py-9 lg:pr-8"
            >
              <span
                className="grid place-items-center rounded-[13px] shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.12)',
                  color: i % 2 === 0 ? 'var(--color-signal)' : 'var(--color-brand)',
                }}
              >
                <Icon name={t.icon} size={20} />
              </span>
              <div>
                <h3 className="text-white font-semibold text-[0.94rem] leading-snug">
                  {t.title}
                </h3>
                <p className="text-white/48 text-[0.81rem] leading-relaxed mt-1.5">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ==========================================================================
   SERVICES — bento grid with expand-on-hover
   ========================================================================== */

function ServiceCard({ s, index }: { s: (typeof SERVICES)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const dark = s.tone === 'dark';
  const tall = s.id === 'rides';

  return (
    <Reveal
      as="article"
      delay={index * 0.06}
      className={`${s.span} group relative`}
    >
      <motion.div
        onHoverStart={() => setOpen(true)}
        onHoverEnd={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        tabIndex={0}
        className="relative h-full overflow-hidden rounded-lg cursor-pointer"
        style={{
          minHeight: tall ? 460 : 268,
          border: `1px solid ${dark ? 'transparent' : 'var(--color-line)'}`,
        }}
        whileHover={reduced ? undefined : { y: -5 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Media */}
        <img
          src={s.image}
          srcSet={srcset(s.id as never)}
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: open && !reduced ? 'scale(1.055)' : 'scale(1)',
            transition: 'transform 1.1s var(--ease-out-expo)',
          }}
        />

        {/* Scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? 'linear-gradient(180deg, rgba(8,8,12,.35) 0%, rgba(8,8,12,.72) 55%, rgba(8,8,12,.94) 100%)'
              : 'linear-gradient(180deg, rgba(8,8,12,.55) 0%, rgba(8,8,12,.78) 60%, rgba(8,8,12,.95) 100%)',
          }}
        />
        {dark && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(120deg, rgba(219,20,123,.34) 0%, rgba(219,20,123,0) 55%)',
            }}
          />
        )}

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <span
              className="grid place-items-center rounded-[11px] shrink-0"
              style={{
                width: 38,
                height: 38,
                background: 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.2)',
                color: '#fff',
              }}
            >
              <Icon
                name={
                  s.id === 'airport'
                    ? 'plane'
                    : s.id === 'scheduled'
                      ? 'calendar'
                      : s.id === 'corporate'
                        ? 'briefcase'
                        : s.id === 'delivery'
                          ? 'box'
                          : 'car'
                }
                size={19}
              />
            </span>
            <h3 className="h3 text-white">{s.title}</h3>
          </div>

          <p
            className="text-white/72 text-[0.9rem] leading-relaxed mt-4 max-w-[46ch]"
            style={{ marginTop: 16 }}
          >
            {s.short}
          </p>

          {/* Expands on hover / focus */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p
                  className="text-white/55 text-[0.85rem] leading-relaxed mt-4"
                  style={{ marginTop: 16 }}
                >
                  {s.detail}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-4" style={{ marginTop: 16 }}>
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-[0.78rem] text-white/72"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7AC143" strokeWidth="2.8" strokeLinecap="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href="#book"
            className="flex items-center gap-2.5 text-white font-semibold text-[0.86rem] mt-6 group/link w-fit"
            style={{ marginTop: 24 }}
            onClick={() => track('service_card_open', { service: s.id })}
          >
            Book this service
            <span
              className="grid place-items-center rounded-full transition-transform group-hover/link:translate-x-1"
              style={{ width: 26, height: 26, background: 'var(--color-brand)' }}
            >
              <Icon name="arrow-right" size={14} strokeWidth={2.4} />
            </span>
          </a>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function Services() {
  return (
    <section id="services" className="section" style={{ background: '#fff' }}>
      <div className="shell">
        <SectionHead
          eyebrow="What we do"
          title={
            <>
              One Ride.
              <br />
              Many Ways To Move.
            </>
          }
          lede="Five services, one standard of car and driver. Whether it is a quick run across town, a flight to catch or a parcel that must arrive, the same CTC discipline applies."
          action={
            <a
              href="#book"
              className="btn btn--outline"
              onClick={() => track('cta_click', { cta: 'services_quote' })}
            >
              Request a quote
            </a>
          }
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-6 lg:auto-rows-[minmax(230px,auto)]" style={{ marginTop: 64 }}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
