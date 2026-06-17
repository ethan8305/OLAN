/**
 * Cosmetic reward catalogue. v1 rewards are COSMETIC-ONLY: points buy avatar
 * clothing/items and nothing else. No real goods, no money, no marketplace.
 * This keeps the economy closed and removes any incentive to game points for
 * cash value. The "real marketplace" is explicitly out of scope (see Rewards UI
 * for the disabled "coming soon" stub).
 */

import type { CosmeticItem } from '../types/models';

export const COSMETICS: CosmeticItem[] = [
  { id: 'hat-cap', name: 'Green Cap', emoji: '🧢', slot: 'hat', pricePoints: 50 },
  { id: 'hat-crown', name: 'Eco Crown', emoji: '👑', slot: 'hat', pricePoints: 300 },
  { id: 'hat-party', name: 'Party Hat', emoji: '🎉', slot: 'hat', pricePoints: 120 },
  { id: 'top-scarf', name: 'Cozy Scarf', emoji: '🧣', slot: 'top', pricePoints: 80 },
  { id: 'top-tee', name: 'Recycle Tee', emoji: '♻️', slot: 'top', pricePoints: 60 },
  { id: 'acc-glasses', name: 'Cool Shades', emoji: '🕶️', slot: 'accessory', pricePoints: 90 },
  { id: 'acc-medal', name: 'Gold Medal', emoji: '🏅', slot: 'accessory', pricePoints: 200 },
  { id: 'bg-forest', name: 'Forest Backdrop', emoji: '🌳', slot: 'background', pricePoints: 150 },
  { id: 'bg-ocean', name: 'Ocean Backdrop', emoji: '🌊', slot: 'background', pricePoints: 150 },
];

export function getCosmetic(id: string): CosmeticItem | undefined {
  return COSMETICS.find((c) => c.id === id);
}
