# ReLoop — a recycling engagement layer for Singapore's BCRS

ReLoop is a mobile-first **PWA** that sits **on top of** Singapore's BCRS
**"Return Right"** beverage-container deposit scheme. It **does not replace** it.
Return Right (and its RVMs / deposit infrastructure) remains the system of
record for returns and refunds; ReLoop adds streaks, points, education, and
cosmetic rewards as an engagement layer.

> **Core principle:** every point comes from a **verified return**. Never the
> honour system.

## Stack

React + Vite + TypeScript + Tailwind, React Router, Zustand. Internationalised
with **react-i18next** (en/zh/ms/ta). Installable **PWA** via `vite-plugin-pwa`.
Auth via **@react-oauth/google**. State persists to `localStorage` through a
swappable repository (the local mock "backend").

```
cp .env.example .env.local   # add your VITE_GOOGLE_CLIENT_ID
npm install
npm run dev       # start the dev server on http://localhost:5173
npm run build     # typecheck + production build (+ PWA service worker)
npm run lint      # tsc --noEmit
```

### Google sign-in setup

Google OAuth is the **primary** login. Create a Web OAuth client at
<https://console.cloud.google.com/apis/credentials> and add
`http://localhost:5173` as an **Authorized JavaScript origin**. No redirect URI
is needed — `@react-oauth/google` uses **popup mode**, so there is no
`/auth/google/callback` route. Put the client ID in `.env.local` as
`VITE_GOOGLE_CLIENT_ID`. Without it, the app falls back to email + password so
local dev isn't blocked.

## The two seams that matter

Everything is designed so the mock pieces can be replaced by real backends with
a one-line change and **no downstream edits**.

### 1. Verification seam — `src/services/verification/`

The **most important boundary in the app**. The rest of the app only imports
`verifyReturn()` and trusts a result of `{ valid: true }`; it never decides on
its own that a return happened.

- `types.ts` — the `VerificationAdapter` contract + `VerifyReturnResult`.
- `mockRvmAdapter.ts` — current adapter: accepts a scanned code / mock RVM
  confirmation, returns `{ valid, containerType, timestamp, verificationRef }`.
- `returnRightAdapter.ts` — **TODO** stub for the real Return Right / Rehub API.
- `index.ts` — exports the active adapter. **Going live = changing one line.**

### 2. Backend/persistence seam — `src/services/backend/`

A `Repository` interface (`load/save/clear`). Today it's `localRepository`
(localStorage). A real API client implementing the same interface drops in
without touching callers.

## Identity & anti-gaming (`src/config/gamification.ts`)

A points-for-recycling app must not reward buying drinks/empty containers to
farm points. Defences:

1. **Verification** — a point can only come from a confirmed return.
2. **Identity** — a verified **Google account (email)** is the v1 identity key:
   one account = one wallet. **Phone + SMS OTP** is the stronger long-term
   control but is **deferred/stubbed** (needs paid SMS infra, untestable
   locally). See `screens/Auth/Auth.tsx`.
3. **Weekly earning cap** — `WEEKLY_POINT_EARNING_CAP` (single constant). Returns
   past it still count toward the streak and lifetime stats but earn **0 points**.

Streaks are **weekly, not daily** (`lib/streaks.ts`, `lib/weeks.ts`).

## Internationalisation (`src/i18n/`)

Four languages: **English (en), Mandarin (zh), Malay (ms), Tamil (ta)**. Every
user-facing string is externalised into `locales/*.json`. The switcher appears
on the welcome screen and in Settings; the choice is persisted; default English.

- English is complete and is the fallback for any missing key.
- zh/ms are translated for core nav + key screens; ta covers core nav + key
  labels with longer strings flagged `_todo` (they fall back to English).
- **Recycling-critical guidance is intentionally NOT translated** — the item
  accept/reject text + WHY lives in `data/recyclables.ts` in English on purpose,
  because a mistranslation misinforms. Human-reviewed translations are a TODO.

## Screens

Bottom nav: **Home · Streaks · Rewards · Extra · Settings**.

1. **Onboarding** — welcome (+ language switcher) → swipeable slides → loading
   screen with a rotating recycling tip.
2. **Auth** — Google OAuth primary; email + password fallback; phone OTP stub.
3. **Avatar picker** — 5 starter avatars.
4. **Home** — avatar, weekly streak, "Log a return" → `verifyReturn()`, plus
   entry points to the Checker and Dashboard.
5. **Streaks** — weekly visualisation, points balance, milestone badges.
6. **Recyclable Checker** (off-nav, linked from Home) — searchable NEA/BCRS
   "accepted / not accepted + why" lookup. The anti-contamination feature.
7. **Rewards** — cosmetic-only: avatar dress-up **and a customisable room** with
   placeholder recycled-themed furniture; disabled "Marketplace (coming soon)".
8. **Extra** — clearly-labelled placeholder for sponsors / mini-games.
9. **Dashboard** — lifetime returns + estimated CO₂ / landfill saved.
10. **About Us** — mission + how-it-works + the "does not replace BCRS" note.
11. **Settings** — account, language switcher, impact summary, reset.

### Trying the demo flow

In "Log a return", a code's prefix sets the container type: `PB…` plastic
bottle, `MC…` metal can, `GB…` glass, `CT…` carton. Enter `INVALID` to see the
rejected path. (No real OTP/RVM in the demo.)

## Out of scope for v1 (stubs/comments only)

Real-goods rewards, blind boxes, sponsor furniture, BeReal-style photo uploads,
mini-games, donations, lottery draws, and **SMS OTP**.

## Where real data plugs in

- Real verification → `services/verification/returnRightAdapter.ts`.
- Real persistence/API → a new `Repository` in `services/backend/`.
- Real NEA recyclables data → `data/recyclables.ts` (shape stays stable).
- Real impact factors → `lib/stats.ts`.
- Human-reviewed translations → `i18n/locales/{zh,ms,ta}.json` (`_todo` markers).
