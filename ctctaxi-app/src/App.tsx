import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { TrustStrip, Services } from './components/Sections';
import { AppDownloadStrip, TwoApps } from './components/Apps';
import { DriveWithCTC, CeoAbout } from './components/AppDrive';
import { Blog } from './components/Blog';
import { BackToTop } from './components/BackToTop';
import {
  Airport,
  Corporate,
  Safety,
  HowItWorks,
} from './components/BelowFold';
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

export default function App() {
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
        <CeoAbout />
        <Testimonials />
        <FAQ />
        <Contact />
        <Blog />
        <FinalCTA />
      </main>

      <Footer />
      <MobileBar />
      <BackToTop />
    </>
  );
}