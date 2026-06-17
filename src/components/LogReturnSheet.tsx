import { useState } from 'react';
import { Button } from './Button';
import { useStore, type LogReturnOutcome } from '../store/useStore';
import { WEEKLY_POINT_EARNING_CAP } from '../config/gamification';

/**
 * Bottom sheet for logging a return. It does NOT decide anything itself — it
 * collects a scanned/typed code and hands it to store.logReturn(), which runs it
 * through verifyReturn(). This mirrors the real flow: scan at the RVM, the RVM/
 * BCRS confirms, and only then do points move.
 *
 * Demo codes: prefix sets the container type — PB… (plastic bottle), MC… (can),
 * GB… (glass), CT… (carton). Type "INVALID" to see the rejected path.
 */
export function LogReturnSheet({ onClose }: { onClose: () => void }) {
  const logReturn = useStore((s) => s.logReturn);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<LogReturnOutcome | null>(null);

  async function submit() {
    setBusy(true);
    const result = await logReturn(code);
    setOutcome(result);
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-app animate-slide-up rounded-t-3xl bg-white p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {!outcome ? (
          <>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
            <h2 className="text-xl font-bold text-slate-800">Log a return</h2>
            <p className="mt-1 text-sm text-slate-500">
              Scan the code shown on the RVM after you drop your bottle or can. We confirm it
              with the deposit system before awarding any points.
            </p>

            <input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Scan or enter RVM code (e.g. PB-12345)"
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            <div className="mt-4 space-y-2">
              <Button onClick={submit} disabled={busy || !code.trim()}>
                {busy ? 'Verifying…' : 'Verify return'}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <Result outcome={outcome} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function Result({ outcome, onClose }: { outcome: LogReturnOutcome; onClose: () => void }) {
  if (!outcome.ok) {
    return (
      <div className="py-2 text-center">
        <div className="text-6xl">🚫</div>
        <h3 className="mt-3 text-lg font-bold text-slate-800">Couldn’t verify that</h3>
        <p className="mt-1 text-sm text-slate-500">{outcome.reason}</p>
        <div className="mt-5">
          <Button onClick={onClose}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 text-center">
      <div className="animate-pop-in text-6xl">{outcome.cappedNoPoints ? '✅' : '🎉'}</div>
      <h3 className="mt-3 text-lg font-bold text-slate-800">
        {outcome.cappedNoPoints ? 'Return counted!' : `+${outcome.pointsEarned} points!`}
      </h3>
      {outcome.cappedNoPoints ? (
        <p className="mt-1 text-sm text-slate-500">
          You’ve hit this week’s {WEEKLY_POINT_EARNING_CAP}-return points cap, so this one earns no
          points — but it still counts toward your streak and your impact. The cap keeps the game
          fair: you can’t farm points by over-buying.
        </p>
      ) : (
        <p className="mt-1 text-sm text-slate-500">
          Verified and added to your streak. Keep looping!
        </p>
      )}
      <div className="mt-5">
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}
