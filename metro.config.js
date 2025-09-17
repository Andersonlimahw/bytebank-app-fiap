const { getDefaultConfig } = require("@expo/metro-config");

// Use Expo's default Metro config. Avoid custom Hermes transformer overrides
// to ensure compatibility with current Expo/RN versions.
module.exports = getDefaultConfig(__dirname);
