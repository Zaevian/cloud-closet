import type { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 320 } },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.18 } },
};

export const toastVariants: Variants = {
  initial: { opacity: 0, x: 80, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', damping: 22, stiffness: 280 } },
  exit: { opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } },
};

export const fabVariants: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.15 } },
};

export const successOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const checkmarkVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.6, ease: 'easeInOut', delay: 0.2 }, opacity: { duration: 0.1 } },
  },
};

export const hoverLift = {
  whileHover: { y: -4, scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

export const pulseBuy = {
  animate: {
    scale: [1, 1.05, 0.96, 1],
    transition: { duration: 0.4 },
  },
};

export const springConfig = { type: 'spring', damping: 22, stiffness: 280 } as const;
