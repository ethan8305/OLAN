/**
 * Weekly streak + points engine.
 *
 * Pure functions only — given the current state and a newly VERIFIED return,
 * compute the next state. This file never calls verifyReturn(); it assumes the
 * caller already has a trusted result. That keeps the "is this real?" question
 * (verification) cleanly separate from the "what does it earn?" question (here).
 */

import {
  POINTS_PER_VERIFIED_RETURN,
  WEEKLY_POINT_EARNING_CAP,
} from '../config/gamification';
import type { ReturnEvent, WeeklyStreakState } from '../types/models';
import { currentWeekKey, isConsecutiveWeek, isoWeekKey, weeksAreEqual } from './weeks';

export function emptyStreak(): WeeklyStreakState {
  return { currentStreakWeeks: 0, longestStreakWeeks: 0, lastQualifiedWeek: null };
}

/** How many returns the user already logged in a given week. */
export function returnsInWeek(returns: ReturnEvent[], weekKey: string): number {
  return returns.filter((r) => isoWeekKey(r.timestamp) === weekKey).length;
}

/**
 * Decide the points for a return given how many returns already happened this
 * week. ANTI-GAMING: once we hit WEEKLY_POINT_EARNING_CAP, further returns earn
 * 0 — so buying extra containers to farm points is pointless past the cap.
 */
export function pointsForNextReturn(returnsAlreadyThisWeek: number): number {
  return returnsAlreadyThisWeek < WEEKLY_POINT_EARNING_CAP
    ? POINTS_PER_VERIFIED_RETURN
    : 0;
}

/**
 * Advance the weekly streak when a verified return lands in `weekKey`.
 * - Same week as last qualifying return -> streak unchanged (already counted).
 * - The very next calendar week -> streak + 1.
 * - A gap of 2+ weeks -> streak resets to 1 (this week starts a new run).
 */
export function advanceStreak(
  streak: WeeklyStreakState,
  weekKey: string
): WeeklyStreakState {
  let current: number;
  if (streak.lastQualifiedWeek === null) {
    current = 1;
  } else if (weeksAreEqual(streak.lastQualifiedWeek, weekKey)) {
    current = streak.currentStreakWeeks; // already counted this week
  } else if (isConsecutiveWeek(streak.lastQualifiedWeek, weekKey)) {
    current = streak.currentStreakWeeks + 1;
  } else {
    current = 1; // missed at least one week -> streak broke, restart
  }

  return {
    currentStreakWeeks: current,
    longestStreakWeeks: Math.max(streak.longestStreakWeeks, current),
    lastQualifiedWeek: weekKey,
  };
}

/**
 * A streak is only "alive" if the last qualifying week is the current week or
 * the one immediately before it. Used by the UI to show "keep it up!" vs
 * "your streak is at risk / has ended". Pure read — does not mutate state.
 */
export function streakIsAlive(streak: WeeklyStreakState, now = new Date()): boolean {
  if (streak.lastQualifiedWeek === null) return false;
  const thisWeek = isoWeekKey(now);
  if (weeksAreEqual(streak.lastQualifiedWeek, thisWeek)) return true;
  return isConsecutiveWeek(streak.lastQualifiedWeek, thisWeek);
}

/** Whether the user has already kept this week's streak alive. */
export function streakSafeThisWeek(streak: WeeklyStreakState): boolean {
  return weeksAreEqual(streak.lastQualifiedWeek, currentWeekKey());
}
