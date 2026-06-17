/**
 * GAMIFICATION CONFIG — single source of truth for all anti-gaming rules.
 *
 * WHY these exist:
 * The danger of any "points for recycling" app is that it incentivises the wrong
 * behaviour — people buying drinks they don't want, or worse, buying empty
 * containers, just to farm points. That is bad for the environment AND bankrupts
 * the reward economy. We defend against this on three layers:
 *
 *   1. VERIFICATION (see services/verification): a point can only come from a
 *      return that BCRS/an RVM actually confirmed. No honour system, ever.
 *   2. IDENTITY (see User.phone): one verified phone = one wallet, so you cannot
 *      multiply rewards by spinning up accounts.
 *   3. WEEKLY EARNING CAP (this file): points stop accruing once you pass a
 *      realistic weekly consumption volume, so buying *extra* containers to farm
 *      points yields literally nothing past the cap.
 *
 * Tune these constants here and nowhere else.
 */

/**
 * Maximum number of returns per calendar week that EARN points.
 * Set just above normal household consumption: a heavy-but-honest drinker might
 * return ~14 containers/week (2/day). Returns beyond this still count toward the
 * streak and lifetime stats, but earn 0 points — so farming has no payoff.
 */
export const WEEKLY_POINT_EARNING_CAP = 15;

/** Points awarded per verified, under-cap return. Flat rate keeps it simple. */
export const POINTS_PER_VERIFIED_RETURN = 10;

/**
 * Streak cadence is WEEKLY, not daily. At least one verified return within a
 * calendar week (Mon–Sun, local time) keeps the streak alive. We deliberately
 * avoid a daily streak: returning a container every single day is unrealistic
 * and would punish normal behaviour, pushing people toward gaming.
 */
export const STREAK_CADENCE = 'weekly' as const;

/** Locale/timezone used to compute "which calendar week" a return falls in. */
export const STREAK_TIMEZONE = 'Asia/Singapore';
