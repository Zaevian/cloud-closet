import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { successOverlayVariants, checkmarkVariants } from '../../motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
}

function generateConfetti(count: number): ConfettiPiece[] {
  const colors = ['#2dd4bf', '#00E5FF', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 0.8,
    size: 6 + Math.floor(Math.random() * 8),
  }));
}

const confettiPieces = generateConfetti(28);

interface SuccessOverlayProps {
  open: boolean;
  title: string;
  message: string;
  onClose?: () => void;
  autoClose?: number;
}

export function SuccessOverlay({ open, title, message, onClose, autoClose = 3000 }: SuccessOverlayProps) {
  useEffect(() => {
    if (!open || !autoClose) return;
    const timer = setTimeout(() => onClose?.(), autoClose);
    return () => clearTimeout(timer);
  }, [open, autoClose, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={successOverlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-navy-900/90 backdrop-blur-md" />

          {/* Confetti */}
          {confettiPieces.map(piece => (
            <motion.div
              key={piece.id}
              className="absolute top-0 rounded-sm pointer-events-none"
              style={{
                left: `${piece.x}%`,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{ y: '100vh', opacity: [1, 1, 0], rotate: 720 }}
              transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
            />
          ))}

          {/* Content */}
          <motion.div
            className="relative z-10 text-center px-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 280, delay: 0.1 } }}
          >
            {/* Checkmark circle */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-teal-400/20 teal-glow" />
              <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
                <circle cx="48" cy="48" r="44" stroke="#2dd4bf" strokeWidth="3" opacity="0.4" />
                <motion.path
                  d="M28 48 L42 62 L68 36"
                  stroke="#2dd4bf"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  variants={checkmarkVariants}
                  initial="initial"
                  animate="animate"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
            <p className="text-slate-300 text-lg max-w-sm mx-auto">{message}</p>

            {onClose && (
              <motion.button
                className="mt-8 px-6 py-2.5 glass border border-teal-400/40 text-teal-300 rounded-xl text-sm font-medium hover:bg-teal-400/10 transition-colors"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.8 } }}
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
