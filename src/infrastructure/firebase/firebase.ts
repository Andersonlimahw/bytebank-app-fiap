// src/infrastructure/firebase/auth-setup.ts
import { Platform } from "react-native";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  // ❗️não importamos getReactNativePersistence aqui
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthModule from "firebase/auth"; // fallback dinâmico

import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signOut,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
} from "firebase/auth";

let app: FirebaseApp | null = null;

export function getFirebaseAuth() {
  app =
    app ??
    getApps()[0] ??
    initializeApp({
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    });

  if (Platform.OS === "web") {
    const auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(() => {});
    return { app, auth };
  }

  // RN: tenta obter a função em runtime; se não houver, cai para memória (sem persistência)
  const getRNP = (AuthModule as any)?.getReactNativePersistence;
  if (typeof getRNP === "function") {
    const auth = initializeAuth(app, { persistence: getRNP(AsyncStorage) });
    return { app, auth };
  }

  // Fallback: inicializa sem persistência (funciona; só não persiste após fechar app)
  const auth = initializeAuth(app, {});
  return { app, auth };
}

const { auth } = getFirebaseAuth();

export const Providers = {
  google: () => new GoogleAuthProvider(),
  apple: () => new OAuthProvider("apple.com"),
  facebook: () => new OAuthProvider("facebook.com"),
};

export {
  auth,
  onAuthStateChanged,
  signOut,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
};
