import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Ruler, ShoppingBag, Package, CalendarDays, RotateCcw, ChevronRight, Cloud, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/AppStoreContext';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { staggerContainer, staggerChild } from '../motion';
import { formatDate } from '../utils/format';

export function Profile() {
  const { state, dispatch } = useAppStore();
  const { user, closet, marketplace } = state;

  const storedCount = closet.filter(i => i.status === 'stored').length;
  const listedCount = closet.filter(i => i.status === 'listed').length;
  const marketplaceListings = marketplace.filter(l => l.sellerId === user.id).length;

  function handleReset() {
    if (window.confirm('Reset the demo to its initial state? All your changes will be lost.')) {
      dispatch({ type: 'RESET_STATE' });
    }
  }

  const planLabel = user.plan === 'beta-40' ? 'Beta Standard (40 lbs)' : 'Beta Premium (80 lbs)';

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
          <p className="text-zinc-400">Manage your account and Cloud Closet preferences</p>
        </motion.div>

        <div className="space-y-5">
          {/* User card */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-18 h-18 rounded-2xl border-2 border-zinc-600 object-cover"
                  style={{ width: 72, height: 72 }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/avatar/72/72'; }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-[#0a0a0a] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-zinc-400 text-sm">{user.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Beta Customer
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {planLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Mail, label: 'Email', value: user.email },
                { icon: Phone, label: 'Phone', value: user.phone },
                { icon: MapPin, label: 'Address', value: user.address },
                { icon: CalendarDays, label: 'Member Since', value: formatDate(user.joinedDate) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl">
                  <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="text-sm text-white truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-400" />
              Closet Stats
            </h3>
            <motion.div
              className="grid grid-cols-3 gap-3"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                { label: 'Total Items', value: closet.length, color: 'text-white' },
                { label: 'In Storage', value: storedCount, color: 'text-zinc-200' },
                { label: 'Listed', value: listedCount + marketplaceListings, color: 'text-zinc-300' },
              ].map(stat => (
                <motion.div key={stat.label} variants={staggerChild} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
                  <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Size Profile */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-zinc-400" />
              Size Profile
              <span className="ml-auto text-xs text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Used for AI matching
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Shirt', value: user.sizeProfile.shirtSize },
                { label: 'Waist', value: `${user.sizeProfile.waist}"` },
                { label: 'Inseam', value: `${user.sizeProfile.inseam}"` },
                { label: 'Shoes', value: `US ${user.sizeProfile.shoeSize}` },
                ...(user.sizeProfile.dressSize ? [{ label: 'Dress', value: user.sizeProfile.dressSize }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { to: '/dashboard', icon: Package, label: 'My Cloud Closet', desc: `${closet.length} items` },
                { to: '/fit-planner', icon: CalendarDays, label: 'Fit Planner', desc: 'Plan your weekly outfits' },
                { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace', desc: `${marketplace.length} items available` },
                { to: '/pricing', icon: Cloud, label: 'My Plan', desc: planLabel },
              ].map(({ to, icon: Icon, label, desc }) => (
                <Link key={to} to={to}>
                  <motion.div
                    className="flex items-center gap-4 px-4 py-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-xl cursor-pointer transition-colors"
                    whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-700 border border-zinc-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-zinc-500">{desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Closet Items */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Recently Added</h3>
              <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">View all</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {closet.slice(0, 8).map(item => (
                <Link key={item.id} to="/dashboard" className="shrink-0">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden group">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/64/80`; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h3 className="font-semibold text-white mb-4">Wardrobe Breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {(['shirt', 'pants', 'jacket', 'dress', 'shoes', 'accessories', 'socks', 'underwear'] as const).map(cat => {
                const count = closet.filter(i => i.category === cat).length;
                if (count === 0) return null;
                return (
                  <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg">
                    <Badge type="category" value={cat} />
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-white mb-2">Demo Controls</h3>
            <p className="text-sm text-zinc-500 mb-4">Reset the demo to its original state with all 40 items and marketplace listings restored.</p>
            <Button
              variant="danger"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleReset}
            >
              Reset Demo State
            </Button>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
