const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ANDROID_DIR = path.join(process.cwd(), 'android');

if (!fs.existsSync(ANDROID_DIR)) {
  console.log('⚠️  android/ not found. Create native projects first.');
  console.log('- Run: npm run bootstrap:native');
  console.log('- Or follow docs/android-native-setup.md');
  process.exit(1);
}

const child = spawn('npx', ['react-native', 'run-android'], { stdio: 'inherit', shell: false });
child.on('exit', (code) => process.exit(code ?? 0));

