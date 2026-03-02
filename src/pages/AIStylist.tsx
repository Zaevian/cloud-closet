import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Cloud, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/AppStoreContext';
import { PageShell } from '../components/layout/PageShell';
import { OutfitCard } from '../components/shared/OutfitCard';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { staggerContainer, staggerChild } from '../motion';
import { generateOutfits, WEATHER_OPTIONS, EVENT_OPTIONS, getWeatherKey } from '../utils/aiStylist';
import type { OutfitSuggestion } from '../types';
import type { WeatherKey, EventKey } from '../data/mockOutfits';

export function AIStylist() {
  const { state } = useAppStore();
  const [selectedWeather, setSelectedWeather] = useState<WeatherKey>('sunny-warm');
  const [selectedEvent, setSelectedEvent] = useState<EventKey>('casual');
  const [customEvent, setCustomEvent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Tallahassee weather simulation
  const currentWeather = WEATHER_OPTIONS.find(w => w.key === selectedWeather)!;

  function handleGenerate() {
    setGenerating(true);
    setHasGenerated(true);
    setOutfits([]);
    setTimeout(() => {
      const weatherKey = getWeatherKey(
        selectedWeather.includes('rainy') ? 'rainy' : selectedWeather.includes('cloudy') ? 'cloudy' : 'sunny',
        currentWeather.tempF
      );
      const generated = generateOutfits(state.closet, weatherKey, selectedEvent);
      setOutfits(generated);
      setGenerating(false);
    }, 1800);
  }

  useEffect(() => {
    // Auto-generate on first load
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Stylist</h1>
              <p className="text-slate-400 text-sm">Smart outfit suggestions from your Cloud Closet</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-5">
            {/* Tallahassee Weather */}
            <motion.div
              className="glass rounded-2xl p-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-4 h-4 text-teal-400" />
                <h2 className="font-semibold text-white text-sm">Tallahassee Weather</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WEATHER_OPTIONS.map(w => (
                  <motion.button
                    key={w.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedWeather(w.key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-sm font-medium transition-all border ${
                      selectedWeather === w.key
                        ? 'bg-teal-500/20 border-teal-400/40 text-teal-300'
                        : 'glass border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl">{w.emoji}</span>
                    <span className="text-xs leading-tight text-center">{w.label}</span>
                    <span className="text-xs text-slate-500">{w.tempF}°F</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Event / Occasion */}
            <motion.div
              className="glass rounded-2xl p-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h2 className="font-semibold text-white text-sm">Today's Occasion</h2>
              </div>
              <div className="space-y-2">
                {EVENT_OPTIONS.map(ev => (
                  <motion.button
                    key={ev.key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedEvent(ev.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                      selectedEvent === ev.key
                        ? 'bg-purple-500/20 border-purple-400/40 text-purple-300'
                        : 'glass border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="text-base">{ev.emoji}</span>
                    {ev.label}
                    {selectedEvent === ev.key && (
                      <motion.span
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                        layoutId="event-dot"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Custom event input */}
              <div className="mt-3">
                <input
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-400/40 transition-colors bg-transparent"
                  placeholder="Or describe your event…"
                  value={customEvent}
                  onChange={e => setCustomEvent(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Generate Button */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 border-0 teal-glow-sm"
                onClick={handleGenerate}
                loading={generating}
                icon={<Sparkles className="w-5 h-5" />}
              >
                {generating ? 'Generating Outfits…' : 'Generate My Outfits'}
              </Button>
            </motion.div>

            {/* Tips */}
            <motion.div
              className="glass rounded-xl p-4 border border-amber-400/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs font-semibold text-amber-400 mb-2">✨ Stylist Tips</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• Rainy days automatically include a jacket from your closet</li>
                <li>• FSU Game Day picks garnet &amp; gold whenever possible</li>
                <li>• Hit "Ship This Look" to get the full outfit delivered tomorrow</li>
              </ul>
            </motion.div>
          </div>

          {/* Outfits Panel */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">
                {generating ? 'Crafting your looks…' : hasGenerated ? `${outfits.length} Outfit${outfits.length !== 1 ? 's' : ''} Generated` : 'Your Outfits'}
              </h2>
              {outfits.length > 0 && !generating && (
                <button
                  className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors"
                  onClick={handleGenerate}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div
                  key="loading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[1, 2].map(i => (
                    <div key={i} className="glass rounded-2xl overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <SkeletonCard />
                      </div>
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex items-center justify-center gap-3 py-6">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-teal-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-purple-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.33 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-teal-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.66 }}
                    />
                    <span className="text-sm text-slate-400">AI is styling your look…</span>
                  </div>
                </motion.div>
              ) : outfits.length > 0 ? (
                <motion.div
                  key="results"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {outfits.map(outfit => (
                    <OutfitCard key={outfit.id} outfit={outfit} />
                  ))}
                </motion.div>
              ) : hasGenerated ? (
                <motion.div
                  key="empty"
                  variants={staggerChild}
                  initial="initial"
                  animate="animate"
                  className="glass rounded-2xl p-12 text-center"
                >
                  <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">No outfits generated</h3>
                  <p className="text-slate-400 text-sm">Try a different weather or occasion combination.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Recent outfit history */}
            {state.outfitHistory.length > 0 && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold text-slate-400 text-sm mb-3">Recent Looks</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {state.outfitHistory.slice(0, 5).map(outfit => (
                    <div key={outfit.id} className="glass rounded-xl p-3 shrink-0 w-48">
                      <p className="text-xs font-medium text-white truncate">{outfit.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{outfit.items.length} items</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
