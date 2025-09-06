import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDI } from '../providers/AppProviders';
import { TOKENS } from '../../core/di/container';
import type { User } from '../../domain/entities/User';
import type { AuthProvider } from '../../domain/entities/AuthProvider';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import { SignInWithProvider } from '../../application/usecases/SignInWithProvider';
import { SignOut } from '../../application/usecases/SignOut';

export function useAuthViewModel() {
  const di = useDI();
  const authRepo = useMemo(() => di.resolve<AuthRepository>(TOKENS.AuthRepository), [di]);
  const signInUC = useMemo(() => new SignInWithProvider(authRepo), [authRepo]);
  const signOutUC = useMemo(() => new SignOut(authRepo), [authRepo]);
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
    (provider: AuthProvider, options?: { email?: string; password?: string }) => signInUC.execute(provider, options),
    [signInUC]
  );
  const signOut = useCallback(() => signOutUC.execute(), [signOutUC]);
  const signUp = useCallback((options: { email: string; password: string }) => authRepo.signUp(options), [authRepo]);

  return { initializing, user, signIn, signOut, signUp };
}
