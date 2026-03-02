import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, Sparkles, Check } from 'lucide-react';
import type { ClothingItem } from '../../types';
import { Badge } from '../ui/Badge';
import { staggerChild } from '../../motion';
import { formatRelativeDate } from '../../utils/format';

interface ClothingCardProps {
  item: ClothingItem;
  onClick?: () => void;
  onQuickAction?: (action: 'deliver' | 'sell' | 'style') => void;
  showActions?: boolean;
  compact?: boolean;
}

export function ClothingCard({ item, onClick, onQuickAction, showActions = false, compact = false }: ClothingCardProps) {
  const [imgError, setImgError] = useState(false);
  const [justBought, setJustBought] = useState(false);

  const fallbackUrl = `https://picsum.photos/seed/${item.id}/400/500`;

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustBought(true);
    setTimeout(() => setJustBought(false), 1500);
    onQuickAction?.('deliver');
  };

  return (
    <motion.div
      variants={staggerChild}
      layout
      className="group glass rounded-2xl overflow-hidden cursor-pointer glass-hover transition-all duration-200"
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-navy-800" style={{ aspectRatio: compact ? '4/3' : '3/4' }}>
        <img
          src={imgError ? fallbackUrl : item.imageUrl}
          alt={item.imageAlt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Status badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge type="status" value={item.status} />
        </div>
        {/* Quick buy overlay */}
        <AnimatePresence>
          {justBought && (
            <motion.div
              className="absolute inset-0 bg-teal-400/20 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-12 h-12 rounded-full bg-teal-400 flex items-center justify-center teal-glow">
                <Check className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
        <div className="flex items-center justify-between mt-1">
          <Badge type="category" value={item.category} />
          <span className="text-xs text-slate-400">{item.size}</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="w-3 h-3 rounded-full border border-white/20 inline-block shrink-0" style={{ backgroundColor: item.color.toLowerCase().replace(/\s/g, '') === 'white' ? '#fff' : item.color.toLowerCase() }} />
          <span className="text-xs text-slate-400 truncate">{item.color}</span>
        </div>
        {!compact && (
          <p className="text-xs text-slate-500 mt-1">Cleaned {formatRelativeDate(item.lastCleaned)}</p>
        )}

        {/* Quick actions */}
        {showActions && (
          <div className="flex gap-1 mt-2.5">
            <motion.button
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-medium hover:bg-teal-500/30 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={handleBuy}
              aria-label="Request delivery"
            >
              <Truck className="w-3 h-3" />
              Deliver
            </motion.button>
            <motion.button
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onQuickAction?.('sell'); }}
              aria-label="Sell item"
            >
              <ShoppingBag className="w-3 h-3" />
              Sell
            </motion.button>
            <motion.button
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onQuickAction?.('style'); }}
              aria-label="Style item"
            >
              <Sparkles className="w-3 h-3" />
              Style
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
