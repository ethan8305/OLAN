import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TABS = [
  { to: '/home', key: 'nav.home', icon: '🏠' },
  { to: '/streaks', key: 'nav.streaks', icon: '🔥' },
  { to: '/rewards', key: 'nav.rewards', icon: '🎁' },
  { to: '/extra', key: 'nav.extra', icon: '✨' },
  { to: '/settings', key: 'nav.settings', icon: '⚙️' },
];

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-5 border-t border-slate-200 bg-white/95 backdrop-blur">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
              isActive ? 'text-brand-700' : 'text-slate-400'
            }`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          {t(tab.key)}
        </NavLink>
      ))}
    </nav>
  );
}
