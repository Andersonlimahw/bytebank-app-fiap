// Conditional Expo app config to avoid failing prebuild when
// Firebase config files are absent locally.
// If you add real files at project root:
// - GoogleService-Info.plist
// - google-services.json
// they will be picked up automatically.

const fs = require('fs');
const path = require('path');

module.exports = ({ config }) => {
  const iosPlistPath = path.resolve(__dirname, 'GoogleService-Info.plist');
  const androidJsonPath = path.resolve(__dirname, 'google-services.json');

  const hasIosPlist = fs.existsSync(iosPlistPath);
  const hasAndroidJson = fs.existsSync(androidJsonPath);

  return {
    ...config,
    ios: {
      ...config.ios,
      ...(hasIosPlist ? { googleServicesFile: './GoogleService-Info.plist' } : {}),
    },
    android: {
      ...config.android,
      ...(hasAndroidJson ? { googleServicesFile: './google-services.json' } : {}),
    },
  };
};

