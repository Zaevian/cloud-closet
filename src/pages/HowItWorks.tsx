import { motion } from 'framer-motion';
import { CalendarCheck, Sparkles, ShieldCheck, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { staggerContainer, staggerChild } from '../motion';
import { Button } from '../components/ui/Button';

const steps = [
  {
    number: '01',
    icon: CalendarCheck,
    title: 'Book a Pickup',
    description: 'Schedule a free pickup from anywhere in Tallahassee. Choose your date, time slot, and we\'ll arrive at your door. No minimum — even a single item works.',
    color: 'teal',
    details: ['Free pickup for beta customers', 'Available 7 days a week', 'Friendly local team'],
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'We Clean & Catalog',
    description: 'Every item is professionally cleaned, inspected, and cataloged with a photo. Your Cloud Closet dashboard is updated within 24 hours so you can see every piece.',
    color: 'purple',
    details: ['Professional dry cleaning & laundering', 'High-res photos taken', 'Dashboard updated in 24 hours'],
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Secure Climate Storage',
    description: 'Your clothes rest in our climate-controlled Tallahassee facility — no moisture, no pests, no wrinkles. Protected by 24/7 security monitoring.',
    color: 'blue',
    details: ['Climate-controlled environment', '24/7 security monitoring', 'Garment bags & acid-free storage'],
  },
  {
    number: '04',
    icon: Truck,
    title: 'Request Delivery Anytime',
    description: 'Open the app, pick any item or a full outfit, and tap "Request Delivery." We deliver anywhere in Tallahassee the next business day by 6 PM.',
    color: 'amber',
    details: ['Next-day delivery in Tallahassee', 'Request single items or full outfits', 'AI Stylist ships complete looks'],
  },
  {
    number: '05',
    icon: ShoppingBag,
    title: 'Sell or Discover',
    description: 'Declutter by listing items in our integrated marketplace — clearance from $1 or premium resale at $35+. Or browse and buy from Tallahassee\'s community closet.',
    color: 'pink',
    details: ['AI-powered price suggestions', 'Size-matched recommendations', '15% commission on sales'],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; line: string }> = {
  teal: { bg: 'bg-teal-500/20', border: 'border-teal-400/30', text: 'text-teal-400', line: 'bg-teal-400/30' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-400/30', text: 'text-purple-400', line: 'bg-purple-400/30' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-400/30', text: 'text-blue-400', line: 'bg-blue-400/30' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-400/30', text: 'text-amber-400', line: 'bg-amber-400/30' },
  pink: { bg: 'bg-pink-500/20', border: 'border-pink-400/30', text: 'text-pink-400', line: 'bg-pink-400/30' },
};

export function HowItWorks() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-teal-400/30 text-teal-300 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple. Magical. Tallahassee-local.
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            How Cloud Closet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Works</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Five simple steps from your overflowing closet to a perfectly organized wardrobe, delivered on demand.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-teal-400/40 via-purple-400/20 to-transparent pointer-events-none hidden sm:block" />

          {steps.map((step, idx) => {
            const colors = colorMap[step.color];
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={staggerChild}
                className="relative flex gap-6 sm:gap-8"
              >
                {/* Step indicator */}
                <div className="shrink-0 flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 sm:w-20 sm:h-20 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center z-10 relative`}
                    whileInView={{ scale: [0.8, 1.05, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.text}`} />
                  </motion.div>
                  <span className={`text-xs font-bold mt-2 ${colors.text} hidden sm:block`}>{step.number}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className={`text-xs font-bold ${colors.text} uppercase tracking-wider`}>Step {step.number}</span>
                        <h3 className="text-xl font-bold text-white mt-1">{step.title}</h3>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/5 shrink-0">
                          <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
                        </div>
                      )}
                    </div>
                    <p className="text-slate-400 mb-5 leading-relaxed">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map(detail => (
                        <span
                          key={detail}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="glass rounded-3xl p-10 border border-teal-400/15">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to simplify your wardrobe?</h2>
            <p className="text-slate-400 mb-8">Join 23 Tallahassee residents who've already claimed their beta spot.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#waitlist">
                <Button size="lg" className="teal-glow-sm">
                  Join the Waitlist <ChevronRight />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="secondary">
                  See Pricing
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
