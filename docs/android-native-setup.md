Native Android Setup (React Native CLI)

Goal
- Build and run the app on Android using the native React Native CLI toolchain with Firebase, Google Sign-In, and react-native-config.

Prereqs
- Android Studio (latest) with SDKs and at least one AVD (emulator).
- Java 17 (set JAVA_HOME). From Android Studio, enable JDK 17 or install Temurin 17.
- Android SDK platform-tools in PATH (`adb`).

1) Generate a fresh RN 0.76.x shell
- In a sibling folder (outside this repo):
  - `npx @react-native-community/cli@latest init bytebank --version 0.76.5`
  - If that fails: `npx react-native@0.76.5 init bytebank`

2) Copy native folders into this project
- From the new template project, copy `ios/` and `android/` into this repo’s root:
  - `cp -R ../bytebank/android ./`
  - `cp -R ../bytebank/ios ./` (for iOS support on macOS)

3) Firebase config
- Place `google-services.json` into `android/app/`.
- Add Google Services plugin to `android/build.gradle` (RN template usually already includes it):
  - In `build.gradle` (Project), under `dependencies {}`: `classpath("com.google.gms:google-services:4.4.2")`
- Apply the plugin in `android/app/build.gradle`:
  - Add at bottom: `apply plugin: "com.google.gms.google-services"`

4) react-native-config
- RN 0.76 auto-links the library. Ensure `new ReactNativeConfigPackage()` is picked up (auto-linking).
- No extra steps typically needed in Gradle beyond what the library includes by default.

5) Google Sign-In
- The library `@react-native-google-signin/google-signin` requires a correctly configured `google-services.json` and SHA-1 fingerprints registered in your Firebase project for debug builds.
- Ensure your `android/app/src/debug/AndroidManifest.xml` has any required meta-data if you customize; defaults usually work with Firebase config.

6) Run
- Start Metro in one terminal: `npm run start`
- Start an AVD from Android Studio or `emulator -list-avds && emulator -avd <name>`
- In another terminal: `npm run android`

Troubleshooting
- Duplicate RN versions / Gradle sync errors:
  - `cd android && ./gradlew clean`
  - Delete `android/.gradle` and `android/app/build`
  - Reinstall deps: `rm -rf node_modules && npm i`
- SDK not found:
  - Ensure `ANDROID_HOME` is set and `platform-tools` on PATH.
- Java version:
  - Use Java 17. Set `JAVA_HOME` accordingly.

