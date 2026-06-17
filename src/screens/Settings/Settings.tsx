import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { computeLifetimeStats, formatMass } from '../../lib/stats';
import { AvatarDisplay } from '../../components/AvatarDisplay';

const TYPE_LABELS: Record<string, string> = {
  plastic_bottle: 'Plastic bottles',
  metal_can: 'Metal cans',
  glass_bottle: 'Glass bottles',
  carton: 'Cartons',
};

export function Settings() {
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
            {user.phone}
            {user.oauthGoogle && ' · Google'}
          </p>
        </div>
      </header>

      {/* Lifetime impact dashboard */}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Lifetime impact
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <Metric value={stats.totalReturns.toLocaleString()} label="Returns" emoji="♻️" />
          <Metric value={formatMass(stats.co2eGrams)} label="CO₂e saved" emoji="🌍" />
          <Metric value={formatMass(stats.landfillGrams)} label="Out of landfill" emoji="🗑️" />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Estimates for motivation, based on average life-cycle figures. Real per-container
          factors load from NEA/BCRS later.
        </p>
      </section>

      {/* Breakdown by container type */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-600">By container type</h3>
        <div className="space-y-1.5">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{TYPE_LABELS[type] ?? type}</span>
              <span className="font-semibold text-slate-800">{count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Account</h2>
        <Row label="Notifications" value="Coming soon" />
        <Row label="Language" value="English" />
        <Row label="About Return Right" value="↗" />
      </section>

      <div className="pt-2">
        <Button
          variant="secondary"
          onClick={() => {
            if (confirm('Reset all local data? This clears your demo account, streak and points.')) {
              void resetAll();
            }
          }}
        >
          Reset demo data
        </Button>
      </div>

      <p className="pb-4 text-center text-[11px] text-slate-400">
        ReLoop is an engagement layer on top of Singapore’s BCRS “Return Right” deposit scheme.
        It does not replace it.
      </p>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-400">{value}</span>
    </div>
  );
}
