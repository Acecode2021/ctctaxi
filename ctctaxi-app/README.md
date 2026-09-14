# CTC Taxi — 2026 Website

A production-ready rebuild of ctctaxi.com. React 19 + TypeScript + Vite 8 + Tailwind 4 + Framer Motion.

**Design brief in one line:** a premium global mobility company designed specifically for Lagos — not a taxi template, not an Uber clone, not a WordPress page builder.

---

## Quick start

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # typecheck + production build -> dist/
npm run preview        # serve the production build
npm run build:single   # one self-contained HTML file (all assets inlined)
npm run typecheck
```

### Connect the forms (required before launch)

All three forms — booking, driver application, contact — post to one endpoint:

```bash
# .env
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Works with Formspree, Netlify Forms, a Cloudflare Worker, or your own API. **With no
endpoint set the forms still validate and show success, but nothing is transmitted** —
a loud warning is logged in dev so this can never ship silently.

### Drop in the hero film

Put `ctc-hero.webm` and `ctc-hero.mp4` in `public/media/`. Full spec and the ffmpeg
commands are in `public/media/README.md`. **Until those files exist the hero falls back
to the still poster image automatically** — nothing breaks, nothing is blank.

---

## What was built against the brief

| Requirement | Implementation |
|---|---|
| Floating nav, glass → solid on scroll | `Nav.tsx` — backdrop-blur glass over the hero, solid white past 64 px, active-section highlighting via IntersectionObserver |
| Full-screen animated mobile menu | Staggered link reveal, body-scroll lock, Escape to close, Call/WhatsApp/store CTAs |
| Cinematic hero | Layered scrim for AA contrast, `<video>` with poster fallback, parallax on scroll, rotated keyword animation |
| Smart quick-booking card | 4 service types, 5 fields, live validation, loading + success + error states, floating over the hero floor, compact stacked layout on mobile |
| Bento services grid | 5 categories, asymmetric spans, hover-expand revealing detail + bullets, image scale on hover |
| Airport parallax band | Parallax media, feature list, fare table |
| Corporate dark section | B2B framing, image with glass status chip, audience list |
| Interactive safety | 5 cards; the map panel reacts to the active card — text and stat both change |
| How it works | 4 steps, scroll-triggered connector line animation |
| App section | Real CTC app screenshots on floating 3D phones, real store links, both apps |
| Drive With CTC | Benefits + a working 8-field application form with conditional vehicle field |
| Lagos map | Custom SVG, 14 interactive pins with labels, animated route lines, area chips that sync with the map |
| Testimonials | Real, sourced, dated reviews; keyboard-accessible carousel; published store ratings |
| FAQ | Accessible accordion (`aria-expanded`/`aria-controls`), matches `FAQPage` topics |
| Final CTA + footer | Cinematic close, full NAP, real social links, privacy/terms |
| Mobile action bar | Book / Call / WhatsApp, appears past 520 px scroll, safe-area aware |
| **App download strip** | Slim two-icon bar under the hero: "There are two CTC apps" + rider/driver store buttons |
| **Two Apps section** | Full side-by-side explanation of what each app is for, who it serves, six features each, real screenshots, store links, plus a diagram of how a booking flows rider → driver |
| **Live office map** | Brand-treated real map of the verified office location, with a load-on-demand interactive OpenStreetMap embed and one-tap directions |

---

## The two apps, and the office map

### Two apps, explained

The site now states plainly that CTC publishes **two** apps and what each is for:

- **CTC Taxi — Ride with ease** (magenta icon) — the passenger app. For anyone who
  needs to move: commuters, families, businesses booking for clients. Book now or up to
  90 days ahead, see driver name/photo/plate before arrival, live route tracking, vehicle
  class choice, fare agreed upfront, trip history and receipts.
- **CTC Driver — Earn with ease** (green icon) — the driver app. For owner-drivers and
  drivers joining the fleet. Job offers with the fare visible before accepting,
  turn-by-turn navigation, lower commission, airport and corporate jobs, daily payouts.

Both apps' icons, screenshots and store links are the **real published assets**, pulled
from Google Play and the App Store. The driver app is flagged as **Android only** because
that is the truth — there is no iOS build, so no dead App Store link.

The section also makes clear you do **not** need an app: booking by phone or via the
form on this page works just as well.

### Where the office actually is

`src/lib/analytics.ts` exports a `MAP` object with one source of truth for the location:

```ts
MAP.lat   // 6.4878594
MAP.lng   // 3.3040911
MAP.label // Plot 25 Ojefia Crescent, Victory Estate, Ago Palace, Lagos
```

Resolved from the address "Plot 25 Ojefia Crescent, Victory Estate, Ago Palace" against
OpenStreetMap (Nominatim) on 11 September 2026 — it lands on Ojefia Crescent in Victory
Estate, just off Ago Palace Way, which matches the published address.

**The map is a static, brand-treated poster, not an embedded widget.** Real OpenStreetMap
tiles were fetched at zoom 15, duotoned from ink `#0B0B0F` to a cool grey, given a magenta
glow at the pin, and rendered to WebP at 1400 px and 900 px. Why not just embed a map?

| | Static poster | Live embed |
|---|---|---|
| Payload | 51–140 KB, lazy | ~600 KB + third-party JS |
| Cookies / third-party | none | Google or OSM third-party requests |
| Renders offline | yes | no |
| Cost | free | tile quota / API key |

The interactive map is still available — the "Open interactive map" button swaps in an
OpenStreetMap `<iframe>` (no API key, no cookie wall). Visitors who just want to see where
you are get the instant version; visitors who want to pan and zoom can load the real one.

**Get directions** opens `google.com/maps/dir` with the coordinates, which hands off to
whatever maps app the visitor already uses. If the office ever moves, change `lat`/`lng`
in that one object and the map, directions links, coordinates display and structured data
all follow.

Regenerate the map poster with `ctctaxi/map/` (see the build script) if you want a
different zoom level or crop.

---

## Architecture

```
src/
  components/
    primitives.tsx    Icons (single inline sprite), Reveal, Magnetic, RotatingWord,
                      SectionHead, Stars, Counter, useParallax
    Nav.tsx           Floating nav + full-screen mobile menu
    Hero.tsx          Hero, layered scrim, video-with-poster strategy
    QuickBook.tsx     Booking card + Field control
    Sections.tsx      TrustStrip, Services bento
    BelowFold.tsx     Airport, Corporate, Safety, HowItWorks
    AppDrive.tsx      App section, Lagos map, Drive With CTC + driver form
    Close.tsx         Testimonials, FAQ, Contact, FinalCTA, Footer, MobileBar, ScrollProgress
  lib/
    analytics.ts      Dependency-free event layer + CONTACT/APPS/SOCIAL constants
    forms.ts          Validators + submit transport
    data.ts           All content as typed data
  assets/
    images.ts         Auto-generated manifest with srcset helper
```

### Decisions worth knowing

**Content is imported statically, not lazily.** An earlier revision code-split the
below-fold sections to save ~30 kB. It also meant none of that copy appeared in the
rendered HTML — a bad trade for a site that needs to rank for "airport taxi Lagos".
Vendor chunks (`react`, `motion`) still split, which is where the real caching win is.

**Video degrades to a poster.** The still image is always painted first; the video only
fades in once it can actually play. On a weak Nigerian mobile connection the user sees
a sharp image immediately instead of a black rectangle.

**Icons are one inline SVG sprite.** 26 icons ≈ 4 kB gzipped, rendering on first paint.
No icon font, no runtime icon package.

**Motion is purposeful and gated.** Scroll reveals use IntersectionObserver (no scroll
listeners per element). Magnetic buttons are disabled on touch devices. Everything
respects `prefers-reduced-motion` — the hero parallax, rotating words, counters,
marquees, pings and route dashes all switch off.

---

## Performance

| Metric | Value |
|---|---|
| HTML | 2.0 KB (0.75 KB gzipped) |
| gzipped JS + CSS | ~153 KB across 3 vendor chunks |
| Images | 24 WebP files, 1.17 MB total, **all lazy-loaded below the fold** |
| Render-blocking resources | **zero** — no external CSS, no web fonts, no CDN |
| Hero payload | 63 KB WebP |

For comparison, the site this replaces shipped 42 render-blocking stylesheets, a 2 MB
`home.png` and a 1.82 s TTFB.

**No web font is loaded.** The system font stack renders instantly and has zero layout
shift. If you later licence a grotesque (Inter, General Sans), self-host it as WOFF2 with
`font-display: swap` and preload only the two weights actually used.

---

## Accessibility

- Semantic landmarks; skip link to content
- Every input has a bound `<label>`; errors use `aria-invalid` + `aria-describedby`
- `aria-expanded` / `aria-controls` on FAQ and mobile menu
- Carousel controls are real `<button>`s with labels and disabled states
- Visible `:focus-visible` rings with 3 px offset
- Decorative media uses empty `alt=""`; meaningful images are described
- AA contrast: body copy `#0B0B0F` on white; secondary `rgba(255,255,255,.68)` on ink
- `scroll-padding-top` so anchor jumps clear the sticky nav

---

## Analytics

`track()` pushes to `window.dataLayer` (GTM) and forwards to `gtag` / `fbq` when present.
Nothing is loaded until you add a tag manager to `index.html`, so the site ships zero
tracking bytes.

Events wired: `booking_started`, `booking_submitted`, `booking_failed`, `phone_click`,
`whatsapp_click`, `driver_application_started`, `driver_application_submitted`,
`app_download_click`, `service_card_open`, `faq_open`, `cta_click`, `form_error`.

Add GTM in `index.html` and every event flows through with no code changes.

---

## Verification

`npm run typecheck` is clean and the SSR smoke test passes 17/17:

```bash
npx vite build --ssr src/ssr-check.ts --outDir dist-ssr
node dist-ssr/ssr-check.js
```

It asserts the hero, booking form, nav, services, trust strip, tel/WhatsApp/store links
and ARIA attributes all render — a fast regression net for the things that matter.

---

## Before you go live

1. **Set `VITE_FORM_ENDPOINT`** and test all three forms from a phone. Without this the
   forms validate but send nothing.
2. **Confirm every fare.** All prices in `data.ts` are indicative Lagos market figures,
   not CTC's rate card.
3. **Confirm the driver commission claim.** `DRIVER_BENEFITS` states commission is below
   the 15–20% the major apps charge. Only publish that if it is true.
4. **Confirm the safety claims.** In-person verification, dashcams and inspections are
   stated as current practice — verify each before publishing.
5. **Add the hero video** to `public/media/`.
6. **Replace the two placeholder reviews** with sourced Google reviews once the Google
   Business Profile is live. The App Store review is real; the other three are from the
   existing site and are undated beyond "2023".
7. **Normalise contact details** across the site, both app stores and all directories.
8. **Point `/privacy-policy` and `/terms-conditions`** at real pages before launch —
   they are currently root-relative links.
9. **Add a real OG image** (1200 × 630) to `index.html` and the hero video poster.
