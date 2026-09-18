import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Icon, Magnetic, RotatingWord } from './primitives';
import { IMG, srcset } from '../assets/images';
import { APPS, track } from '../lib/analytics';
import { QuickBook } from './QuickBook';

/**
 * Hero background.
 *
 * Strategy: the poster image is always rendered and painted first, so the
 * section is never empty. The video sits above it and fades in only once it
 * can actually play. If the file is missing (or the network is slow on a
 * Nigerian mobile connection) the user simply sees the still frame.
 *
 * Drop the rendered hero film at:  public/media/ctc-hero.mp4  /  .webm
 * Spec: 1920x1080, ~10 s, seamless loop, no audio track, <= 2 MB,
 *       +faststart, poster frame matching hero-main.
 */
function HeroMedia() {
  const reduced = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const showVideo = !reduced && !videoFailed;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={IMG.hero_main_1280}
        srcSet={srcset('hero_main')}
        sizes="100vw"
        alt=""
        width={1280}
        height={537}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '62% 58%' }}
      />
      {showVideo && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: '62% 58%',
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 1.1s var(--ease-out-expo)',
          }}
          poster={IMG.hero_main_1280}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src="/media/ctc-hero.webm" type="video/webm" />
          <source src="/media/ctc-hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Layered scrim: keeps the headline at AA contrast without dulling the car */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(8,8,12,.95) 0%, rgba(8,8,12,.86) 32%, rgba(8,8,12,.42) 62%, rgba(8,8,12,.18) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,12,.62) 0%, rgba(8,8,12,0) 26%, rgba(8,8,12,.55) 100%)',
        }}
      />
    </div>
  );
}

const TRUST = [
  { icon: 'user', label: 'Professional Drivers' },
  { icon: 'pin', label: 'Safe & Tracked Rides' },
  { icon: 'calendar', label: 'Available for Scheduled Trips' },
];

const APP_SLIDES = [
  {
    id: 'rider',
    title: 'CTC Taxi app',
    subtitle: 'Ride with ease',
    badge: 'Free',
    ratingPrimary: { value: '4.6', label: 'Google Play' },
    ratingSecondary: { value: '5.0', label: 'App Store' },
    summary: 'Ratings shown as published by the app stores. Verified, not cherry-picked.',
  },
  {
    id: 'driver',
    title: 'CTC Driver app',
    subtitle: 'Earn with ease',
    badge: 'Free',
    ratingPrimary: { value: '5.0', label: 'Google Play' },
    ratingSecondary: null,
    summary: 'Ratings shown as published by the app store. Verified, not cherry-picked.',
  },
] as const;

function HeroAppCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = APP_SLIDES[activeIndex];

  /* Auto-advance the carousel so both app slides show without clicks */
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % APP_SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full max-w-[560px] justify-self-end">
      <div className="app-carousel rounded-[28px] p-3 sm:p-4">
        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/20">
          <div className="relative aspect-[16/11] w-full overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={IMG.hero_main_1280}
              className="h-full w-full object-cover"
              style={{ objectPosition: '62% 58%' }}
            >
              <source src="/media/ctc-hero.webm" type="video/webm" />
              <source src="/media/ctc-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080c]/85 via-[#08080c]/20 to-[#08080c]/5" />
            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
              Video
            </div>
          </div>
        </div>

        <div className="glass mt-4 rounded-[22px] p-4 sm:p-5">
          <div className="flex items-center gap-3.5">
            <img
              src={current.id === 'rider' ? IMG.icon_rider : IMG.icon_driver}
              alt=""
              width={52}
              height={52}
              className="rounded-[13px]"
              style={{ width: 52, height: 52 }}
            />
            <div>
              <div className="text-white font-semibold text-[1.02rem] leading-tight">
                {current.title}
              </div>
              <div className="text-white/50 text-[0.74rem] mt-0.5">{current.subtitle}</div>
            </div>
            <span
              className="ml-auto tag"
              style={{
                background: 'rgba(122,193,67,.16)',
                color: '#9BE065',
                border: '1px solid rgba(122,193,67,.3)',
              }}
            >
              {current.badge}
            </span>
          </div>

          <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}>
            <div className="flex items-end gap-6">
              <div>
                <div className="text-[2.1rem] font-bold text-white leading-none tracking-tight">
                  {current.ratingPrimary.value}
                  <span className="text-brand text-[1.2rem] align-top ml-0.5">★</span>
                </div>
                <div className="text-white/45 text-[0.72rem] mt-1.5">{current.ratingPrimary.label}</div>
              </div>
              {current.ratingSecondary && (
                <>
                  <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,.12)' }} />
                  <div>
                    <div className="text-[2.1rem] font-bold text-white leading-none tracking-tight">
                      {current.ratingSecondary.value}
                      <span className="text-brand text-[1.2rem] align-top ml-0.5">★</span>
                    </div>
                    <div className="text-white/45 text-[0.72rem] mt-1.5">{current.ratingSecondary.label}</div>
                  </div>
                </>
              )}
            </div>
            <p className="text-white/40 text-[0.72rem] mt-5 leading-relaxed">{current.summary}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous app rating card"
              className="app-carousel-button"
              onClick={() => setActiveIndex((prev) => (prev === 0 ? APP_SLIDES.length - 1 : prev - 1))}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next app rating card"
              className="app-carousel-button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % APP_SLIDES.length)}
            >
              →
            </button>
          </div>

          <div className="flex items-center gap-2">
            {APP_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.title}`}
                className={`app-carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate overflow-hidden"
      style={{ background: 'var(--color-ink)' }}
    >
      <HeroMedia />

      <div
        className="relative z-10 shell"
        style={{
          paddingTop: 'clamp(128px, 15vh, 190px)',
          paddingBottom: 'clamp(150px, 20vh, 250px)',
        }}
      >
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:items-center"
        >
          {/* ---------------- Copy ---------------- */}
          <div>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow text-white/100"
            >
              <b>Lagos moves with CTC</b>
            </motion.div>

            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="display mt-6 text-white"
              style={{ marginTop: 24 }}
            >
              Your Journey.
              <br />
              <span className="inline-flex flex-wrap items-baseline gap-x-4">
                <span className="text-white/55 font-normal">Handled</span>
                <RotatingWord
                  words={['With Care','With Ease.', 'For Work.', 'For Travel.', 'For Delivery.',]}
                  className="text-brand"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="lede lede--dark mt-7"
              style={{ marginTop: 28, maxWidth: '46ch' }}
            >
              Reliable everyday rides, airport transfers, corporate transportation and
              delivery services designed to move Lagos forward.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-3"
              style={{ marginTop: 40 }}
            >
              <Magnetic>
                <a
                  href="#book"
                  className="btn btn--brand"
                  onClick={() => track('cta_click', { cta: 'hero_book' })}
                >
                  
                  Book a Ride
                  <Icon name="arrow-right" size={17} />
                </a>
              </Magnetic>
              <a
                href="#services"
                className="btn btn--ghost"
                onClick={() => track('cta_click', { cta: 'hero_services' })}
              >
                Explore Our Services
              </a>
            </motion.div>

            {/* Trust indicators */}
            {/* App download — a real, prominent path for visitors who want the app */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
              style={{ marginTop: 36 }}
            >
              <span className="text-[0.82rem] text-white/55 max-w-[20ch] leading-snug">
                Get the app to book, track and pay.
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={APPS.riderAppStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--white btn--sm"
                  onClick={() => track('app_download_click', { platform: 'appstore', app: 'rider', source: 'hero' })}
                  aria-label="Download the CTC Taxi app on the App Store"
                >
                  <Icon name="download" size={15} /> App Store
                </a>
                <a
                  href={APPS.riderPlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost btn--sm"
                  onClick={() => track('app_download_click', { platform: 'play', app: 'rider', source: 'hero' })}
                  aria-label="Get the CTC Taxi app on Google Play"
                >
                  <Icon name="download" size={15} /> Google Play
                </a>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.ul
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.44 }}
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3"
              style={{ marginTop: 40 }}
            >
              {TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-2.5">
                  <span
                    className="grid place-items-center rounded-full shrink-0"
                    style={{
                      width: 26,
                      height: 26,
                      background: 'rgba(122,193,67,.16)',
                      border: '1px solid rgba(122,193,67,.32)',
                      color: '#9BE065',
                    }}
                  >
                    <Icon name={t.icon} size={13} strokeWidth={2.4} />
                  </span>
                  <span className="text-[0.82rem] text-white/62">{t.label}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ---------------- App media carousel ---------------- */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[560px] justify-self-end"
          >
            <HeroAppCarousel />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating quick-booking card, pulled up over the hero floor */}
      <div className="relative z-20 shell" style={{ marginBottom: 'clamp(-118px, -7vw, -76px)' }}>
        <QuickBook />
      </div>
    </section>
  );
}
