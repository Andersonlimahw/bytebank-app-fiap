import 'react-native-get-random-values';

import { Platform } from 'react-native';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithCredential as firebaseSignInWithCredential,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithPopup as firebaseSignInWithPopup,
  type Auth,
  type AuthCredential,
  type AuthProvider as FirebaseAuthProvider,
  type NextOrObserver,
  type User,
  type UserCredential,
} from 'firebase/auth';

import {
  initFirebase,
  getFirebaseApp,
  getFirebaseAuth,
  getFirestoreDb,
} from './expoFirebaseApp';
import { AppConfig } from '../../config/appConfig';

let initialized = false;

function ensureInitialized() {
  if (AppConfig.useMock) {
    throw new Error('[FirebaseAPI] Firebase disabled because AppConfig.useMock=true.');
  }
  if (!initialized) {
    initFirebase();
    initialized = true;
  }
}

function resolveAuth(): Auth {
  ensureInitialized();
  return getFirebaseAuth();
}

function resolveApp(): FirebaseApp {
  ensureInitialized();
  return getFirebaseApp();
}

function resolveDb(): Firestore {
  ensureInitialized();
  return getFirestoreDb();
}

export const FirebaseAPI = {
  ensureFirebase() {
    ensureInitialized();
  },
  get app(): FirebaseApp {
    return resolveApp();
  },
  get db(): Firestore {
    return resolveDb();
  },
  get auth(): Auth {
    return resolveAuth();
  },
  Providers: {
    google: () => new GoogleAuthProvider(),
    apple: () => new OAuthProvider('apple.com'),
    facebook: () => new OAuthProvider('facebook.com'),
  },
  onAuthStateChanged(cb: NextOrObserver<User>) {
    try {
      return onAuthStateChanged(resolveAuth(), cb);
    } catch (error) {
      console.error('[FirebaseAPI] Failed to set onAuthStateChanged listener', error);
      return () => {};
    }
  },
  async signOut(): Promise<void> {
    await firebaseSignOut(resolveAuth());
  },
  async signInAnonymously(): Promise<UserCredential> {
    return firebaseSignInAnonymously(resolveAuth());
  },
  async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return firebaseSignInWithEmailAndPassword(resolveAuth(), email, password);
  },
  async createUserWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return firebaseCreateUserWithEmailAndPassword(resolveAuth(), email, password);
  },
  async signInWithCredential(credential: AuthCredential) {
    return firebaseSignInWithCredential(resolveAuth(), credential);
  },
  async signInWithPopup(provider: FirebaseAuthProvider) {
    if (Platform.OS !== 'web') {
      throw new Error('signInWithPopup is Web-only');
    }
    return firebaseSignInWithPopup(resolveAuth(), provider);
  },
};

export type FirebaseService = typeof FirebaseAPI;
