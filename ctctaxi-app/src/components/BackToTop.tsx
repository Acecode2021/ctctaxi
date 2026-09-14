import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Icon } from './primitives';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={reduced ? false : { opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduced ? undefined : { scale: 1.06 }}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          className="grid place-items-center rounded-full"
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            width: 48,
            height: 48,
            zIndex: 40,
            background: 'var(--color-brand)',
            color: '#fff',
            border: '1px solid rgba(0,0,0,.06)',
            boxShadow: '0 12px 32px rgba(0,0,0,.24)',
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'inline-flex', transform: 'rotate(-90deg)' }}>
            <Icon name="arrow-right" size={20} />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}