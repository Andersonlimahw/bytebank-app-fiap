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
  Auth,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
// RN-specific persistence helper (tree-shaken on web)
// Types are declared in src/types/firebase-react-native.d.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - shimmed in src/types/firebase-react-native.d.ts for RN envs
import { getReactNativePersistence } from "firebase/auth/react-native";

import { getFirestore, Firestore } from "firebase/firestore";
import { AppConfig } from "../../config/appConfig";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
export function ensureFirebase() {
  if (AppConfig.useMock) return null;
  if (!app) {
    const cfg = AppConfig.firebase as any;
    if (!cfg?.apiKey || !cfg?.projectId || !cfg?.appId) {
      throw new Error(
        "Firebase config is missing. Set EXPO_PUBLIC_FIREBASE_* envs or enable mock mode."
      );
    }
    app = getApps().length ? getApps()[0] : initializeApp(cfg);
    // Use RN persistence on native to avoid web storage and ensure session persistence
    if (Platform.OS === "ios" || Platform.OS === "android") {
      try {
        auth = initializeAuth(app, {
          // Persist sessions on native using AsyncStorage
          persistence: getReactNativePersistence(AsyncStorage),
        } as any);
      } catch (e) {
        // If already initialized (hot reload), fallback to getAuth
        auth = getAuth(app);
      }
    } else {
      auth = getAuth(app);
    }
    db = getFirestore(app);
  }
  return { app, auth, db } as { app: FirebaseApp; auth: Auth; db: Firestore };
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
