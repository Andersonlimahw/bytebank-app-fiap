/*
  Bootstrap Native Projects (iOS/Android)

  Creates or guides creation of ios/ and android/ for this RN CLI app.

  What it does:
  - Checks for ios/ and android/
  - If missing, prints step-by-step commands to generate a fresh RN 0.76.5 shell
    in a sibling folder and copy native folders here.
  - Optionally, if RUN=1 is set in env, it will attempt to execute the steps
    (requires network, Xcode/CocoaPods/Android SDK installed).

  Usage:
    npm run bootstrap:native            # prints instructions
    RUN=1 npm run bootstrap:native     # attempts to run the steps
*/

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IOS_DIR = path.join(ROOT, 'ios');
const ANDROID_DIR = path.join(ROOT, 'android');
const RUN = process.env.RUN === '1' || process.env.RUN === 'true';

function hasDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function sh(cmd, args, options = {}) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...options });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

function main() {
  const hasIOS = hasDir(IOS_DIR);
  const hasAndroid = hasDir(ANDROID_DIR);

  if (hasIOS && hasAndroid) {
    console.log('✅ ios/ and android/ already present. Nothing to do.');
    console.log('Try: npm run ios  |  npm run android');
    return;
  }

  console.log('— Bootstrap Native Projects —');
  console.log('\nWe will create a fresh RN 0.76.5 template named "bytebank" next to this repo,');
  console.log('then copy ios/ and android/ into this project.');

  const parent = path.dirname(ROOT);
  const tempProject = path.join(parent, 'bytebank');

  console.log('\nManual steps (recommended):');
  console.log('  1) In a sibling folder:');
  console.log('     npx @react-native-community/cli@latest init bytebank --version 0.76.5');
  console.log('     # or: npx react-native@0.76.5 init bytebank');
  console.log('  2) Copy native folders into this repo:');
  console.log('     cp -R ../bytebank/ios ./');
  console.log('     cp -R ../bytebank/android ./');
  console.log('  3) Install pods:');
  console.log('     (cd ios && pod install)');
  console.log('  4) Place Firebase files:');
  console.log('     - iOS:     GoogleService-Info.plist → ios/bytebank/');
  console.log('     - Android: google-services.json     → android/app/');
  console.log('  5) Run:');
  console.log('     npm run start   # Metro');
  console.log('     npm run ios     # iOS simulator');
  console.log('     npm run android # Android');

  if (!RUN) {
    console.log('\nTip: set RUN=1 to attempt running these steps automatically.');
    return;
  }

  try {
    if (!fs.existsSync(tempProject)) {
      try {
        sh('npx', ['@react-native-community/cli@latest', 'init', 'bytebank', '--version', '0.76.5'], { cwd: parent });
      } catch (e) {
        console.warn('Falling back to: npx react-native@0.76.5 init bytebank');
        sh('npx', ['react-native@0.76.5', 'init', 'bytebank'], { cwd: parent });
      }
    } else {
      console.log(`Found existing template at: ${tempProject}`);
    }

    // Copy ios/android
    if (!hasIOS) {
      sh('cp', ['-R', path.join(tempProject, 'ios'), ROOT]);
    }
    if (!hasAndroid) {
      sh('cp', ['-R', path.join(tempProject, 'android'), ROOT]);
    }

    console.log('\n✅ Native folders copied. Now installing pods...');
    try {
      sh('bash', ['-lc', 'cd ios && pod install']);
    } catch (e) {
      console.warn('pod install failed or CocoaPods not available. Run it manually later.');
    }

    console.log('\nAll set. Next steps: place Firebase files as described above, then run iOS/Android scripts.');
  } catch (e) {
    console.error(`\nFailed to bootstrap: ${e.message}`);
    process.exit(1);
  }
}

main();

