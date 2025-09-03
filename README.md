ByteBank App (Expo + React Native)

Overview
- Expo + React Native + TypeScript
- MVVM + Clean Architecture + SOLID-oriented boundaries (lightweight DI)
- Auth repository with anonymous login (mock by default)
- Mock mode enabled by default so the app runs without Firebase
- Features: Login, Home (balance + transactions), Dashboard (summary)

Project Structure
- app.json: Expo app configuration
- App.tsx: Entrypoint with providers + navigation
- src/config: Env config (Firebase + flags)
- src/core/di: Minimal DI container + tokens
- src/domain: Entities and repository interfaces
- src/application: Use cases (business rules) [TBD]
- src/data/firebase: Firebase repository implementations [TBD]
- src/data/mock: Mock repository implementations (default)
- src/infrastructure/firebase: Firebase initialization + providers [TBD]
- src/presentation: Screens, navigation, providers, components
- src/utils: Format helpers

Getting Started
1) Prerequisites
   - Node.js LTS
   - Expo CLI: npx expo@latest --version

2) Install dependencies
   - npm install
   - or: pnpm i / yarn

3) Run in mock mode (default)
   - npm run start
   - Press i for iOS simulator or a for Android when Metro starts

Current Status
- Mock repositories wired via DI
- Auth flow (anonymous) + guarded navigation
- Home shows balance and seeded transactions
- Dashboard shows simple income/expense summary + sign out

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

3) Install required packages if not present
  - npx expo install expo-auth-session expo-apple-authentication expo-web-browser expo-constants
  - npm i firebase @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
  - npx expo install react-native-screens react-native-safe-area-context

4) Providers (native)
   - Google/Apple/Facebook on native require Expo AuthSession flows and native config.
   - This starter includes a Firebase popup flow for Web; on native, wire sign-in via expo-auth-session and pass credentials to Firebase (see comments in FirebaseAuthRepository and Expo docs).

5) Run with Firebase
   - npm run start
   - Ensure .env is loaded (Expo reads EXPO_PUBLIC_* automatically)

Notes
- Assets are referenced from the repo’s contents/figma folder to reflect designs without duplicating files.
- Mock mode seeds demo transactions and a sample user so you can navigate immediately.
- For production, replace the placeholder EAS projectId in app.json and configure app icons, splash, and bundle ids.

Scripts
- start: Launch Metro bundler
- android / ios: Build and run a dev prebuild (requires native toolchains)
- typecheck: TypeScript validation without emitting
