/**
 * Calendar-week utilities for the WEEKLY streak system.
 *
 * A "week" is an ISO week (Mon–Sun) computed in Singapore local time, so a
 * return at 11pm Sunday and one at 1am Monday land in different weeks the way a
 * user would expect. We key weeks as "YYYY-Www" (e.g. "2026-W24").
 */

import { STREAK_TIMEZONE } from '../config/gamification';

/** Get a Date's Y/M/D as observed in the configured timezone. */
function partsInTz(date: Date): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: STREAK_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [y, m, d] = fmt.format(date).split('-').map(Number);
  return { y, m, d };
}

/** ISO week number + ISO week-year for the given instant (timezone-aware). */
export function isoWeekKey(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const { y, m, d } = partsInTz(date);

  // Work on a UTC date built from the local Y/M/D so week math is DST-free.
  const target = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (target.getUTCDay() + 6) % 7; // Mon=0 .. Sun=6
  target.setUTCDate(target.getUTCDate() - dayNum + 3); // nearest Thursday
  const isoYear = target.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week =
    1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return `${isoYear}-W${String(week).padStart(2, '0')}`;
}

/** Parse a "YYYY-Www" key back into sortable numbers. */
function parseWeekKey(key: string): { year: number; week: number } {
  const [yearStr, weekStr] = key.split('-W');
  return { year: Number(yearStr), week: Number(weekStr) };
}

/**
 * True if `b` is the calendar week immediately after `a`.
 * Handles the year boundary (a week-53/week-52 year rolls into W01).
 */
export function isConsecutiveWeek(a: string, b: string): boolean {
  const pa = parseWeekKey(a);
  const pb = parseWeekKey(b);
  if (pb.year === pa.year) return pb.week === pa.week + 1;
  if (pb.year === pa.year + 1 && pb.week === 1) {
    // a must have been the last week of its year (52 or 53).
    return pa.week >= 52;
  }
  return false;
}

export function weeksAreEqual(a: string | null, b: string | null): boolean {
  return a !== null && a === b;
}

/** Convenience: the ISO week key for "now". */
export function currentWeekKey(): string {
  return isoWeekKey(new Date());
}
