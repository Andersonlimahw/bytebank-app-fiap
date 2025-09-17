const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Helper: read env with fallback
const env = (key, fallback) => process.env[key] ?? fallback;

// Build `extra` so values are available at runtime via Constants.expoConfig.extra
const extra = {
  // App meta
  version: env("EXPO_PUBLIC_APP_VERSION", "1.0.0"),
  // Make all EXPO_PUBLIC_* available in Constants.expoConfig.extra
  EXPO_PUBLIC_USE_MOCK: env("EXPO_PUBLIC_USE_MOCK"),
  EXPO_PUBLIC_BRAND: env("EXPO_PUBLIC_BRAND", "bytebank"),
  EXPO_PUBLIC_THEME_MODE: env("EXPO_PUBLIC_THEME_MODE", "light"),
  EXPO_PUBLIC_BUNDLE_IDENTIFIER: env(
    "EXPO_PUBLIC_BUNDLE_IDENTIFIER",
    "com.andersonlimahw.bytebankapp"
  ),
  EXPO_PUBLIC_ANDROID_PACKAGE: env(
    "EXPO_PUBLIC_ANDROID_PACKAGE",
    "com.andersonlimahw.bytebankapp"
  ),

  // Firebase
  EXPO_PUBLIC_FIREBASE_API_KEY: env("EXPO_PUBLIC_FIREBASE_API_KEY"),
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: env("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: env("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  EXPO_PUBLIC_FIREBASE_APP_ID: env("EXPO_PUBLIC_FIREBASE_APP_ID"),
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: env("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: env("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  EXPO_PUBLIC_DATABASE_URL: env("EXPO_PUBLIC_DATABASE_URL"),

  // Google OAuth client IDs
  EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID: env("EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID"),
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: env("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"),
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: env("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"),
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: env("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),

  // EAS project id
  eas: {
    projectId: env("EXPO_PUBLIC_PROJECT_ID"),
  },
};

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
      extra.EXPO_PUBLIC_BUNDLE_IDENTIFIER || "com.andersonlimahw.bytebankapp",
    // Swift pods must be dynamic to avoid CocoaPods static linkage errors
    // This writes ios.useFrameworks to Podfile.properties.json during prebuild
    useFrameworks: "dynamic",
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
    package:
      extra.EXPO_PUBLIC_ANDROID_PACKAGE || "com.andersonlimahw.bytebankapp",
    googleServicesFile: fs.existsSync(
      path.resolve(__dirname, "google-services.json")
    )
      ? "./google-services.json"
      : undefined,
  },
  web: {
    favicon: "./contents/figma/icons/Logo.png",
  },
  extra,
};
