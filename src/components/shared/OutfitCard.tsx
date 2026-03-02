import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Sparkles } from 'lucide-react';
import type { OutfitSuggestion } from '../../types';
import { staggerChild } from '../../motion';
import { SuccessOverlay } from './SuccessOverlay';
import { useAppStore } from '../../store/AppStoreContext';

interface OutfitCardProps {
  outfit: OutfitSuggestion;
}

export function OutfitCard({ outfit }: OutfitCardProps) {
  const { dispatch } = useAppStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShip = () => {
    dispatch({
      type: 'SHIP_OUTFIT',
      payload: { outfitId: outfit.id, itemIds: outfit.items.map(i => i.id) },
    });
    setShowSuccess(true);
  };

  return (
    <>
      <motion.div
        variants={staggerChild}
        className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-teal-400/30 transition-colors"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-white">{outfit.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {outfit.weather.condition} · {outfit.weather.tempF}°F · {outfit.event.replace('-', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-400/10 border border-teal-400/20">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span className="text-xs text-teal-300 font-medium">AI Pick</span>
            </div>
          </div>
        </div>

        {/* Item collage */}
        <div className="p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {outfit.items.slice(0, 4).map((item, idx) => (
              <motion.div
                key={item.id}
                className="relative rounded-xl overflow-hidden bg-navy-800 aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: idx * 0.08 } }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/200/200`;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                  <p className="text-xs text-white truncate leading-tight">{item.name}</p>
                </div>
              </motion.div>
            ))}
            {outfit.items.length > 4 && (
              <div className="rounded-xl bg-white/5 border border-white/10 aspect-square flex items-center justify-center">
                <span className="text-sm font-medium text-slate-400">+{outfit.items.length - 4}</span>
              </div>
            )}
          </div>

          {/* Item list */}
          <div className="space-y-1.5 mb-4">
            {outfit.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span className="truncate">{item.name}</span>
                <span className="shrink-0 text-slate-500">{item.size}</span>
              </div>
            ))}
          </div>

          {/* Ship button */}
          <motion.button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-colors teal-glow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShip}
          >
            <Truck className="w-4 h-4" />
            Ship This Entire Look
          </motion.button>
        </div>
      </motion.div>

      <SuccessOverlay
        open={showSuccess}
        title="Look Shipped! 🚚"
        message="Your complete outfit is on its way. Arriving tomorrow by 6 PM."
        onClose={() => setShowSuccess(false)}
        autoClose={4000}
      />
    </>
  );
}
