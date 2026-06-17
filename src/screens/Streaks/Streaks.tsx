import { useStore } from '../../store/useStore';
import { BADGES, nextBadge, unlockedBadges } from '../../data/badges';
import { streakIsAlive } from '../../lib/streaks';
import { isoWeekKey } from '../../lib/weeks';

export function Streaks() {
  const { streak, points, returns } = useStore();
  const alive = streakIsAlive(streak);
  const unlocked = unlockedBadges(streak.longestStreakWeeks);
  const upcoming = nextBadge(streak.longestStreakWeeks);
  const unlockedIds = new Set(unlocked.map((b) => b.id));

  // Build the last 8 weeks (oldest -> newest) and mark which had a return.
  const activeWeeks = new Set(returns.map((r) => isoWeekKey(r.timestamp)));
  const recentWeeks = lastNWeekKeys(8);

  return (
    <div className="space-y-6 px-5 pt-6">
      <header>
        <h1 className="text-2xl font-extrabold text-slate-800">Your streak</h1>
        <p className="text-sm text-slate-400">One verified return a week keeps it burning.</p>
      </header>

      <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 p-5 text-white shadow-lg">
        <div className="text-6xl">{alive ? '🔥' : '🥲'}</div>
        <div>
          <p className="text-4xl font-extrabold">{streak.currentStreakWeeks} weeks</p>
          <p className="text-sm text-white/90">Best: {streak.longestStreakWeeks} weeks</p>
        </div>
      </div>

      {/* Weekly dots — Duolingo-style but per WEEK, not per day. */}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Last 8 weeks
        </h2>
        <div className="flex justify-between gap-1.5">
          {recentWeeks.map((wk) => {
            const hit = activeWeeks.has(wk);
            return (
              <div key={wk} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`flex aspect-square w-full max-w-[40px] items-center justify-center rounded-2xl text-lg ${
                    hit ? 'bg-brand-500 text-white shadow' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {hit ? '✓' : '·'}
                </div>
                <span className="text-[10px] text-slate-400">{wk.split('-W')[1]}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-400">Points balance</p>
        <p className="text-3xl font-extrabold text-slate-800">⭐ {points.toLocaleString()}</p>
      </div>

      {/* Badges */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Badges</h2>
          {upcoming && (
            <span className="text-xs text-slate-400">
              Next: {upcoming.label} @ {upcoming.requiredStreakWeeks} wk
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const got = unlockedIds.has(b.id);
            return (
              <div
                key={b.id}
                className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-center ${
                  got ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-slate-100 opacity-60'
                }`}
              >
                <span className={`text-3xl ${got ? '' : 'grayscale'}`}>{b.emoji}</span>
                <span className="text-[11px] font-semibold leading-tight text-slate-700">
                  {b.label}
                </span>
                <span className="text-[10px] text-slate-400">{b.requiredStreakWeeks} wk</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/** The ISO week keys for the last n weeks, oldest first. */
function lastNWeekKeys(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    keys.push(isoWeekKey(d));
  }
  return keys;
}
