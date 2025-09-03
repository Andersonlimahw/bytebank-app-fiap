import React, { createContext, useContext, useMemo } from 'react';
import { Container, ContainerProvider, TOKENS, createDI, type DI } from '../../core/di/container';
import { AppConfig } from '../../config/appConfig';
import { MockAuthRepository } from '../../data/mock/MockAuthRepository';
import { MockTransactionRepository } from '../../data/mock/MockTransactionRepository';
import { FirebaseAuthRepository } from '../../data/firebase/FirebaseAuthRepository';
import { FirebaseTransactionRepository } from '../../data/firebase/FirebaseTransactionRepository';
import { AuthProvider } from './AuthProvider';

const DIContext = createContext<DI | null>(null);
export function useDI(): DI {
  const ctx = useContext(DIContext);
  if (!ctx) throw new Error('DI not available');
  return ctx;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const container = useMemo(() => {
    const c = new Container();
    if (AppConfig.useMock) {
      c.set(TOKENS.AuthRepository, new MockAuthRepository());
      c.set(TOKENS.TransactionRepository, new MockTransactionRepository());
    } else {
      // Register Firebase-backed repositories for real implementation
      c.set(TOKENS.AuthRepository, new FirebaseAuthRepository());
      c.set(TOKENS.TransactionRepository, new FirebaseTransactionRepository());
    }
    return c;
  }, []);

  const di = useMemo(() => createDI(container), [container]);
  return (
    <ContainerProvider container={container}>
      <DIContext.Provider value={di}>
        <AuthProvider>{children}</AuthProvider>
      </DIContext.Provider>
    </ContainerProvider>
  );
}
