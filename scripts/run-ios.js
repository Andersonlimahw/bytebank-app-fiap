const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const IOS_DIR = path.join(process.cwd(), 'ios');

if (!fs.existsSync(IOS_DIR)) {
  console.log('⚠️  ios/ not found. Create native projects first.');
  console.log('- Run: npm run bootstrap:native');
  console.log('- Or follow docs/ios-native-setup.md');
  process.exit(1);
}

const child = spawn('npx', ['react-native', 'run-ios'], { stdio: 'inherit', shell: false });
child.on('exit', (code) => process.exit(code ?? 0));

