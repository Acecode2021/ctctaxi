import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav'; // Assuming Nav is in components
import { Footer, MobileBar, ScrollProgress } from './components/Close';
import { BackToTop } from './components/BackToTop';

// Import your new pages
import Home from './pages/home';
import Services from './pages/services';
import Drive from './pages/drive';
import About from './pages/About';
import Contact from './pages/Contact';
import Newsroom from './pages/Newsroom';
import PrivacyPolicy from './pages/privacypolicy';


function RouteScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) target.scrollIntoView();
      else window.scrollTo({ top: 0 });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <RouteScroll />
      <Nav />
      <MobileBar />
      
      {/* The Router */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/drive" element={<Drive />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/newsroom" element={<Newsroom />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<main className="shell min-h-screen pt-32"><h1 className="h2">Page not found</h1><a className="btn btn--brand mt-6" href="/">Return home</a></main>} />
      </Routes>

      <Footer />
      <BackToTop />
    </>
  );
}