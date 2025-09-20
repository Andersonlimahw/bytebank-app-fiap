import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  currentUser,
  observeAuthState,
  signInWithGoogle,
  signOut,
} from '../infrastructure/auth/expoFirebaseAuth';

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useFirebaseAuth(): AuthState {
  const [user, setUser] = useState<User | null>(() => currentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = observeAuthState(setUser);
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
