import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Clock, MapPin, Package, CheckCircle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/AppStoreContext';
import { PageShell } from '../components/layout/PageShell';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { staggerContainer, staggerChild } from '../motion';
import { generateId, formatDate } from '../utils/format';

const TIME_SLOTS = [
  { value: '08:00-10:00', label: '8:00 AM – 10:00 AM' },
  { value: '10:00-12:00', label: '10:00 AM – 12:00 PM' },
  { value: '12:00-14:00', label: '12:00 PM – 2:00 PM' },
  { value: '14:00-16:00', label: '2:00 PM – 4:00 PM' },
  { value: '16:00-18:00', label: '4:00 PM – 6:00 PM' },
];

const ITEM_ESTIMATES = [
  { value: '5', label: '1–5 items (small bag)' },
  { value: '15', label: '6–15 items (medium load)' },
  { value: '30', label: '16–30 items (large load)' },
  { value: '50', label: '31–50 items (full wardrobe)' },
];

interface PickupForm {
  date: string;
  timeSlot: string;
  address: string;
  estimatedItems: string;
  notes: string;
}

interface FormErrors {
  date?: string;
  timeSlot?: string;
  address?: string;
  estimatedItems?: string;
}

export function BookPickup() {
  const { state, dispatch } = useAppStore();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [form, setForm] = useState<PickupForm>({
    date: minDate,
    timeSlot: '10:00-12:00',
    address: state.user.address,
    estimatedItems: '15',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedRequest, setConfirmedRequest] = useState<{ date: string; timeSlot: string; address: string } | null>(null);

  function validate() {
    const e: FormErrors = {};
    if (!form.date) e.date = 'Please select a date';
    if (!form.timeSlot) e.timeSlot = 'Please select a time slot';
    if (!form.address.trim()) e.address = 'Pickup address is required';
    if (!form.estimatedItems) e.estimatedItems = 'Please estimate your item count';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const slot = TIME_SLOTS.find(s => s.value === form.timeSlot)?.label ?? form.timeSlot;
      dispatch({
        type: 'SUBMIT_PICKUP',
        payload: {
          id: generateId(),
          date: form.date,
          timeSlot: slot,
          address: form.address,
          estimatedItems: Number(form.estimatedItems),
          status: 'scheduled',
          createdAt: new Date().toISOString(),
        },
      });
      setConfirmedRequest({ date: form.date, timeSlot: slot, address: form.address });
      setLoading(false);
      setConfirmed(true);
    }, 1200);
  }

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Book a Pickup</h1>
              <p className="text-slate-400 text-sm">We'll come to you — anywhere in Tallahassee</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
              {/* How it works mini */}
              <motion.div
                className="grid grid-cols-3 gap-3 mb-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {[
                  { icon: CalendarCheck, label: 'Book a slot', step: '1' },
                  { icon: Package, label: 'We collect', step: '2' },
                  { icon: Clock, label: 'Stored in 24hr', step: '3' },
                ].map(item => (
                  <motion.div key={item.step} variants={staggerChild} className="glass rounded-xl p-3 text-center">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 mx-auto mb-2 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-teal-400" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{item.label}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Step {item.step}</p>
                  </motion.div>
                ))}
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="glass rounded-2xl p-5 space-y-4">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-teal-400" />
                    Schedule Details
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Pickup Date"
                      type="date"
                      required
                      value={form.date}
                      min={minDate}
                      onChange={e => setForm(v => ({ ...v, date: e.target.value }))}
                      error={errors.date}
                    />
                    <Select
                      label="Time Slot"
                      required
                      value={form.timeSlot}
                      onChange={e => setForm(v => ({ ...v, timeSlot: e.target.value }))}
                      options={TIME_SLOTS}
                      error={errors.timeSlot}
                    />
                  </div>

                  <Select
                    label="Estimated Item Count"
                    required
                    value={form.estimatedItems}
                    onChange={e => setForm(v => ({ ...v, estimatedItems: e.target.value }))}
                    options={ITEM_ESTIMATES}
                    error={errors.estimatedItems}
                  />
                </div>

                <div className="glass rounded-2xl p-5 space-y-4">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    Pickup Address
                  </h2>
                  <Input
                    label="Street Address"
                    placeholder="e.g. 2847 Mahan Dr, Tallahassee, FL 32308"
                    required
                    value={form.address}
                    onChange={e => setForm(v => ({ ...v, address: e.target.value }))}
                    error={errors.address}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Additional Notes (optional)</label>
                    <textarea
                      className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400/60 transition-colors bg-transparent resize-none"
                      rows={3}
                      placeholder="e.g. Gate code #1234, leave bags at front door…"
                      value={form.notes}
                      onChange={e => setForm(v => ({ ...v, notes: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Price estimate */}
                <div className="glass rounded-xl p-4 border border-teal-400/10">
                  <p className="text-sm text-slate-300">
                    <span className="text-teal-400 font-semibold">Pickup Fee:</span> Free for beta customers · First month of storage included
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full teal-glow-sm" loading={loading} icon={<ChevronRight className="w-5 h-5" />}>
                  {loading ? 'Scheduling…' : 'Confirm Pickup'}
                </Button>
              </form>

              {/* Past pickups */}
              {state.pickupRequests.length > 0 && (
                <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-semibold text-slate-400 text-sm mb-3">Past Pickups</h3>
                  <div className="space-y-2">
                    {state.pickupRequests.slice(-3).reverse().map(req => (
                      <div key={req.id} className="glass rounded-xl p-3 flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{req.address}</p>
                          <p className="text-xs text-slate-400">{formatDate(req.date)} · {req.timeSlot}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">{req.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 280 } }}
              className="text-center"
            >
              <div className="glass rounded-3xl p-10 border border-teal-400/20">
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center teal-glow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { type: 'spring', damping: 12, stiffness: 200, delay: 0.2 } }}
                >
                  <CheckCircle className="w-12 h-12 text-teal-400" />
                </motion.div>

                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
                  <motion.h2 variants={staggerChild} className="text-2xl font-bold text-white">Pickup Confirmed! 🚚</motion.h2>
                  <motion.p variants={staggerChild} className="text-slate-400">
                    We'll see you on <span className="text-white font-semibold">{confirmedRequest ? formatDate(confirmedRequest.date) : ''}</span>
                  </motion.p>
                </motion.div>

                <motion.div
                  className="mt-6 space-y-3 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.5 } }}
                >
                  {[
                    { icon: Clock, label: 'Time Window', value: confirmedRequest?.timeSlot ?? '' },
                    { icon: MapPin, label: 'Address', value: confirmedRequest?.address ?? '' },
                    { icon: Package, label: 'Items', value: `~${form.estimatedItems} items estimated` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 px-4 py-3 glass rounded-xl">
                      <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="text-sm text-white font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.7 } }}
                >
                  <Button variant="secondary" className="flex-1" onClick={() => { setConfirmed(false); }}>
                    Schedule Another
                  </Button>
                  <Button className="flex-1" onClick={() => window.location.href = '/dashboard'}>
                    View My Closet
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
