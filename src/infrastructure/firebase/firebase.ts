import "react-native-get-random-values";

import { Platform } from "react-native";
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

import {
  initFirebase,
  getFirebaseApp,
  getFirestoreDb,
} from "./expoFirebaseApp";
import AppConfig from "../../config/appConfig";

let initialized = false;

function ensureInitialized() {
  if (AppConfig.useMock) {
    console.log(
      "[FirebaseAPI] Firebase disabled because AppConfig.useMock=true."
    );
  }
  if (!initialized) {
    initFirebase();
    initialized = true;
  }
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
};

export type FirebaseService = typeof FirebaseAPI;
