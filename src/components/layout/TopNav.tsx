import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, LayoutDashboard, CalendarDays, ShoppingBag, Tag, HelpCircle, DollarSign, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/AppStoreContext';
import { GetBagButton } from '../shared/GetBag';

const navItems = [
  { to: '/dashboard', label: 'My Closet', icon: LayoutDashboard },
  { to: '/fit-planner', label: 'Fit Planner', icon: CalendarDays },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/sell', label: 'Sell', icon: Tag },
  { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
  { to: '/pricing', label: 'Pricing', icon: DollarSign },
];

export function TopNav() {
  const location = useLocation();
  const { state } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === '/';

  if (isLanding) return null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">Cloud Closet</span>
            </NavLink>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white border border-zinc-600'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <GetBagButton />
              </div>
              <NavLink
                to="/profile"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                aria-label="Profile"
              >
                <img
                  src={state.user.avatarUrl}
                  alt={state.user.name}
                  className="w-7 h-7 rounded-full border border-zinc-600"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/avatar/40/40'; }}
                />
                <span className="text-sm text-zinc-300">{state.user.name.split(' ')[0]}</span>
              </NavLink>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <motion.div
            className="lg:hidden border-t border-zinc-800 px-4 py-3 space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="pb-2">
              <GetBagButton />
            </div>
            {[...navItems, { to: '/profile', label: 'Profile', icon: User }].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </header>
    </>
  );
}
