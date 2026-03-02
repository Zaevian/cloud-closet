import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sparkles, ShieldCheck, Truck, Star, ChevronRight, CheckCircle, Phone, Mail, User, Package } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { SuccessOverlay } from '../components/shared/SuccessOverlay';
import { useAppStore } from '../store/AppStoreContext';
import { staggerContainer, staggerChild } from '../motion';

interface FormData {
  name: string;
  email: string;
  phone: string;
  approxItems: string;
  movingSoon: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  approxItems?: string;
}

const features = [
  { icon: Cloud, title: 'Secure Cloud Storage', desc: 'Climate-controlled facility keeps your clothes fresh and wrinkle-free.' },
  { icon: Sparkles, title: 'AI Outfit Stylist', desc: 'Smart suggestions based on Tallahassee weather and your calendar.' },
  { icon: ShieldCheck, title: 'Professional Cleaning', desc: 'Expert care for every fabric type before storage and delivery.' },
  { icon: Truck, title: 'Door-to-Door Delivery', desc: 'Anywhere in Tallahassee — request your items and they arrive tomorrow.' },
];

const testimonials = [
  { name: 'Maya T.', role: 'FSU Junior', text: 'I moved into a tiny dorm and Cloud Closet saved me. My winter clothes are stored safely and I can request them anytime!', stars: 5 },
  { name: 'Derek W.', role: 'Tallahassee Professional', text: 'The AI stylist picked my interview outfit and I got the job. Worth every penny.', stars: 5 },
  { name: 'Priya S.', role: 'Beta User', text: 'Selling old clothes through the marketplace was so easy. Made $85 in my first week!', stars: 5 },
];

// Floating clothing emoji items for hero animation
const floatingItems = [
  { emoji: '👔', delay: 0, x: -120, y: -60 },
  { emoji: '👗', delay: 0.15, x: 80, y: -80 },
  { emoji: '🧥', delay: 0.3, x: -60, y: 30 },
  { emoji: '👖', delay: 0.45, x: 100, y: 20 },
  { emoji: '👠', delay: 0.6, x: -100, y: 80 },
  { emoji: '🧣', delay: 0.75, x: 60, y: 90 },
];

export function Landing() {
  const { dispatch, state } = useAppStore();
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', approxItems: '', movingSoon: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    if (!formData.approxItems.trim() || isNaN(Number(formData.approxItems))) e.approxItems = 'Enter a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_WAITLIST',
        payload: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          approxItems: Number(formData.approxItems),
          movingSoon: formData.movingSoon,
          submittedAt: new Date().toISOString(),
        },
      });
      setLoading(false);
      setShowSuccess(true);
    }, 1200);
  }

  const alreadyOnList = !!state.waitlist;

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
        {/* Nav */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white text-lg">Cloud Closet</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/how-it-works" className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors">How it works</Link>
              <Link to="/pricing" className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link>
              <Link to="/dashboard">
                <Button size="sm">Open App</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/3 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Beta badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Tallahassee Beta — 50 Early Spots Available
            </motion.div>

            {/* Hero cloud animation */}
            <div className="relative h-40 mb-6 flex items-center justify-center">
              {/* Floating clothes */}
              {floatingItems.map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl"
                  initial={{ opacity: 0, x: item.x * 2, y: item.y * 2, scale: 0.3 }}
                  animate={{ opacity: [0, 1, 1, 0.6], x: [item.x * 2, item.x * 0.5, 0], y: [item.y * 2, item.y * 0.5, 0], scale: [0.3, 0.8, 0.5] }}
                  transition={{ duration: 1.4, delay: item.delay, ease: 'easeOut' }}
                >
                  {item.emoji}
                </motion.div>
              ))}
              {/* Central cloud icon */}
              <motion.div
                className="relative z-10 w-24 h-24 rounded-3xl bg-zinc-800 border border-zinc-600 flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.5 }}
              >
                <Cloud className="w-12 h-12 text-white" strokeWidth={1.5} />
                {/* Orbiting dots */}
                {[0, 120, 240].map((deg, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-zinc-400"
                    style={{ top: '50%', left: '50%' }}
                    animate={{ rotate: 360 + deg }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'linear' }}
                  >
                    <div
                      className="w-2 h-2 rounded-full bg-zinc-400"
                      style={{ transform: `translateX(${44 + i * 6}px) translateY(-50%)` }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Never Haul Clothes{' '}
              <span className="text-zinc-400">
                Again
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-zinc-300 max-w-2xl mx-auto mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              Cloud Closet stores, cleans, and delivers your clothes on demand — exclusively for Tallahassee's beta community.
            </motion.p>

            <motion.p
              className="text-sm text-zinc-400 font-medium mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              🏈 Perfect for FSU students, young professionals, and anyone moving in Tallahassee
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <a href="#waitlist">
                <Button size="lg">
                  Join the Waitlist <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/dashboard">
                <Button size="lg" variant="secondary">
                  Explore the App
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/32/32`} alt="" className="w-8 h-8 rounded-full border-2 border-[#0a0a0a]" />
                ))}
              </div>
              <span className="text-sm text-zinc-400">
                <span className="text-white font-semibold">23 of 50</span> beta spots claimed
              </span>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center text-white mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Everything Your Wardrobe Needs
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {features.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={staggerChild} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-zinc-400">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                {[
                  { value: '50', label: 'Beta Customers' },
                  { value: '24hr', label: 'Delivery Window' },
                  { value: '$15', label: 'Starting / Month' },
                  { value: '100%', label: 'Tallahassee Local' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center text-white mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Loved by Tallahassee's Early Users
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {testimonials.map(t => (
                <motion.div key={t.name} variants={staggerChild} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-zinc-300 fill-zinc-300" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-zinc-500 text-xs">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Waitlist Form */}
        <section id="waitlist" className="py-20 px-4 sm:px-6">
          <div className="max-w-lg mx-auto">
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Cloud className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Claim Your Spot</h2>
                <p className="text-zinc-400 text-sm">Join 23 Tallahassee residents already on the list.</p>
              </div>

              {alreadyOnList ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">You're on the list!</h3>
                  <p className="text-zinc-400 text-sm">We'll reach out to {state.waitlist?.email} soon.</p>
                  <Link to="/dashboard" className="inline-block mt-4">
                    <Button variant="secondary">Explore the Demo</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <Input label="Full Name" placeholder="Alex Johnson" required icon={<User className="w-4 h-4" />} value={formData.name} onChange={e => setFormData(v => ({ ...v, name: e.target.value }))} error={errors.name} />
                  <Input label="Email" type="email" placeholder="alex@email.com" required icon={<Mail className="w-4 h-4" />} value={formData.email} onChange={e => setFormData(v => ({ ...v, email: e.target.value }))} error={errors.email} />
                  <Input label="Phone Number" type="tel" placeholder="(850) 555-0100" required icon={<Phone className="w-4 h-4" />} value={formData.phone} onChange={e => setFormData(v => ({ ...v, phone: e.target.value }))} error={errors.phone} />
                  <Input label="Approximate Number of Clothing Items" type="number" placeholder="e.g. 45" required icon={<Package className="w-4 h-4" />} value={formData.approxItems} onChange={e => setFormData(v => ({ ...v, approxItems: e.target.value }))} error={errors.approxItems} min="1" />
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-zinc-700 bg-transparent accent-white"
                      checked={formData.movingSoon}
                      onChange={e => setFormData(v => ({ ...v, movingSoon: e.target.checked }))}
                    />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">I'm moving soon and need storage ASAP</span>
                  </label>
                  <Button type="submit" size="lg" className="w-full" loading={loading}>
                    {loading ? 'Submitting…' : 'Join the Waitlist'}
                  </Button>
                  <p className="text-xs text-zinc-600 text-center">No spam. We'll only contact you about your beta invite.</p>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-4 sm:px-6 border-t border-zinc-800">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-zinc-500">Cloud Closet — Tallahassee, FL Beta</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/how-it-works" className="text-xs text-zinc-600 hover:text-white transition-colors">How it works</Link>
              <Link to="/pricing" className="text-xs text-zinc-600 hover:text-white transition-colors">Pricing</Link>
              <Link to="/dashboard" className="text-xs text-zinc-600 hover:text-white transition-colors">Demo App</Link>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <SuccessOverlay
            open={showSuccess}
            title="You're on the list! 🎉"
            message={`We'll email ${formData.email} with your beta invite soon. Welcome to Cloud Closet!`}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
