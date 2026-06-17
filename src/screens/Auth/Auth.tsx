import { useState } from 'react';
import { Button } from '../../components/Button';
import { useStore } from '../../store/useStore';

/**
 * Phone-number + password auth, with Google OAuth as an option.
 *
 * WHY PHONE IS THE PRIMARY IDENTITY:
 * Phone number is the app's anti-multi-accounting control. The whole points
 * economy rests on "one human = one wallet". Phone numbers are costly and
 * annoying to farm at scale (SIMs, OTP), which makes them the cheapest strong
 * identity we can use to stop someone from spinning up many accounts to multiply
 * rewards. Even when a user signs in with Google, we still bind the account to a
 * verified phone — Google alone is too cheap to mint. (OTP verification is
 * stubbed here for the MVP; a real backend would send + verify an SMS code.)
 */
export function Auth() {
  const authenticate = useStore((s) => s.authenticate);
  const [mode, setMode] = useState<'phone' | 'google'>('phone');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function validPhone(p: string) {
    // Lightweight check; the real backend owns authoritative validation + OTP.
    return /^\+?\d[\d\s-]{6,}$/.test(p.trim());
  }

  function submitPhone() {
    if (!validPhone(phone)) {
      setError('Enter a valid phone number — it’s how we keep one account per person.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setError(null);
    // TODO: send + verify an SMS OTP here before creating the account.
    authenticate({ phone: phone.trim(), displayName: name, oauthGoogle: false });
  }

  function submitGoogle() {
    // TODO: real Google OAuth flow. Even after Google sign-in we still require a
    // phone number, because phone is the anti-multi-accounting key (see above).
    if (!validPhone(phone)) {
      setError('Add your phone number to finish — we bind every account to a verified phone.');
      return;
    }
    setError(null);
    authenticate({
      phone: phone.trim(),
      displayName: name || 'Google user',
      oauthGoogle: true,
    });
  }

  return (
    <div className="flex min-h-screen flex-col justify-center gap-6 bg-slate-50 px-7 py-10">
      <div className="text-center">
        <div className="text-5xl">♻️</div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-800">Welcome to ReLoop</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your phone number keeps your streak yours — one account per person.
        </p>
      </div>

      <div className="space-y-3">
        <Field label="Display name (optional)">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Eco Warrior"
            className="input"
          />
        </Field>

        <Field label="Phone number">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="+65 9123 4567"
            className="input"
          />
        </Field>

        {mode === 'phone' && (
          <Field label="Password">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••"
              className="input"
            />
          </Field>
        )}
      </div>

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      {mode === 'phone' ? (
        <Button onClick={submitPhone}>Continue</Button>
      ) : (
        <Button onClick={submitGoogle}>
          <span className="text-lg">🔵</span> Continue with Google
        </Button>
      )}

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        or
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Button
        variant="secondary"
        onClick={() => {
          setError(null);
          setMode(mode === 'phone' ? 'google' : 'phone');
        }}
      >
        {mode === 'phone' ? 'Use Google instead' : 'Use phone + password instead'}
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-slate-400">
        Demo build: no real OTP is sent. A production app verifies your phone via SMS
        before any points can be earned.
      </p>

      {/* Local utility class for inputs to keep markup tidy. */}
      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          background: #fff;
          padding: 0.8rem 1rem;
          font-size: 1rem;
          outline: none;
        }
        .input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
