import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Sparkles, Check, Tag, X, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/AppStoreContext';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { ConditionMeter } from '../components/shared/ConditionMeter';
import { staggerContainer, staggerChild } from '../motion';
import { formatCurrency, formatRelativeDate } from '../utils/format';
import type { MarketplaceListing } from '../types';

type TabKey = 'clearance' | 'premium';

export function Marketplace() {
  const { state, dispatch } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabKey>('clearance');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [boughtIds, setBoughtIds] = useState<Set<string>>(new Set());
  const [detailListing, setDetailListing] = useState<MarketplaceListing | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return state.marketplace.filter(l => {
      const matchTab = l.tier === activeTab;
      const matchSearch = search === '' ||
        l.item.name.toLowerCase().includes(search.toLowerCase()) ||
        l.item.category.toLowerCase().includes(search.toLowerCase()) ||
        l.item.color.toLowerCase().includes(search.toLowerCase()) ||
        l.sellerName.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [state.marketplace, activeTab, search]);

  const clearanceCount = state.marketplace.filter(l => l.tier === 'clearance').length;
  const premiumCount = state.marketplace.filter(l => l.tier === 'premium').length;

  function handleQuickBuy(listing: MarketplaceListing) {
    setBuyingId(listing.id);
    setTimeout(() => {
      dispatch({ type: 'QUICK_BUY', payload: { listingId: listing.id } });
      setBoughtIds(prev => new Set([...prev, listing.id]));
      setBuyingId(null);
      setDetailListing(null);
    }, 900);
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Marketplace</h1>
              <p className="text-zinc-400 text-sm">Affordable pre-loved clothes from Tallahassee's community</p>
            </div>
          </div>

          {/* AI Size Match Banner */}
          <motion.div
            className="mt-5 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-zinc-300 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">AI Size Matching Active</p>
              <p className="text-xs text-zinc-500">Items with your size ({state.user.sizeProfile.shirtSize} shirt, {state.user.sizeProfile.waist}" waist) are highlighted with match hints below.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: 'clearance' as TabKey, label: 'Clearance', desc: '$1 – $20', count: clearanceCount },
            { key: 'premium' as TabKey, label: 'Premium Resale', desc: '$35+', count: premiumCount },
          ]).map(tab => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-3 rounded-xl font-medium transition-all border ${
                activeTab === tab.key
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-black/15 text-black/70' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {tab.desc} · {tab.count} items
              </span>
            </motion.button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder={`Search ${activeTab} items…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white" onClick={() => setSearch('')}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-8 h-8" />}
            title="No items found"
            message={search ? `No ${activeTab} items match "${search}".` : `No ${activeTab} items available right now.`}
            action={search ? <Button variant="secondary" onClick={() => setSearch('')}>Clear Search</Button> : undefined}
          />
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            key={activeTab}
          >
            {filtered.map(listing => (
              <MarketplaceCard
                key={listing.id}
                listing={listing}
                isBuying={buyingId === listing.id}
                isBought={boughtIds.has(listing.id)}
                onBuy={() => handleQuickBuy(listing)}
                onDetail={() => setDetailListing(listing)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailListing && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDetailListing(null)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[#111] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
                  <h3 className="text-white font-bold truncate pr-4">{detailListing.item.name}</h3>
                  <button onClick={() => setDetailListing(null)} className="text-zinc-400 hover:text-white shrink-0">
                    <X size={20} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1">
                  {/* Image */}
                  <div className="relative" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={detailListing.item.imageUrl}
                      alt={detailListing.item.imageAlt}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${detailListing.id}/400/300`; }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-sm font-black px-3 py-1.5 rounded-xl bg-white text-black">
                        {formatCurrency(detailListing.price)}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        detailListing.condition === 'like-new' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        detailListing.condition === 'good' ? 'bg-sky-950 text-sky-300 border-sky-800' :
                        'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {detailListing.condition === 'like-new' ? 'Like New' : detailListing.condition === 'good' ? 'Good' : 'Fair'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Category', value: detailListing.item.category },
                        { label: 'Color', value: detailListing.item.color },
                        { label: 'Size', value: detailListing.item.size },
                        { label: 'Brand', value: detailListing.item.brand ?? 'Unknown' },
                        { label: 'Seller', value: detailListing.sellerName },
                        { label: 'Listed', value: formatRelativeDate(detailListing.listedDate) },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                          <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
                          <p className="text-sm font-medium text-white capitalize">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Size match hint */}
                    {detailListing.sizeMatchHint && (
                      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700">
                        <Sparkles size={14} className="text-zinc-300 shrink-0 mt-0.5" />
                        <p className="text-sm text-zinc-300">{detailListing.sizeMatchHint}</p>
                      </div>
                    )}

                    {/* Condition meter + defect log */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                      <ConditionMeter
                        condition={detailListing.item.condition}
                        score={detailListing.item.conditionScore}
                        defects={detailListing.item.defects}
                        inspectedDate={detailListing.item.inspectedDate}
                      />
                    </div>

                    {/* Buy button */}
                    <motion.button
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        boughtIds.has(detailListing.id)
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-white text-black hover:bg-zinc-100'
                      }`}
                      whileTap={{ scale: 0.97 }}
                      onClick={boughtIds.has(detailListing.id) ? undefined : () => handleQuickBuy(detailListing)}
                      disabled={buyingId === detailListing.id || boughtIds.has(detailListing.id)}
                    >
                      {buyingId === detailListing.id ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : boughtIds.has(detailListing.id) ? (
                        <><Check size={16} /> Added to Your Closet</>
                      ) : (
                        <><Tag size={16} /> Buy for {formatCurrency(detailListing.price)}</>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

interface MarketplaceCardProps {
  listing: MarketplaceListing;
  isBuying: boolean;
  isBought: boolean;
  onBuy: () => void;
  onDetail: () => void;
}

function MarketplaceCard({ listing, isBuying, isBought, onBuy, onDetail }: MarketplaceCardProps) {
  const [imgError, setImgError] = useState(false);

  const conditionBadge = {
    'like-new': 'bg-emerald-950 text-emerald-300 border-emerald-800',
    'good': 'bg-sky-950 text-sky-300 border-sky-800',
    'fair': 'bg-amber-950 text-amber-300 border-amber-800',
  };
  const conditionLabel = { 'like-new': 'Like New', 'good': 'Good', 'fair': 'Fair' };

  return (
    <motion.div
      variants={staggerChild}
      layout
      className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-200 cursor-pointer"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onDetail}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-zinc-800" style={{ aspectRatio: '3/4' }}>
        <img
          src={imgError ? `https://picsum.photos/seed/${listing.id}/400/500` : listing.item.imageUrl}
          alt={listing.item.imageAlt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Price badge */}
        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-sm font-black bg-white text-black">
          {formatCurrency(listing.price)}
        </div>
        {/* Condition */}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${conditionBadge[listing.condition]}`}>
            {conditionLabel[listing.condition]}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white truncate">{listing.item.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{listing.item.color} · {listing.item.size}</p>
        <p className="text-xs text-zinc-600 mt-0.5">by {listing.sellerName} · {formatRelativeDate(listing.listedDate)}</p>

        {/* Condition bar compact */}
        <div className="mt-2">
          <ConditionMeter
            condition={listing.item.condition}
            score={listing.item.conditionScore}
            defects={listing.item.defects}
            inspectedDate={listing.item.inspectedDate}
            compact
          />
        </div>

        {/* AI Size Match Hint */}
        {listing.sizeMatchHint && (
          <div className="mt-2 flex items-start gap-1.5 px-2 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
            <Sparkles className="w-3 h-3 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-400 leading-snug">{listing.sizeMatchHint}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-1.5 mt-3" onClick={e => e.stopPropagation()}>
          <motion.button
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
              isBought
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
            whileTap={{ scale: 0.96 }}
            onClick={isBought ? undefined : onBuy}
            disabled={isBuying || isBought}
          >
            {isBuying ? (
              <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isBought ? (
              <><Check size={10} /> In Closet</>
            ) : (
              <><Tag size={10} /> Buy</>
            )}
          </motion.button>
          <button
            onClick={onDetail}
            className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-0.5"
          >
            Details <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
