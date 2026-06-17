import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/streaks', label: 'Streaks', icon: '🔥' },
  { to: '/checker', label: 'Checker', icon: '🔎' },
  { to: '/rewards', label: 'Rewards', icon: '🎁' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-5 border-t border-slate-200 bg-white/95 backdrop-blur">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
              isActive ? 'text-brand-700' : 'text-slate-400'
            }`
          }
        >
          <span className="text-xl">{t.icon}</span>
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
