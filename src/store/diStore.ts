import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppConfig } from '../config/appConfig';
import { FirebaseAPI } from '../infrastructure/firebase/firebase';
import { Container, TOKENS, createDI, type DI } from '../core/di/container';
import { MockAuthRepository } from '../data/mock/MockAuthRepository';
import { MockTransactionRepository } from '../data/mock/MockTransactionRepository';
import { MockInvestmentRepository } from '../data/mock/MockInvestmentRepository';
import { FirebaseAuthRepository } from '../data/firebase/FirebaseAuthRepository';
import { FirebaseTransactionRepository } from '../data/firebase/FirebaseTransactionRepository';
import { FirebaseInvestmentRepository } from '../data/firebase/FirebaseInvestmentRepository';

type DIState = {
  container: Container;
  di: DI;
};

function buildContainer(): Container {
  const c = new Container();
  if (AppConfig.useMock) {
    c.set(TOKENS.AuthRepository, new MockAuthRepository());
    c.set(TOKENS.TransactionRepository, new MockTransactionRepository());
    c.set(TOKENS.InvestmentRepository, new MockInvestmentRepository());
    return c;
  }

  // In real mode, try to init Firebase; if it fails, gracefully fallback to mocks
  try {
    FirebaseAPI.ensureFirebase();
    c.set(TOKENS.AuthRepository, new FirebaseAuthRepository());
    c.set(TOKENS.TransactionRepository, new FirebaseTransactionRepository());
    c.set(TOKENS.InvestmentRepository, new FirebaseInvestmentRepository());
  } catch (e: any) {
    // Keep the app usable in development if Firebase env is missing/misconfigured
    // eslint-disable-next-line no-console
    console.warn('[DI] Firebase init failed, using mocks instead:', e?.message ?? e);
    c.set(TOKENS.AuthRepository, new MockAuthRepository());
    c.set(TOKENS.TransactionRepository, new MockTransactionRepository());
    c.set(TOKENS.InvestmentRepository, new MockInvestmentRepository());
  }
  return c;
}

const container = buildContainer();
const di = createDI(container);

export const useDIStore = create<DIState>()(
  devtools(() => ({ container, di }), { name: 'DI' })
);

export function useDI(): DI {
  type S = ReturnType<typeof useDIStore.getState>;
  return useDIStore((s: S) => s.di);
}
