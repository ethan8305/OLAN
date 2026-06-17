import { useTranslation } from 'react-i18next';

/**
 * Extra / Sponsors / Games — a clearly-labelled PLACEHOLDER stub.
 * Everything here is OUT OF SCOPE for v1 (sponsor tie-ins, mini-games, etc.).
 * Nothing is functional; it exists to reserve the nav slot and set expectations.
 */
export function Extra() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 px-5 pt-6">
      <header>
        <h1 className="text-2xl font-extrabold text-slate-800">{t('extra.title')}</h1>
        <p className="text-sm text-slate-400">{t('extra.subtitle')}</p>
      </header>

      <div className="rounded-2xl bg-amber-50 p-3 text-center text-sm font-medium text-amber-700">
        🚧 {t('extra.placeholderBanner')}
      </div>

      <StubCard emoji="🤝" title={t('extra.sponsors')} body={t('extra.sponsorsStub')} />
      <StubCard emoji="🎮" title={t('extra.games')} body={t('extra.gamesStub')} />
    </div>
  );
}

function StubCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  const { t } = useTranslation();
  return (
    <section className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100 p-4 opacity-80">
      <span className="text-3xl">{emoji}</span>
      <div className="flex-1">
        <p className="font-semibold text-slate-600">{title}</p>
        <p className="text-xs text-slate-400">{body}</p>
      </div>
      <span className="rounded-full bg-slate-300 px-2.5 py-1 text-[11px] font-semibold text-white">
        {t('common.comingSoon')}
      </span>
    </section>
  );
}
