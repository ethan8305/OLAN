/**
 * Core domain models.
 *
 * This app is an ENGAGEMENT LAYER on top of Singapore's BCRS "Return Right"
 * beverage container deposit scheme. It does not move money, hold deposits, or
 * replace any official refund flow — it adds streaks, points, and education on
 * top of returns that BCRS has already verified.
 */

/**
 * Container types recognised by BCRS at MVP.
 * Singapore's BCRS launch covers pre-packaged beverages in plastic bottles and
 * metal cans (150ml–3L). We model the small set we can actually verify today.
 */
export type ContainerType = 'plastic_bottle' | 'metal_can' | 'glass_bottle' | 'carton';

export interface User {
  id: string;
  /**
   * Phone number is the PRIMARY identity and the anti-multi-accounting control.
   * One verified phone == one streak == one points wallet. See auth comments and
   * verifyReturn() — points fraud is mostly defeated at the identity layer, not
   * the points layer, so we treat phone as a first-class, immutable-ish key.
   */
  phone: string;
  displayName: string;
  /** True when the account was created via Google OAuth (still phone-bound). */
  oauthGoogle: boolean;
  avatarId: string;
  /** Cosmetic items the user owns (rewards are cosmetic-only in v1). */
  ownedItemIds: string[];
  /** Cosmetic items currently equipped on the avatar. */
  equippedItemIds: string[];
  createdAt: string; // ISO
}

/**
 * A single VERIFIED return event. We never create one of these from the honour
 * system — it only exists because verifyReturn() returned { valid: true }.
 */
export interface ReturnEvent {
  id: string;
  userId: string;
  containerType: ContainerType;
  /** ISO timestamp of when BCRS/RVM confirmed the return. */
  timestamp: string;
  /** The opaque code/receipt that proved this return (audit trail). */
  verificationRef: string;
  /**
   * Whether this return earned points. Returns past the weekly anti-gaming cap
   * are still recorded (they count for the streak + lifetime stats) but earn 0
   * points. Keeping them lets us show honest lifetime totals.
   */
  earnedPoints: number;
}

export interface WeeklyStreakState {
  /** Number of consecutive calendar weeks with >= 1 verified return. */
  currentStreakWeeks: number;
  longestStreakWeeks: number;
  /** ISO week key (e.g. "2026-W24") of the most recent qualifying return. */
  lastQualifiedWeek: string | null;
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  emoji: string;
  /** Streak length (in weeks) required to unlock. */
  requiredStreakWeeks: number;
}

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  /** Tailwind gradient classes for the avatar's backdrop. */
  bg: string;
}

export type CosmeticSlot = 'hat' | 'top' | 'accessory' | 'background';

export interface CosmeticItem {
  id: string;
  name: string;
  emoji: string;
  slot: CosmeticSlot;
  /** Price in points. Cosmetic-only — these never cost or pay out real money. */
  pricePoints: number;
}

/** Recyclable Checker entry — seeded from NEA / BCRS guidance. */
export interface RecyclableRule {
  id: string;
  /** Common name(s) people would search for. */
  name: string;
  /** Extra search aliases (brand-y or colloquial terms). */
  aliases: string[];
  category: 'beverage' | 'paper' | 'plastic' | 'metal' | 'glass' | 'food' | 'other';
  emoji: string;
  /** Whether the item is accepted in Singapore's blue-bin recycling stream. */
  accepted: boolean;
  /** Whether the item is also eligible for a BCRS deposit refund. */
  bcrsEligible: boolean;
  /** Plain-language WHY — this is the anti-contamination teaching moment. */
  why: string;
  /** Optional prep instruction (e.g. "rinse and flatten"). */
  prep?: string;
}

/** The full persisted application state for the (single) local user. */
export interface AppData {
  user: User | null;
  returns: ReturnEvent[];
  streak: WeeklyStreakState;
  points: number;
  /** Onboarding completion flag so we don't replay slides every launch. */
  onboarded: boolean;
}
