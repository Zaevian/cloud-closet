import type { ClothingCategory, ItemStatus } from '../../types';

const categoryColors: Record<ClothingCategory, string> = {
  shirt: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  pants: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
  jacket: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  dress: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
  shoes: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  accessories: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
  socks: 'bg-green-500/20 text-green-300 border-green-400/30',
  underwear: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
};

const statusColors: Record<ItemStatus, string> = {
  stored: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
  delivering: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  'at-home': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  listed: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
};

const statusLabels: Record<ItemStatus, string> = {
  stored: 'In Cloud',
  delivering: 'On the Way',
  'at-home': 'At Home',
  listed: 'Listed',
};

interface BadgeProps {
  type: 'category' | 'status';
  value: ClothingCategory | ItemStatus;
}

export function Badge({ type, value }: BadgeProps) {
  const colorClass = type === 'category'
    ? categoryColors[value as ClothingCategory]
    : statusColors[value as ItemStatus];

  const label = type === 'status'
    ? statusLabels[value as ItemStatus]
    : value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  );
}
