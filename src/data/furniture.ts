/**
 * PLACEHOLDER recycled-themed furniture for the customisable room (under
 * cosmetic Rewards). v1 keeps this cosmetic-only and intentionally simple: a
 * small starter set you can place/remove. The "real" furniture economy
 * (sponsor furniture, blind boxes) is OUT OF SCOPE — see the Extra tab + the
 * out-of-scope list. Prices are in points, same closed cosmetic economy.
 */

export interface FurnitureItem {
  id: string;
  name: string;
  emoji: string;
  pricePoints: number;
}

export const FURNITURE: FurnitureItem[] = [
  { id: 'fn-plant', name: 'Potted Plant', emoji: '🪴', pricePoints: 40 },
  { id: 'fn-pallet-sofa', name: 'Pallet Sofa', emoji: '🛋️', pricePoints: 120 },
  { id: 'fn-crate-shelf', name: 'Crate Shelf', emoji: '🗄️', pricePoints: 90 },
  { id: 'fn-jar-lamp', name: 'Jar Lamp', emoji: '🏮', pricePoints: 70 },
  { id: 'fn-rug', name: 'Rag Rug', emoji: '🧶', pricePoints: 60 },
  { id: 'fn-bottle-art', name: 'Bottle Wall Art', emoji: '🖼️', pricePoints: 110 },
];

export function getFurniture(id: string): FurnitureItem | undefined {
  return FURNITURE.find((f) => f.id === id);
}
