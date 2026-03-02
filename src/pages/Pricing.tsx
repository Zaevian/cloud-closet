import { motion } from 'framer-motion';
import { Check, Zap, Shield, Truck, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { staggerContainer, staggerChild } from '../motion';

const plans = [
  {
    id: 'beta-40',
    name: 'Beta Standard',
    badge: 'Most Popular',
    price: 15,
    originalPrice: 25,
    period: 'month',
    description: 'Perfect for students and individuals with a compact wardrobe.',
    capacity: 'Up to 40 lbs of clothing (~30–40 items)',
    color: 'teal',
    features: [
      'Up to 40 lbs storage',
      'Free initial pickup',
      '2 free deliveries per month',
      'AI Outfit Stylist access',
      'Marketplace buying & selling',
      'Climate-controlled storage',
      'Dashboard with photos',
    ],
  },
  {
    id: 'beta-80',
    name: 'Beta Premium',
    badge: 'Best Value',
    price: 25,
    originalPrice: 45,
    period: 'month',
    description: 'For families, professionals, and wardrobe enthusiasts.',
    capacity: 'Up to 80 lbs of clothing (~60–80 items)',
    color: 'purple',
    features: [
      'Up to 80 lbs storage',
      'Free pickup every month',
      'Unlimited deliveries',
      'AI Outfit Stylist access',
      'Priority marketplace listing',
      'Climate-controlled storage',
      'Dashboard with photos',
      'Seasonal rotation service',
    ],
  },
];

const addOns = [
  { name: 'Extra Delivery', price: '$5', desc: 'Additional delivery beyond your plan allowance' },
  { name: 'Express Delivery', price: '$12', desc: 'Same-day delivery by 8 PM (Tallahassee only)' },
  { name: 'Dry Cleaning', price: 'From $8', desc: 'Per item, for delicates and formal wear' },
  { name: 'Alterations', price: 'From $15', desc: 'Tailoring and basic repairs' },
];

const faq = [
  {
    q: 'What happens to my items if I cancel?',
    a: 'We\'ll schedule a free return pickup to deliver all your items back to you within 3 business days.',
  },
  {
    q: 'How are items weighed?',
    a: 'We weigh your items at pickup. Most everyday wardrobes (30–40 items) fall well under the 40 lb limit.',
  },
  {
    q: 'Is there a minimum commitment?',
    a: 'No — cancel anytime. For beta customers, we ask for 30 days notice out of courtesy.',
  },
  {
    q: 'What\'s the marketplace commission?',
    a: '15% of the sale price. We handle payment processing, photos, and listing — you just ship us the item.',
  },
];

export function Pricing() {
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber-400/30 text-amber-300 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Beta pricing — locked in for your first 6 months
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Transparent</span>{' '}
            Pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Early beta customers lock in their rate forever.
          </p>
        </motion.div>

        {/* Plans */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {plans.map(plan => (
            <motion.div
              key={plan.id}
              variants={staggerChild}
              className={`glass rounded-3xl p-8 border relative overflow-hidden ${
                plan.color === 'purple'
                  ? 'border-purple-400/30'
                  : 'border-teal-400/30'
              }`}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Background glow */}
              <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                plan.color === 'purple' ? 'bg-purple-500/10' : 'bg-teal-500/10'
              }`} />

              {/* Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5 ${
                plan.color === 'purple'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-400/30'
              }`}>
                <Star className="w-3 h-3 fill-current" />
                {plan.badge}
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
              <p className="text-sm text-slate-400 mb-5">{plan.description}</p>

              {/* Price */}
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-5xl font-black ${plan.color === 'purple' ? 'text-purple-300' : 'text-teal-300'}`}>
                  ${plan.price}
                </span>
                <div className="pb-2">
                  <span className="text-slate-500 text-sm line-through">${plan.originalPrice}</span>
                  <span className="text-slate-400 text-sm">/{plan.period}</span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium mb-6 ${
                plan.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : 'bg-teal-500/10 text-teal-400'
              }`}>
                <Shield className="w-3 h-3" />
                {plan.capacity}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check className={`w-4 h-4 shrink-0 ${plan.color === 'purple' ? 'text-purple-400' : 'text-teal-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/#waitlist">
                <Button
                  size="lg"
                  className={`w-full ${plan.color === 'purple'
                    ? 'bg-purple-600 hover:bg-purple-500 border-0'
                    : 'teal-glow-sm'
                  }`}
                >
                  Claim Beta Spot
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Add-ons */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">À la Carte Add-ons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addOns.map(addon => (
              <div key={addon.name} className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{addon.name}</p>
                    <span className="text-teal-400 font-bold">{addon.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{addon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marketplace commission */}
        <motion.div
          className="mb-14 glass rounded-2xl p-6 border border-amber-400/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Marketplace Fees</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Commission', value: '15%', desc: 'Of final sale price' },
              { label: 'Listing Fee', value: 'Free', desc: 'Always — list as many as you want' },
              { label: 'Payout', value: '48 hrs', desc: 'After buyer confirms receipt' },
            ].map(item => (
              <div key={item.label} className="text-center p-4 glass rounded-xl">
                <div className="text-2xl font-black text-amber-400 mb-1">{item.value}</div>
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <motion.div
                key={i}
                className="glass rounded-2xl p-5"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <h3 className="font-semibold text-white mb-1.5">{item.q}</h3>
                <p className="text-sm text-slate-400">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
