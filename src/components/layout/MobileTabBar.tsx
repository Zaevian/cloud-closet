import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, ShoppingBag, User, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/AppStoreContext';
import { GetBagButton } from '../shared/GetBag';

const tabs = [
  { to: '/dashboard', label: 'Closet', icon: LayoutDashboard },
  { to: '/fit-planner', label: 'Planner', icon: CalendarDays },
  { to: '/marketplace', label: 'Shop', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: User },
];

export function MobileTabBar() {
  const location = useLocation();
  const { state } = useAppStore();
  const [bagOpen, setBagOpen] = useState(false);
  const bagCount = state.getBag.length;

  if (location.pathname === '/') return null;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-zinc-800 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-colors relative"
                aria-label={label}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-white/8 rounded-xl border border-zinc-600"
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-colors relative z-10 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span className={`text-xs font-medium relative z-10 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                  {label}
                </span>
              </NavLink>
            );
          })}

          {/* Send to Me Bag tab */}
          <button
            onClick={() => setBagOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-colors relative"
            aria-label="Send to Me Bag"
          >
            <div className="relative">
              <Package className="w-5 h-5 text-zinc-500" />
              {bagCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center">
                  {bagCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-zinc-500">Bag</span>
          </button>
        </div>
      </nav>

      {/* GetBag drawer triggered from tab bar */}
      <AnimatePresence>
        {bagOpen && (
          <div className="lg:hidden">
            <GetBagButton forceOpen onForceClose={() => setBagOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
