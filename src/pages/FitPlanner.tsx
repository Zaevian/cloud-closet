import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Plus, Sparkles, Truck, CheckCircle, X, Loader, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/AppStoreContext';
import { PageShell } from '../components/layout/PageShell';
import { ConditionMeter } from '../components/shared/ConditionMeter';
import type { FitPlanWeek, FitPlanDay, ClothingItem } from '../types';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Returns the Monday of the current week (or next Monday if today is Sunday).
 * Logic: if today is Sunday (0), advance to next Monday (+1).
 * Otherwise, go back to this week's Monday.
 */
function getWeekStart(fromDate: Date): Date {
  const d = new Date(fromDate);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  if (dow === 0) {
    // Sunday → next Monday
    d.setDate(d.getDate() + 1);
  } else {
    // Go back to Monday of this week
    d.setDate(d.getDate() - (dow - 1));
  }
  return d;
}

function buildWeekLabel(start: Date): string {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function buildWeek(startDate: Date): FitPlanWeek {
  return {
    weekLabel: buildWeekLabel(startDate),
    startDate: startDate.toISOString().split('T')[0],
    days: [],
  };
}

export function FitPlanner() {
  const { state, dispatch } = useAppStore();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [planItemsOpen, setPlanItemsOpen] = useState(false);
  const [deliverSetOpen, setDeliverSetOpen] = useState(false);
  const [selectedDeliveryDays, setSelectedDeliveryDays] = useState<number[]>([]);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [deliverStep, setDeliverStep] = useState<'select' | 'processing' | 'success'>('select');
  const [processingIndex, setProcessingIndex] = useState(0);
  const [generatingDay, setGeneratingDay] = useState<number | null>(null);
  const [confirmedAddress, setConfirmedAddress] = useState('');
  const [confirmedDays, setConfirmedDays] = useState<number[]>([]);

  const firstName = state.user.name.split(' ')[0];

  const processingSteps = useMemo(() => [
    'Processing request...',
    `Finding ${firstName}'s clothing vault...`,
    'Scanning fit plan selections...',
    'Verifying item availability...',
    'Initiating set preparation...',
  ], [firstName]);

  const startDate = useMemo(() => getWeekStart(new Date()), []);
  const weekLabel = buildWeekLabel(startDate);
  const startDateStr = startDate.toISOString().split('T')[0];

  // Initialize/reset fit plan week in an effect — never dispatch during render
  useEffect(() => {
    if (!state.fitPlan || state.fitPlan.startDate !== startDateStr) {
      dispatch({ type: 'SET_FIT_PLAN_WEEK', payload: buildWeek(startDate) });
    }
  }, [startDateStr]); // eslint-disable-line react-hooks/exhaustive-deps

  const fitPlan = state.fitPlan;

  const planItems = useMemo(() =>
    state.fitPlanItems
      .map(id => state.closet.find(c => c.id === id))
      .filter(Boolean) as ClothingItem[],
    [state.fitPlanItems, state.closet]
  );

  const planShirts = planItems.filter(i => ['shirt', 'jacket', 'dress'].includes(i.category));
  const planPants = planItems.filter(i => i.category === 'pants');
  const planShoes = planItems.filter(i => i.category === 'shoes');

  function getDayPlan(dayIndex: number): FitPlanDay | undefined {
    return fitPlan?.days.find(d => d.dayIndex === dayIndex);
  }

  function hasDayOutfit(dayIndex: number): boolean {
    const d = getDayPlan(dayIndex);
    return !!(d && (d.shirtId || d.pantsId || d.shoesId));
  }

  function setSlot(dayIndex: number, slot: 'shirtId' | 'pantsId' | 'shoesId', itemId: string | undefined) {
    dispatch({ type: 'SET_FIT_PLAN_DAY', payload: { dayIndex, slot, itemId } });
  }

  function handleGenerateSuggestion(dayIndex: number) {
    setGeneratingDay(dayIndex);
    setTimeout(() => {
      const shirt = planShirts.length > 0 ? planShirts[dayIndex % planShirts.length] : undefined;
      const pants = planPants.length > 0 ? planPants[dayIndex % planPants.length] : undefined;
      const shoes = planShoes.length > 0 ? planShoes[dayIndex % planShoes.length] : undefined;
      if (shirt) dispatch({ type: 'SET_FIT_PLAN_DAY', payload: { dayIndex, slot: 'shirtId', itemId: shirt.id } });
      if (pants) dispatch({ type: 'SET_FIT_PLAN_DAY', payload: { dayIndex, slot: 'pantsId', itemId: pants.id } });
      if (shoes) dispatch({ type: 'SET_FIT_PLAN_DAY', payload: { dayIndex, slot: 'shoesId', itemId: shoes.id } });
      setGeneratingDay(null);
    }, 1200);
  }

  function handleToggleDeliveryDay(di: number) {
    setSelectedDeliveryDays(prev =>
      prev.includes(di) ? prev.filter(d => d !== di) : [...prev, di]
    );
  }

  function handleConfirmSetDelivery() {
    const addr = useCustomAddress ? customAddress : state.user.address;
    setConfirmedAddress(addr);
    setConfirmedDays([...selectedDeliveryDays]);
    setDeliverStep('processing');
    setProcessingIndex(0);
    let i = 0;
    const totalItems = selectedDeliveryDays.reduce((acc, di) => {
      const dp = getDayPlan(di);
      return acc + [dp?.shirtId, dp?.pantsId, dp?.shoesId].filter(Boolean).length;
    }, 0);
    const allSteps = [
      ...processingSteps,
      `Delivery process for ${totalItems} article${totalItems !== 1 ? 's' : ''} of clothing started...`,
    ];
    const interval = setInterval(() => {
      i++;
      if (i < allSteps.length) {
        setProcessingIndex(i);
      } else {
        clearInterval(interval);
        dispatch({
          type: 'CONFIRM_SET_DELIVERY',
          payload: {
            dayIndices: selectedDeliveryDays,
            address: addr,
            deliveryDate: (() => {
              const d = new Date(startDate);
              d.setDate(d.getDate() + (selectedDeliveryDays[0] ?? 0));
              return d.toISOString().split('T')[0];
            })(),
          },
        });
        setTimeout(() => setDeliverStep('success'), 400);
      }
    }, 850);
  }

  // Delivery set cutoff: must be at least 2 days before Monday of the week
  const now = new Date();
  const msUntilMonday = startDate.getTime() - now.getTime();
  const daysUntilMonday = msUntilMonday / 86400000;
  const canDeliver = daysUntilMonday >= 2;

  const daysWithOutfits = [0, 1, 2, 3, 4, 5, 6].filter(hasDayOutfit);

  const allProcessingSteps = useMemo(() => {
    const totalItems = selectedDeliveryDays.reduce((acc, di) => {
      const dp = getDayPlan(di);
      return acc + [dp?.shirtId, dp?.pantsId, dp?.shoesId].filter(Boolean).length;
    }, 0);
    return [
      ...processingSteps,
      `Delivery process for ${totalItems} article${totalItems !== 1 ? 's' : ''} of clothing started...`,
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeliveryDays, processingSteps]);

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">Fit Planner</h1>
            </div>
            <p className="text-zinc-400 text-sm ml-1">Plan your outfits for the week ahead</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setPlanItemsOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              <Plus size={15} />
              Plan Items
              {state.fitPlanItems.length > 0 && (
                <span className="bg-white text-black text-xs font-black px-1.5 py-0.5 rounded-full">{state.fitPlanItems.length}</span>
              )}
            </button>
            <button
              onClick={() => { setDeliverSetOpen(true); setDeliverStep('select'); setSelectedDeliveryDays([]); }}
              disabled={daysWithOutfits.length === 0 || !canDeliver}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Truck size={15} />
              Deliver Set
            </button>
          </div>
        </div>

        {/* Week label */}
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded-2xl border border-zinc-800">
          <CalendarDays size={16} className="text-zinc-400" />
          <span className="text-zinc-300 font-semibold text-sm">{weekLabel}</span>
          {!canDeliver && (
            <span className="text-xs text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full ml-auto">
              Set delivery available next week only
            </span>
          )}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-2">
          {DAY_SHORT.map((dayName, i) => {
            const hasOutfit = hasDayOutfit(i);
            const isSelected = selectedDay === i;
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(isSelected ? null : i)}
                className={`relative flex flex-col items-center gap-1 py-3 px-1 rounded-2xl border transition-all text-xs font-semibold ${
                  isSelected
                    ? 'bg-white text-black border-white'
                    : hasOutfit
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {hasOutfit && !isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
                <span className="hidden sm:block">{dayName}</span>
                <span className="sm:hidden">{dayName.charAt(0)}</span>
                <span className={`text-[10px] font-normal ${isSelected ? 'text-black/60' : 'text-zinc-600'}`}>
                  {dayDate.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected day panel */}
        <AnimatePresence>
          {selectedDay !== null && (
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
            >
              {/* Day header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h2 className="text-white font-bold text-lg">{DAY_NAMES[selectedDay]} Outfit Selection</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerateSuggestion(selectedDay)}
                    disabled={planItems.length === 0 || generatingDay === selectedDay}
                    className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-40"
                  >
                    {generatingDay === selectedDay ? (
                      <Loader size={13} className="animate-spin" />
                    ) : (
                      <Sparkles size={13} />
                    )}
                    Generate Suggestion
                  </button>
                  <button onClick={() => setSelectedDay(null)} className="text-zinc-500 hover:text-white transition-colors p-1">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: outfit slots */}
                <div className="space-y-4">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Outfit Slots</p>
                  {(['shirtId', 'pantsId', 'shoesId'] as const).map(slot => {
                    const slotLabels = { shirtId: 'Top / Jacket', pantsId: 'Bottoms', shoesId: 'Shoes' };
                    const dayPlan = getDayPlan(selectedDay);
                    const itemId = dayPlan?.[slot];
                    const item = itemId ? state.closet.find(c => c.id === itemId) : undefined;
                    return (
                      <div key={slot} className="flex items-center gap-3 p-3 bg-zinc-800/60 rounded-xl border border-zinc-700">
                        {item ? (
                          <>
                            <img src={item.imageUrl} alt={item.imageAlt} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                              <p className="text-zinc-500 text-xs">{item.color} · {item.size}</p>
                            </div>
                            <button
                              onClick={() => setSlot(selectedDay, slot, undefined)}
                              className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                            >
                              <X size={15} />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-12 h-12 rounded-lg bg-zinc-700/50 border border-dashed border-zinc-600 flex items-center justify-center">
                              <Plus size={16} className="text-zinc-600" />
                            </div>
                            <span className="text-zinc-500 text-sm">{slotLabels[slot]} — select below</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right: all relevant closet items — add to pool + assign to slot */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                      Closet Items
                    </p>
                    <span className="text-zinc-600 text-xs">{state.fitPlanItems.length} in pool</span>
                  </div>
                  {(() => {
                    const relevantItems = state.closet.filter(i =>
                      ['shirt', 'jacket', 'dress', 'pants', 'shoes'].includes(i.category)
                    );
                    if (relevantItems.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <p className="text-zinc-600 text-sm">No wearable items in closet.</p>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {relevantItems.map(item => {
                          const slot: 'shirtId' | 'pantsId' | 'shoesId' | null =
                            ['shirt', 'jacket', 'dress'].includes(item.category) ? 'shirtId' :
                            item.category === 'pants' ? 'pantsId' :
                            item.category === 'shoes' ? 'shoesId' : null;
                          if (!slot) return null;
                          const inPool = state.fitPlanItems.includes(item.id);
                          const dayPlan = getDayPlan(selectedDay!);
                          const isAssigned = dayPlan?.[slot] === item.id;
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                                isAssigned
                                  ? 'bg-white/8 border-zinc-500 ring-1 ring-white/20'
                                  : inPool
                                  ? 'bg-zinc-800/60 border-zinc-700'
                                  : 'bg-zinc-900/60 border-zinc-800'
                              }`}
                            >
                              <img src={item.imageUrl} alt={item.imageAlt} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                                <p className="text-zinc-500 text-[10px] capitalize">{item.category}</p>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {/* Toggle pool membership */}
                                <button
                                  onClick={() => dispatch({ type: 'TOGGLE_FIT_PLAN_ITEM', payload: item.id })}
                                  title={inPool ? 'Remove from pool' : 'Add to pool'}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                    inPool
                                      ? 'bg-emerald-900 border border-emerald-700 text-emerald-300 hover:bg-emerald-800'
                                      : 'bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {inPool ? '✓ Pool' : '+ Pool'}
                                </button>
                                {/* Assign to day slot (only if in pool) */}
                                {inPool && (
                                  <button
                                    onClick={() => setSlot(selectedDay!, slot, isAssigned ? undefined : item.id)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                      isAssigned
                                        ? 'bg-white text-black hover:bg-zinc-200'
                                        : 'bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 hover:text-white'
                                    }`}
                                  >
                                    {isAssigned ? 'Assigned' : 'Wear'}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Week overview cards */}
        {selectedDay === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6].map(i => {
              const dayPlan = getDayPlan(i);
              const shirt = dayPlan?.shirtId ? state.closet.find(c => c.id === dayPlan.shirtId) : undefined;
              const pants = dayPlan?.pantsId ? state.closet.find(c => c.id === dayPlan.pantsId) : undefined;
              const shoes = dayPlan?.shoesId ? state.closet.find(c => c.id === dayPlan.shoesId) : undefined;
              const dayDate = new Date(startDate);
              dayDate.setDate(startDate.getDate() + i);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className="text-left bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-600 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-sm">{DAY_NAMES[i]}</p>
                      <p className="text-zinc-600 text-xs">{dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    {hasDayOutfit(i) ? (
                      <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">Planned</span>
                    ) : (
                      <span className="text-xs text-zinc-600 px-2 py-0.5 rounded-full">Empty</span>
                    )}
                  </div>
                  {shirt || pants || shoes ? (
                    <div className="flex gap-1.5">
                      {[shirt, pants, shoes].map((item, si) =>
                        item ? (
                          <img key={si} src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-zinc-700" />
                        ) : (
                          <div key={si} className="w-12 h-12 rounded-lg border border-dashed border-zinc-700 bg-zinc-800/30" />
                        )
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-600 text-xs">
                      <Plus size={12} />
                      <span>Tap to plan outfit</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Plan Items Drawer */}
      <AnimatePresence>
        {planItemsOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPlanItemsOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#111] border-l border-zinc-800 z-50 flex flex-col"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <h3 className="text-white font-bold">Plan Items</h3>
                <button onClick={() => setPlanItemsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="px-5 py-3 text-xs text-zinc-500 border-b border-zinc-800">
                Toggle items to include in your weekly planning pool. Only shirts, pants, and shoes are used for day slots.
              </p>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {state.closet
                  .filter(item => ['shirt', 'jacket', 'dress', 'pants', 'shoes'].includes(item.category))
                  .map(item => {
                    const inPlan = state.fitPlanItems.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => dispatch({ type: 'TOGGLE_FIT_PLAN_ITEM', payload: item.id })}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          inPlan
                            ? 'bg-white/8 border-zinc-500 ring-1 ring-white/20'
                            : 'bg-zinc-800/40 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <img src={item.imageUrl} alt={item.imageAlt} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                          <p className="text-zinc-500 text-xs capitalize">{item.category} · {item.size}</p>
                          <div className="mt-1 w-24">
                            <ConditionMeter
                              condition={item.condition}
                              score={item.conditionScore}
                              defects={item.defects}
                              inspectedDate={item.inspectedDate}
                              compact
                            />
                          </div>
                        </div>
                        {inPlan && <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
              </div>
              <div className="p-4 border-t border-zinc-800">
                <button
                  onClick={() => setPlanItemsOpen(false)}
                  className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  Done ({state.fitPlanItems.length} selected)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deliver Set Modal */}
      <AnimatePresence>
        {deliverSetOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={deliverStep === 'select' ? () => setDeliverSetOpen(false) : undefined}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[#111] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-white" />
                    <h3 className="text-white font-bold">
                      {deliverStep === 'select' ? 'Deliver Set' : deliverStep === 'processing' ? 'Processing...' : 'Confirmed!'}
                    </h3>
                  </div>
                  {deliverStep === 'select' && (
                    <button onClick={() => setDeliverSetOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* SELECT STEP */}
                {deliverStep === 'select' && (
                  <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-3">Select Days to Deliver</p>
                      <p className="text-xs text-zinc-600 mb-3">Only days with planned outfits can be selected. Sets must be ordered at least 2 days before the week starts (48-hour guarantee).</p>
                      <div className="grid grid-cols-7 gap-1.5">
                        {[0, 1, 2, 3, 4, 5, 6].map(i => {
                          const has = hasDayOutfit(i);
                          const sel = selectedDeliveryDays.includes(i);
                          const dayDate = new Date(startDate);
                          dayDate.setDate(startDate.getDate() + i);
                          return (
                            <button
                              key={i}
                              disabled={!has}
                              onClick={() => handleToggleDeliveryDay(i)}
                              className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                sel
                                  ? 'bg-white text-black border-white'
                                  : has
                                  ? 'bg-zinc-800 border-zinc-600 text-white hover:border-zinc-400'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed'
                              }`}
                            >
                              <span>{DAY_SHORT[i]}</span>
                              <span className={`text-[10px] font-normal ${sel ? 'text-black/60' : 'text-zinc-600'}`}>
                                {dayDate.getDate()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected items preview */}
                    {selectedDeliveryDays.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Items to Deliver</p>
                        {selectedDeliveryDays.map(di => {
                          const dp = getDayPlan(di);
                          const items = [dp?.shirtId, dp?.pantsId, dp?.shoesId]
                            .filter(Boolean)
                            .map(id => state.closet.find(c => c.id === id))
                            .filter(Boolean) as ClothingItem[];
                          return (
                            <div key={di} className="bg-zinc-900 rounded-xl border border-zinc-800 p-3">
                              <p className="text-zinc-400 text-xs font-semibold mb-2">{DAY_NAMES[di]}</p>
                              <div className="flex gap-2">
                                {items.map(item => (
                                  <div key={item.id} className="flex items-center gap-1.5">
                                    <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-md object-cover" />
                                    <span className="text-zinc-400 text-xs truncate max-w-16">{item.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Address */}
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Delivery Address</p>
                      <button
                        onClick={() => setUseCustomAddress(false)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                          !useCustomAddress ? 'border-white bg-white/5 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                        }`}
                      >
                        <p className="text-xs text-zinc-500 mb-0.5">Saved</p>
                        <p>{state.user.address}</p>
                      </button>
                      <button
                        onClick={() => setUseCustomAddress(true)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                          useCustomAddress ? 'border-white bg-white/5 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                        }`}
                      >
                        <p className="text-xs text-zinc-500 mb-0.5">Custom address</p>
                        {useCustomAddress ? (
                          <input
                            autoFocus
                            value={customAddress}
                            onChange={e => setCustomAddress(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            placeholder="Enter address..."
                            className="w-full bg-transparent text-white placeholder-zinc-600 outline-none"
                          />
                        ) : (
                          <p className="text-zinc-600">Enter a different address</p>
                        )}
                      </button>
                    </div>

                    {/* Guarantee note */}
                    <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                      <Truck size={12} />
                      Guaranteed 48-hour delivery. Sets arrive before the week starts.
                    </p>

                    <button
                      disabled={selectedDeliveryDays.length === 0 || (useCustomAddress && !customAddress.trim())}
                      onClick={handleConfirmSetDelivery}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors"
                    >
                      Deliver {selectedDeliveryDays.length} Day{selectedDeliveryDays.length !== 1 ? 's' : ''}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* PROCESSING STEP */}
                {deliverStep === 'processing' && (
                  <div className="p-8 flex flex-col items-center space-y-5">
                    <div className="relative w-14 h-14">
                      <Loader size={56} className="text-zinc-700 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      {allProcessingSteps.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: i <= processingIndex ? 1 : 0.2, x: 0 }}
                          transition={{ duration: 0.35 }}
                          className={`flex items-center gap-2.5 text-sm py-0.5 ${
                            i < processingIndex ? 'text-zinc-400' : i === processingIndex ? 'text-white font-semibold' : 'text-zinc-700'
                          }`}
                        >
                          <span className="flex-shrink-0">
                            {i < processingIndex ? (
                              <span className="text-emerald-400 text-xs">✓</span>
                            ) : i === processingIndex ? (
                              <span className="processing-dot inline-block w-1.5 h-1.5 bg-white rounded-full" />
                            ) : (
                              <span className="inline-block w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                            )}
                          </span>
                          {s}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUCCESS STEP */}
                {deliverStep === 'success' && (
                  <div className="p-6 flex flex-col items-center space-y-5 text-center">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    >
                      <CheckCircle size={72} className="text-emerald-400" />
                    </motion.div>
                    <div className="space-y-1">
                      <h3 className="text-white font-black text-2xl">Set Confirmed!</h3>
                      <p className="text-zinc-400 text-sm">
                        {confirmedDays.length} day{confirmedDays.length !== 1 ? 's' : ''} of outfits are being prepared.
                      </p>
                    </div>

                    {/* Address callout */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-left space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                          <Truck size={14} className="text-zinc-300" />
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Delivering to</p>
                          <p className="text-white font-semibold text-sm">{confirmedAddress}</p>
                        </div>
                      </div>
                      <div className="border-t border-zinc-800" />
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                          <CalendarDays size={14} className="text-zinc-300" />
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Guaranteed arrival by</p>
                          <p className="text-white font-semibold text-sm">
                            {new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Per-day item breakdown */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="w-full space-y-2 text-left"
                    >
                      <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Outfits on the way</p>
                      {confirmedDays.map(di => {
                        const dp = getDayPlan(di);
                        const items = [dp?.shirtId, dp?.pantsId, dp?.shoesId]
                          .filter(Boolean)
                          .map(id => state.closet.find(c => c.id === id))
                          .filter(Boolean) as ClothingItem[];
                        return (
                          <div key={di} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                            <p className="text-zinc-400 text-xs font-bold mb-2">{DAY_NAMES[di]}</p>
                            <div className="space-y-1.5">
                              {items.map(item => (
                                <div key={item.id} className="flex items-center gap-2.5">
                                  <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                                  <span className="text-zinc-300 text-xs truncate flex-1">{item.name}</span>
                                  <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>

                    <button
                      onClick={() => setDeliverSetOpen(false)}
                      className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                      Back to Planner
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
