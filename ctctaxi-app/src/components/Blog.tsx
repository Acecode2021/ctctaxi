import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Reveal, SectionHead } from './primitives';
import { IMG, srcset } from '../assets/images';
import { POSTS, TAGS, type Post, type TagFilter } from '../lib/blog';
import { track } from '../lib/analytics';

/* ==========================================================================
   NEWSROOM — anchor: #blog  (linked from the nav as "Newsroom")

   Content lives in lib/blog.ts. Every post there carries a source URL and
   reads straight from the company's own releases and the national coverage
   of them. Nothing here is invented — see the header of lib/blog.ts.

   The card opens a slide-over rather than routing to another page. The site
   is a single page, and a client-side route would mean a server rewrite
   rule, a new bundle entry and a 404 risk on a marketing site that should
   not have one. If CTC later wants real article URLs for SEO, the post
   bodies are already structured for it — see the note in README.md.
   ========================================================================== */

const TAG_COLOURS: Record<string, string> = {
  Company: 'var(--color-brand)',
  Safety: '#7AC143',
  Expansion: '#3B82F6',
  Travel: '#F59E0B',
  Payments: '#8B5CF6',
  Fleet: '#06B6D4',
};

function Chip({ tag }: { tag: string }) {
  return (
    <span
      className="inline-flex items-center text-[0.66rem] font-bold tracking-[0.12em] uppercase"
      style={{
        color: tag === 'Safety' ? '#0b1a05' : '#fff',
        background: TAG_COLOURS[tag] ?? 'var(--color-brand)',
        borderRadius: 999,
        padding: '5px 11px',
      }}
    >
      {tag}
    </span>
  );
}

const BLOG_IMG = IMG as unknown as Record<string, string>;

function Cover({ post, priority = false }: { post: Post; priority?: boolean }) {
  if (!post.img) {
    /* Guide posts have no photograph — use a brand plate instead of a stock
       picture we do not have the rights to. */
    return (
      <div
        aria-hidden="true"
        className="w-full grid place-items-center"
        style={{
          aspectRatio: '16 / 9',
          background:
            'linear-gradient(140deg, rgba(219,20,123,.34), rgba(255,255,255,.04) 60%), #0b0b12',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,.5)' }}>
          <Icon name="shield" size={34} />
        </span>
      </div>
    );
  }
  return (
    <img
      src={BLOG_IMG[`blog_${post.img}_760`]}
      srcSet={srcset(`blog_${post.img}`)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt=""
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className="w-full block object-cover"
      style={{ aspectRatio: '16 / 9' }}
    />
  );
}

function PostCard({
  post,
  onOpen,
  delay = 0,
  feature = false,
}: {
  post: Post;
  onOpen: (p: Post) => void;
  delay?: number;
  feature?: boolean;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className="h-full flex flex-col overflow-hidden"
        style={{
          background: '#fff',
          border: '1px solid var(--color-line)',
          borderRadius: 24,
        }}
      >
        <div className="relative overflow-hidden">
          <Cover post={post} priority={feature} />
          <div className="absolute top-4 left-4">
            <Chip tag={post.tag} />
          </div>
        </div>

        <div className="flex flex-col flex-1 p-6">
          <p
            className="text-[0.72rem] font-bold tracking-[0.14em] uppercase"
            style={{ color: 'var(--color-fg-3)' }}
          >
            {post.date}
          </p>
          <h3
            className="mt-3 font-semibold text-fg"
            style={{
              fontSize: feature ? '1.4rem' : '1.14rem',
              letterSpacing: '-0.025em',
              lineHeight: 1.22,
              marginTop: 12,
            }}
          >
            {post.title}
          </h3>
          <p
            className="mt-3 text-[0.9rem] leading-relaxed flex-1"
            style={{ color: 'var(--color-fg-2)', marginTop: 12 }}
          >
            {post.excerpt}
          </p>

          <div
            className="mt-6 flex items-center justify-between gap-4"
            style={{ borderTop: '1px solid var(--color-line)', paddingTop: 18, marginTop: 24 }}
          >
            <button
              type="button"
              onClick={() => onOpen(post)}
              className="inline-flex items-center gap-2 font-semibold text-[0.88rem]"
              style={{ color: 'var(--color-brand)' }}
            >
              Read story
              <Icon name="arrow-right" size={16} />
            </button>
            <a
              href={post.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.72rem] hover:underline"
              style={{ color: 'var(--color-fg-3)' }}
              onClick={() => track('blog_source_click', { slug: post.slug, from: 'card' })}
            >
              {post.source.label}
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Reader({ post, onClose }: { post: Post; onClose: () => void }) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(8,8,12,.72)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      <motion.article
        className="absolute inset-y-0 right-0 w-full overflow-y-auto"
        style={{ maxWidth: 720, background: '#fff' }}
        initial={reduced ? { opacity: 0 } : { x: '100%' }}
        animate={reduced ? { opacity: 1 } : { x: 0 }}
        exit={reduced ? { opacity: 0 } : { x: '100%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative">
          <Cover post={post} priority />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close story"
            className="absolute top-5 right-5 grid place-items-center rounded-full"
            style={{
              width: 44,
              height: 44,
              background: 'rgba(8,8,12,.72)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Icon name="x" size={19} />
          </button>
        </div>

        <div className="p-7 sm:p-10">
          <div className="flex items-center gap-3 flex-wrap">
            <Chip tag={post.tag} />
            <span
              className="text-[0.74rem] font-bold tracking-[0.14em] uppercase"
              style={{ color: 'var(--color-fg-3)' }}
            >
              {post.date}
            </span>
          </div>

          <h2
            className="mt-5 font-semibold text-fg"
            style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.3rem)', letterSpacing: '-0.032em', lineHeight: 1.1, marginTop: 20 }}
          >
            {post.title}
          </h2>

          <div className="mt-7 space-y-5" style={{ marginTop: 28 }}>
            {post.body.map((para, i) => (
              <p
                key={i}
                className="text-[1rem] leading-relaxed"
                style={{ color: 'var(--color-fg-2)' }}
              >
                {para}
              </p>
            ))}
          </div>

          <div
            className="mt-9"
            style={{
              marginTop: 36,
              borderTop: '1px solid var(--color-line)',
              paddingTop: 22,
            }}
          >
            <p className="text-[0.78rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--color-fg-3)' }}>
              Source
            </p>
            <a
              href={post.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-[0.9rem]"
              style={{ color: 'var(--color-brand)', marginTop: 8 }}
              onClick={() => track('blog_source_click', { slug: post.slug })}
            >
              {post.source.label}
              <Icon name="arrow-right" size={15} />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3" style={{ marginTop: 32 }}>
            <a href="#book" className="btn btn--brand" onClick={onClose}>
              Book a Ride
            </a>
            <button type="button" className="btn btn--outline" onClick={onClose}>
              Back to stories
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

/* ==========================================================================
   FROM OUR CHANNELS

   Real photographs pulled from CTC's own YouTube channel (@ctctaxii) and the
   group's Blow Money Records channel. Each tile links to the video it came
   from so a reader can check it.

   These are NOT stock and NOT generated. Instagram (@ctctaxi) and Facebook
   (facebook.com/Ctctaxi) are login-walled and could not be scraped — do not
   claim any of these came from those accounts.
   ========================================================================== */

type Shot = { img: string; caption: string; video: string; label: string };

const SHOTS: Shot[] = [
  {
    img: 'fleet',
    caption: 'A CTC car in company livery — white with the green and magenta band.',
    video: 'https://www.youtube.com/watch?v=HEzqil_YeQk',
    label: 'Go On A Safe And Affordable Trip With CTC Taxi',
  },
  {
    img: 'support',
    caption: 'A CTC support agent on shift at the Lagos office.',
    video: 'https://www.youtube.com/watch?v=netW-89fw5U',
    label: 'Drive And Earn With CTC Taxi And Maintain Your Freedom',
  },
  {
    img: 'office',
    caption: 'Riders being looked after at the CTC office.',
    video: 'https://www.youtube.com/watch?v=6n7e7Y87Q1Y',
    label: 'Your Ride Experience Is Limitless With CTC Taxi',
  },
  {
    img: 'staff',
    caption: 'The CTC team, on camera in their own boardroom.',
    video: 'https://www.youtube.com/watch?v=NODhbb9A6lc',
    label: 'Upgrade Your Ride Experience Today with CTC Taxi',
  },
  {
    img: 'uganda',
    caption: 'Inside the Uganda partnership meeting at the group headquarters.',
    video: 'https://www.youtube.com/watch?v=awNtgGnWYhE',
    label: 'CTC Taxi and BlowPay Set to Launch in Uganda',
  },
  {
    img: 'brand',
    caption: 'The mark, the livery and Lagos — from the CTC Taxi brand film.',
    video: 'https://www.youtube.com/watch?v=ptC2RIPt6Ug',
    label: 'CTC Taxi: Your Perfect Taxi Ride Is In Town',
  },
];

function FromOurChannels() {
  return (
    <div style={{ marginTop: 72 }}>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow text-brand">From our channels</span>
            <h3
              className="font-semibold text-fg mt-4"
              style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.95rem)', letterSpacing: '-0.03em', marginTop: 16 }}
            >
              Straight from the fleet.
            </h3>
            <p className="lede mt-3" style={{ marginTop: 12 }}>
              CTC Taxi's own YouTube channel (@ctctaxii) and the group's Blow Money Records channel are the source of these photographs. Every tile links to the video it came from so you can check it.
            </p>
            <p className="lede mt-3" style={{ marginTop: 12 }}>
            </p>
          </div>
          <a
            href="https://www.youtube.com/@ctctaxii"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline btn--sm"
            onClick={() => track('blog_source_click', { slug: 'youtube_channel' })}
          >
            Watch on YouTube
            <Icon name="arrow-right" size={15} />
          </a>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" style={{ marginTop: 32 }}>
        {SHOTS.map((sh, i) => (
          <Reveal key={sh.img} delay={0.04 + i * 0.05}>
            <a
              href={sh.video}
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative overflow-hidden"
              style={{ borderRadius: 20, background: '#0b0b12' }}
              onClick={() => track('blog_source_click', { slug: `channel_${sh.img}` })}
            >
              <img
                src={BLOG_IMG[`social_${sh.img}_760`]}
                srcSet={srcset(`social_${sh.img}`)}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                alt={sh.caption}
                loading="lazy"
                decoding="async"
                className="w-full block object-cover"
                style={{ aspectRatio: '16 / 9' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(8,8,12,.88) 0%, rgba(8,8,12,.12) 46%, rgba(8,8,12,0) 70%)',
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-white text-[0.86rem] font-medium leading-snug">{sh.caption}</p>
                <span
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold"
                  style={{ color: 'rgba(255,255,255,.62)', marginTop: 8 }}
                >
                  <Icon name="play" size={13} />
                  {sh.label}
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Blog() {
  const [filter, setFilter] = useState<TagFilter>('All');
  const [open, setOpen] = useState<Post | null>(null);

  const shown = useMemo(
    () => (filter === 'All' ? POSTS : POSTS.filter((p) => p.tag === filter)),
    [filter],
  );

  const openPost = (p: Post) => {
    setOpen(p);
    track('blog_open', { slug: p.slug, tag: p.tag });
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: POSTS.length };
    for (const p of POSTS) c[p.tag] = (c[p.tag] ?? 0) + 1;
    return c;
  }, []);

  return (
    <section id="blog" className="section" style={{ background: 'var(--color-sand)' }}>
      <div className="shell">
        <SectionHead
          eyebrow="Newsroom"
          title={
            <>
              News From
              <br />
              The Fleet.
            </>
          }
          lede="Fleet upgrades, expansion plans and the announcements we have made. Every story links to where it was published."
          action={
            <span
              className="hidden md:inline-flex items-center gap-2 text-[0.82rem] font-medium"
              style={{ color: 'var(--color-fg-3)' }}
            >
              <span style={{ color: '#7AC143' }}>
                <Icon name="check" size={15} />
              </span>
              {POSTS.length} stories, all sourced
            </span>
          }
        />

        {/* ---------------- filters ---------------- */}
        <Reveal>
          <div
            className="mt-10 flex flex-wrap gap-2.5"
            style={{ marginTop: 40 }}
            role="group"
            aria-label="Filter stories by topic"
          >
            {TAGS.map((t) => {
              const active = filter === t;
              const n = counts[t] ?? 0;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setFilter(t);
                    track('blog_filter', { tag: t });
                  }}
                  aria-pressed={active}
                  disabled={n === 0}
                  className="text-[0.84rem] font-semibold transition-colors"
                  style={{
                    color: active ? '#fff' : n === 0 ? 'var(--color-fg-3)' : 'var(--color-fg-2)',
                    background: active ? 'var(--color-ink)' : '#fff',
                    border: `1px solid ${active ? 'var(--color-ink)' : 'var(--color-line)'}`,
                    borderRadius: 999,
                    padding: '10px 17px',
                    opacity: n === 0 ? 0.45 : 1,
                    cursor: n === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {t}
                  <span style={{ opacity: 0.5, marginLeft: 7 }}>{n}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ---------------- grid ---------------- */}
        <div className="mt-10" style={{ marginTop: 40 }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {shown.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
                  className={p.featured && filter === 'All' ? 'md:col-span-2 xl:col-span-1' : ''}
                >
                  <PostCard post={p} onOpen={openPost} delay={0} feature={Boolean(p.featured) && filter === 'All'} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <FromOurChannels />

        {/* ---------------- closing note ---------------- */}
        <Reveal delay={0.1}>
          <div
            className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            style={{
              marginTop: 48,
              background: '#fff',
              border: '1px solid var(--color-line)',
              borderRadius: 24,
              padding: '26px 28px',
            }}
          >
            <div>
              <h3 className="font-semibold text-fg" style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                Want this on the record?
              </h3>
              <p className="text-[0.9rem] mt-1.5" style={{ color: 'var(--color-fg-2)' }}>
                Press, partnerships and corporate enquiries all go through one desk.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="#contact"
                className="btn btn--brand"
                onClick={() => track('cta_click', { cta: 'blog_press' })}
              >
                Contact the desk
              </a>
              <a href="#book" className="btn btn--outline">
                Book a Ride
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>{open && <Reader post={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
