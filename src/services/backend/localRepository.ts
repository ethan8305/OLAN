/**
 * Mock backend: persists the whole AppData blob to localStorage.
 *
 * This stands in for json-server / a real API during development. It is async on
 * purpose so swapping in a network-backed Repository later changes nothing about
 * how callers await it.
 *
 * TODO: replace with a real API client (the production backend would also move
 * points/streak computation server-side so they can't be tampered with).
 */

import { emptyStreak } from '../../lib/streaks';
import type { AppData } from '../../types/models';
import type { Repository } from './types';

const STORAGE_KEY = 'reloop.appdata.v1';

export function freshAppData(): AppData {
  return {
    user: null,
    returns: [],
    streak: emptyStreak(),
    points: 0,
    onboarded: false,
  };
}

export const localRepository: Repository = {
  async load(): Promise<AppData> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return freshAppData();
      const parsed = JSON.parse(raw) as Partial<AppData>;
      // Merge over a fresh shape so older/missing fields can't crash the app.
      const merged = { ...freshAppData(), ...parsed };
      // Normalise the user so a record saved under an older schema (before
      // email/roomItemIds existed) can't crash newer screens.
      if (merged.user) {
        const u = merged.user as Partial<AppData['user']> & Record<string, unknown>;
        merged.user = {
          ...(u as object),
          email: (u.email as string | null) ?? null,
          phone: (u.phone as string | null) ?? null,
          authMethod: (u.authMethod as 'google' | 'email' | 'phone') ?? 'email',
          ownedItemIds: (u.ownedItemIds as string[]) ?? [],
          equippedItemIds: (u.equippedItemIds as string[]) ?? [],
          roomItemIds: (u.roomItemIds as string[]) ?? [],
        } as AppData['user'];
      }
      return merged;
    } catch {
      return freshAppData();
    }
  },

  async save(data: AppData): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  },
};
