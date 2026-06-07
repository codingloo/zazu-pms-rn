# Setup Guide — Personal Manager

## Step 1: Install Node.js
Download from https://nodejs.org → choose LTS version → install.

## Step 2: Create a fresh Expo project
Open terminal (Command Prompt or PowerShell on Windows):

```bash
npx create-expo-app@latest PersonalManager --template blank-typescript
cd PersonalManager
```

## Step 3: Install all dependencies
```bash
npx expo install expo-sqlite expo-file-system expo-sharing expo-document-picker expo-local-authentication expo-secure-store
npx expo install @react-native-async-storage/async-storage react-native-svg
npm install date-fns
npx expo install expo-router react-native-screens react-native-safe-area-context
```

## Step 4: Copy project files
Replace / add these files from the zip into your project folder:

```
PersonalManager/
├── app.config.js          ← REPLACE
├── package.json           ← REPLACE  
├── tsconfig.json          ← ADD
├── metro.config.js        ← ADD
├── assets/                ← ADD whole folder (icon, splash, adaptive-icon)
│
├── app/
│   ├── _layout.tsx        ← REPLACE
│   ├── index.tsx          ← ADD
│   ├── onboarding.tsx     ← ADD
│   ├── lock.tsx           ← ADD
│   ├── settings.tsx       ← ADD
│   ├── health/
│   │   ├── log.tsx        ← ADD
│   │   ├── charts.tsx     ← ADD
│   │   └── history.tsx    ← ADD
│   ├── finance/
│   │   └── index.tsx      ← ADD
│   └── plans/
│       └── index.tsx      ← ADD
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx   ← ADD
│   │   └── Sidebar.tsx    ← ADD
│   └── ui/
│       ├── UIComponents.tsx  ← ADD
│       └── WaterTracker.tsx  ← ADD
│
├── context/
│   ├── AuthContext.tsx    ← ADD
│   └── ThemeContext.tsx   ← ADD
│
├── db/
│   └── database.ts        ← ADD
│
├── backup/
│   └── cloudBackup.ts     ← ADD
│
└── constants/
    ├── theme.ts           ← ADD
    └── types.ts           ← ADD
```

## Step 5: Install Expo Go on your phone
- Android: Search "Expo Go" on Play Store → install
- iOS: Search "Expo Go" on App Store → install

## Step 6: Run the app
```bash
npx expo start
```

Your terminal will show a QR code.
- Android: Open Expo Go → tap "Scan QR code"
- iOS: Open your Camera app and point at the QR code

## Step 7: Test on browser (no phone needed)
```bash
npx expo start --web
```

## Common errors and fixes

**"SDK mismatch" error**
→ Make sure you used `npx create-expo-app@latest` (not an older cached version)
→ Delete node_modules and run `npm install` again

**"Cannot find module" error**  
→ Run `npm install` again in your project folder

**"Asset not found" error**
→ Make sure the `assets/` folder from the zip is copied into your project

**Metro bundler stuck**
→ Press `r` in the terminal to reload, or Ctrl+C and run `npx expo start` again
