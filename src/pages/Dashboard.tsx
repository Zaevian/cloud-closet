import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid3X3, List, ShoppingBag, Tag, X, Cloud, RotateCcw, XCircle, Truck, Sun, Moon, Sunrise, Home, Package, Sparkles, ArrowUpRight, Shirt } from 'lucide-react';
import { useAppStore } from '../store/AppStoreContext';
import { PageShell } from '../components/layout/PageShell';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { ConditionMeter } from '../components/shared/ConditionMeter';
import { staggerContainer, staggerChild } from '../motion';
import type { ClothingItem, ClothingCategory } from '../types';
import { formatRelativeDate } from '../utils/format';
import { useNavigate } from 'react-router-dom';

const CATEGORIES: { value: ClothingCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'shirt', label: 'Shirts' },
  { value: 'pants', label: 'Pants' },
  { value: 'jacket', label: 'Jackets' },
  { value: 'dress', label: 'Dresses' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'socks', label: 'Socks' },
  { value: 'underwear', label: 'Underwear' },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'stored', label: 'In Cloud' },
  { value: 'at-home', label: 'At Home' },
  { value: 'delivering', label: 'On the Way' },
  { value: 'listed', label: 'Listed' },
];

function statusBadge(status: string) {
  if (status === 'stored') return 'bg-zinc-800 text-zinc-300 border-zinc-700';
  if (status === 'at-home') return 'bg-sky-950 text-sky-300 border-sky-800';
  if (status === 'delivering') return 'bg-amber-950 text-amber-300 border-amber-800';
  if (status === 'listed') return 'bg-purple-950 text-purple-300 border-purple-800';
  return 'bg-zinc-800 text-zinc-400 border-zinc-700';
}

function statusLabel(status: string) {
  if (status === 'stored') return 'In Cloud';
  if (status === 'at-home') return 'At Home';
  if (status === 'delivering') return 'On the Way';
  if (status === 'listed') return 'Listed';
  return status;
}

export function Dashboard() {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ClothingCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return state.closet.filter(item => {
      const matchSearch = search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.color.toLowerCase().includes(search.toLowerCase()) ||
        (item.brand ?? '').toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || item.category === category;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [state.closet, search, category, statusFilter]);

  const stats = useMemo(() => ({
    total: state.closet.length,
    stored: state.closet.filter(i => i.status === 'stored').length,
    atHome: state.closet.filter(i => i.status === 'at-home').length,
    delivering: state.closet.filter(i => i.status === 'delivering').length,
  }), [state.closet]);

  function handleToggleGetBag(item: ClothingItem) {
    dispatch({ type: 'TOGGLE_GET_BAG', payload: item.id });
  }

  function handleCancelDelivery(item: ClothingItem) {
    const order = state.deliveryOrders.find(o => o.itemIds.includes(item.id) && o.status === 'confirmed');
    if (order) {
      dispatch({ type: 'CANCEL_DELIVERY', payload: { itemId: item.id, orderId: order.id } });
    }
  }

  function handleSellFromModal() {
    if (!selectedItem) return;
    navigate('/sell', { state: { item: selectedItem } });
    setSelectedItem(null);
  }

  const isInBag = (id: string) => state.getBag.some(b => b.itemId === id);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? { label: 'Working late', Icon: Moon } :
    hour < 12 ? { label: 'Good morning', Icon: Sunrise } :
    hour < 18 ? { label: 'Good afternoon', Icon: Sun } :
    { label: 'Good evening', Icon: Moon };
  const GreetingIcon = greeting.Icon;

  // Percentage helper
  const pct = (n: number) => stats.total === 0 ? 0 : Math.round((n / stats.total) * 100);
  const storedPct = pct(stats.stored);
  const homePct = pct(stats.atHome);
  const deliveringPct = pct(stats.delivering);

  // Category counts for the strip
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    state.closet.forEach(i => { counts[i.category] = (counts[i.category] ?? 0) + 1; });
    return counts;
  }, [state.closet]);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== EDITORIAL HERO ===== */}
        <section className="relative mb-10">
          {/* Ambient gradient backdrop */}
          <div aria-hidden className="absolute -top-20 -left-20 w-[480px] h-[320px] bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute top-10 right-0 w-[360px] h-[260px] bg-gradient-to-tl from-sky-500/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            {/* Greeting badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm mb-5">
              <GreetingIcon className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-medium text-zinc-300">
                {greeting.label}, <span className="text-white font-semibold">{state.user.name.split(' ')[0]}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="text-xs text-zinc-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Editorial heading */}
            <div className="flex items-end gap-4 flex-wrap">
              <h1 className="font-black text-white tracking-tight leading-[0.95]">
                <span className="block text-5xl sm:text-6xl lg:text-7xl">
                  <span className="font-extralight italic text-zinc-400">My</span> Closet
                </span>
              </h1>
              <p className="text-zinc-500 text-sm max-w-md pb-2">
                Curated, climate-controlled, and one tap away. <span className="text-zinc-300">{stats.total} pieces</span> in your care.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ===== STATS DASHBOARD ===== */}
        <motion.section
          className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Hero stat card — Total + distribution */}
          <motion.div variants={staggerChild} className="lg:col-span-6 relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-800/80 via-zinc-900 to-black border border-zinc-800 p-6 group hover:border-zinc-700 transition-colors">
            {/* Decorative grid pattern */}
            <div aria-hidden className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            {/* Glow */}
            <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.05] rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">Wardrobe Total</p>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <motion.span
                    key={stats.total}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl sm:text-7xl font-black text-white tracking-tighter tabular-nums leading-none"
                  >
                    {stats.total}
                  </motion.span>
                  <span className="text-zinc-500 text-sm font-medium">pieces</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-900/60">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Live</span>
              </div>
            </div>

            {/* Segmented distribution bar */}
            <div className="relative">
              <div className="flex items-center gap-1 h-2.5 rounded-full overflow-hidden bg-zinc-800">
                {stats.stored > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${storedPct}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-zinc-300 to-zinc-100 rounded-full"
                  />
                )}
                {stats.atHome > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${homePct}%` }}
                    transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-300 rounded-full"
                  />
                )}
                {stats.delivering > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveringPct}%` }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                  />
                )}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-100" />
                  <span className="text-xs text-zinc-400"><span className="text-white font-bold">{stats.stored}</span> in Cloud <span className="text-zinc-600">· {storedPct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-xs text-zinc-400"><span className="text-white font-bold">{stats.atHome}</span> At Home <span className="text-zinc-600">· {homePct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-zinc-400"><span className="text-white font-bold">{stats.delivering}</span> Delivering <span className="text-zinc-600">· {deliveringPct}%</span></span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side stat tiles */}
          {[
            {
              label: 'In Cloud Storage',
              value: stats.stored,
              percent: storedPct,
              Icon: Cloud,
              tint: 'from-zinc-700/30 to-zinc-800/0',
              iconBg: 'bg-zinc-800 border-zinc-700',
              iconColor: 'text-zinc-200',
              barColor: 'bg-zinc-200',
              accent: 'text-zinc-300',
            },
            {
              label: 'At Your Home',
              value: stats.atHome,
              percent: homePct,
              Icon: Home,
              tint: 'from-sky-900/20 to-zinc-900/0',
              iconBg: 'bg-sky-950 border-sky-900',
              iconColor: 'text-sky-300',
              barColor: 'bg-sky-400',
              accent: 'text-sky-300',
            },
            {
              label: 'On the Way',
              value: stats.delivering,
              percent: deliveringPct,
              Icon: Truck,
              tint: 'from-amber-900/20 to-zinc-900/0',
              iconBg: 'bg-amber-950 border-amber-900',
              iconColor: 'text-amber-300',
              barColor: 'bg-amber-400',
              accent: 'text-amber-300',
            },
          ].map(s => (
            <motion.div
              key={s.label}
              variants={staggerChild}
              className={`lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br ${s.tint} bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-700 transition-all hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-2xl ${s.iconBg} border flex items-center justify-center`}>
                  <s.Icon className={`w-5 h-5 ${s.iconColor}`} strokeWidth={2} />
                </div>
                <span className={`text-[10px] font-bold ${s.accent} tabular-nums`}>{s.percent}%</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-4xl font-black text-white tracking-tight tabular-nums leading-none">{s.value}</span>
                <span className="text-zinc-600 text-xs">/ {stats.total}</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mb-3">{s.label}</p>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.percent}%` }}
                  transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                  className={`h-full ${s.barColor} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ===== CATEGORY QUICK STRIP ===== */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">Browse by category</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
            {CATEGORIES.filter(c => c.value === 'all' || (categoryCounts[c.value] ?? 0) > 0).map(c => {
              const count = c.value === 'all' ? stats.total : (categoryCounts[c.value] ?? 0);
              const active = category === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`flex-shrink-0 group flex items-center gap-2 pl-3 pr-2 py-2 rounded-full border text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  {c.value === 'all' && <Package className="w-3.5 h-3.5" />}
                  {(c.value === 'shirt' || c.value === 'jacket' || c.value === 'dress') && <Shirt className="w-3.5 h-3.5" />}
                  <span>{c.label}</span>
                  <span className={`min-w-[20px] text-center text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                    active ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="Search by name, color, brand…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white" onClick={() => setSearch('')}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${showFilters ? 'border-zinc-500 text-white bg-zinc-800' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700'}`}
              onClick={() => setShowFilters(v => !v)}
            >
              <Filter className="w-4 h-4" /> Filters
              {(category !== 'all' || statusFilter !== 'all') && <span className="w-2 h-2 rounded-full bg-white" />}
            </button>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <button
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${category === c.value ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setStatusFilter(s.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${statusFilter === s.value ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                {(category !== 'all' || statusFilter !== 'all') && (
                  <button
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
                    onClick={() => { setCategory('all'); setStatusFilter('all'); }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500">
            {loading ? 'Loading…' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
            {(search || category !== 'all' || statusFilter !== 'all') && !loading && ' matching your filters'}
          </p>
        </div>

        {/* Grid / List */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Cloud className="w-8 h-8" />}
            title="No items found"
            message={search ? `No clothes match "${search}".` : 'No items match your current filters.'}
            action={
              <Button variant="secondary" onClick={() => { setSearch(''); setCategory('all'); setStatusFilter('all'); }}>
                Clear Filters
              </Button>
            }
          />
        ) : viewMode === 'grid' ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filtered.map(item => {
              const inBag = isInBag(item.id);
              return (
                <motion.div
                  key={item.id}
                  variants={staggerChild}
                  className={`relative bg-zinc-900 border rounded-2xl overflow-hidden cursor-pointer transition-all group ${inBag ? 'border-white/30 ring-1 ring-white/20' : 'border-zinc-800 hover:border-zinc-600'}`}
                  onClick={() => setSelectedItem(item)}
                >
                  {inBag && (
                    <div className="absolute inset-0 bg-white/4 pointer-events-none z-10 rounded-2xl" />
                  )}
                  <div className="relative aspect-square overflow-hidden">
                    <img src={item.imageUrl} alt={item.imageAlt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/300/300`; }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    {inBag && (
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-black">In Bag</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white font-semibold text-xs truncate">{item.name}</p>
                    <p className="text-zinc-600 text-[10px] mt-0.5">{item.color} · {item.size}</p>
                    <div className="mt-2">
                      <ConditionMeter condition={item.condition} score={item.conditionScore} defects={item.defects} inspectedDate={item.inspectedDate} compact />
                    </div>
                    <div className="mt-2.5 flex flex-col gap-1.5" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1.5">
                        {item.status === 'delivering' ? (
                          <button
                            onClick={() => handleCancelDelivery(item)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold bg-red-950 border border-red-800 text-red-300 hover:bg-red-900 transition-colors"
                          >
                            <XCircle size={11} /> Cancel
                          </button>
                        ) : item.status === 'stored' ? (
                          <button
                            onClick={() => handleToggleGetBag(item)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
                              inBag
                                ? 'bg-white text-black hover:bg-zinc-200'
                                : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                            }`}
                          >
                            <ShoppingBag size={11} />
                            {inBag ? 'In Bag' : 'Send to me'}
                          </button>
                        ) : (
                          <div className="flex-1" />
                        )}
                        <button
                          onClick={() => { setSelectedItem(item); }}
                          className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => navigate('/sell', { state: { item } })}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Tag size={11} /> Sell
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div className="space-y-2" variants={staggerContainer} initial="initial" animate="animate">
            {filtered.map(item => {
              const inBag = isInBag(item.id);
              return (
                <motion.div
                  key={item.id}
                  variants={staggerChild}
                  layout
                  className={`bg-zinc-900 rounded-xl p-4 flex items-center gap-4 cursor-pointer border transition-all ${inBag ? 'border-white/25 ring-1 ring-white/10' : 'border-zinc-800 hover:border-zinc-600'}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <img src={item.imageUrl} alt={item.imageAlt} className="w-14 h-14 rounded-xl object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/56/56`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge type="category" value={item.category} />
                      <span className="text-xs text-zinc-600">{item.color} · {item.size}</span>
                    </div>
                    <div className="mt-2 w-32">
                      <ConditionMeter condition={item.condition} score={item.conditionScore} defects={item.defects} inspectedDate={item.inspectedDate} compact />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${statusBadge(item.status)}`}>{statusLabel(item.status)}</span>
                    {item.status === 'delivering' ? (
                      <button onClick={() => handleCancelDelivery(item)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-red-950 border border-red-800 text-red-300 hover:bg-red-900 transition-colors flex items-center gap-1">
                        <XCircle size={12} /> Cancel
                      </button>
                    ) : item.status === 'stored' ? (
                      <button onClick={() => handleToggleGetBag(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${inBag ? 'bg-white text-black' : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}>
                        <ShoppingBag size={12} />{inBag ? 'In Bag' : 'Send to me'}
                      </button>
                    ) : null}
                    <button onClick={() => navigate('/sell', { state: { item } })}
                      className="px-2 py-1 rounded-lg text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-1">
                      <Tag size={12} /> Sell
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Item Detail Modal */}
      <Modal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
        maxWidth="max-w-lg"
      >
        {selectedItem && (
          <div className="space-y-5">
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedItem.id}/400/300`; }}
              />
              <div className="absolute top-3 left-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadge(selectedItem.status)}`}>
                  {statusLabel(selectedItem.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Category', value: selectedItem.category },
                { label: 'Color', value: selectedItem.color },
                { label: 'Size', value: selectedItem.size },
                { label: 'Brand', value: selectedItem.brand ?? 'Unknown' },
                { label: 'Last Cleaned', value: formatRelativeDate(selectedItem.lastCleaned) },
                { label: 'Added', value: formatRelativeDate(selectedItem.addedDate) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-zinc-800 rounded-xl p-3">
                  <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-white capitalize">{value}</p>
                </div>
              ))}
            </div>

            {/* Condition meter + defect log */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <ConditionMeter
                condition={selectedItem.condition}
                score={selectedItem.conditionScore}
                defects={selectedItem.defects}
                inspectedDate={selectedItem.inspectedDate}
              />
            </div>

            <div className="space-y-2">
              {selectedItem.status === 'delivering' ? (
                <button
                  onClick={() => {
                    handleCancelDelivery(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950 border border-red-800 text-red-300 font-semibold hover:bg-red-900 transition-colors"
                >
                  <XCircle size={16} /> Cancel Delivery
                </button>
              ) : selectedItem.status === 'stored' ? (
                <button
                  onClick={() => {
                    handleToggleGetBag(selectedItem);
                    setSelectedItem(null);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors ${
                    isInBag(selectedItem.id)
                      ? 'bg-zinc-700 text-white border border-zinc-600 hover:bg-zinc-600'
                      : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  <ShoppingBag size={16} />
                  {isInBag(selectedItem.id) ? 'Remove from Send to Me Bag' : 'Add to Send to Me Bag'}
                </button>
              ) : null}
              <div className="grid grid-cols-1 gap-2">
                <Button variant="secondary" icon={<Tag className="w-4 h-4" />} onClick={handleSellFromModal}>
                  Sell This Item
                </Button>
              </div>
              {selectedItem.status === 'delivering' && (
                <div className="flex items-center justify-center gap-2 text-amber-300 text-sm">
                  <Truck size={14} /> This item is currently on its way to you
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
