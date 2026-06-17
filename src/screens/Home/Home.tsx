import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { AvatarDisplay } from '../../components/AvatarDisplay';
import { Button } from '../../components/Button';
import { LogReturnSheet } from '../../components/LogReturnSheet';
import { streakSafeThisWeek, streakIsAlive, returnsInWeek } from '../../lib/streaks';
import { WEEKLY_POINT_EARNING_CAP } from '../../config/gamification';
import { currentWeekKey } from '../../lib/weeks';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, streak, points, returns } = useStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  if (!user) return null;

  const safe = streakSafeThisWeek(streak);
  const alive = streakIsAlive(streak);
  const thisWeekCount = returnsInWeek(returns, currentWeekKey());
  const earningLeft = Math.max(0, WEEKLY_POINT_EARNING_CAP - thisWeekCount);

  return (
    <div className="space-y-5 px-5 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{t('home.welcomeBack')}</p>
          <h1 className="text-xl font-extrabold text-slate-800">{user.displayName}</h1>
        </div>
        <AvatarDisplay avatarId={user.avatarId} equippedItemIds={user.equippedItemIds} size="sm" />
      </header>

      <div
        className={`rounded-3xl p-5 text-white shadow-lg ${
          alive
            ? 'bg-gradient-to-br from-orange-400 to-rose-500'
            : 'bg-gradient-to-br from-slate-400 to-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{t('home.weeklyStreak')}</p>
            <p className="text-4xl font-extrabold">
              {streak.currentStreakWeeks} <span className="text-xl font-bold">{t('home.weeks')}</span>
            </p>
          </div>
          <div className="text-5xl">{alive ? '🔥' : '🥲'}</div>
        </div>
        <p className="mt-2 text-sm text-white/90">
          {safe ? t('home.secured') : alive ? t('home.keepAlive') : t('home.cooled')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label={t('home.pointsBalance')} value={points.toLocaleString()} emoji="⭐" />
        <Stat label={t('home.earningLeft')} value={`${earningLeft}`} emoji="📦" />
      </div>

      <Button onClick={() => setSheetOpen(true)}>
        <span className="text-lg">📲</span> {t('home.logReturn')}
      </Button>
      <p className="text-center text-xs text-slate-400">{t('home.verifiedOnly')}</p>

      {/* Checker is a first-class feature but lives off the bottom nav now,
          so surface a prominent entry point here. */}
      <button
        onClick={() => navigate('/checker')}
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
      >
        <span className="text-2xl">🔎</span>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">{t('home.checkItem')}</p>
          <p className="text-xs text-slate-400">{t('home.checkItemSub')}</p>
        </div>
        <span className="text-slate-300">›</span>
      </button>

      <button
        onClick={() => navigate('/dashboard')}
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
      >
        <span className="text-2xl">🌍</span>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">{t('home.viewDashboard')}</p>
        </div>
        <span className="text-slate-300">›</span>
      </button>

      {sheetOpen && <LogReturnSheet onClose={() => setSheetOpen(false)} />}
    </div>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <p className="mt-1 text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-xs leading-tight text-slate-400">{label}</p>
    </div>
  );
}
