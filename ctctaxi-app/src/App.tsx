import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { TrustStrip, Services } from './components/Sections';
import { AppDownloadStrip, TwoApps } from './components/Apps';
import { BackToTop } from './components/BackToTop';
import {
  Airport,
  Corporate,
  Safety,
  HowItWorks,
} from './components/BelowFold';
import { DriveWithCTC, LagosMap } from './components/AppDrive';
import {
  Testimonials,
  FAQ,
  Contact,
  FinalCTA,
  Footer,
  MobileBar,
  ScrollProgress,
} from './components/Close';
import { STRUCTURED_DATA } from './lib/data';

/**
 * Everything is imported statically on purpose.
 *
 * An earlier revision lazy-loaded the below-fold sections to shave ~30 kB off
 * the initial bundle. It also meant none of that copy appeared in the rendered
 * HTML, which is a bad trade for a marketing site that needs to rank for
 * "airport taxi Lagos" and friends.
 *
 * Code splitting still happens — Vite emits separate `react` and `motion`
 * vendor chunks (see build.rollupOptions.output.manualChunks), which is where
 * the real caching win is. Content stays in the main bundle so it renders
 * server-side and is indexable.
 */
export default function App() {
  /* Local-business structured data, injected after first paint so it never
     blocks rendering. */
  useEffect(() => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(STRUCTURED_DATA);
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="main">
        <Hero />
        <TrustStrip />
        <AppDownloadStrip />
        <Services />
        <TwoApps />
        <Airport />
        <Corporate />
        <Safety />
        <HowItWorks />
        <DriveWithCTC />
        <LagosMap />
        <Testimonials />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>

      <Footer />
      <MobileBar />
      <BackToTop />
    </>
  );
}