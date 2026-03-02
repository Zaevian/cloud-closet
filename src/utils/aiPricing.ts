import type { ClothingCategory, ItemCondition, MarketplaceTier } from '../types';

const BASE_PRICES: Record<ClothingCategory, number> = {
  shirt: 8,
  pants: 14,
  jacket: 28,
  dress: 18,
  shoes: 22,
  accessories: 10,
  socks: 3,
  underwear: 4,
};

const CONDITION_MULTIPLIERS: Record<ItemCondition, number> = {
  'like-new': 1.5,
  'good': 1.0,
  'fair': 0.6,
};

export function suggestPrice(
  category: ClothingCategory,
  condition: ItemCondition,
  tier: MarketplaceTier,
  brand?: string
): number {
  const base = BASE_PRICES[category] ?? 10;
  const multiplier = CONDITION_MULTIPLIERS[condition];
  const brandBonus = brand && ['Nike', 'Patagonia', 'Levi\'s', 'Calvin Klein', 'Hugo Boss', 'Brooks Brothers'].includes(brand) ? 1.2 : 1.0;
  const jitter = (Math.floor(Math.random() * 5) - 2);

  let price = Math.round(base * multiplier * brandBonus) + jitter;

  if (tier === 'clearance') {
    price = Math.max(1, Math.min(20, price));
  } else {
    price = Math.max(35, price < 35 ? price + 30 : price);
  }

  return price;
}
