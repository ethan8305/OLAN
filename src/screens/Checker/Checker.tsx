import { useMemo, useState } from 'react';
import { searchRecyclables } from '../../data/recyclables';
import type { RecyclableRule } from '../../types/models';

/**
 * Recyclable Checker — a FIRST-CLASS feature, not a footnote. This is the app's
 * anti-contamination mechanism: it teaches people what actually belongs in the
 * blue bin (and what carries a Return Right deposit) and, crucially, WHY.
 * Dataset is hand-seeded from NEA/BCRS guidance — see data/recyclables.ts for
 * the TODO to load real NEA data.
 */
export function Checker() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const results = useMemo(() => searchRecyclables(query), [query]);

  return (
    <div className="flex h-full flex-col px-5 pt-6">
      <header>
        <h1 className="text-2xl font-extrabold text-slate-800">Can I recycle this?</h1>
        <p className="text-sm text-slate-400">
          Check before you bin it — putting the wrong thing in spoils the whole batch.
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-5 bg-slate-50 px-5 py-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: bottle, can, bubble tea, greasy box…"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="flex-1 space-y-2.5 pb-4">
        {results.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No match. Try a simpler word like “cup”, “can” or “box”.
          </p>
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
  return (
    <button
      onClick={onToggle}
      className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{rule.emoji}</span>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">{rule.name}</p>
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            <Tag accepted={rule.accepted} />
            {rule.bcrsEligible && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                💰 Deposit refund
              </span>
            )}
          </div>
        </div>
        <span className={`text-slate-300 transition ${expanded ? 'rotate-90' : ''}`}>›</span>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-700">Why: </span>
            {rule.why}
          </p>
          {rule.prep && (
            <p className="text-slate-600">
              <span className="font-semibold text-slate-700">Prep: </span>
              {rule.prep}
            </p>
          )}
        </div>
      )}
    </button>
  );
}

function Tag({ accepted }: { accepted: boolean }) {
  return accepted ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
      ✅ Accepted
    </span>
  ) : (
    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
      ⛔ Not accepted
    </span>
  );
}
