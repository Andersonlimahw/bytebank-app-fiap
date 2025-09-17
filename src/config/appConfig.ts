export type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

import Constants from "expo-constants";

const getEnv = (key: string, fallback?: string): string | undefined => {
  const expoConstants = Constants.expoConfig?.extra || {};
  return expoConstants[`EXPO_PUBLIC_${key}`] ?? fallback;
};

// Auto-detect mock vs real mode:
// - If EXPO_PUBLIC_USE_MOCK is set, respect it.
// - Otherwise, enable real mode when required Firebase envs are present; fallback to mock.
function detectUseMock(): boolean {
  const raw = getEnv("USE_MOCK");
  if (raw !== undefined) {
    return raw.toString() === "true";
  }
  const hasFirebaseBasics = !!(
    getEnv("FIREBASE_API_KEY") &&
    getEnv("FIREBASE_PROJECT_ID") &&
    getEnv("FIREBASE_APP_ID")
  );
  return !hasFirebaseBasics;
}

export const AppConfig = {
  useMock: detectUseMock(),
  appearance: {
    brand: getEnv("BRAND", "bytebank"),
    mode: getEnv("THEME_MODE", "light") === "dark" ? "dark" : "light",
  },
  firebase: {
    apiKey:
      Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY ||
      "AIzaSyDz5LzOWv0F4VD23s9J5z_UUxWqMwkUrf8",
    authDomain:
      Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      "projeto-bytebank.firebaseapp.com",
    projectId:
      Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
      "projeto-bytebank",
    appId:
      Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID ||
      "1:102802199932:web:28f905156987a9166880f9",
    storageBucket:
      Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      "projeto-bytebank.firebasestorage.app",
    messagingSenderId:
      Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      "102802199932",
  } as FirebaseConfig,
};
