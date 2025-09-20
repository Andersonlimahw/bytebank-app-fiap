// This build avoids firebase/auth entirely.
// Keep exports to satisfy imports, but provide no-op stubs.

// Minimal types used by callers
export type User = any;
export type Unsubscribe = () => void;
export type Auth = any;

export function observeAuthState(callback: (user: User | null) => void): Unsubscribe {
  // No firebase-auth observer in this build; emit null once.
  try { callback(null); } catch {}
  return () => {};
}

export function currentUser(): User | null {
  return null;
}

export async function signInWithGoogle(): Promise<User> {
  throw new Error('signInWithGoogle() via firebase/auth não suportado nesta build. Use GoogleSignin.');
}

export async function signOut(): Promise<void> {
  // No-op here; GoogleAuthRepository handles signOut via GoogleSignin.
}

export function getAuthInstance(): Auth {
  return null as any;
}
