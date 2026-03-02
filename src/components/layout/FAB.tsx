import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CalendarCheck, Tag, Truck, X } from 'lucide-react';
import { fabVariants } from '../../motion';

const fabActions: Record<string, { label: string; icon: typeof CalendarCheck; to: string }[]> = {
  '/dashboard': [
    { label: 'Book Pickup', icon: CalendarCheck, to: '/pickup' },
    { label: 'Sell Items', icon: Tag, to: '/sell' },
  ],
  '/stylist': [
    { label: 'Request Delivery', icon: Truck, to: '/dashboard' },
    { label: 'Book Pickup', icon: CalendarCheck, to: '/pickup' },
  ],
  '/marketplace': [
    { label: 'Sell Items', icon: Tag, to: '/sell' },
    { label: 'Book Pickup', icon: CalendarCheck, to: '/pickup' },
  ],
};

export function FAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const actions = fabActions[location.pathname];
  if (!actions || location.pathname === '/') return null;

  return (
    <div className="lg:hidden fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2">
      {/* Action items */}
      <AnimatePresence>
        {open && actions.map((action, i) => (
          <motion.div
            key={action.label}
            variants={fabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2"
          >
            <span className="glass border border-white/10 px-3 py-1.5 rounded-lg text-sm text-white font-medium">
              {action.label}
            </span>
            <motion.button
              className="w-10 h-10 rounded-full glass border border-teal-400/40 text-teal-300 flex items-center justify-center hover:bg-teal-400/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              onClick={() => { navigate(action.to); setOpen(false); }}
              aria-label={action.label}
            >
              <action.icon className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center teal-glow shadow-2xl"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={open}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
