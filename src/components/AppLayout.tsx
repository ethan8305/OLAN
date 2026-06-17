import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

/** Shell for the main tabbed screens: scrollable content + persistent nav. */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-y-auto pb-4">{children}</main>
      <BottomNav />
    </div>
  );
}
