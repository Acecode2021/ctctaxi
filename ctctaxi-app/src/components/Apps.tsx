import { motion, useReducedMotion } from 'framer-motion';
import { Icon, Reveal, SectionHead } from './primitives';
import { IMG } from '../assets/images';
import { APPS, CONTACT, track } from '../lib/analytics';

/* ==========================================================================
   APP DOWNLOAD STRIP
   A slim, permanent prompt directly under the hero. Parses in one glance:
   there are two apps, and here is which one you want.
   ========================================================================== */

export function AppDownloadStrip() {
  return (
    <section
      id="download"
      aria-label="Download the CTC apps"
      style={{ background: '#fff', borderBottom: '1px solid var(--color-line)' }}
    >
      <div className="shell">
        <div className="grid gap-6 items-center py-8 lg:grid-cols-[auto_1fr_auto] lg:py-9">
          <Reveal className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src={IMG.icon_rider}
                alt=""
                width={46}
                height={46}
                className="rounded-[12px] relative z-10"
                style={{ width: 46, height: 46, boxShadow: '0 6px 18px -8px rgba(0,0,0,.4)' }}
                loading="lazy"
              />
              <img
                src={IMG.icon_driver}
                alt=""
                width={46}
                height={46}
                className="rounded-[12px]"
                style={{ width: 46, height: 46, boxShadow: '0 6px 18px -8px rgba(0,0,0,.4)' }}
                loading="lazy"
              />
            </div>
            <div>
              <div className="font-semibold tracking-tight text-[1.02rem]">
                There are two CTC apps
              </div>
              <div className="text-[0.83rem] mt-0.5" style={{ color: 'var(--color-fg-2)' }}>
                One to book rides. One to earn from them.{' '}
                <a href="#apps" className="font-semibold underline underline-offset-4" style={{ color: 'var(--color-brand)' }}>
                  See what each one does
                </a>
              </div>
            </div>
          </Reveal>

          <div className="hidden lg:block" />

          <Reveal delay={0.08} className="flex flex-wrap gap-2.5">
            <a
              href={APPS.riderAppStore}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--dark btn--sm"
              onClick={() => track('app_download_click', { platform: 'appstore', app: 'rider', source: 'strip' })}
              aria-label="Download the CTC Taxi rider app on the App Store"
            >
              <Icon name="download" size={15} /> Rider app
            </a>
            <a
              href={APPS.riderPlay}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--sm"
              onClick={() => track('app_download_click', { platform: 'play', app: 'rider', source: 'strip' })}
              aria-label="Get the CTC Taxi rider app on Google Play"
            >
              Google Play
            </a>
            <a
              href={APPS.driverPlay}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--sm"
              onClick={() => track('app_download_click', { platform: 'play', app: 'driver', source: 'strip' })}
              aria-label="Get the CTC Driver app on Google Play"
            >
              Driver app
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   THE TWO APPS — a full explanation of what each one is for
   ========================================================================== */

type AppDef = {
  id: 'rider' | 'driver';
  tone: 'brand' | 'signal';
  icon: string;
  name: string;
  tagline: string;
  purpose: string;
  audience: string;
  rating: string;
  ratingSource: string;
  features: { icon: string; title: string; body: string }[];
  platforms: { play?: string; appStore?: string };
  note?: string;
  shots: { src: string; alt: string }[];
};

const APPS_DETAIL: AppDef[] = [
  {
    id: 'rider',
    tone: 'brand',
    icon: IMG.icon_rider,
    name: 'CTC Taxi — Ride with ease',
    tagline: 'The passenger app',
    purpose:
      'Built for anyone who needs to move — a commuter going to work, a family heading to the airport, a business booking a car for a client. You request the ride, see the price, and watch your driver come to you.',
    audience: 'For passengers, families and businesses',
    rating: '4.6★ Google Play · 5.0★ App Store',
    ratingSource: 'Published store ratings, September 2026',
    features: [
      {
        icon: 'pin',
        title: 'Request now or schedule ahead',
        body: 'Book a car for right now, or set a pickup up to 90 days in advance — useful for early flights and standing appointments.',
      },
      {
        icon: 'user',
        title: 'See your driver before they arrive',
        body: 'Your driver’s name, photo, car and plate number are shown before the vehicle reaches you. No guessing which car is yours.',
      },
      {
        icon: 'globe',
        title: 'Live route tracking',
        body: 'Follow the journey on the map from pickup to drop-off, so you always know the route being taken.',
      },
      {
        icon: 'car',
        title: 'Choose your vehicle class',
        body: 'An executive saloon for one or two, a Sienna or SUV for a family, a minibus for a group. Pick the car that fits the trip.',
      },
      {
        icon: 'rupee',
        title: 'Fare agreed before you move',
        body: 'The price is settled when you confirm. Cash, bank transfer or card — no meter, and no surge multiplier.',
      },
      {
        icon: 'clock',
        title: 'Your trip history and receipts',
        body: 'Saved addresses, past journeys and a receipt the moment a trip ends — useful if your company reimburses travel.',
      },
    ],
    platforms: { appStore: APPS.riderAppStore, play: APPS.riderPlay },
    shots: [
      { src: IMG.shot_rider_1, alt: 'CTC Taxi rider app welcome screen' },
      { src: IMG.shot_rider_2, alt: 'CTC Taxi rider app map screen showing a Lagos pickup point' },
    ],
  },
  {
    id: 'driver',
    tone: 'signal',
    icon: IMG.icon_driver,
    name: 'CTC Driver — Earn with ease',
    tagline: 'The driver app',
    purpose:
      'Built for people who want to earn from their car. It is the other half of the same system: the rider app sends the job, the driver app receives it, guides you there and handles the money split.',
    audience: 'For owner-drivers and drivers joining our fleet',
    rating: '5.0★ Google Play',
    ratingSource: 'Published store rating, September 2026',
    features: [
      {
        icon: 'briefcase',
        title: 'Job offers with the fare shown',
        body: 'See what a trip pays before you accept it. You decide what is worth your fuel and your time.',
      },
      {
        icon: 'globe',
        title: 'Turn-by-turn navigation',
        body: 'Guidance to the pickup point and on to the drop-off, so you are never hunting for an address.',
      },
      
       
        
      
      {
        icon: 'calendar',
        title: 'Airport and corporate jobs',
        body: 'Higher-value scheduled work — airport runs and staff transport — not only short city hops.',
      },
      {
        icon: 'download',
        title: 'Daily payouts, weekly statements',
        body: 'Money you can plan around, plus a written record of every trip you have completed.',
      },
      {
        icon: 'headset',
        title: 'Support while you are on a trip',
        body: 'A direct line to our team if something goes wrong mid-journey, rather than a form nobody answers.',
      },
    ],
    platforms: { play: APPS.driverPlay },
    note: 'Android only for now. An iPhone version is not yet available.',
    shots: [{ src: IMG.shot_driver_1, alt: 'CTC Driver app showing a ride request on a Lagos map' }],
  },
];

function AppColumn({ app, index }: { app: AppDef; index: number }) {
  const brand = app.tone === 'brand';
  const accent = brand ? 'var(--color-brand)' : 'var(--color-signal)';
  const softBg = brand ? 'rgba(219,20,123,.10)' : 'rgba(122,193,67,.12)';
  const softFg = brand ? 'var(--color-brand-700)' : '#3F6B17';

  return (
    <Reveal
      as="article"
      delay={index * 0.08}
      className="card flex flex-col overflow-hidden"
      >
      <div style={{ borderTop: `3px solid ${accent}` }} />

      {/* header */}
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <img
            src={app.icon}
            alt=""
            width={64}
            height={64}
            className="rounded-[15px] shrink-0"
            style={{ width: 64, height: 64, boxShadow: '0 8px 20px -10px rgba(0,0,0,.45)' }}
            loading="lazy"
          />
          <div className="min-w-0">
            <span className="tag" style={{ background: softBg, color: softFg }}>
              {app.tagline}
            </span>
            <h3 className="h3 mt-2.5" style={{ marginTop: 10 }}>
              {app.name}
            </h3>
          </div>
        </div>

        <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase mt-5" style={{ color: softFg, marginTop: 20 }}>
          {app.audience}
        </p>

        <p className="text-[0.93rem] leading-relaxed mt-3" style={{ color: 'var(--color-fg-2)', marginTop: 12 }}>
          {app.purpose}
        </p>

        <p className="text-[0.8rem] mt-3 flex items-center gap-2" style={{ color: 'var(--color-fg-3)', marginTop: 12 }}>
          <Icon name="star" size={13} className="shrink-0" />
          <span>
            <strong style={{ color: 'var(--color-fg)' }}>{app.rating}</strong> · {app.ratingSource}
          </span>
        </p>
      </div>

      {/* features */}
      <div className="px-6 sm:px-8 pb-2">
        <h4 className="text-[0.68rem] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--color-fg-3)' }}>
          What it does
        </h4>
      </div>
      <ul className="px-6 sm:px-8 pb-6 grid gap-4 flex-1" style={{ paddingTop: 16 }}>
        {app.features.map((f) => (
          <li key={f.title} className="flex gap-3.5">
            <span
              className="grid place-items-center rounded-[10px] shrink-0 mt-0.5"
              style={{ width: 34, height: 34, background: softBg, color: softFg }}
            >
              <Icon name={f.icon} size={16} />
            </span>
            <div>
              <div className="font-semibold text-[0.9rem] leading-snug">{f.title}</div>
              <div className="text-[0.855rem] leading-relaxed mt-1" style={{ color: 'var(--color-fg-2)' }}>
                {f.body}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* screenshots */}
      <div className="px-6 sm:px-8 pb-6">
        <div className={`grid gap-3 ${app.shots.length > 1 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {app.shots.map((s) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              loading="lazy"
              decoding="async"
              className="w-full rounded-[12px]"
              style={{ border: '1px solid var(--color-line)' }}
            />
          ))}
          {app.shots.length === 1 && (
            <div
              className="rounded-[12px] grid place-items-center text-center p-5"
              style={{ border: '1px dashed var(--color-line-strong)', background: 'var(--color-sand)' }}
            >
              <span className="text-[0.72rem] leading-relaxed font-semibold tracking-wide" style={{ color: 'var(--color-fg-3)' }}>
                DRIVER APP
                <br />
                SCREENS
                <br />
                <span className="font-normal">to be supplied</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* download */}
      <div
        className="mt-auto px-6 sm:px-8 py-6"
        style={{ borderTop: '1px solid var(--color-line)', background: 'var(--color-sand)' }}
      >
        <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--color-fg-3)' }}>
          {app.id === 'rider' ? 'Get the rider app' : 'Get the driver app'}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {app.platforms.appStore && (
            <a
              href={app.platforms.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--dark btn--sm"
              onClick={() => track('app_download_click', { platform: 'appstore', app: app.id, source: 'apps_section' })}
            >
              <AppleGlyph /> App Store
            </a>
          )}
          {app.platforms.play && (
            <a
              href={app.platforms.play}
              target="_blank"
              rel="noopener noreferrer"
              className={app.platforms.appStore ? 'btn btn--outline btn--sm' : 'btn btn--dark btn--sm'}
              onClick={() => track('app_download_click', { platform: 'play', app: app.id, source: 'apps_section' })}
            >
              <PlayGlyph /> Google Play
            </a>
          )}
        </div>
        {app.note && (
          <p className="text-[0.75rem] leading-relaxed mt-3" style={{ color: 'var(--color-fg-3)', marginTop: 12 }}>
            {app.note}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export function TwoApps() {
  const reduced = useReducedMotion();

  return (
    <section id="apps" className="section" style={{ background: 'var(--color-sand)' }}>
      <div className="shell">
        <SectionHead
          eyebrow="Two apps, one service"
          title={
            <>
              One sends the ride.
              <br />
              One earns from it.
            </>
          }
          lede="CTC runs both sides of the journey with two separate apps, both published by Countryside Taxi Company Ltd. Choose the one that matches what you need — or use this website and the phone, which work just as well."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:items-stretch" style={{ marginTop: 56 }}>
          {APPS_DETAIL.map((a, i) => (
            <AppColumn key={a.id} app={a} index={i} />
          ))}
        </div>

        {/* how the two connect */}
        <Reveal delay={0.1}>
          <div
            className="mt-8 rounded-lg p-7 sm:p-9"
            style={{ background: 'var(--color-ink)', borderRadius: 24, marginTop: 32 }}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div>
                <span className="tag" style={{ background: 'rgba(219,20,123,.18)', color: '#F7A9D0' }}>
                  Rider books
                </span>
                <p className="text-white/70 text-[0.92rem] leading-relaxed mt-3" style={{ marginTop: 12 }}>
                  You enter your pickup, drop-off and time in the rider app. The fare is
                  agreed at that moment.
                </p>
              </div>

              <div className="hidden lg:flex flex-col items-center gap-2 px-4">
                <motion.span
                  animate={reduced ? undefined : { x: [0, 10, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: 'var(--color-brand)' }}
                >
                  <Icon name="arrow-right" size={26} />
                </motion.span>
                <span className="font-mono text-[0.65rem] tracking-widest" style={{ color: 'rgba(255,255,255,.4)' }}>
                  MATCHED
                </span>
                <motion.span
                  animate={reduced ? undefined : { x: [-10, 0, -10] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: 'var(--color-signal)' }}
                >
                  <Icon name="arrow-right" size={26} className="rotate-180" />
                </motion.span>
              </div>

              <div>
                <span className="tag" style={{ background: 'rgba(122,193,67,.18)', color: '#9BE065' }}>
                  Driver accepts
                </span>
                <p className="text-white/70 text-[0.92rem] leading-relaxed mt-3" style={{ marginTop: 12 }}>
                  The nearest verified driver sees the job and the fare in the driver app,
                  accepts it, and gets navigation to you.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* phone fallback */}
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5" style={{ marginTop: 32 }}>
            <p className="text-[0.88rem] leading-relaxed max-w-[62ch]" style={{ color: 'var(--color-fg-2)' }}>
              <strong className="font-semibold" style={{ color: 'var(--color-fg)' }}>
                No smartphone, or prefer to talk to someone?
              </strong>{' '}
              You can book entirely by phone or by using the booking card on this page. The
              apps add live tracking and saved trips — they are not required to ride with CTC.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`tel:${CONTACT.phonePrimaryTel}`}
                className="btn btn--dark btn--sm"
                onClick={() => track('phone_click', { source: 'apps_section' })}
              >
                <Icon name="phone" size={15} /> {CONTACT.phonePrimary}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline btn--sm"
                onClick={() => track('whatsapp_click', { source: 'apps_section' })}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AppleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.9c0-2.4 1.96-3.55 2.05-3.6-1.12-1.64-2.86-1.86-3.48-1.89-1.48-.15-2.88.87-3.63.87-.75 0-1.9-.85-3.13-.83-1.61.02-3.1.94-3.93 2.38-1.67 2.9-.43 7.2 1.2 9.55.79 1.15 1.74 2.44 2.99 2.39 1.2-.05 1.65-.78 3.1-.78s1.86.78 3.13.75c1.29-.02 2.11-1.17 2.9-2.33.91-1.34 1.29-2.64 1.31-2.71-.03-.01-2.5-.96-2.51-3.8ZM14.7 5.6c.66-.8 1.11-1.92.99-3.03-.95.04-2.11.63-2.79 1.43-.61.7-1.15 1.83-1 2.91 1.06.08 2.14-.54 2.8-1.31Z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.6 1.8a1.2 1.2 0 0 0-.6 1.05v18.3a1.2 1.2 0 0 0 .6 1.05l10-10.2-10-10.2Zm11.4 9.05 2.9-2.95-13-6.62 10.1 9.57Zm0 2.3L4.9 22.72l13-6.62-2.9-2.95Zm5.2-2.6-3.3 3.35-3.3-3.35 3.3-3.35 3.3 3.35Z" />
    </svg>
  );
}
