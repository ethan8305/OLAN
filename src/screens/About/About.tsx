import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/** About Us page. */
export function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-5 px-5 pt-6">
      <header>
        <button onClick={() => navigate('/settings')} className="mb-2 text-sm text-brand-600">
          ← {t('nav.settings')}
        </button>
        <div className="text-5xl">♻️</div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">{t('about.title')}</h1>
      </header>

      <Section title={t('about.mission')} body={t('about.missionBody')} />
      <Section title={t('about.howTitle')} body={t('about.howBody')} />

      <p className="rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-brand-800">
        {t('about.disclaimer')}
      </p>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h2>
      <p className="text-sm leading-relaxed text-slate-600">{body}</p>
    </section>
  );
}
