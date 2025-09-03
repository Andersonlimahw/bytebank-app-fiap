import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { User } from '../../domain/entities/User';
import type { AuthProvider } from '../../domain/entities/AuthProvider';
import { FirebaseAPI } from '../../infrastructure/firebase/firebase';

function mapUser(u: any): User {
  return {
    id: u.uid,
    name: u.displayName || 'User',
    email: u.email || undefined,
    photoUrl: u.photoURL || undefined
  };
}

export class FirebaseAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<User | null> {
    const auth = FirebaseAPI.auth;
    const u = auth.currentUser;
    return u ? mapUser(u) : null;
  }

  onAuthStateChanged(cb: (user: User | null) => void): () => void {
    const auth = FirebaseAPI.auth;
    return FirebaseAPI.fbOnAuthStateChanged(auth, (u) => cb(u ? mapUser(u) : null));
  }

  async signIn(provider: AuthProvider, options?: { email?: string; password?: string }): Promise<User> {
    const auth = FirebaseAPI.auth;
    if (provider === 'password') {
      if (!options?.email || !options?.password) {
        throw new Error('Email and password are required');
      }
      const res = await FirebaseAPI.signInWithEmailAndPassword(auth as any, options.email, options.password);
      return mapUser(res.user);
    }
    if (provider === 'anonymous') {
      const res = await FirebaseAPI.signInAnonymously(auth);
      if (!res.user) throw new Error('Anonymous sign-in failed');
      return mapUser(res.user);
    }
    // Note: For native apps, use Expo Auth Session for Google/Apple/Facebook.
    // This repository assumes Web or preconfigured native credential flow.
    const provFactory = (FirebaseAPI.Providers as any)[provider];
    if (!provFactory) throw new Error(`Provider ${provider} not supported`);
    const prov = provFactory();
    const res = await FirebaseAPI.signInWithPopup(auth as any, prov as any);
    return mapUser(res.user);
  }

  async signOut(): Promise<void> {
    await FirebaseAPI.fbSignOut(FirebaseAPI.auth);
  }
}
