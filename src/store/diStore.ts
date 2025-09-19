import { create } from "zustand";
import { devtools } from "zustand/middleware";
import AppConfig from "../config/appConfig";
import { FirebaseAPI } from "../infrastructure/firebase/firebase";
import { Container, TOKENS, createDI, type DI } from "../core/di/container";
import { MockAuthRepository } from "../data/mock/MockAuthRepository";
import { MockTransactionRepository } from "../data/mock/MockTransactionRepository";
import { MockInvestmentRepository } from "../data/mock/MockInvestmentRepository";
import { FirebaseAuthRepository } from "../data/firebase/FirebaseAuthRepository";
import { FirebaseTransactionRepository } from "../data/firebase/FirebaseTransactionRepository";
import { FirebaseInvestmentRepository } from "../data/firebase/FirebaseInvestmentRepository";
import { FirebasePixRepository } from "../data/firebase/FirebasePixRepository";
import { FirebaseCardRepository } from "../data/firebase/FirebaseCardRepository";
import { MockPixRepository } from "../data/mock/MockPixRepository";
import { MockCardRepository } from "../data/mock/MockCardRepository";

type DIState = {
  container: Container;
  di: DI;
};

function buildContainer(): Container {
  const container = new Container();
  if (AppConfig.useMock) {
    container.set(TOKENS.AuthRepository, new MockAuthRepository());
    container.set(
      TOKENS.TransactionRepository,
      new MockTransactionRepository()
    );
    container.set(TOKENS.InvestmentRepository, new MockInvestmentRepository());
    container.set(TOKENS.PixRepository, new MockPixRepository());
    container.set(TOKENS.CardRepository, new MockCardRepository());
    return container;
  }

  // In real mode, try to init Firebase; if it fails, gracefully fallback to mocks
  try {
    FirebaseAPI.auth;
    container.set(TOKENS.AuthRepository, new FirebaseAuthRepository());
    container.set(
      TOKENS.TransactionRepository,
      new FirebaseTransactionRepository()
    );
    container.set(
      TOKENS.InvestmentRepository,
      new FirebaseInvestmentRepository()
    );
    container.set(TOKENS.PixRepository, new FirebasePixRepository());
    container.set(TOKENS.CardRepository, new FirebaseCardRepository());
  } catch (e: any) {
    // Keep the app usable in development if Firebase env is missing/misconfigured
    // eslint-disable-next-line no-console
    console.warn("[DI] Firebase init failed, using mocks instead:", {
      error: e,
    });
    container.set(TOKENS.AuthRepository, new MockAuthRepository());
    container.set(
      TOKENS.TransactionRepository,
      new MockTransactionRepository()
    );
    container.set(TOKENS.InvestmentRepository, new MockInvestmentRepository());
    container.set(TOKENS.PixRepository, new MockPixRepository());
    container.set(TOKENS.CardRepository, new MockCardRepository());
  }
  return container;
}

const container = buildContainer();
const di = createDI(container);

export const useDIStore = create<DIState>()(
  devtools(() => ({ container, di }), { name: "DI" })
);

export function useDI(): DI {
  type S = ReturnType<typeof useDIStore.getState>;
  return useDIStore((s: S) => s.di);
}
