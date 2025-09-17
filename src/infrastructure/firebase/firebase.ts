import "react-native-get-random-values"; // For Firebase
import { Platform } from "react-native";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  onAuthStateChanged as fbOnAuthStateChanged,
  signOut as fbSignOut,
  signInAnonymously,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";

// Get the persistence mechanism based on platform
const getAuthPersistence = () => {
  if (Platform.OS === "web") {
    return browserLocalPersistence;
  }
  try {
    // Dynamic import for React Native persistence
    return require("firebase/auth").getReactNativePersistence;
  } catch (e) {
    console.warn(
      "[Firebase]: Failed to load React Native persistence, falling back to indexedDB",
      e
    );
    return indexedDBLocalPersistence;
  }
};
const reactNativePersistence = getAuthPersistence();
// RN-specific persistence helper (tree-shaken on web)
// Types are declared in src/types/firebase-react-native.d.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore, Firestore } from "firebase/firestore";
import { AppConfig } from "../../config/appConfig";

let app: FirebaseApp | null = null;
let auth: any | null = null;
let db: Firestore | null = null;
export function ensureFirebase() {
  try {
    if (AppConfig.useMock) {
      console.log("[Firebase]: Running in mock mode");
      return null;
    }

    if (!app) {
      // Clear any existing apps first
      if (getApps().length) {
        console.log("[Firebase]: Cleaning up existing Firebase instances");
        getApps().forEach((app) => (app as any).delete());
      }

      const cfg = AppConfig.firebase as any;
      if (!cfg?.apiKey || !cfg?.projectId || !cfg?.appId) {
        throw new Error(
          "Firebase config is missing. Set EXPO_PUBLIC_FIREBASE_* envs or enable mock mode."
        );
      }

      console.log("[Firebase]: Initializing new Firebase instance");
      app = initializeApp(cfg);
      db = getFirestore(app);

      // Initialize Auth with proper persistence
      if (Platform.OS === "web") {
        console.log("[Firebase]: Initializing web auth");
        auth = getAuth(app);
      } else {
        console.log("[Firebase]: Initializing native auth with persistence");
        auth = initializeAuth(app, {
          persistence: reactNativePersistence(ReactNativeAsyncStorage),
        });
      }

      return { app, auth, db } as {
        app: FirebaseApp;
        auth: any;
        db: Firestore;
      };
    }
  } catch (e) {
    console.error("[Firebase]: ensureFirebase() failed:", (e as any)?.message);
    throw e;
  }
  return null;
}

export const Providers = {
  google: () => new GoogleAuthProvider(),
  apple: () => new OAuthProvider("apple.com"),
  facebook: () => new OAuthProvider("facebook.com"),
};

export const FirebaseAPI = {
  ensureFirebase,
  get auth() {
    ensureFirebase();
    if (!auth) throw new Error("Auth not initialized");
    return auth;
  },
  get db() {
    ensureFirebase();
    if (!db) throw new Error("Firestore not initialized");
    return db;
  },
  fbOnAuthStateChanged,
  fbSignOut,
  signInAnonymously,
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  Providers,
};
