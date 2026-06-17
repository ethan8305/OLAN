/**
 * Central app store (zustand). Holds the single local user's AppData and exposes
 * typed actions. It is the ONLY place that:
 *   - calls verifyReturn() (the verification seam), and
 *   - applies streak + points logic to a verified result.
 *
 * Components never compute points themselves — they dispatch intent and read
 * derived state. That keeps the anti-gaming rules in exactly one place.
 */

import { create } from 'zustand';
import { freshAppData, repository } from '../services/backend';
import { verifyReturn } from '../services/verification';
import {
  advanceStreak,
  pointsForNextReturn,
  returnsInWeek,
} from '../lib/streaks';
import { isoWeekKey } from '../lib/weeks';
import { getCosmetic } from '../data/cosmetics';
import type { AppData, ReturnEvent, User } from '../types/models';

/** Result of attempting to log a return, surfaced to the UI. */
export interface LogReturnOutcome {
  ok: boolean;
  /** Points earned (0 if past the weekly cap, even when valid). */
  pointsEarned: number;
  /** True when valid but the weekly earning cap was already reached. */
  cappedNoPoints: boolean;
  reason?: string;
  containerType?: ReturnEvent['containerType'];
}

interface StoreState extends AppData {
  hydrated: boolean;

  hydrate: () => Promise<void>;
  completeOnboarding: () => void;

  /** Create or sign in the single local user. Phone is the identity key. */
  authenticate: (args: {
    phone: string;
    displayName?: string;
    oauthGoogle?: boolean;
  }) => void;

  setAvatar: (avatarId: string) => void;

  /** Log a return — runs verification, then applies streak + points. */
  logReturn: (code: string) => Promise<LogReturnOutcome>;

  buyCosmetic: (itemId: string) => { ok: boolean; reason?: string };
  toggleEquip: (itemId: string) => void;

  resetAll: () => Promise<void>;
}

/** Persist the AppData slice of the store (fire-and-forget). */
function persist(state: AppData) {
  void repository.save({
    user: state.user,
    returns: state.returns,
    streak: state.streak,
    points: state.points,
    onboarded: state.onboarded,
  });
}

export const useStore = create<StoreState>((set, get) => ({
  ...freshAppData(),
  hydrated: false,

  async hydrate() {
    const data = await repository.load();
    set({ ...data, hydrated: true });
  },

  completeOnboarding() {
    set({ onboarded: true });
    persist(get());
  },

  authenticate({ phone, displayName, oauthGoogle }) {
    const existing = get().user;
    // Reuse the existing user if the same phone signs back in, so streak/points
    // survive. Phone == identity; a different phone is a different account.
    const user: User =
      existing && existing.phone === phone
        ? existing
        : {
            id: `user-${phone}`,
            phone,
            displayName: displayName?.trim() || 'Recycler',
            oauthGoogle: Boolean(oauthGoogle),
            avatarId: '',
            ownedItemIds: [],
            equippedItemIds: [],
            createdAt: new Date().toISOString(),
          };
    set({ user });
    persist(get());
  },

  setAvatar(avatarId) {
    const user = get().user;
    if (!user) return;
    set({ user: { ...user, avatarId } });
    persist(get());
  },

  async logReturn(code) {
    const user = get().user;
    if (!user) return { ok: false, pointsEarned: 0, cappedNoPoints: false, reason: 'Not signed in.' };

    // 1) VERIFY — the only source of truth. No points without a valid result.
    const result = await verifyReturn({ code, userId: user.id });
    if (!result.valid || !result.containerType) {
      return {
        ok: false,
        pointsEarned: 0,
        cappedNoPoints: false,
        reason: result.reason ?? 'Verification failed.',
      };
    }

    // 2) Guard against double-claiming the same physical return.
    const { returns } = get();
    if (returns.some((r) => r.verificationRef === result.verificationRef)) {
      return {
        ok: false,
        pointsEarned: 0,
        cappedNoPoints: false,
        reason: 'That return has already been counted.',
      };
    }

    // 3) Apply the WEEKLY anti-gaming cap to decide points.
    const weekKey = isoWeekKey(result.timestamp);
    const alreadyThisWeek = returnsInWeek(returns, weekKey);
    const pointsEarned = pointsForNextReturn(alreadyThisWeek);
    const cappedNoPoints = pointsEarned === 0;

    const event: ReturnEvent = {
      id: `ret-${Date.now()}`,
      userId: user.id,
      containerType: result.containerType,
      timestamp: result.timestamp,
      verificationRef: result.verificationRef,
      earnedPoints: pointsEarned,
    };

    // 4) Streak advances on ANY verified return this week, capped or not.
    const nextStreak = advanceStreak(get().streak, weekKey);

    set({
      returns: [...returns, event],
      points: get().points + pointsEarned,
      streak: nextStreak,
    });
    persist(get());

    return {
      ok: true,
      pointsEarned,
      cappedNoPoints,
      containerType: result.containerType,
    };
  },

  buyCosmetic(itemId) {
    const { user, points } = get();
    if (!user) return { ok: false, reason: 'Not signed in.' };
    const item = getCosmetic(itemId);
    if (!item) return { ok: false, reason: 'Unknown item.' };
    if (user.ownedItemIds.includes(itemId)) return { ok: false, reason: 'Already owned.' };
    if (points < item.pricePoints) return { ok: false, reason: 'Not enough points.' };

    set({
      points: points - item.pricePoints,
      user: { ...user, ownedItemIds: [...user.ownedItemIds, itemId] },
    });
    persist(get());
    return { ok: true };
  },

  toggleEquip(itemId) {
    const user = get().user;
    if (!user || !user.ownedItemIds.includes(itemId)) return;
    const item = getCosmetic(itemId);
    if (!item) return;

    // Only one item per slot can be equipped at a time.
    const sameSlotEquipped = user.equippedItemIds.filter((id) => {
      const c = getCosmetic(id);
      return c && c.slot === item.slot;
    });
    const isEquipped = user.equippedItemIds.includes(itemId);

    let equipped = user.equippedItemIds.filter((id) => !sameSlotEquipped.includes(id));
    if (!isEquipped) equipped = [...equipped, itemId];

    set({ user: { ...user, equippedItemIds: equipped } });
    persist(get());
  },

  async resetAll() {
    await repository.clear();
    set({ ...freshAppData(), hydrated: true });
  },
}));
