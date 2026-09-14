import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionProps,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

/* ==========================================================================
   ICONS — a single inline sprite. No icon-font, no runtime dependency:
   26 icons cost roughly 4 kB gzipped and render on first paint.
   ========================================================================== */

const PATHS: Record<string, string> = {
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-right': 'm9 6 6 6-6 6',
  phone:
    'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
  shield: 'M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z',
  'shield-check': 'M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Zm-3 10 2 2 4-4',
  pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  plane: 'M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-.9 1.7l5.3 2.3-2.4 2.4-2.6-.5a1 1 0 0 0-.9 1.7L5 15l1.2 1.6a1 1 0 0 0 1.7-.9l-.5-2.6 2.4-2.4 2.3 5.3a1 1 0 0 0 1.7-.9Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5l3.5 2',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  car: 'M5 17h14M6.5 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM4 13l1.6-5A2 2 0 0 1 7.5 6.5h9a2 2 0 0 1 1.9 1.5L20 13v4H4v-4Z',
  headset:
    'M4 14v-2a8 8 0 0 1 16 0v2 M4 14a2 2 0 0 1 2 2v1a2 2 0 0 1-4 0v-1a2 2 0 0 1 2-2Zm16 0a2 2 0 0 0-2 2v1a2 2 0 0 0 4 0v-1a2 2 0 0 0-2-2Z',
  chat: 'M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.8-.8L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  box: 'M21 16V8l-9-5-9 5v8l9 5 9-5ZM3.3 7.5 12 12.5l8.7-5M12 22V12.5',
  briefcase:
    'M3 8h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm5 0V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13h20',
  rupee: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  star: 'm12 2 3 6.6 7 .9-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-.9L12 2Z',
  play: 'M6 3.5v17l14-8.5-14-8.5Z',
  lock: 'M4 10h16v11H4V10Zm4 0V7a4 4 0 0 1 8 0v3',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z',
  download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  menu: 'M3 6h18M3 12h18M3 18h18',
  mail: 'M3 6h18v12H3z M3 7l9 6 9-6',
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',
};

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.9,
}: {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const d = PATHS[name] ?? PATHS['arrow-right'];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

/* ==========================================================================
   REVEAL — scroll-triggered entrance. Uses IntersectionObserver via
   framer-motion's whileInView so there is no scroll listener at all.
   ========================================================================== */

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'figure';
};

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as as 'div';
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -10% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* ==========================================================================
   MAGNETIC — pointer-following wrapper for primary CTAs.
   Disabled on touch devices and when reduced motion is requested.
   ========================================================================== */

export function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 22, mass: 0.5 });

  if (reduced || !fine) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-block' }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ==========================================================================
   ROTATING WORD — cycles keywords with a vertical slide.
   ========================================================================== */

export function RotatingWord({
  words,
  interval = 2600,
  className = '',
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => window.clearInterval(t);
  }, [interval, words.length, reduced]);

  if (reduced) return <span className={className}>{words[0]}</span>;

  return (
    <span
      className={`relative inline-grid overflow-hidden align-bottom ${className}`}
      aria-live="polite"
    >
      {/* Reserve width for the longest word so the layout never jumps */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <span className="col-start-1 row-start-1">
        {words.map((w, idx) => (
          <motion.span
            key={w}
            className="absolute inset-0"
            initial={false}
            animate={{
              y: idx === i ? '0%' : idx < i ? '-110%' : '110%',
              opacity: idx === i ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/* ==========================================================================
   SECTION HEADING
   ========================================================================== */

export function SectionHead({
  eyebrow,
  title,
  lede,
  dark = false,
  align = 'left',
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  dark?: boolean;
  align?: 'left' | 'center';
  action?: ReactNode;
}) {
  const centered = align === 'center';
  return (
    <Reveal
      className={[
        'flex flex-col gap-8',
        centered
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between',
      ].join(' ')}
    >
      <div className={centered ? 'max-w-3xl' : 'max-w-3xl'}>
        <span className={`eyebrow ${dark ? 'text-white/60' : 'text-brand'}`}>
          {eyebrow}
        </span>
        <h2
          className={`h2 mt-5 ${dark ? 'text-white' : 'text-fg'}`}
          style={{ marginTop: 20 }}
        >
          {title}
        </h2>
        {lede && (
          <p className={`lede mt-5 ${dark ? 'lede--dark' : ''}`} style={{ marginTop: 20 }}>
            {lede}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/* ==========================================================================
   STAR RATING
   ========================================================================== */

export function Stars({ value = 5, size = 15 }: { value?: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < Math.round(value) ? 'var(--color-brand)' : 'var(--color-line-strong)'}
          aria-hidden="true"
        >
          <path d={PATHS.star} />
        </svg>
      ))}
    </span>
  );
}

/* ==========================================================================
   ANIMATED COUNTER — counts to a *defensible* value only. Used sparingly.
   ========================================================================== */

export function Counter({
  to,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 1400,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(to * eased);
          if (p < 1) requestAnimationFrame(tick);
          else setV(to);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, reduced]);

  return (
    <span ref={ref}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   PARALLAX — a single transform driven by an IntersectionObserver-gated
   scroll subscription. Cheaper than a scroll listener per element.
   ========================================================================== */

export function useParallax(range = 60) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0.5);
  const y = useTransform(progress, [0, 1], [-range, range]);
  const smooth = useSpring(y, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = 1 - (r.top + r.height / 2) / (window.innerHeight + r.height / 2);
      progress.set(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [progress, reduced]);

  return { ref, y: reduced ? undefined : smooth };
}

export type { MotionProps };
export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>;

/* ==========================================================================
   STORE GLYPHS — shared so the app CTAs stay visually identical everywhere.
   ========================================================================== */

export function AppleGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.9c0-2.4 1.96-3.55 2.05-3.6-1.12-1.64-2.86-1.86-3.48-1.89-1.48-.15-2.88.87-3.63.87-.75 0-1.9-.85-3.13-.83-1.61.02-3.1.94-3.93 2.38-1.67 2.9-.43 7.2 1.2 9.55.79 1.15 1.74 2.44 2.99 2.39 1.2-.05 1.65-.78 3.1-.78s1.86.78 3.13.75c1.29-.02 2.11-1.17 2.9-2.33.91-1.34 1.29-2.64 1.31-2.71-.03-.01-2.5-.96-2.51-3.8ZM14.7 5.6c.66-.8 1.11-1.92.99-3.03-.95.04-2.11.63-2.79 1.43-.61.7-1.15 1.83-1 2.91 1.06.08 2.14-.54 2.8-1.31Z" />
    </svg>
  );
}

export function PlayGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.6 1.8a1.2 1.2 0 0 0-.6 1.05v18.3a1.2 1.2 0 0 0 .6 1.05l10-10.2-10-10.2Zm11.4 9.05 2.9-2.95-13-6.62 10.1 9.57Zm0 2.3L4.9 22.72l13-6.62-2.9-2.95Zm5.2-2.6-3.3 3.35-3.3-3.35 3.3-3.35 3.3 3.35Z" />
    </svg>
  );
}
