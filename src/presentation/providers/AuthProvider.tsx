import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../../domain/entities/User';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import { useContainer, TOKENS } from '../../core/di/container';

type AuthContextValue = {
  user: User | null | undefined; // undefined while loading
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider not found');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const container = useContainer();
  const authRepo = container.get<AuthRepository>(TOKENS.AuthRepository);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const u = await authRepo.getCurrentUser();
        setUser(u);
      } finally {
        setLoading(false);
        unsub = authRepo.onAuthStateChanged((u: User | null) => setUser(u));
      }
    })();
    return () => {
      if (unsub) unsub();
    };
  }, [authRepo]);

  const signInAnonymously = useCallback(async () => {
    setLoading(true);
    try {
      await authRepo.signIn('anonymous');
    } finally {
      setLoading(false);
    }
  }, [authRepo]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authRepo.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [authRepo]);

  const value = useMemo(() => ({ user, loading, signInAnonymously, signOut }), [user, loading, signInAnonymously, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
