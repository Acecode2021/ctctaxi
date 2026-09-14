import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Icon, Magnetic } from './primitives';
import { APPS, CONTACT, track } from '../lib/analytics';
import { IMG } from '../assets/images';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Download App', href: '#apps' },
  { label: 'Airport Transfer', href: '#airport' },
  { label: 'Corporate', href: '#corporate' },
  { label: 'Safety', href: '#safety' },
  { label: 'Drive With CTC', href: '#drive' },
  { label: 'About Us', href: '#about' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#top');
  const reduced = useReducedMotion();

  /* Solid bar after the hero begins to leave the viewport */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Highlight the section currently in view */
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(`#${vis.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  /* Lock body scroll + close on Escape while the mobile sheet is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const solid = scrolled && !open;

  return (
    <>
      <a href="#services" className="skip">
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          transition: 'background-color .45s var(--ease-out-expo), border-color .45s, backdrop-filter .45s',
          backgroundColor: solid ? 'rgba(255, 254, 252, 0.94)' : 'rgba(3, 3, 3, 0.28)',
          backdropFilter: solid ? 'blur(20px) saturate(180%)' : 'blur(14px)',
          WebkitBackdropFilter: solid ? 'blur(20px) saturate(180%)' : 'blur(14px)',
          borderBottom: `1px solid ${solid ? 'var(--color-line)' : 'rgba(223, 15, 15, 0.1)'}`,
        }}
      >
        <div className="shell flex items-center justify-between gap-6" style={{ minHeight: 76 }}>
          {/* Brand */}
          <a
            href="#top"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setOpen(false)}
            aria-label="CTC Taxi — home"
          >
            <img
              src={solid ? IMG.logo_ink : IMG.logo_white}
              alt=""
              width={40}
              height={40}
              style={{ width: 40, height: 40, transition: 'opacity .3s' }}
            />
            <span className="hidden sm:flex flex-col leading-none">
              <span
                className="font-bold tracking-tight text-[1.05rem]"
                style={{ color: solid ? 'var(--color-ink)' : '#fff' }}
              >
                CTC Taxi
              </span>
              <span
                className="text-[0.6rem] tracking-[0.14em] uppercase mt-0.5"
                style={{ color: solid ? 'var(--color-fg-3)' : 'rgba(255,255,255,.55)' }}
              >
                Countryside Taxi Co.
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-6 flex-nowrap" aria-label="Primary">
            {LINKS.map((l) => {
              const isActive = active === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative text-[1rem] font-medium py-1.5 transition-colors whitespace-nowrap"
                  style={{
                    color: solid
                      ? isActive
                        ? 'var(--color-ink)'
                        : 'var(--color-fg-2)'
                      : isActive
                        ? '#fff'
                        : 'rgba(255,255,255,.72)',
                  }}
                >
                  {l.label}
                  <span
                    className="absolute left-0 -bottom-0.5 h-[1.5px] rounded-full"
                    style={{
                      background: 'var(--color-brand)',
                      width: isActive ? '100%' : '0%',
                      transition: 'width .3s var(--ease-out-expo)',
                    }}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2.5">
            <a
              href="#contact"
              className="hidden lg:inline-flex items-center gap-2 text-[0.85rem] font-semibold px-3 py-2 rounded-full transition-colors"
              style={{ color: solid ? 'var(--color-fg-2)' : 'rgba(255,255,255,.8)' }}
              onClick={() => track('cta_click', { cta: 'nav_contact' })}
            >
              <Icon name="mail" size={30} />
              <b>Contact</b>
            </a>

            {/* Become a Driver */}
            <a
              href="#drive"
              className="btn btn--outline btn--sm hidden md:inline-flex"
              style={
                solid
                  ? undefined
                  : { borderColor: 'rgba(245, 55, 122, 0.95)', color: '#f1115f' }
              }
              onClick={() => track('cta_click', { cta: 'nav_become_driver' })}
            >
              Become a Driver
            </a>

            <Magnetic strength={0.22}>
              <a
                href="quickbook.tsx"
                className="btn btn--brand btn--sm hidden sm:inline-flex"
                onClick={() => track('cta_click', { cta: 'nav_book' })}
              >
                Book a Ride
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="xl:hidden grid place-items-center rounded-full"
              style={{
                width: 44,
                height: 44,
                border: `1px solid ${solid ? 'var(--color-line-strong)' : 'rgba(255,255,255,.24)'}`,
                color: solid ? 'var(--color-ink)' : '#fff',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 40, scale: 0.7 }}
                  transition={{ duration: 0.22 }}
                  className="grid place-items-center"
                >
                  <Icon name={open ? 'x' : 'menu'} size={19} />
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Mobile full-screen menu ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'var(--color-ink)' }}
              onClick={() => setOpen(false)}
            />
            <div className="relative h-full overflow-y-auto pt-24 pb-32 shell">
              <nav aria-label="Mobile">
                <ul className="flex flex-col">
                  {LINKS.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={reduced ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.055,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b"
                      style={{ borderColor: 'rgba(255,255,255,.09)' }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-5 text-white"
                      >
                        <span className="text-[1.6rem] font-semibold tracking-tight">
                          {l.label}
                        </span>
                        <Icon name="arrow-right" size={20} className="text-white/35" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.5 }}
                className="mt-10 flex flex-col gap-3"
              >
                <a
                  href="#book"
                  className="btn btn--brand btn--block"
                  onClick={() => setOpen(false)}
                >
                  Book a Ride
                </a>

                <a
                  href="#drive"
                  className="btn btn--outline btn--block"
                  style={{ borderColor: 'rgba(255,255,255,.35)', color: '#fff' }}
                  onClick={() => {
                    setOpen(false);
                    track('cta_click', { cta: 'mobile_become_driver' });
                  }}
                >
                  Become a Driver
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${CONTACT.phonePrimaryTel}`}
                    className="btn btn--ghost"
                    onClick={() => track('phone_click', { source: 'mobile_menu' })}
                  >
                    <Icon name="phone" size={16} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost"
                    onClick={() => track('whatsapp_click', { source: 'mobile_menu' })}
                  >
                    WhatsApp
                  </a>
                </div>

                <div className="flex gap-2.5 mt-2">
                  <a
                    href={APPS.riderPlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost btn--sm flex-1"
                    onClick={() => track('app_download_click', { platform: 'play', source: 'menu' })}
                  >
                    Google Play
                  </a>
                  <a
                    href={APPS.riderAppStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost btn--sm flex-1"
                    onClick={() => track('app_download_click', { platform: 'appstore', source: 'menu' })}
                  >
                    App Store
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}