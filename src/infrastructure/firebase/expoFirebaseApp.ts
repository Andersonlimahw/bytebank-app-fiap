import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { AppConfig } from '../../config/appConfig';

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
  const requiredKeys: Array<keyof FirebaseEnvConfig> = ['apiKey', 'projectId', 'appId'];
  for (const key of requiredKeys) {
    if (!firebaseOptions[key]) {
      throw new Error(`Firebase config missing ${key}. Check your EXPO_PUBLIC_FIREBASE_* envs.`);
    }
  }
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

function ensureApp(): FirebaseApp {
  if (AppConfig.useMock) {
    throw new Error('Firebase disabled because AppConfig.useMock=true.');
  }
  assertFirebaseConfig();
  if (!appInstance) {
    appInstance = getApps()[0] ?? initializeApp(firebaseOptions as any);
  }
  return appInstance;
}

function ensureAuth(): Auth {
  if (!authInstance) {
    const app = ensureApp();
    if (Platform.OS === 'web') {
      authInstance = getAuth(app);
    } else {
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  }
  return authInstance;
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
    throw new Error('Cannot initialize Firebase while running with mocks.');
  }
  const app = ensureApp();
  const auth = ensureAuth();
  const db = ensureFirestore();
  return { app, auth, db };
}

export function getFirebaseApp(): FirebaseApp {
  return ensureApp();
}

export function getFirebaseAuth(): Auth {
  return ensureAuth();
}

export function getFirestoreDb(): Firestore {
  return ensureFirestore();
}
