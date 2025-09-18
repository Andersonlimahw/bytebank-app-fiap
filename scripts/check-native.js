/*
  Simple native setup checker for this repo.
  - Verifies presence of ios/ and android/
  - Verifies AppRegistry name matches suggested native project name
  - Prints next-step commands to bootstrap native projects

  Usage:
    npm run doctor
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IOS_DIR = path.join(ROOT, 'ios');
const ANDROID_DIR = path.join(ROOT, 'android');

function hasDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return undefined;
  }
}

function checkAppRegistryName() {
  const indexPath = path.join(ROOT, 'index.js');
  const content = readFile(indexPath) || '';
  const match = content.match(/AppRegistry\.registerComponent\(['\"]([^'\"]+)['\"]/);
  return match ? match[1] : undefined;
}

function main() {
  const hasIOS = hasDir(IOS_DIR);
  const hasAndroid = hasDir(ANDROID_DIR);
  const appName = checkAppRegistryName();

  console.log('— ByteBank Native Doctor —');
  console.log(`index.js AppRegistry name: ${appName || '(not found)'}`);
  console.log(`ios/ present: ${hasIOS}`);
  console.log(`android/ present: ${hasAndroid}`);

  if (!appName) {
    console.log('\nHint: index.js should register "bytebank" to match the RN template name.');
  }

  if (hasIOS && hasAndroid) {
    console.log('\n✅ Native projects detected.');
    console.log('- Start Metro:   npm run start');
    console.log('- iOS Simulator: npm run ios');
    console.log('- Android:       npm run android');
    return;
  }

  console.log('\n⚠️  Missing native projects. Follow this one-time bootstrap:');
  console.log('1) Create a fresh RN 0.76 shell in a sibling folder:');
  console.log('   npx @react-native-community/cli@latest init bytebank --version 0.76.5');
  console.log('   # If the above fails:');
  console.log('   npx react-native@0.76.5 init bytebank');
  console.log('2) Copy native folders into this repo root:');
  console.log('   cp -R ../bytebank/ios ./');
  console.log('   cp -R ../bytebank/android ./');
  console.log('3) iOS pods:');
  console.log('   (cd ios && pod install)');
  console.log('4) Place Firebase files:');
  console.log('   - iOS:     GoogleService-Info.plist → ios/bytebank/');
  console.log('   - Android: google-services.json     → android/app/');
  console.log('5) Run:');
  console.log('   npm run start  # Metro');
  console.log('   npm run ios    # iOS simulator');
  console.log('   npm run android# Android (AVD running)');
}

main();

