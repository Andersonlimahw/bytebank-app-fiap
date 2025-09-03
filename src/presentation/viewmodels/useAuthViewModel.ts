import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDI } from '../providers/AppProviders';
import { TOKENS } from '../../core/di/container';
import type { User } from '../../domain/entities/User';
import type { AuthProvider } from '../../domain/entities/AuthProvider';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';

export function useAuthViewModel() {
  const di = useDI();
  const authRepo = useMemo(() => di.resolve<AuthRepository>(TOKENS.AuthRepository), [di]);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = authRepo.onAuthStateChanged((u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, [authRepo]);

  const signIn = useCallback(
    (provider: AuthProvider, options?: { email?: string; password?: string }) => authRepo.signIn(provider, options),
    [authRepo]
  );
  const signOut = useCallback(() => authRepo.signOut(), [authRepo]);

  return { initializing, user, signIn, signOut };
}
