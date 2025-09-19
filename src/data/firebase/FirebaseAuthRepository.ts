import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { User } from '../../domain/entities/User';
import type { AuthProvider } from '../../domain/entities/AuthProvider';
import { Platform } from 'react-native';
import {
  currentUser,
  observeAuthState,
  signInWithGoogle,
  signOut as signOutFirebase,
  getAuthInstance,
} from '../../infrastructure/auth/expoFirebaseAuth';
import {
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInAnonymously as firebaseSignInAnonymously,
  type User as FirebaseUser,
} from 'firebase/auth';

function mapUser(u: FirebaseUser): User {
  return {
    id: u.uid,
    name: u.displayName || 'User',
    email: u.email || undefined,
    photoUrl: u.photoURL || undefined
  };
}

export class FirebaseAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<User | null> {
    const u = currentUser();
    return u ? mapUser(u) : null;
  }

  onAuthStateChanged(cb: (user: User | null) => void): () => void {
    return observeAuthState((u: FirebaseUser | null) =>
      cb(u ? mapUser(u) : null)
    );
  }

  async signIn(provider: AuthProvider, options?: { email?: string; password?: string }): Promise<User> {
    if (provider === 'password') {
      if (!options?.email || !options?.password) {
        throw new Error('Email and password are required');
      }
      const auth = getAuthInstance();
      const res = await firebaseSignInWithEmailAndPassword(
        auth,
        options.email,
        options.password
      );
      return mapUser(res.user);
    }
    if (provider === 'anonymous') {
      const auth = getAuthInstance();
      const res = await firebaseSignInAnonymously(auth);
      if (!res.user) throw new Error('Anonymous sign-in failed');
      return mapUser(res.user);
    }
    if (provider === 'google') {
      const u = await signInWithGoogle();
      return mapUser(u as FirebaseUser);
    }
    if (provider === 'apple') {
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In disponível apenas no iOS');
      }
      throw new Error('Apple Sign-In não foi configurado nesta build.');
    }
    throw new Error(`Provider ${provider} not supported`);
  }

  async signOut(): Promise<void> {
    await signOutFirebase();
  }

  async signUp(options: { email: string; password: string }): Promise<User> {
    const auth = getAuthInstance();
    const res = await firebaseCreateUserWithEmailAndPassword(
      auth,
      options.email,
      options.password
    );
    return mapUser(res.user);
  }
}
