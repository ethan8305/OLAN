import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { computeLifetimeStats, formatMass } from '../../lib/stats';

/** Separate lifetime-impact dashboard: returns count + estimated CO2/landfill. */
export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { returns } = useStore();
  const stats = computeLifetimeStats(returns);

  const TYPE_KEYS = ['plastic_bottle', 'metal_can', 'glass_bottle', 'carton'] as const;

  return (
    <div className="space-y-6 px-5 pt-6">
      <header>
        <button onClick={() => navigate('/home')} className="mb-2 text-sm text-brand-600">
          ← {t('nav.home')}
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800">{t('dashboard.title')}</h1>
        <p className="text-sm text-slate-400">{t('dashboard.subtitle')}</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <Metric value={stats.totalReturns.toLocaleString()} label={t('dashboard.returns')} emoji="♻️" />
        <Metric value={formatMass(stats.co2eGrams)} label={t('dashboard.co2Saved')} emoji="🌍" />
        <Metric
          value={formatMass(stats.landfillGrams)}
          label={t('dashboard.outOfLandfill')}
          emoji="🗑️"
        />
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-600">{t('dashboard.byType')}</h3>
        <div className="space-y-1.5">
          {TYPE_KEYS.map((type) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{t(`dashboard.${type}`)}</span>
              <span className="font-semibold text-slate-800">{stats.byType[type]}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-slate-400">{t('dashboard.estimateNote')}</p>
    </div>
  );
}

function Metric({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <p className="mt-1 text-lg font-extrabold leading-tight text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
