// Outfit templates keyed by event type. AI logic fills items from user's closet.
export type WeatherKey = 'sunny-warm' | 'sunny-cool' | 'cloudy' | 'rainy';
export type EventKey = 'job-interview' | 'date-night' | 'fsu-game' | 'casual' | 'workout';

export interface OutfitTemplate {
  id: string;
  name: string;
  description: string;
  weather: WeatherKey[];
  event: EventKey;
  slots: {
    category: string;
    colorPreference?: string[];
  }[];
}

export const outfitTemplates: OutfitTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Power Interview Look',
    description: 'Sharp and professional for landing that dream job',
    weather: ['sunny-warm', 'sunny-cool', 'cloudy'],
    event: 'job-interview',
    slots: [
      { category: 'shirt', colorPreference: ['White', 'Light Blue', 'Navy'] },
      { category: 'pants', colorPreference: ['Black', 'Navy', 'Charcoal'] },
      { category: 'jacket', colorPreference: ['Navy', 'Black', 'Gray'] },
      { category: 'shoes', colorPreference: ['Black', 'Brown', 'Dark Brown'] },
    ],
  },
  {
    id: 'tpl-002',
    name: 'Polished Professional',
    description: 'Classic business attire that commands respect',
    weather: ['sunny-cool', 'cloudy', 'rainy'],
    event: 'job-interview',
    slots: [
      { category: 'shirt', colorPreference: ['White', 'Navy', 'Light Blue'] },
      { category: 'pants', colorPreference: ['Black', 'Khaki', 'Navy'] },
      { category: 'jacket', colorPreference: ['Charcoal', 'Navy', 'Gray'] },
      { category: 'accessories', colorPreference: ['Navy', 'Tan', 'Silver'] },
    ],
  },
  {
    id: 'tpl-003',
    name: 'Romantic Date Night',
    description: 'Effortlessly charming for a special evening',
    weather: ['sunny-warm', 'sunny-cool', 'cloudy'],
    event: 'date-night',
    slots: [
      { category: 'dress', colorPreference: ['Red', 'Black', 'Teal', 'Dusty Rose'] },
      { category: 'shoes', colorPreference: ['Black', 'Brown', 'Tan'] },
      { category: 'accessories', colorPreference: ['Silver', 'Tan', 'Gold'] },
    ],
  },
  {
    id: 'tpl-004',
    name: 'Sophisticated Evening Out',
    description: 'Smart casual for a perfect night in Tallahassee',
    weather: ['sunny-warm', 'cloudy'],
    event: 'date-night',
    slots: [
      { category: 'shirt', colorPreference: ['White', 'Black', 'Navy'] },
      { category: 'pants', colorPreference: ['Black', 'Dark Blue', 'Navy'] },
      { category: 'shoes', colorPreference: ['Black', 'Brown', 'Cognac'] },
      { category: 'accessories', colorPreference: ['Tan', 'Silver', 'Navy'] },
    ],
  },
  {
    id: 'tpl-005',
    name: 'FSU Game Day Spirit',
    description: 'Loud and proud for the Seminoles at Doak Campbell',
    weather: ['sunny-warm', 'sunny-cool', 'cloudy'],
    event: 'fsu-game',
    slots: [
      { category: 'shirt', colorPreference: ['Garnet', 'Gold', 'Maroon'] },
      { category: 'pants', colorPreference: ['Khaki', 'Dark Blue', 'Black'] },
      { category: 'shoes', colorPreference: ['White', 'Navy', 'Black'] },
      { category: 'accessories', colorPreference: ['Navy', 'Gold'] },
    ],
  },
  {
    id: 'tpl-006',
    name: 'Casual Weekend Vibe',
    description: 'Relaxed and stylish for a Tallahassee Saturday',
    weather: ['sunny-warm', 'sunny-cool'],
    event: 'casual',
    slots: [
      { category: 'shirt', colorPreference: ['Gray', 'Navy', 'White', 'Olive'] },
      { category: 'pants', colorPreference: ['Khaki', 'Light Blue', 'Olive'] },
      { category: 'shoes', colorPreference: ['White', 'Navy', 'Brown'] },
    ],
  },
  {
    id: 'tpl-007',
    name: 'Layered Cool-Weather Casual',
    description: 'Comfortable layers for Tallahassee\'s mild winters',
    weather: ['cloudy', 'rainy', 'sunny-cool'],
    event: 'casual',
    slots: [
      { category: 'shirt', colorPreference: ['Gray', 'Navy', 'Burgundy'] },
      { category: 'jacket', colorPreference: ['Gray', 'Tan', 'Navy', 'Black'] },
      { category: 'pants', colorPreference: ['Dark Blue', 'Black', 'Khaki'] },
      { category: 'shoes', colorPreference: ['Black', 'Brown', 'White'] },
    ],
  },
  {
    id: 'tpl-008',
    name: 'Active Workout Ready',
    description: 'Performance gear to dominate your workout',
    weather: ['sunny-warm', 'sunny-cool', 'cloudy'],
    event: 'workout',
    slots: [
      { category: 'shirt', colorPreference: ['Black', 'Gray', 'Navy', 'Gold'] },
      { category: 'pants', colorPreference: ['Black', 'Gray', 'Navy'] },
      { category: 'shoes', colorPreference: ['Navy/White', 'Black', 'White'] },
      { category: 'accessories', colorPreference: ['Navy', 'Black', 'Gray'] },
    ],
  },
];
