# Personal Manager — React Native App

A local-first personal management app. All data stays on your device.

## Architecture
- **Framework**: Expo (React Native) with expo-router
- **Database**: SQLite via expo-sqlite (on device)
- **Navigation**: Sidebar drawer (no bottom tabs)
- **Backup**: Google Drive / iCloud via native share sheet
- **Auth**: PIN + biometrics via expo-local-authentication

## Navigation structure
```
Sidebar
├── Overview
│   └── Dashboard          (app/index.tsx)
├── Health
│   ├── Daily log          (app/health/log.tsx)
│   ├── Trends             (app/health/charts.tsx)
│   └── History            (app/health/history.tsx)
├── Finance                (app/finance/index.tsx) — coming soon
├── Daily Plans            (app/plans/index.tsx)   — coming soon
└── Settings               (app/settings.tsx)
```

## Setup
```bash
cd mobile
npx create-expo-app . --template blank
# copy all files from this folder into the project
npm install
npx expo start
```

## Key files
| File | Purpose |
|---|---|
| `app/_layout.tsx` | Root — auth guard, Stack navigator |
| `app/index.tsx` | Dashboard |
| `app/health/log.tsx` | Health entry form |
| `app/health/charts.tsx` | Trend charts |
| `app/health/history.tsx` | Full log history |
| `app/settings.tsx` | Settings + backup |
| `app/onboarding.tsx` | First-launch setup |
| `app/lock.tsx` | PIN / biometric lock |
| `components/layout/AppShell.tsx` | Topbar + sidebar wrapper |
| `components/layout/Sidebar.tsx` | Drawer with all nav items |
| `components/ui/UIComponents.tsx` | Shared UI primitives |
| `components/ui/WaterTracker.tsx` | Water cup tracker |
| `context/AuthContext.tsx` | Auth state + PIN + biometric |
| `context/ThemeContext.tsx` | Light / dark / system |
| `db/database.ts` | SQLite setup + CRUD |
| `backup/cloudBackup.ts` | Export / import via share sheet |
| `constants/theme.ts` | Design tokens |
| `constants/types.ts` | TypeScript interfaces |

## Adding a new module (e.g. Finance)
1. Create `app/finance/index.tsx` using `<AppShell title="Finance">`
2. Add nav items to `components/layout/Sidebar.tsx` NAV_ITEMS array
3. Add new SQLite table in `db/database.ts` setupDatabase()
4. Register screen in `app/_layout.tsx` Stack
