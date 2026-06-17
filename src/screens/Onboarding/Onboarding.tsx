import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { useStore } from '../../store/useStore';
import { randomTip } from '../../data/tips';

type Phase = 'welcome' | 'slides' | 'loading';

const SLIDES = [
  {
    emoji: '♻️',
    title: 'Returns that count',
    body: 'ReLoop sits on top of Singapore’s Return Right deposit scheme. Every container you return earns rewards — but only when it’s really returned.',
    bg: 'from-brand-400 to-brand-600',
  },
  {
    emoji: '🔥',
    title: 'Build a weekly streak',
    body: 'Return at least one container each week to keep your streak alive. Miss a week and it resets — so make it a habit, not a chore.',
    bg: 'from-amber-400 to-orange-500',
  },
  {
    emoji: '🔎',
    title: 'Recycle right, not just often',
    body: 'Not sure if something is recyclable? Check before you bin it. Putting the wrong thing in spoils the whole batch.',
    bg: 'from-teal-400 to-cyan-600',
  },
];

export function Onboarding() {
  const [phase, setPhase] = useState<Phase>('welcome');

  if (phase === 'welcome') return <Welcome onStart={() => setPhase('slides')} />;
  if (phase === 'slides') return <Slides onDone={() => setPhase('loading')} />;
  return <LoadingTip />;
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700 px-8 text-center text-white">
      <div className="animate-pop-in text-8xl">♻️</div>
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">ReLoop</h1>
        <p className="text-lg text-brand-50/90">
          The fun layer on top of Return Right. Recycle, build streaks, dress up your buddy.
        </p>
      </div>
      <div className="w-full max-w-xs">
        <Button variant="secondary" onClick={onStart}>
          Get started →
        </Button>
      </div>
    </div>
  );
}

function Slides({ onDone }: { onDone: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Track which slide is centred so the dots + button label stay in sync.
  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndex(i);
  }

  function goNext() {
    const el = scroller.current;
    if (!el) return;
    if (index >= SLIDES.length - 1) return onDone();
    el.scrollTo({ left: (index + 1) * el.clientWidth, behavior: 'smooth' });
  }

  const isLast = index >= SLIDES.length - 1;

  return (
    <div className="flex min-h-screen flex-col">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {SLIDES.map((s) => (
          <section
            key={s.title}
            className={`flex min-w-full snap-center flex-col items-center justify-center gap-6 bg-gradient-to-br ${s.bg} px-10 text-center text-white`}
          >
            <div className="text-8xl">{s.emoji}</div>
            <h2 className="text-3xl font-extrabold">{s.title}</h2>
            <p className="max-w-xs text-lg text-white/90">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="space-y-4 bg-white px-8 py-6">
        <div className="flex justify-center gap-2">
          {SLIDES.map((s, i) => (
            <span
              key={s.title}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-600' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
        <Button onClick={goNext}>{isLast ? 'Let’s go' : 'Next'}</Button>
      </div>
    </div>
  );
}

/**
 * Loading screen shown before entering the app. Displays a rotating recycling
 * TIP (a new random one each mount) so the wait is itself educational.
 */
function LoadingTip() {
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [tip] = useState(randomTip);

  useEffect(() => {
    const t = setTimeout(completeOnboarding, 2200);
    return () => clearTimeout(t);
  }, [completeOnboarding]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-brand-600 to-emerald-800 px-10 text-center text-white">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">
          Did you know?
        </p>
        <p className="text-xl font-medium leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}
