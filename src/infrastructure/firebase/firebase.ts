import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { AppConfig } from "../../config/appConfig";

export type Auth = FirebaseAuthTypes.Module;
export type Firestore = FirebaseFirestoreTypes.Module;
export type User = FirebaseAuthTypes.User;

export function ensureFirebase() {
  try {
    if (AppConfig.useMock) {
      console.log("[Firebase]: Running in mock mode");
      return null;
    }

    console.log("[Firebase]: Checking Firebase instance");

    // React Native Firebase is already initialized via native configuration
    // Just verify we can get instances
    const currentAuth = auth();
    const currentDb = firestore();

    return {
      auth: currentAuth,
      db: currentDb,
    };
  } catch (e) {
    console.error("[Firebase]: ensureFirebase() failed:", (e as any)?.message);
    throw e;
  }
}

export const FirebaseAPI = {
  ensureFirebase,
  get auth() {
    if (AppConfig.useMock) return null;
    return auth();
  },
  get db() {
    if (AppConfig.useMock) return null;
    return firestore();
  },
};
