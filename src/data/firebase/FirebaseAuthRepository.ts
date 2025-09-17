import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import type { User } from "../../domain/entities/User";
import type { AuthProvider } from "../../domain/entities/AuthProvider";
import { Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  signInWithGoogleNative,
  signInWithAppleNative,
} from "../../infrastructure/auth/expoAuth";

function mapUser(u: FirebaseAuthTypes.User): User {
  return {
    id: u.uid,
    name: u.displayName || "User",
    email: u.email || undefined,
    photoUrl: u.photoURL || undefined,
  };
}

export class FirebaseAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<User | null> {
    const currentUser = auth().currentUser;
    return currentUser ? mapUser(currentUser) : null;
  }

  onAuthStateChanged(cb: (user: User | null) => void): () => void {
    return auth().onAuthStateChanged((u: FirebaseAuthTypes.User | null) =>
      cb(u ? mapUser(u) : null)
    );
  }

  async signIn(
    provider: AuthProvider,
    options?: { email?: string; password?: string }
  ): Promise<User> {
    if (provider === "password") {
      if (!options?.email || !options?.password) {
        throw new Error("Email and password are required");
      }
      const res = await auth().signInWithEmailAndPassword(
        options.email,
        options.password
      );
      return mapUser(res.user);
    }

    if (provider === "anonymous") {
      const res = await auth().signInAnonymously();
      if (!res.user) throw new Error("Anonymous sign-in failed");
      return mapUser(res.user);
    }

    // Native apps: handle Google/Apple using Expo Auth Session
    if (Platform.OS !== "web") {
      if (provider === "google") {
        const credential = await signInWithGoogleNative();
        const res = await auth().signInWithCredential(credential);
        return mapUser(res.user);
      }
      if (provider === "apple") {
        const credential = await signInWithAppleNative();
        const res = await auth().signInWithCredential(credential);
        return mapUser(res.user);
      }
    }

    throw new Error(`Provider ${provider} not supported on ${Platform.OS}`);
  }

  async signOut(): Promise<void> {
    await auth().signOut();
  }

  async signUp(options: { email: string; password: string }): Promise<User> {
    const res = await auth().createUserWithEmailAndPassword(
      options.email,
      options.password
    );
    return mapUser(res.user);
  }
}
