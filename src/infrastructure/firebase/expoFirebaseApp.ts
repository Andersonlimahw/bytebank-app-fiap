import { Platform } from "react-native";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
// import { getReactNativePersistence } from 'firebase/auth/react-native';

import { getFirestore, type Firestore } from "firebase/firestore";
import AppConfig from "../../config/appConfig";

type FirebaseEnvConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};
const firebaseOptions: FirebaseEnvConfig = AppConfig.firebase;

function assertFirebaseConfig() {
  const requiredKeys: Array<keyof FirebaseEnvConfig> = [
    "apiKey",
    "projectId",
    "appId",
  ];
  for (const key of requiredKeys) {
    if (!firebaseOptions[key]) {
      throw new Error(
        `Firebase config missing ${key}. Check your EXPO_PUBLIC_FIREBASE_* envs.`
      );
    }
  }
}

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

function ensureApp(): FirebaseApp {
  if (AppConfig.useMock) {
    console.log("Firebase disabled because AppConfig.useMock=true.");
    return null as any;
  }
  assertFirebaseConfig();
  if (!appInstance) {
    appInstance = getApps()[0] ?? initializeApp(firebaseOptions as any);
  }
  return appInstance;
}

function ensureFirestore(): Firestore {
  if (!firestoreInstance) {
    const app = ensureApp();
    firestoreInstance = getFirestore(app);
  }
  return firestoreInstance;
}

export function initFirebase() {
  if (AppConfig.useMock) {
    console.log("Cannot initialize Firebase while running with mocks.");
    return null as any;
  }
  const app = ensureApp();
  const db = ensureFirestore();
  return { app, db };
}

export function getFirebaseApp(): FirebaseApp {
  return ensureApp();
}

export function getFirestoreDb(): Firestore {
  return ensureFirestore();
}

// Provided only for legacy imports; this project does not require firebase/auth
// at runtime for Google Sign-In. Calling this will throw to make it explicit.
export function getFirebaseAuth(): any {
  // Auth via firebase/auth não é utilizado nesta build.
  // Mantemos a função para compatibilidade com imports legados.
  return null as any;
}
