import type { Badge } from '../types/models';

/** Streak-milestone badges (weeks of consecutive returning). */
export const BADGES: Badge[] = [
  { id: 'first-return', label: 'First Return', description: 'You returned your first container!', emoji: '🌟', requiredStreakWeeks: 1 },
  { id: 'three-week', label: 'Getting the Habit', description: '3 weeks in a row', emoji: '🔁', requiredStreakWeeks: 3 },
  { id: 'six-week', label: 'Committed', description: '6 weeks in a row', emoji: '💪', requiredStreakWeeks: 6 },
  { id: 'twelve-week', label: 'Quarter Champ', description: '12 weeks in a row', emoji: '🏆', requiredStreakWeeks: 12 },
  { id: 'twentysix-week', label: 'Half-Year Hero', description: '26 weeks in a row', emoji: '🦸', requiredStreakWeeks: 26 },
  { id: 'fiftytwo-week', label: 'Year of Loops', description: '52 weeks in a row', emoji: '👑', requiredStreakWeeks: 52 },
];

/** Badges unlocked given the user's best streak. */
export function unlockedBadges(longestStreakWeeks: number): Badge[] {
  return BADGES.filter((b) => longestStreakWeeks >= b.requiredStreakWeeks);
}

/** The next badge to chase, if any. */
export function nextBadge(longestStreakWeeks: number): Badge | null {
  return BADGES.find((b) => longestStreakWeeks < b.requiredStreakWeeks) ?? null;
}
