# ReLoop — a recycling engagement layer for Singapore's BCRS

ReLoop is a mobile-first web app that sits **on top of** Singapore's BCRS
**"Return Right"** beverage-container deposit scheme. It **does not replace** it.
Return Right (and its RVMs / deposit infrastructure) remains the system of
record for returns and refunds; ReLoop adds streaks, points, education, and
cosmetic rewards as an engagement layer.

> **Core principle:** every point comes from a **verified return**. Never the
> honour system.

## Stack

React + Vite + TypeScript + Tailwind CSS. State in Zustand, persisted to
`localStorage` via a swappable repository (the local mock "backend").

```
npm install
npm run dev       # start the dev server
npm run build     # typecheck + production build
npm run lint      # tsc --noEmit
```

## The two seams that matter

Everything is designed so the mock pieces can be replaced by real backends with
a one-line change and **no downstream edits**.

### 1. Verification seam — `src/services/verification/`

This is the **most important boundary in the app**. The rest of the app only
ever imports `verifyReturn()` from `services/verification` and trusts a result
of `{ valid: true }`. It never decides on its own that a return happened.

- `types.ts` — the `VerificationAdapter` contract + `VerifyReturnResult`.
- `mockRvmAdapter.ts` — current adapter: accepts a scanned code / mock RVM
  confirmation and returns `{ valid, containerType, timestamp, verificationRef }`.
- `returnRightAdapter.ts` — **TODO** stub for the real Return Right / Rehub
  confirmation API, with an implementation checklist.
- `index.ts` — exports the active adapter. **Going live = changing one line here.**

### 2. Backend/persistence seam — `src/services/backend/`

A `Repository` interface (`load/save/clear`). Today it's `localRepository`
(localStorage). A real API client implementing the same interface drops in
without touching callers.

## Anti-gaming design (`src/config/gamification.ts`)

A points-for-recycling app must not reward buying drinks (or empty containers)
to farm points. Three layers defend against this:

1. **Verification** — a point can only come from a confirmed return (above).
2. **Identity** — phone number is the primary identity (`User.phone`): one
   verified phone = one wallet, so accounts can't be multiplied. See
   `screens/Auth/Auth.tsx` for the rationale.
3. **Weekly earning cap** — `WEEKLY_POINT_EARNING_CAP` (a single config
   constant, set just above realistic weekly consumption). Returns past the cap
   still count toward the streak and lifetime stats but earn **0 points**, so
   over-buying yields nothing.

Streaks are **weekly, not daily**: at least one verified return per calendar
week (Singapore time) keeps the streak alive. Logic lives in `lib/streaks.ts`
and `lib/weeks.ts`.

## Screens

1. **Onboarding** — welcome → swipeable slides → loading screen with a rotating
   recycling tip.
2. **Auth** — phone + password, with Google OAuth (still phone-bound).
3. **Avatar picker** — 5 starter avatars.
4. **Home** — avatar, weekly streak status, primary "Log a return" → `verifyReturn()`.
5. **Streaks** — weekly visualisation, points balance, milestone badges.
6. **Recyclable Checker** — searchable NEA/BCRS-seeded "accepted / not accepted
   + why" lookup. The anti-contamination feature. Seed in `data/recyclables.ts`.
7. **Rewards** — cosmetic-only; disabled "Marketplace (coming soon)" stub.
8. **Settings** — lifetime dashboard (returns + estimated CO₂ / landfill saved).

### Trying the demo flow

In the "Log a return" sheet, enter a code where the prefix sets the container
type: `PB…` plastic bottle, `MC…` metal can, `GB…` glass, `CT…` carton. Enter
`INVALID` to see the rejected path. (No real OTP/RVM in the demo.)

## Out of scope for v1

Intentionally **not** built (left as stubs/comments): real-goods rewards, blind
boxes, sponsor furniture, BeReal-style photo uploads, mini-games, donations,
lottery draws.

## Where real data plugs in

- Real verification → `services/verification/returnRightAdapter.ts`.
- Real persistence/API → a new `Repository` in `services/backend/`.
- Real NEA recyclables data → `data/recyclables.ts` (shape stays stable).
- Real impact factors → `lib/stats.ts`.
