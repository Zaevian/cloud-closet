import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  if (hover || onClick) {
    return (
      <motion.div
        className={`glass rounded-2xl ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`}
        whileHover={hover ? { y: -4, scale: 1.02, transition: { duration: 0.2 } } : undefined}
        whileTap={onClick ? { scale: 0.97 } : undefined}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`glass rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
