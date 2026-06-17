import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { PhoneFrame } from './components/PhoneFrame';
import { AppLayout } from './components/AppLayout';
import { Onboarding } from './screens/Onboarding/Onboarding';
import { Auth } from './screens/Auth/Auth';
import { AvatarPicker } from './screens/AvatarPicker/AvatarPicker';
import { Home } from './screens/Home/Home';
import { Streaks } from './screens/Streaks/Streaks';
import { Checker } from './screens/Checker/Checker';
import { Rewards } from './screens/Rewards/Rewards';
import { Extra } from './screens/Extra/Extra';
import { Settings } from './screens/Settings/Settings';
import { Dashboard } from './screens/Dashboard/Dashboard';
import { About } from './screens/About/About';

const SETUP_ROUTES = ['/onboarding', '/auth', '/avatar'];

/**
 * Decides where the user belongs based on setup progress:
 *   not onboarded -> /onboarding ; no account -> /auth ; no avatar -> /avatar.
 * The main tabbed screens are only reachable once setup is complete.
 */
function useSetupRedirect(): string | null {
  const { onboarded, user } = useStore();
  const { pathname } = useLocation();

  if (!onboarded) return pathname === '/onboarding' ? null : '/onboarding';
  if (!user) return pathname === '/auth' ? null : '/auth';
  if (!user.avatarId) return pathname === '/avatar' ? null : '/avatar';

  // Setup complete — don't let the user sit on a setup screen.
  if (SETUP_ROUTES.includes(pathname) || pathname === '/') return '/home';
  return null;
}

function Gate() {
  const redirect = useSetupRedirect();
  const { pathname } = useLocation();
  if (redirect && redirect !== pathname) return <Navigate to={redirect} replace />;

  if (SETUP_ROUTES.includes(pathname)) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/avatar" element={<AvatarPicker />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/streaks" element={<Streaks />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/extra" element={<Extra />} />
        <Route path="/settings" element={<Settings />} />
        {/* Off-nav but first-class / supporting screens. */}
        <Route path="/checker" element={<Checker />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  const { hydrated, hydrate } = useStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <PhoneFrame>
      {hydrated ? (
        <Gate />
      ) : (
        <div className="flex min-h-screen items-center justify-center text-brand-600">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      )}
    </PhoneFrame>
  );
}
