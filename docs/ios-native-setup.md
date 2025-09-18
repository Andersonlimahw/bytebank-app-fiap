Native iOS Setup (React Native CLI)

Goal
- Build and run the app on iOS Simulator using native modules (no Expo Go): React Native CLI + react-native-firebase + Google/Apple Sign-In + react-native-config.

What’s already done in this repo
- Migrated code to use native libs (React Native Firebase, Google/Apple sign-in, react-native-config).
- Metro configured for RN CLI; `npm run start` uses `react-native start`.
- Added `react-native-gesture-handler` and the required import in `index.js`.

What’s missing
- The native iOS/Android projects (`ios/` and `android/`). Generate them once and keep them in the repo.

Prereqs
- Xcode 15+, CocoaPods, Node 18+.
- Ruby and Cocoapods: `sudo gem install cocoapods`
- Watchman (optional): `brew install watchman`

1) Generate a fresh RN 0.76.x shell
- In a sibling folder (outside this repo):
  - `npx @react-native-community/cli@latest init bytebank --version 0.76.5`
  - If `--version` fails, use: `npx react-native@0.76.5 init bytebank`

2) Copy native folders into this project
- From the new template project, copy `ios/` and `android/` into this repo’s root.
- Do not overwrite JS files; only bring native folders.

3) iOS: Pod install
- From this repo root:
  - `cd ios && pod install && cd ..`

4) Firebase files
- iOS: place `GoogleService-Info.plist` into `ios/bytebank/` (same folder as `Info.plist`).
- Android: place `google-services.json` into `android/app/`.

5) iOS config tweaks
- URL Schemes (Google Sign-In):
  - In Xcode → bytebank target → Info → URL Types → add two entries:
    1) `REVERSED_CLIENT_ID` from your `GoogleService-Info.plist`.
    2) Custom scheme (optional for deep links): `bytebank`.
- Apple Sign-In:
  - In Signing & Capabilities → add “Sign In with Apple”.
- react-native-config:
  - Ensure `ios/bytebank/Config.xcconfig` exists and is included in build settings (the pod does this automatically). If not, add a Config.xcconfig with `#include? "../Pods/Target Support Files/Pods-bytebank/Pods-bytebank.debug.xcconfig"` and release variant; then set them under Project → Info → Configurations.

6) Android config (summary)
- `android/build.gradle`:
  - Ensure Google Services classpath exists and plugin applied in `app/build.gradle`.
- `app/src/main/AndroidManifest.xml`:
  - Add Google Sign-In web client id via meta-data if needed (library docs).

7) Env vars
- Copy `.env.example` to `.env` and fill:
  - `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID`, etc.
  - `GOOGLE_IOS_CLIENT_ID`, `GOOGLE_ANDROID_CLIENT_ID`, `GOOGLE_WEB_CLIENT_ID`.
- `USE_MOCK=false` to force real Firebase mode (optional; otherwise auto-detects).

8) Run
- Terminal 1: `npm run start` (Metro)
- Terminal 2: `npm run ios` (build + boot simulator)

Troubleshooting
- Duplicate or missing RN versions:
  - Remove `node_modules`, `ios/Pods`, and DerivedData. Reinstall deps and `pod install`.
- Gesture handler errors:
  - Ensure `react-native-gesture-handler` is installed and `import 'react-native-gesture-handler';` is at the very top of `index.js`.
- Firebase not initializing:
  - Check `.env` values and that `GoogleService-Info.plist`/`google-services.json` are in the correct native folders.

