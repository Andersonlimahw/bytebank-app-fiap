ByteBank App (Expo + React Native)

Overview
- Expo + React Native + TypeScript
- MVVM + Clean Architecture + SOLID-oriented boundaries (lightweight DI)
- Auth repository with anonymous login (mock by default)
- Mock mode is available; default mode follows your scripts/env
- Features: Login, Home (balance + transactions), Dashboard (summary)
 - Shared theme tokens for consistent colors, spacing, and typography

Project Structure
- app.json: Expo app configuration
- App.tsx: Entrypoint with providers + navigation
- src/config: Env config (Firebase + flags)
- src/core/di: Minimal DI container + tokens
- src/domain: Entities and repository interfaces
- src/application: Use cases (business rules)
- src/data/firebase: Firebase repository implementations
- src/data/mock: Mock repository implementations (default)
- src/infrastructure/firebase: Firebase initialization + providers
- src/presentation: Screens, navigation, providers, components
  - presentation/theme: App theme (colors, spacing, radius)
- src/utils: Format helpers

Getting Started
1) Prerequisites
   - Node.js LTS
   - Expo CLI: npx expo@latest --version

2) Install dependencies
   - npm install
   - or: pnpm i / yarn

3) Run the app
   - Real (Firebase) mode: `npm run start:firebase` (reads `.env` with `EXPO_PUBLIC_USE_MOCK=false`).
   - Mock mode (no Firebase needed): `npm run start:mocks`.
   - Default: `npm run start` (no prebuild, uses current env).
   - In Metro, press `i` for iOS simulator or `a` for Android.

Troubleshooting
- PlatformConstants not found: This usually means a native/JS version mismatch or duplicate native modules.
  - Remove explicit duplicates from dependencies: avoid pinning `react-native` and `expo-constants` directly in `package.json` for managed apps. Use `expo install` to get compatible versions.
  - Reinstall deps and clear caches:
    - `rm -rf node_modules package-lock.json` then `npm i`
    - `npm run clear-cache` (runs `expo start --clear`)
  - If you prebuilt native projects before, run `npx expo prebuild --clean` and rebuild the app.
  - Ensure your Expo SDK and Expo Go app are up-to-date (this project targets SDK 54 / RN 0.75).

Current Status
- Mock repositories wired via DI, with automatic fallback if Firebase is misconfigured
- Auth flow (Google/Apple/Email/Anonymous) + guarded navigation
- Home shows balance and recent transactions
- Dashboard shows income/expense summary and allows adding demo credits/debits
- Extract supports search, edit, delete, and now adding new transactions (modal)
 - PIX screen with send, QR pay/receive, keys, favorites, history, and limits

Switching to Firebase
1) Create a Firebase project and a web app to obtain config.
2) Set the following environment variables (Expo public envs):
   - EXPO_PUBLIC_USE_MOCK=false
   - EXPO_PUBLIC_FIREBASE_API_KEY=...
   - EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   - EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   - EXPO_PUBLIC_FIREBASE_APP_ID=...
   - EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   - EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   You can copy .env.example to .env and edit.

3) Google/Apple providers (native)
   - Google Sign-In uses expo-auth-session. Set one of:
     - EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID (works on Expo Go), or
     - Platform-specific: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID / ANDROID / WEB.
   - Redirect handling: app.json includes `"scheme": "bytebank"` and the code uses `makeRedirectUri({ scheme: 'bytebank', useProxy: true })` on native for easy dev. For production builds, AuthSession will use your app scheme.
   - Apple Sign-In works only on iOS. Ensure your Apple capabilities are configured for your Bundle ID.

4) Install required packages if not present
  - npx expo install expo-auth-session expo-apple-authentication expo-web-browser
  - npm i firebase @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
  - npx expo install react-native-screens react-native-safe-area-context
  - Note: `app.json` includes the `expo-apple-authentication` plugin required for native iOS builds.

5) Providers (native)
   - Google/Apple/Facebook on native require Expo AuthSession flows and native config.
   - This starter includes a Firebase popup flow for Web; on native, wire sign-in via expo-auth-session and pass credentials to Firebase (see comments in FirebaseAuthRepository and Expo docs).

6) Run with Firebase
  - npm run start
  - Ensure .env is loaded (Expo reads EXPO_PUBLIC_* automatically)
  - In `app.json`, update iOS bundle identifier and Android package if needed.

Auth Persistence on Native
- The app attempts to use React Native persistence for Firebase Auth when running on iOS/Android via `initializeAuth(..., getReactNativePersistence(AsyncStorage))`.
- If `@react-native-async-storage/async-storage` isn’t installed, it falls back to in-memory persistence (sign-in still works during the session but won’t persist across restarts).
- To enable full persistence, install AsyncStorage:
  - npx expo install @react-native-async-storage/async-storage
  - Then rebuild if using prebuild/EAS.

Transactions (Firestore)
- Collection: `transactions` with fields: `userId` (string), `type` ('credit'|'debit'), `amount` (number, cents), `description` (string), `category` (optional string), `createdAt` (serverTimestamp)
- Queries order by `createdAt desc` filtered by `userId` (you may be prompted by Firebase to create a composite index)

Investments (Firestore)
- Collection: `investments` with fields: `userId` (string), `type` (category), `amount` (number, cents)

Data Standardization Notes
- Firestore transactions use `createdAt` stored as `serverTimestamp()`; readers map Firestore `Timestamp` to epoch milliseconds to match domain model.
- ViewModels now use application usecases (`GetRecentTransactions`, `GetBalance`, `SignInWithProvider`, `SignOut`) to keep layers consistent with Clean Architecture.
 - UI uses centralized theme tokens in `src/presentation/theme/theme.ts` to standardize colors (primary, success, danger, text, muted, border), spacing, and radius.

Firebase Initialization (Real Mode)
- When `EXPO_PUBLIC_USE_MOCK=false`, Firebase is initialized early during DI container setup via `FirebaseAPI.ensureFirebase()`. This fails fast if any required Firebase env vars are missing, helping catch config issues on startup.

Notes
- Assets are referenced from the repo’s contents/figma folder to reflect designs without duplicating files.
- Mock mode seeds demo transactions and a sample user so you can navigate immediately.
- For production, replace the placeholder EAS projectId in app.json and configure app icons, splash, and bundle ids.

Scripts
- start: Launch Metro bundler
- android / ios: Build and run a dev prebuild (requires native toolchains)
- typecheck: TypeScript validation without emitting
PIX (Firestore)
- Collections and fields:
  - `pixKeys`: `userId` (string), `type` ('email'|'phone'|'cpf'|'random'), `value` (string), `active` (bool), `createdAt` (serverTimestamp)
  - `pixFavorites`: `userId` (string), `alias` (string), `keyValue` (string), `name` (optional string), `createdAt` (serverTimestamp)
  - `pixTransfers`: `userId` (payer id, string), `toKey` (string), `toName` (optional string), `amount` (number, cents), `description` (optional), `status` ('completed'|'pending'|'failed'), `method` ('key'|'qr'), `createdAt` (serverTimestamp)
  - `pixQrCharges`: `userId` (merchant id), `amount` (number|null, cents), `description` (string|null), `status` ('pending'|'paid'), `payload` (string), `createdAt` (serverTimestamp), `paidAt` (serverTimestamp|null), `payerId` (string|null)

PIX Features
- Send by key: validates limits (daily, nightly, per-transfer) and records a debit in `transactions`. If the destination key exists, credits the recipient’s `transactions`.
- Pay QR: parses a simplified `PIXQR:` payload or `key|amount|desc` string, debits the payer, and updates any matching `pixQrCharges` to `paid` (credits merchant).
- Receive via QR: creates a `pixQrCharges` doc and returns a shareable payload string.
- Keys: list/add/remove. You can add email/phone/CPF with a custom value (or generate random keys).
- Favorites: list/add/remove. Used as quick references for frequent keys.
- History: lists last PIX transfers for the current user.
- Limits: per user document in `pixLimits` with defaults that you can update in-app.

Indexes
- Firestore may prompt you to create indexes for queries combining `where('userId','==',...)` and `orderBy('createdAt','desc')` on collections above. Create the suggested index in the Firebase console if requested.

Enabling Real PIX Mode
- Set `EXPO_PUBLIC_USE_MOCK=false` and Firebase envs in `.env`.
- Install required deps (see Switching to Firebase above) and run the app.
- Sign in (email/password, anonymous, or a provider). PIX data is scoped to the signed-in `userId`.
