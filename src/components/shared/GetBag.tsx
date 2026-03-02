import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, MapPin, Clock, ChevronRight, CheckCircle, Loader } from 'lucide-react';
import { useAppStore } from '../../store/AppStoreContext';
import { generateId } from '../../utils/format';
import type { DeliveryOrder } from '../../types';

function getProcessingSteps(firstName: string) {
  return [
    'Processing request...',
    `Finding ${firstName}'s clothing vault...`,
    'Gathering selected items...',
    'Verifying item quality...',
    'Initiating clothing preparation...',
  ];
}

function getDeliveryTimeOptions(now: Date): { label: string; value: string; date: string }[] {
  const options: { label: string; value: string; date: string }[] = [];
  const cutoff = 21; // 9 PM

  const tryDate = (d: Date, label: string) => {
    const slots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'];
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const isToday = d.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    for (const slot of slots) {
      const [timePart, ampm] = slot.split(' ');
      const [h] = timePart.split(':').map(Number);
      const hour24 = ampm === 'PM' && h !== 12 ? h + 12 : ampm === 'AM' && h === 12 ? 0 : h;
      if (hour24 >= cutoff) break;
      if (isToday && hour24 <= currentHour + 3) continue; // need 3h lead for today
      options.push({ label: `${label} ${dateStr} at ${slot}`, value: slot, date: d.toISOString().split('T')[0] });
    }
  };

  const today = new Date(now);
  tryDate(today, 'Today,');
  if (options.length < 3) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tryDate(tomorrow, 'Tomorrow,');
  }
  if (options.length === 0) {
    // Past 9 PM — only offer tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tryDate(tomorrow, 'Tomorrow,');
  }
  return options;
}

interface GetBagButtonProps {
  forceOpen?: boolean;
  onForceClose?: () => void;
}

export function GetBagButton({ forceOpen, onForceClose }: GetBagButtonProps = {}) {
  const { state, dispatch } = useAppStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const count = state.getBag.length;

  const isOpen = forceOpen !== undefined ? forceOpen : internalOpen;
  const handleClose = () => {
    if (onForceClose) onForceClose();
    setInternalOpen(false);
  };

  return (
    <>
      {/* Only render button when not in forced mode (mobile tab bar handles its own button) */}
      {forceOpen === undefined && (
        <button
          onClick={() => setInternalOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-xl text-sm hover:bg-zinc-200 transition-colors"
        >
          <ShoppingBag size={16} />
          Send to Me Bag
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border-2 border-black text-black rounded-full text-[10px] font-black flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <GetBagDrawer
            onClose={handleClose}
            dispatch={dispatch}
            state={state}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface DrawerProps {
  onClose: () => void;
  dispatch: ReturnType<typeof useAppStore>['dispatch'];
  state: ReturnType<typeof useAppStore>['state'];
}

type Step = 'bag' | 'checkout' | 'processing' | 'success';

function GetBagDrawer({ onClose, dispatch, state }: DrawerProps) {
  const [step, setStep] = useState<Step>('bag');
  const address = state.user.address || '';
  const [useCustom, setUseCustom] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [processingIndex, setProcessingIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [confirmedAddress, setConfirmedAddress] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('');
  const [confirmedItems, setConfirmedItems] = useState<typeof state.closet>([]);

  const firstName = state.user.name.split(' ')[0];
  const PROCESSING_STEPS = getProcessingSteps(firstName);

  const now = new Date();
  const timeOptions = getDeliveryTimeOptions(now);
  const bagItems = state.getBag.map(b => state.closet.find(c => c.id === b.itemId)).filter(Boolean) as typeof state.closet;

  function handleRemove(id: string) {
    dispatch({ type: 'TOGGLE_GET_BAG', payload: id });
  }

  function handleDeliver() {
    if (bagItems.length === 0) return;
    const chosen = timeOptions[selectedOption];
    const finalAddress = useCustom ? customAddress : address;

    setItemCount(bagItems.length);
    setConfirmedAddress(finalAddress);
    setConfirmedTime(chosen?.label ?? chosen?.value ?? '9:00 AM');
    setConfirmedItems([...bagItems]);
    setStep('processing');
    setProcessingIndex(0);

    const steps = [
      ...PROCESSING_STEPS,
      `Delivery process for ${bagItems.length} article${bagItems.length !== 1 ? 's' : ''} of clothing started...`,
    ];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setProcessingIndex(i);
      } else {
        clearInterval(interval);
        const order: DeliveryOrder = {
          id: generateId(),
          itemIds: bagItems.map(b => b.id),
          address: finalAddress,
          deliveryDate: chosen?.date ?? now.toISOString().split('T')[0],
          deliveryTime: chosen?.value ?? '9:00 AM',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'CONFIRM_DELIVERY', payload: order });
        setTimeout(() => setStep('success'), 400);
      }
    }, 900);
  }

  const processingStepsDisplay = [
    ...PROCESSING_STEPS,
    `Delivery process for ${itemCount} article${itemCount !== 1 ? 's' : ''} of clothing started...`,
  ];


  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/70 z-40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={step === 'bag' || step === 'checkout' ? onClose : undefined}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111] border-l border-zinc-800 z-50 flex flex-col"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-white" />
            <h2 className="text-white font-bold text-lg">
              {step === 'bag' ? 'Send to Me Bag' : step === 'checkout' ? 'Delivery Details' : step === 'processing' ? 'Processing...' : 'Confirmed!'}
            </h2>
            {step === 'bag' && bagItems.length > 0 && (
              <span className="text-xs bg-white text-black font-bold px-2 py-0.5 rounded-full">{bagItems.length}</span>
            )}
          </div>
          {(step === 'bag' || step === 'checkout') && (
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* BAG STEP */}
          {step === 'bag' && (
            <div className="p-6 space-y-4">
              {bagItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={40} className="text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400 font-medium">Your Send to Me Bag is empty</p>
                  <p className="text-zinc-600 text-sm mt-1">Press "Send to me" on any closet item to add it</p>
                </div>
              ) : (
                bagItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                    <img src={item.imageUrl} alt={item.imageAlt} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-zinc-500 text-xs">{item.color} · {item.size}</p>
                      <p className="text-zinc-600 text-xs capitalize">{item.condition?.replace('-', ' ')}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CHECKOUT STEP */}
          {step === 'checkout' && (
            <div className="p-6 space-y-6">
              {/* Address */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
                  <MapPin size={15} />
                  <span>Delivery Address</span>
                </div>

                {/* Saved address */}
                <button
                  onClick={() => setUseCustom(false)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    !useCustom ? 'border-white bg-white/5 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  <p className="font-semibold text-xs text-zinc-400 mb-0.5">Saved address</p>
                  <p>{state.user.address}</p>
                </button>

                {/* Custom address */}
                <button
                  onClick={() => setUseCustom(true)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    useCustom ? 'border-white bg-white/5 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  <p className="font-semibold text-xs text-zinc-400 mb-0.5">Different address</p>
                  {useCustom ? (
                    <input
                      autoFocus
                      value={customAddress}
                      onChange={e => setCustomAddress(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      placeholder="Enter delivery address..."
                      className="w-full bg-transparent text-white placeholder-zinc-600 outline-none"
                    />
                  ) : (
                    <p className="text-zinc-600">Enter a custom address</p>
                  )}
                </button>
              </div>

              {/* Time selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
                  <Clock size={15} />
                  <span>Delivery Time <span className="text-zinc-500 font-normal">(up to 4 hrs)</span></span>
                </div>
                <p className="text-xs text-zinc-500">Deliveries cannot be made past 9:00 PM</p>
                <div className="space-y-2">
                  {timeOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                        selectedOption === i
                          ? 'border-white bg-white/5 text-white font-semibold'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-2">
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Order Summary</p>
                {bagItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-zinc-300 truncate">{item.name}</span>
                    <span className="text-zinc-500 text-xs ml-2 flex-shrink-0">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROCESSING STEP */}
          {step === 'processing' && (
            <div className="p-8 flex flex-col items-center justify-center min-h-64 space-y-6">
              <div className="relative w-16 h-16">
                <Loader size={64} className="text-zinc-700 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="w-full space-y-2">
                {processingStepsDisplay.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: i <= processingIndex ? 1 : 0.2, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`flex items-start gap-2.5 text-sm py-1 ${
                      i < processingIndex ? 'text-zinc-400' : i === processingIndex ? 'text-white font-semibold' : 'text-zinc-700'
                    }`}
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {i < processingIndex ? (
                        <span className="text-emerald-400 text-xs">✓</span>
                      ) : i === processingIndex ? (
                        <span className="processing-dot inline-block w-1.5 h-1.5 bg-white rounded-full mt-1" />
                      ) : (
                        <span className="inline-block w-1.5 h-1.5 bg-zinc-700 rounded-full mt-1" />
                      )}
                    </span>
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === 'success' && (
            <div className="flex flex-col h-full">
              {/* Big hero area */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                >
                  <CheckCircle size={88} className="text-emerald-400" />
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-white font-black text-3xl">Delivery Confirmed!</h3>
                  <p className="text-zinc-400 text-sm">
                    {itemCount} item{itemCount !== 1 ? 's are' : ' is'} being prepared for delivery.
                  </p>
                </div>

                {/* Address callout */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-left space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <MapPin size={15} className="text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Delivering to</p>
                      <p className="text-white font-semibold text-sm">{confirmedAddress || address}</p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-800" />
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Clock size={15} className="text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Arrival details</p>
                      <p className="text-white font-semibold text-sm">Arriving by {confirmedTime || '9:00 AM'} to {confirmedAddress || address}</p>
                    </div>
                  </div>
                </motion.div>

                <div className="w-full space-y-2">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold text-left">Items on the way</p>
                  {confirmedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5">
                      <img src={item.imageUrl} alt={item.imageAlt} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                        <p className="text-zinc-500 text-[10px]">{item.color} · {item.size}</p>
                      </div>
                      <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800">
          {step === 'bag' && (
            <button
              disabled={bagItems.length === 0}
              onClick={() => setStep('checkout')}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors"
            >
              Checkout ({bagItems.length} item{bagItems.length !== 1 ? 's' : ''})
              <ChevronRight size={18} />
            </button>
          )}
          {step === 'checkout' && (
            <div className="space-y-3">
              <button
                disabled={useCustom && !customAddress.trim()}
                onClick={handleDeliver}
                className="w-full bg-white text-black font-bold py-3.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors"
              >
                Deliver {bagItems.length} Item{bagItems.length !== 1 ? 's' : ''}
              </button>
              <button
                onClick={() => setStep('bag')}
                className="w-full text-zinc-400 hover:text-white text-sm transition-colors"
              >
                ← Back to bag
              </button>
            </div>
          )}
          {step === 'success' && (
            <button
              onClick={onClose}
              className="w-full bg-zinc-800 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Return to Closet
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
