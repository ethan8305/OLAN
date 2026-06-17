import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, setLang, type Lang } from '../i18n';

/**
 * Language switcher used on BOTH the welcome screen and Settings.
 * Choice is persisted (see i18n/setLang) so it survives reloads.
 */
export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { t, i18n } = useTranslation();
  const current = i18n.language as Lang;

  const base =
    variant === 'dark'
      ? 'bg-white/15 text-white ring-white/30'
      : 'bg-white text-slate-700 ring-slate-200';

  return (
    <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={t('lang.label')}>
      {SUPPORTED_LANGS.map((lng) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            onClick={() => setLang(lng)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition ${base} ${
              active ? 'ring-2 ring-brand-500' : 'opacity-70'
            }`}
          >
            {t(`lang.${lng}`)}
          </button>
        );
      })}
    </div>
  );
}
