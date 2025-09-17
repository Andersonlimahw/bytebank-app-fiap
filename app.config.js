const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = {
  name: "ByteBank",
  slug: "bytebank-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./contents/figma/icons/Logo.png",
  userInterfaceStyle: "light",
  plugins: [
    [
      "@react-native-firebase/app",
      {
        android: {
          googleServicesFile: "./google-services.json",
        },
        ios: {
          googleServicesFile: "./GoogleService-Info.plist",
        },
      },
    ],
  ],
  splash: {
    image: "./contents/figma/icons/Logo.png",
    resizeMode: "contain",
    backgroundColor: "#0A0A0A",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier:
      process.env.EXPO_PUBLIC_BUNDLE_IDENTIFIER || "com.bytebank.app",
    googleServicesFile: fs.existsSync(
      path.resolve(__dirname, "GoogleService-Info.plist")
    )
      ? "./GoogleService-Info.plist"
      : undefined,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./contents/figma/icons/Logo.png",
      backgroundColor: "#0A0A0A",
    },
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || "com.bytebank.app",
    googleServicesFile: fs.existsSync(
      path.resolve(__dirname, "google-services.json")
    )
      ? "./google-services.json"
      : undefined,
  },
  web: {
    favicon: "./contents/figma/icons/Logo.png",
  },
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    },
  },
};
