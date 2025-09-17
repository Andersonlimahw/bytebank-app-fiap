import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import app from "@react-native-firebase/app";
import { AppConfig } from "../../config/appConfig";

export type Auth = FirebaseAuthTypes.Module;
export type Firestore = FirebaseFirestoreTypes.Module;
export type User = FirebaseAuthTypes.User;
export type QueryConstraint = {
  field: string;
  operator: FirebaseFirestoreTypes.WhereFilterOp | 'orderBy' | 'limit';
  value: any;
};

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

export const Providers = {
  google: () => auth.GoogleAuthProvider.PROVIDER_ID,
  apple: () => auth.OAuthProvider.PROVIDER_ID,
  facebook: () => auth.OAuthProvider.PROVIDER_ID,
};

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
  fbOnAuthStateChanged: (
    callback: (user: FirebaseAuthTypes.User | null) => void
  ) => auth().onAuthStateChanged(callback),
  fbSignOut: () => auth().signOut(),
  signInAnonymously: () => auth().signInAnonymously(),
  signInWithCredential: (credential: FirebaseAuthTypes.AuthCredential) =>
    auth().signInWithCredential(credential),
  signInWithEmailAndPassword: (email: string, password: string) =>
    auth().signInWithEmailAndPassword(email, password),
  createUserWithEmailAndPassword: (email: string, password: string) =>
    auth().createUserWithEmailAndPassword(email, password),
  Providers,

  // Firestore helpers
  collection: (path: string) => {
    if (AppConfig.useMock) return null;
    return firestore().collection(path);
  },
  doc: (path: string) => {
    if (AppConfig.useMock) return null;
    return firestore().doc(path);
  },
  query: (...queryConstraints: FirebaseFirestoreTypes.QueryConstraint[]) => {
    return (collectionRef: FirebaseFirestoreTypes.CollectionReference) => {
      return queryConstraints.reduce((acc, constraint) => acc.where(constraint.field, constraint.operator, constraint.value), collectionRef);
    };
  },
  where: (field: string, op: FirebaseFirestoreTypes.WhereFilterOp, value: any) => ({
    field,
    operator: op,
    value,
  }),
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => ({
    field,
    operator: 'orderBy',
    value: direction,
  }),
  limit: (value: number) => ({
    field: '',
    operator: 'limit',
    value,
  }),
  addDoc: (coll: FirebaseFirestoreTypes.CollectionReference, data: any) =>
    coll.add(data),
  getDocs: (query: FirebaseFirestoreTypes.Query) =>
    query.get(),
  serverTimestamp: () =>
    firestore.FieldValue.serverTimestamp(),
  updateDoc: (docRef: FirebaseFirestoreTypes.DocumentReference, data: any) =>
    docRef.update(data),
  deleteDoc: (docRef: FirebaseFirestoreTypes.DocumentReference) =>
    docRef.delete(),
  onSnapshot: (query: FirebaseFirestoreTypes.Query, callback: (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => void) =>
    query.onSnapshot(callback),
};
