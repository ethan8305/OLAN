import type { ReactNode } from 'react';

/**
 * Mobile-first canvas. Constrains content to a phone-width column and centres it
 * on larger screens so the app always looks like a mobile app.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full w-full bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-app flex-col bg-slate-50 shadow-xl">
        {children}
      </div>
    </div>
  );
}
