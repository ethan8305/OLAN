/**
 * RECYCLABLE CHECKER dataset — the anti-contamination core of the app.
 *
 * Contamination (putting non-recyclables, or dirty items, into the blue bin) is
 * the single biggest reason Singapore's recycling rate underperforms: ~40% of
 * what goes into blue bins is rejected. So teaching "what actually goes in, and
 * WHY" is a first-class feature, not a footnote.
 *
 * This is a HAND-CURATED STARTER SET reflecting NEA blue-bin guidance and the
 * BCRS "Return Right" deposit scheme (plastic bottles + metal cans, 150ml–3L).
 *
 * TODO: replace/augment this seed with a live feed from NEA / BCRS once an open
 * dataset or API is available. Keep the RecyclableRule shape stable so the UI
 * doesn't need to change — only the source of `RECYCLABLES` does.
 */

import type { RecyclableRule } from '../types/models';

export const RECYCLABLES: RecyclableRule[] = [
  {
    id: 'plastic-bottle',
    name: 'Plastic drink bottle',
    aliases: ['water bottle', 'pet bottle', 'soft drink bottle', 'soda bottle'],
    category: 'beverage',
    emoji: '🥤',
    accepted: true,
    bcrsEligible: true,
    why: 'Empty PET bottles are widely recyclable AND carry a 10-cent deposit under Return Right. Return it to an RVM or deposit point to get your refund and keep it out of the bin.',
    prep: 'Empty it, replace the cap, and return whole.',
  },
  {
    id: 'metal-can',
    name: 'Drink can (aluminium)',
    aliases: ['soda can', 'beer can', 'soft drink can', 'tin can drink'],
    category: 'beverage',
    emoji: '🥫',
    accepted: true,
    bcrsEligible: true,
    why: 'Aluminium cans are infinitely recyclable and are covered by the Return Right deposit. Returning them recovers your deposit and saves a lot of energy vs. new metal.',
    prep: 'Empty it. Do not crush — RVMs read whole cans best.',
  },
  {
    id: 'glass-bottle',
    name: 'Glass bottle',
    aliases: ['wine bottle', 'sauce bottle', 'beer bottle glass'],
    category: 'glass',
    emoji: '🍾',
    accepted: true,
    bcrsEligible: false,
    why: 'Clean glass bottles and jars are recyclable in the blue bin. Glass is NOT part of the Return Right deposit scheme (that covers plastic bottles and metal cans only).',
    prep: 'Rinse it out. Lids can be removed and recycled separately if metal.',
  },
  {
    id: 'beverage-carton',
    name: 'Drink carton',
    aliases: ['milk carton', 'juice box', 'tetra pak', 'hl carton'],
    category: 'beverage',
    emoji: '🧃',
    accepted: true,
    bcrsEligible: false,
    why: 'Beverage cartons are accepted in NEA blue bins and recycled into paper products. They are not part of Return Right.',
    prep: 'Empty, give a quick rinse, and flatten.',
  },
  {
    id: 'bubble-tea-cup',
    name: 'Bubble tea cup',
    aliases: ['boba cup', 'bbt cup', 'plastic cup with film', 'sealed drink cup'],
    category: 'plastic',
    emoji: '🧋',
    accepted: false,
    bcrsEligible: false,
    why: 'Bubble tea cups are usually contaminated with sugary residue and tapioca, and the cup + sealing film + straw are mixed materials. They contaminate other recyclables, so they go in the general waste bin.',
    prep: 'Tip out leftover liquid before binning to avoid spills.',
  },
  {
    id: 'greasy-food-box',
    name: 'Greasy food box / pizza box',
    aliases: ['oily box', 'takeaway box', 'pizza box', 'food container dirty'],
    category: 'food',
    emoji: '🍕',
    accepted: false,
    bcrsEligible: false,
    why: 'Grease and food soak into paper/cardboard and cannot be removed at the recycling plant. Oily packaging ruins entire batches of otherwise-clean paper. Clean, dry portions can be torn off and recycled; greasy parts cannot.',
    prep: 'Tear off and recycle only clean, dry cardboard. Bin the greasy parts.',
  },
  {
    id: 'paper-cardboard',
    name: 'Paper & cardboard',
    aliases: ['newspaper', 'box', 'cardboard', 'office paper', 'magazine'],
    category: 'paper',
    emoji: '📦',
    accepted: true,
    bcrsEligible: false,
    why: 'Clean, dry paper and cardboard are highly recyclable. Keep them away from food and liquids so they stay clean.',
    prep: 'Flatten boxes. Remove heavy tape and food-soiled sections.',
  },
  {
    id: 'plastic-bag',
    name: 'Plastic bag / cling film',
    aliases: ['carrier bag', 'ziplock', 'plastic wrap', 'film'],
    category: 'plastic',
    emoji: '🛍️',
    accepted: false,
    bcrsEligible: false,
    why: 'Soft "scrunchable" plastics jam recycling sorting machinery and are not accepted in blue bins. Reuse them, or bin them.',
    prep: 'Reuse as a trash liner where you can.',
  },
  {
    id: 'styrofoam',
    name: 'Styrofoam / polystyrene',
    aliases: ['foam box', 'foam cup', 'packing foam', 'eps'],
    category: 'plastic',
    emoji: '🧊',
    accepted: false,
    bcrsEligible: false,
    why: 'Polystyrene foam is not recyclable through NEA blue bins — it breaks into pieces and contaminates the stream. Dispose of it as general waste.',
  },
  {
    id: 'glass-cup-ceramic',
    name: 'Drinking glass / ceramic mug',
    aliases: ['mug', 'ceramic', 'porcelain', 'broken cup'],
    category: 'glass',
    emoji: '🍶',
    accepted: false,
    bcrsEligible: false,
    why: 'Drinking glasses, ceramics and porcelain melt at different temperatures than bottle glass and contaminate glass recycling. Only glass bottles and jars are accepted.',
  },
  {
    id: 'aluminium-foil',
    name: 'Aluminium foil & trays',
    aliases: ['tin foil', 'foil tray', 'aluminium tray'],
    category: 'metal',
    emoji: '🍽️',
    accepted: true,
    bcrsEligible: false,
    why: 'Clean aluminium foil and trays are recyclable as metal. Food residue makes them non-recyclable, so they must be clean.',
    prep: 'Rinse off food. Scrunch foil into a ball so it is easy to sort.',
  },
  {
    id: 'tin-food-can',
    name: 'Food tin / can',
    aliases: ['canned food', 'tin', 'steel can', 'soup can'],
    category: 'metal',
    emoji: '🥫',
    accepted: true,
    bcrsEligible: false,
    why: 'Empty, rinsed food cans are recyclable as metal in the blue bin. They are NOT part of Return Right (that is beverage cans only).',
    prep: 'Rinse it out. Leave the label on — it burns off in processing.',
  },
];

/** Lowercased haystack for searching name + aliases. */
export function searchRecyclables(query: string): RecyclableRule[] {
  const q = query.trim().toLowerCase();
  if (!q) return RECYCLABLES;
  return RECYCLABLES.filter((r) => {
    const haystack = [r.name, ...r.aliases, r.category].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}
