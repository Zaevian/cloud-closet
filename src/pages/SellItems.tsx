import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Tag, Sparkles, Eye, CheckCircle, Camera, X } from 'lucide-react';
import { useAppStore } from '../store/AppStoreContext';
import { PageShell } from '../components/layout/PageShell';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { staggerContainer, staggerChild } from '../motion';
import { suggestPrice } from '../utils/aiPricing';
import { formatCurrency, generateId } from '../utils/format';
import type { ClothingCategory, ItemCondition, MarketplaceTier } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

const CATEGORY_OPTIONS = [
  { value: 'shirt', label: 'Shirt / Top' },
  { value: 'pants', label: 'Pants / Bottoms' },
  { value: 'jacket', label: 'Jacket / Outerwear' },
  { value: 'dress', label: 'Dress / Skirt' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'socks', label: 'Socks' },
  { value: 'underwear', label: 'Underwear / Intimates' },
];

const CONDITION_OPTIONS = [
  { value: 'like-new', label: 'Like New — barely worn, no flaws' },
  { value: 'good', label: 'Good — light wear, minor signs of use' },
  { value: 'fair', label: 'Fair — visible wear, well loved' },
];

const TIER_OPTIONS = [
  { value: 'clearance', label: 'Clearance ($1–$20) — quick sale' },
  { value: 'premium', label: 'Premium Resale ($35+) — higher value brands' },
];

const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/seed/sell-preview-1/400/500',
  'https://picsum.photos/seed/sell-preview-2/400/500',
  'https://picsum.photos/seed/sell-preview-3/400/500',
  'https://picsum.photos/seed/sell-preview-4/400/500',
];

interface SellFormData {
  name: string;
  category: ClothingCategory;
  color: string;
  size: string;
  brand: string;
  condition: ItemCondition;
  tier: MarketplaceTier;
  description: string;
}

export function SellItems() {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const prefillItem = location.state?.item;

  const [step, setStep] = useState<'upload' | 'details' | 'preview' | 'done'>(prefillItem ? 'details' : 'upload');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [form, setForm] = useState<SellFormData>({
    name: prefillItem?.name ?? '',
    category: prefillItem?.category ?? 'shirt',
    color: prefillItem?.color ?? '',
    size: prefillItem?.size ?? '',
    brand: prefillItem?.brand ?? '',
    condition: 'good',
    tier: 'clearance',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<SellFormData>>({});
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [loading, setLoading] = useState(false);

  function handleImageSelect(idx: number) {
    setSelectedImageIdx(idx);
    setTimeout(() => setStep('details'), 300);
  }

  function handleGetAIPrice() {
    const price = suggestPrice(form.category, form.condition, form.tier, form.brand || undefined);
    setSuggestedPrice(price);
    setFinalPrice(String(price));
  }

  function validate() {
    const e: Partial<SellFormData> = {};
    if (!form.name.trim()) e.name = 'Item name is required';
    if (!form.color.trim()) e.color = 'Color is required';
    if (!form.size.trim()) e.size = 'Size is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePreview() {
    if (!validate()) return;
    if (!suggestedPrice) handleGetAIPrice();
    setStep('preview');
  }

  function handleList() {
    setLoading(true);
    const price = Number(finalPrice) || suggestedPrice || 10;
    setTimeout(() => {
      const newListing = {
        id: generateId(),
        item: {
          id: prefillItem?.id ?? generateId(),
          name: form.name,
          category: form.category,
          color: form.color,
          size: form.size,
          brand: form.brand || undefined,
          imageUrl: prefillItem?.imageUrl ?? PLACEHOLDER_IMAGES[selectedImageIdx],
          imageAlt: `${form.color} ${form.name}`,
          lastCleaned: new Date().toISOString(),
          status: 'listed' as const,
          addedDate: new Date().toISOString(),
          condition: form.condition as import('../types').ItemCondition,
          conditionScore: form.condition === 'like-new' ? 95 : form.condition === 'good' ? 80 : 60,
          defects: [],
          inspectedDate: new Date().toISOString().split('T')[0],
        },
        price,
        sellerId: state.user.id,
        sellerName: state.user.name,
        tier: form.tier,
        condition: form.condition,
        listedDate: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MARKETPLACE_LISTING', payload: newListing });
      setLoading(false);
      setStep('done');
    }, 1200);
  }

  const previewImageUrl = prefillItem?.imageUrl ?? PLACEHOLDER_IMAGES[selectedImageIdx];

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Tag className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sell My Items</h1>
              <p className="text-slate-400 text-sm">Turn your unused clothes into cash</p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-5">
            {(['upload', 'details', 'preview'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'bg-teal-500 text-white' :
                  (['upload', 'details', 'preview', 'done'].indexOf(step) > i) ? 'bg-teal-500/30 text-teal-300' :
                  'bg-white/10 text-slate-500'
                }`}>
                  {['upload', 'details', 'preview', 'done'].indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium capitalize ${step === s ? 'text-white' : 'text-slate-500'}`}>
                  {s === 'upload' ? 'Photo' : s}
                </span>
                {i < 2 && <div className="w-6 h-px bg-white/10 mx-1" />}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="glass rounded-2xl p-8 border-2 border-dashed border-white/10 hover:border-teal-400/30 transition-colors text-center cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Upload Photo</h3>
                <p className="text-sm text-slate-400 mb-4">Drag &amp; drop your photo, or choose from our demo library below</p>
                <p className="text-xs text-slate-600">(In demo mode, select from the preview images below)</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-400" />
                  Select a demo photo to continue
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {PLACEHOLDER_IMAGES.map((url, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleImageSelect(idx)}
                      className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all ${
                        selectedImageIdx === idx ? 'border-teal-400' : 'border-transparent'
                      }`}
                    >
                      <img src={url} alt={`Demo photo ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      {selectedImageIdx === idx && (
                        <div className="absolute inset-0 bg-teal-400/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-teal-400" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setStep('details')} icon={<Camera className="w-4 h-4" />}>
                Use Selected Photo
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Details */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-40 rounded-xl overflow-hidden shrink-0">
                  <img src={previewImageUrl} alt="Item preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-3">
                  <Input label="Item Name" placeholder="e.g. Navy Polo Shirt" required value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} error={errors.name} />
                  <Select label="Category" required value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value as ClothingCategory }))} options={CATEGORY_OPTIONS} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Color" placeholder="e.g. Navy Blue" required value={form.color} onChange={e => setForm(v => ({ ...v, color: e.target.value }))} error={errors.color} />
                <Input label="Size" placeholder="e.g. M or 32x32" required value={form.size} onChange={e => setForm(v => ({ ...v, size: e.target.value }))} error={errors.size} />
              </div>

              <Input label="Brand (optional)" placeholder="e.g. Nike, Levi's" value={form.brand} onChange={e => setForm(v => ({ ...v, brand: e.target.value }))} />

              <Select label="Condition" required value={form.condition} onChange={e => setForm(v => ({ ...v, condition: e.target.value as ItemCondition }))} options={CONDITION_OPTIONS} />
              <Select label="Listing Tier" required value={form.tier} onChange={e => setForm(v => ({ ...v, tier: e.target.value as MarketplaceTier }))} options={TIER_OPTIONS} />

              {/* AI Price Suggestion */}
              <div className="glass rounded-xl p-4 border border-teal-400/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-semibold text-white">AI Price Suggestion</span>
                  </div>
                  <Button size="sm" variant="secondary" onClick={handleGetAIPrice}>
                    Get Suggestion
                  </Button>
                </div>
                {suggestedPrice !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <p className="text-sm text-slate-400">
                      Suggested price: <span className="text-teal-400 font-bold text-lg">{formatCurrency(suggestedPrice)}</span>
                      {form.tier === 'clearance' ? ' (clearance range: $1–$20)' : ' (premium range: $35+)'}
                    </p>
                    <Input
                      label="Your Final Price ($)"
                      type="number"
                      value={finalPrice}
                      onChange={e => setFinalPrice(e.target.value)}
                      min="1"
                    />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="ghost" onClick={() => setStep('upload')} icon={<X className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={handlePreview} icon={<Eye className="w-4 h-4" />}>
                  Preview Listing
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Preview */}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Listing Preview</p>
                <div className="flex gap-4">
                  <div className="w-32 shrink-0">
                    <div className="rounded-xl overflow-hidden aspect-[3/4]">
                      <img src={previewImageUrl} alt={form.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-white text-lg">{form.name || 'Unnamed Item'}</h3>
                    <div className="flex items-center gap-2">
                      <Badge type="category" value={form.category} />
                      <span className={`text-xl font-black ${form.tier === 'premium' ? 'text-purple-300' : 'text-teal-300'}`}>
                        {formatCurrency(Number(finalPrice) || suggestedPrice || 10)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-400">
                      <p>📏 Size: {form.size}</p>
                      <p>🎨 Color: {form.color}</p>
                      {form.brand && <p>🏷️ Brand: {form.brand}</p>}
                      <p>✨ Condition: {form.condition}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      form.tier === 'premium'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                        : 'bg-teal-500/20 text-teal-300 border-teal-400/30'
                    }`}>
                      {form.tier === 'premium' ? '⭐ Premium Resale' : '🏷️ Clearance'}
                    </div>
                    <p className="text-xs text-slate-500">by {state.user.name}</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4 bg-teal-500/5 border border-teal-400/15">
                <p className="text-sm text-slate-300">
                  <span className="text-teal-400 font-semibold">Cloud Closet Commission:</span> 15% on sale.{' '}
                  You earn {formatCurrency(Math.round((Number(finalPrice) || suggestedPrice || 10) * 0.85))}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="ghost" onClick={() => setStep('details')}>
                  Edit Details
                </Button>
                <Button onClick={handleList} loading={loading} icon={<Tag className="w-4 h-4" />}>
                  {loading ? 'Listing…' : 'List Now'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Done */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center teal-glow"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { type: 'spring', damping: 12, stiffness: 200, delay: 0.1 } }}
              >
                <CheckCircle className="w-12 h-12 text-teal-400" />
              </motion.div>
              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
                <motion.h2 variants={staggerChild} className="text-2xl font-bold text-white">Item Listed! 🎉</motion.h2>
                <motion.p variants={staggerChild} className="text-slate-400">
                  Your item is now live in the marketplace. We'll notify you when it sells.
                </motion.p>
                <motion.div variants={staggerChild} className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button variant="secondary" onClick={() => navigate('/marketplace')}>
                    View in Marketplace
                  </Button>
                  <Button onClick={() => { setStep('upload'); setForm({ name: '', category: 'shirt', color: '', size: '', brand: '', condition: 'good', tier: 'clearance', description: '' }); setSuggestedPrice(null); setFinalPrice(''); }}>
                    Sell Another Item
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
