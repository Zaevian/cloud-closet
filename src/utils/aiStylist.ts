import type { ClothingItem, OutfitSuggestion } from '../types';
import { outfitTemplates } from '../data/mockOutfits';
import type { WeatherKey, EventKey } from '../data/mockOutfits';
import { generateId } from './format';

export function getWeatherKey(condition: string, tempF: number): WeatherKey {
  if (condition === 'rainy') return 'rainy';
  if (condition === 'cloudy') return 'cloudy';
  if (tempF >= 68) return 'sunny-warm';
  return 'sunny-cool';
}

function colorMatches(itemColor: string, preferred: string[]): boolean {
  const lc = itemColor.toLowerCase();
  return preferred.some(p => lc.includes(p.toLowerCase()) || p.toLowerCase().includes(lc));
}

function pickItem(closet: ClothingItem[], category: string, colorPrefs: string[], usedIds: Set<string>): ClothingItem | undefined {
  const candidates = closet.filter(i => i.category === category && !usedIds.has(i.id));
  if (candidates.length === 0) return undefined;

  // prefer color match
  const colorMatch = candidates.find(i => colorMatches(i.color, colorPrefs));
  const chosen = colorMatch ?? candidates[0];
  usedIds.add(chosen.id);
  return chosen;
}

export function generateOutfits(
  closet: ClothingItem[],
  weatherKey: WeatherKey,
  eventKey: EventKey
): OutfitSuggestion[] {
  const matchingTemplates = outfitTemplates.filter(
    t => t.event === eventKey && t.weather.includes(weatherKey)
  );

  // fallback: use casual templates if no match
  const templates = matchingTemplates.length > 0
    ? matchingTemplates.slice(0, 3)
    : outfitTemplates.filter(t => t.event === 'casual').slice(0, 2);

  const outfits: OutfitSuggestion[] = [];
  const globalUsed = new Set<string>();

  const weatherLabel: Record<WeatherKey, string> = {
    'sunny-warm': 'Sunny & Warm',
    'sunny-cool': 'Sunny & Cool',
    'cloudy': 'Cloudy',
    'rainy': 'Rainy',
  };

  const tempMap: Record<WeatherKey, number> = {
    'sunny-warm': 74,
    'sunny-cool': 62,
    'cloudy': 65,
    'rainy': 66,
  };

  for (const template of templates) {
    const localUsed = new Set<string>(globalUsed);
    const items: ClothingItem[] = [];

    for (const slot of template.slots) {
      const item = pickItem(closet, slot.category, slot.colorPreference ?? [], localUsed);
      if (item) {
        items.push(item);
        localUsed.add(item.id);
      }
    }

    // Always add jacket for rainy weather if not already included
    if (weatherKey === 'rainy' && !items.some(i => i.category === 'jacket')) {
      const jacket = pickItem(closet, 'jacket', ['Gray', 'Tan', 'Black', 'Navy'], localUsed);
      if (jacket) items.push(jacket);
    }

    if (items.length >= 2) {
      outfits.push({
        id: generateId(),
        name: template.name,
        items,
        weather: { condition: weatherLabel[weatherKey], tempF: tempMap[weatherKey] },
        event: eventKey,
        generatedAt: new Date().toISOString(),
      });
      // mark items as globally used to avoid repeats
      items.forEach(i => globalUsed.add(i.id));
    }
  }

  return outfits;
}

export const WEATHER_OPTIONS: { key: WeatherKey; label: string; emoji: string; tempF: number }[] = [
  { key: 'sunny-warm', label: 'Sunny & Warm', emoji: '☀️', tempF: 74 },
  { key: 'sunny-cool', label: 'Sunny & Cool', emoji: '🌤️', tempF: 62 },
  { key: 'cloudy', label: 'Cloudy', emoji: '☁️', tempF: 65 },
  { key: 'rainy', label: 'Rainy', emoji: '🌧️', tempF: 66 },
];

export const EVENT_OPTIONS: { key: EventKey; label: string; emoji: string }[] = [
  { key: 'job-interview', label: 'Job Interview', emoji: '💼' },
  { key: 'date-night', label: 'Date Night', emoji: '🌹' },
  { key: 'fsu-game', label: 'FSU Game Day', emoji: '🏈' },
  { key: 'casual', label: 'Casual Day', emoji: '😎' },
  { key: 'workout', label: 'Workout', emoji: '💪' },
];
