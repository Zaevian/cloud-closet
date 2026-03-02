import type { UserProfile } from '../types';

export function getSizeMatchHint(itemSize: string, category: string, user: UserProfile): string | undefined {
  const { shirtSize, waist, shoeSize, dressSize } = user.sizeProfile;

  if (category === 'shoes') {
    const itemShoeSize = parseFloat(itemSize);
    if (!isNaN(itemShoeSize)) {
      if (itemShoeSize === shoeSize) return `Perfect fit — your exact size ${shoeSize}`;
      if (Math.abs(itemShoeSize - shoeSize) <= 0.5) return `Runs close to your size ${shoeSize}`;
    }
    return undefined;
  }

  if (category === 'pants') {
    const waistMatch = itemSize.includes(String(waist));
    if (waistMatch) return `Fits your ${waist}" waist perfectly`;
    const w = parseInt(itemSize.split('x')[0]);
    if (!isNaN(w) && Math.abs(w - waist) === 1) return `Runs ${w > waist ? 'slightly large' : 'slightly small'} for your ${waist}" waist`;
    return undefined;
  }

  if (category === 'dress') {
    if (dressSize && itemSize === dressSize) return `Size ${dressSize} — your exact size!`;
    return undefined;
  }

  // shirts, jackets, accessories
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const userIdx = sizes.indexOf(shirtSize);
  const itemIdx = sizes.indexOf(itemSize.toUpperCase());
  if (itemIdx === -1 || userIdx === -1) return undefined;
  if (itemIdx === userIdx) return `Perfect fit for your size ${shirtSize}`;
  if (Math.abs(itemIdx - userIdx) === 1) return `Runs ${itemIdx > userIdx ? 'slightly large' : 'slightly small'} for your ${shirtSize}`;
  return undefined;
}
