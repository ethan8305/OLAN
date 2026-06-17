import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { AvatarDisplay } from '../../components/AvatarDisplay';
import { computeLifetimeStats, formatMass } from '../../lib/stats';

export function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, returns, resetAll } = useStore();
  if (!user) return null;
  const stats = computeLifetimeStats(returns);

  return (
    <div className="space-y-6 px-5 pt-6">
      <header className="flex items-center gap-3">
        <AvatarDisplay avatarId={user.avatarId} equippedItemIds={user.equippedItemIds} size="sm" />
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">{user.displayName}</h1>
          <p className="text-sm text-slate-400">
            {user.email ?? user.phone ?? '—'}
          </p>
          <p className="text-xs text-slate-400">
            {t('settings.signedInWith', { method: user.authMethod })}
          </p>
        </div>
      </header>

      {/* Language switcher (also on the welcome screen). */}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          {t('lang.label')}
        </h2>
        <LanguageSwitcher />
      </section>

      {/* Compact lifetime summary; full breakdown lives on the Dashboard. */}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          {t('settings.impactSection')}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <Metric value={stats.totalReturns.toLocaleString()} label={t('dashboard.returns')} emoji="♻️" />
          <Metric value={formatMass(stats.co2eGrams)} label={t('dashboard.co2Saved')} emoji="🌍" />
          <Metric
            value={formatMass(stats.landfillGrams)}
            label={t('dashboard.outOfLandfill')}
            emoji="🗑️"
          />
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-brand-700 shadow-sm"
        >
          {t('settings.viewFullDashboard')} →
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          {t('settings.accountSection')}
        </h2>
        <Row label={t('settings.notifications')} value={t('common.comingSoon')} />
        <RowButton label={t('settings.about')} onClick={() => navigate('/about')} />
        <Row label={t('settings.aboutReturnRight')} value="↗" />
      </section>

      <div className="pt-2">
        <Button
          variant="secondary"
          onClick={() => {
            if (confirm(t('settings.resetConfirm'))) void resetAll();
          }}
        >
          {t('settings.resetData')}
        </Button>
      </div>

      <p className="pb-4 text-center text-[11px] text-slate-400">{t('settings.disclaimer')}</p>
    </div>
  );
}

function Metric({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <p className="mt-1 text-base font-extrabold leading-tight text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-400">{value}</span>
    </div>
  );
}

function RowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm"
    >
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-300">›</span>
    </button>
  );
}
