import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Icon } from './primitives';

const BT_CSS = `
.btt-btn {
  position: fixed;
  right: 16px;
  /* clears the mobile Call / WhatsApp / Book bar */
  bottom: calc(88px + env(safe-area-inset-bottom, 0px));
  z-index: 30;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background: var(--color-brand);
  color: #fff;
  border: 1px solid rgba(0,0,0,.06);
  box-shadow: 0 10px 28px rgba(0,0,0,.22);
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}
.btt-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

@media (min-width: 640px) {
  .btt-btn {
    right: 22px;
    bottom: calc(22px + env(safe-area-inset-bottom, 0px));
    width: 50px;
    height: 50px;
  }
}

@media (min-width: 1024px) {
  .btt-btn {
    right: 32px;
    bottom: calc(32px + env(safe-area-inset-bottom, 0px));
    width: 54px;
    height: 54px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .btt-btn { transition: none !important; }
}
`;

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <>
      <style>{BT_CSS}</style>
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
            className="btt-btn"
          >
            <span style={{ display: 'inline-flex', transform: 'rotate(-90deg)' }}>
              <Icon name="arrow-right" size={18} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}