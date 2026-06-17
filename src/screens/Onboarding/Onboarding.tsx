import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useStore } from '../../store/useStore';
import { randomTip } from '../../data/tips';

type Phase = 'welcome' | 'slides' | 'loading';

const SLIDE_KEYS = [
  { titleKey: 'onboarding.slide1Title', bodyKey: 'onboarding.slide1Body', emoji: '♻️', bg: 'from-brand-400 to-brand-600' },
  { titleKey: 'onboarding.slide2Title', bodyKey: 'onboarding.slide2Body', emoji: '🔥', bg: 'from-amber-400 to-orange-500' },
  { titleKey: 'onboarding.slide3Title', bodyKey: 'onboarding.slide3Body', emoji: '🔎', bg: 'from-teal-400 to-cyan-600' },
];

export function Onboarding() {
  const [phase, setPhase] = useState<Phase>('welcome');

  if (phase === 'welcome') return <Welcome onStart={() => setPhase('slides')} />;
  if (phase === 'slides') return <Slides onDone={() => setPhase('loading')} />;
  return <LoadingTip />;
}

function Welcome({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700 px-8 text-center text-white">
      <div className="animate-pop-in text-8xl">♻️</div>
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">ReLoop</h1>
        <p className="text-lg text-brand-50/90">{t('onboarding.welcomeTagline')}</p>
      </div>
      <div className="w-full max-w-xs">
        <Button variant="secondary" onClick={onStart}>
          {t('onboarding.getStarted')}
        </Button>
      </div>
      {/* Language switcher on the welcome screen (also in Settings). */}
      <LanguageSwitcher variant="dark" />
    </div>
  );
}

function Slides({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function goNext() {
    const el = scroller.current;
    if (!el) return;
    if (index >= SLIDE_KEYS.length - 1) return onDone();
    el.scrollTo({ left: (index + 1) * el.clientWidth, behavior: 'smooth' });
  }

  const isLast = index >= SLIDE_KEYS.length - 1;

  return (
    <div className="flex min-h-screen flex-col">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {SLIDE_KEYS.map((s) => (
          <section
            key={s.titleKey}
            className={`flex min-w-full snap-center flex-col items-center justify-center gap-6 bg-gradient-to-br ${s.bg} px-10 text-center text-white`}
          >
            <div className="text-8xl">{s.emoji}</div>
            <h2 className="text-3xl font-extrabold">{t(s.titleKey)}</h2>
            <p className="max-w-xs text-lg text-white/90">{t(s.bodyKey)}</p>
          </section>
        ))}
      </div>

      <div className="space-y-4 bg-white px-8 py-6">
        <div className="flex justify-center gap-2">
          {SLIDE_KEYS.map((s, i) => (
            <span
              key={s.titleKey}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-600' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
        <Button onClick={goNext}>{isLast ? t('onboarding.letsGo') : t('common.next')}</Button>
      </div>
    </div>
  );
}

/** Loading screen with a rotating recycling TIP (new random one each mount). */
function LoadingTip() {
  const { t } = useTranslation();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  // Tips are recycling-critical facts, kept in English on purpose (see tips.ts).
  const [tip] = useState(randomTip);

  useEffect(() => {
    const timer = setTimeout(completeOnboarding, 2200);
    return () => clearTimeout(timer);
  }, [completeOnboarding]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-brand-600 to-emerald-800 px-10 text-center text-white">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">
          {t('onboarding.didYouKnow')}
        </p>
        <p className="text-xl font-medium leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}
