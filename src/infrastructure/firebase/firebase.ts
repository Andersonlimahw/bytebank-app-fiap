// src/infrastructure/firebase/firebase.ts
// 1) Side-effect PARA REGISTRAR o componente 'auth' antes de tudo
import "firebase/auth";
import "react-native-get-random-values";

import { Platform } from "react-native";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import * as AuthModule from "firebase/auth"; // usado p/ fallbacks dinâmicos
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, type Firestore } from "firebase/firestore";
import { AppConfig } from "../../config/appConfig";

// ------------------------
// Helpers de resolução RN
// ------------------------
function resolveGetReactNativePersistence():
  | ((storage: typeof AsyncStorage) => any)
  | null {
  // 1) Tenta pegar do próprio módulo (quando o named export existe)
  const direct = (AuthModule as any)?.getReactNativePersistence;
  if (typeof direct === "function") return direct;

  try {
    // 2) Tenta carregar explicitamente o entry RN (algumas versões continuam expondo)
    // Se falhar, ignora o erro
    // @ts-ignore
    const rn = require("firebase/auth/react-native");
    if (rn?.getReactNativePersistence) return rn.getReactNativePersistence;
  } catch (_) {}

  return null;
}

// ------------------------
// Serviço enxuto
// ------------------------
class FirebaseService {
  private _app: FirebaseApp | null = null;
  private _db: Firestore | null = null;
  private _auth: Auth | null = null;

  constructor(private cfg: typeof AppConfig) {}

  init() {
    if (this.cfg.useMock) {
      console.log("[Firebase] Mock mode enabled. Skipping real init.");
      return;
    }
    if (!this._app) {
      this._app = getApps()[0] ?? initializeApp({ ...this.cfg.firebase });
      this._db = getFirestore(this._app);
    }
    if (!this._auth) {
      if (Platform.OS === "web") {
        // Web: getAuth + LocalStorage
        const auth = getAuth(this._app!);
        setPersistence(auth, browserLocalPersistence).catch(() => {});
        this._auth = auth;
      } else {
        // RN/Expo Go: initializeAuth + AsyncStorage (com fallback)
        const getRNP = resolveGetReactNativePersistence();
        try {
          if (getRNP) {
            this._auth = initializeAuth(this._app!, {
              persistence: getRNP(AsyncStorage),
            });
          } else {
            console.warn(
              "[Firebase] RN persistence not resolved; using memory only."
            );
            this._auth = initializeAuth(this._app!, {});
          }
        } catch (e) {
          // Se ainda der "auth not registered", força fallback memória (mas funcionando)
          console.warn("[Firebase] Falling back to memory persistence.", e);
          this._auth = initializeAuth(this._app!, {});
        }
      }
    }
  }

  get app(): FirebaseApp {
    if (!this._app) throw new Error("[Firebase] App not initialized.");
    return this._app;
  }
  get db(): Firestore {
    if (!this._db) throw new Error("[Firebase] Firestore not initialized.");
    return this._db;
  }
  get auth(): Auth {
    if (!this._auth) throw new Error("[Firebase] Auth not initialized.");
    return this._auth;
  }
}

const service = new FirebaseService(AppConfig);
service.init();

// ---------- Facade p/ uso no app ----------
export const FirebaseAPI = {
  get app() {
    return service.app;
  },
  get db() {
    return service.db;
  },
  get auth() {
    return service.auth;
  },

  Providers: {
    google: () => new (AuthModule as any).GoogleAuthProvider(),
    apple: () => new (AuthModule as any).OAuthProvider("apple.com"),
    facebook: () => new (AuthModule as any).OAuthProvider("facebook.com"),
  },

  onAuthStateChanged: (cb: (user: any) => void) => {
    return AuthModule.onAuthStateChanged(service.auth, cb);
  },

  signOut: async () => {
    return AuthModule.signOut(service.auth);
  },

  signInAnonymously: async () => {
    return AuthModule.signInAnonymously(service.auth);
  },

  signInWithEmailAndPassword: async (email: string, password: string) => {
    return AuthModule.signInWithEmailAndPassword(service.auth, email, password);
  },

  createUserWithEmailAndPassword: async (email: string, password: string) => {
    return AuthModule.createUserWithEmailAndPassword(
      service.auth,
      email,
      password
    );
  },

  signInWithCredential: async (cred: any) => {
    return AuthModule.signInWithCredential(service.auth, cred);
  },

  signInWithPopup: async (provider: any) => {
    if (Platform.OS === "web") {
      return AuthModule.signInWithPopup(service.auth, provider);
    } else {
      throw new Error("signInWithPopup is Web-only");
    }
  },
};
