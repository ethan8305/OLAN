import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { searchRecyclables } from '../../data/recyclables';
import type { RecyclableRule } from '../../types/models';

/**
 * Recyclable Checker — a FIRST-CLASS feature, not a footnote. This is the app's
 * anti-contamination mechanism: it teaches people what actually belongs in the
 * blue bin (and what carries a Return Right deposit) and, crucially, WHY.
 *
 * The per-item guidance (name / why / prep) is rendered from data/recyclables.ts
 * IN ENGLISH on purpose, even in other languages: a mistranslated recycling
 * instruction misinforms and is worse than English-only. UI chrome is localised;
 * human-reviewed translations of the guidance itself are a tracked TODO.
 */
export function Checker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const results = useMemo(() => searchRecyclables(query), [query]);

  return (
    <div className="flex h-full flex-col px-5 pt-6">
      <header>
        <button onClick={() => navigate('/home')} className="mb-2 text-sm text-brand-600">
          ← {t('nav.home')}
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800">{t('checker.title')}</h1>
        <p className="text-sm text-slate-400">{t('checker.subtitle')}</p>
      </header>

      <div className="sticky top-0 z-10 -mx-5 bg-slate-50 px-5 py-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('checker.searchPlaceholder')}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="flex-1 space-y-2.5">
        {results.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">{t('checker.noMatch')}</p>
        )}
        {results.map((r) => (
          <RuleCard
            key={r.id}
            rule={r}
            expanded={open === r.id}
            onToggle={() => setOpen(open === r.id ? null : r.id)}
          />
        ))}
      </div>

      <p className="py-3 text-center text-[11px] leading-relaxed text-slate-400">
        {t('checker.englishNote')}
      </p>
    </div>
  );
}

function RuleCard({
  rule,
  expanded,
  onToggle,
}: {
  rule: RecyclableRule;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onToggle}
      className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{rule.emoji}</span>
        <div className="flex-1">
          {/* Item name stays in English (recycling-critical, see file header). */}
          <p className="font-semibold text-slate-800">{rule.name}</p>
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            <Tag accepted={rule.accepted} />
            {rule.bcrsEligible && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                💰 {t('checker.depositRefund')}
              </span>
            )}
          </div>
        </div>
        <span className={`text-slate-300 transition ${expanded ? 'rotate-90' : ''}`}>›</span>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-700">{t('checker.why')} </span>
            {rule.why}
          </p>
          {rule.prep && (
            <p className="text-slate-600">
              <span className="font-semibold text-slate-700">{t('checker.prep')} </span>
              {rule.prep}
            </p>
          )}
        </div>
      )}
    </button>
  );
}

function Tag({ accepted }: { accepted: boolean }) {
  const { t } = useTranslation();
  return accepted ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
      ✅ {t('checker.accepted')}
    </span>
  ) : (
    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
      ⛔ {t('checker.notAccepted')}
    </span>
  );
}
