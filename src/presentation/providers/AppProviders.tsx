import React, { createContext, useContext, useMemo } from 'react';
import { Container, ContainerProvider, TOKENS, createDI, type DI } from '../../core/di/container';
import { AppConfig } from '../../config/appConfig';
import { MockAuthRepository } from '../../data/mock/MockAuthRepository';
import { MockTransactionRepository } from '../../data/mock/MockTransactionRepository';
import { MockInvestmentRepository } from '../../data/mock/MockInvestmentRepository';
import { FirebaseAuthRepository } from '../../data/firebase/FirebaseAuthRepository';
import { FirebaseTransactionRepository } from '../../data/firebase/FirebaseTransactionRepository';
import { FirebaseInvestmentRepository } from '../../data/firebase/FirebaseInvestmentRepository';
import { AuthProvider } from './AuthProvider';
import { FirebaseAPI } from '../../infrastructure/firebase/firebase';

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
      c.set(TOKENS.InvestmentRepository, new MockInvestmentRepository());
    } else {
      // Register Firebase-backed repositories for real implementation
      // Initialize Firebase early to fail fast on missing config
      FirebaseAPI.ensureFirebase();
      c.set(TOKENS.AuthRepository, new FirebaseAuthRepository());
      c.set(TOKENS.TransactionRepository, new FirebaseTransactionRepository());
      c.set(TOKENS.InvestmentRepository, new FirebaseInvestmentRepository());
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
