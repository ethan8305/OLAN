/**
 * Lifetime impact estimates for the dashboard.
 *
 * These are ESTIMATES for motivation, not audited figures. Per-container factors
 * are rough averages drawn from public life-cycle figures; they are intentionally
 * conservative. When BCRS/NEA publish official per-container impact factors, swap
 * the constants below.  // TODO: load real impact factors from NEA/BCRS.
 */

import type { ContainerType, ReturnEvent } from '../types/models';

/** Approx. grams of CO2-equivalent avoided by recycling vs. landfilling one unit. */
const CO2E_GRAMS_BY_TYPE: Record<ContainerType, number> = {
  plastic_bottle: 82, // ~500ml PET bottle
  metal_can: 110, // aluminium has a high recycling benefit
  glass_bottle: 95,
  carton: 40,
};

/** Approx. grams of material diverted from landfill per unit. */
const MASS_GRAMS_BY_TYPE: Record<ContainerType, number> = {
  plastic_bottle: 18,
  metal_can: 15,
  glass_bottle: 200,
  carton: 28,
};

export interface LifetimeStats {
  totalReturns: number;
  co2eGrams: number;
  landfillGrams: number;
  byType: Record<ContainerType, number>;
}

export function computeLifetimeStats(returns: ReturnEvent[]): LifetimeStats {
  const byType: Record<ContainerType, number> = {
    plastic_bottle: 0,
    metal_can: 0,
    glass_bottle: 0,
    carton: 0,
  };
  let co2eGrams = 0;
  let landfillGrams = 0;

  for (const r of returns) {
    byType[r.containerType] += 1;
    co2eGrams += CO2E_GRAMS_BY_TYPE[r.containerType];
    landfillGrams += MASS_GRAMS_BY_TYPE[r.containerType];
  }

  return { totalReturns: returns.length, co2eGrams, landfillGrams, byType };
}

/** Format grams as a friendly kg/g string. */
export function formatMass(grams: number): string {
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)} kg`;
  return `${Math.round(grams)} g`;
}
