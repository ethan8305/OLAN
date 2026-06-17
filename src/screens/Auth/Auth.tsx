import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../../components/Button';
import { useStore } from '../../store/useStore';
import { decodeGoogleJwt } from '../../lib/jwt';

/**
 * Auth — Google OAuth is the PRIMARY login; email + password is a fallback.
 *
 * IDENTITY = ANTI-MULTI-ACCOUNTING:
 * The whole points economy rests on "one human = one wallet". A verified Google
 * account (email) is the v1 identity key — cheap-ish for users, costly to farm
 * at scale. Even cheaper identities (anonymous handles) would let one person
 * mint many wallets and multiply rewards, so we anchor on Google.
 *
 * PHONE / SMS OTP IS DEFERRED (stubbed, see below): phone + OTP is the stronger
 * long-term control, but real OTP needs paid SMS infrastructure and can't be
 * exercised in local dev, so it's intentionally out of scope for v1.
 */
export function Auth() {
  const { t } = useTranslation();
  const authenticate = useStore((s) => s.authenticate);
  const [mode, setMode] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  function submitEmail() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t('auth.errorEmail'));
      return;
    }
    if (password.length < 4) {
      setError(t('auth.errorPassword'));
      return;
    }
    setError(null);
    // FALLBACK auth. A real backend would hash + check the password server-side.
    authenticate({ method: 'email', email: email.trim(), displayName: name });
  }

  return (
    <div className="flex min-h-screen flex-col justify-center gap-6 bg-slate-50 px-7 py-10">
      <div className="text-center">
        <div className="text-5xl">♻️</div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-800">{t('auth.welcome')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('auth.subtitle')}</p>
      </div>

      {mode === 'google' ? (
        <div className="space-y-3">
          {googleConfigured ? (
            <div className="flex justify-center">
              {/* Popup-mode Google sign-in: only an Authorized JavaScript origin
                  (http://localhost:5173) is needed — no redirect/callback route. */}
              <GoogleLogin
                onSuccess={(cred) => {
                  const claims = decodeGoogleJwt(cred.credential ?? '');
                  authenticate({
                    method: 'google',
                    email: claims.email ?? `google-${claims.sub}`,
                    displayName: claims.name ?? 'Google user',
                  });
                }}
                onError={() => setError(t('auth.googleUnavailable'))}
                shape="pill"
                width="280"
              />
            </div>
          ) : (
            <p className="rounded-2xl bg-amber-50 p-3 text-center text-sm text-amber-700">
              {t('auth.googleUnavailable')}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Field label={t('auth.displayName')}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('auth.displayNamePlaceholder')}
              className="input"
            />
          </Field>
          <Field label={t('auth.email')}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              placeholder={t('auth.emailPlaceholder')}
              className="input"
            />
          </Field>
          <Field label={t('auth.password')}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              className="input"
            />
          </Field>
          <Button onClick={submitEmail}>{t('auth.continue')}</Button>
        </div>
      )}

      {error && <p className="text-center text-sm font-medium text-rose-600">{error}</p>}

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        {t('auth.orDivider')}
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Button
        variant="secondary"
        onClick={() => {
          setError(null);
          setMode(mode === 'google' ? 'email' : 'google');
        }}
      >
        {mode === 'google' ? t('auth.emailFallback') : t('auth.useGoogle')}
      </Button>

      {/*
        PHONE + SMS OTP STUB — deliberately not wired up.
        Deferred because real OTP requires a paid SMS gateway (e.g. Twilio) and
        can't be tested locally. When added, phone+OTP becomes the strongest
        anti-multi-accounting identity. Until then there is no phone path in the UI.
      */}

      <p className="text-center text-[11px] leading-relaxed text-slate-400">
        {t('auth.demoNote')}
      </p>

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
