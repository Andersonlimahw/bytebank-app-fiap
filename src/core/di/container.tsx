import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import type { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import type { InvestmentRepository } from "../../domain/repositories/InvestmentRepository";
import type { PixRepository } from "../../domain/repositories/PixRepository";
import type { CardRepository } from "../../domain/repositories/CardRepository";

export type Token<T> = symbol & { __type?: T };

export class Container {
  private registry = new Map<symbol, unknown>();

  set<T>(token: Token<T>, value: T) {
    this.registry.set(token, value as unknown);
  }

  get<T>(token: Token<T>): T {
    if (!this.registry.has(token)) {
      console.warn(`DI: token not registered: ${String(token)}`);
      // throw new Error(`DI: token not registered: ${String(token)}`);
    }
    return this.registry.get(token) as T;
  }
}

// Simple DI facade used by viewmodels
export type DI = { resolve<T>(token: Token<T>): T };

export const TOKENS = {
  AuthRepository: Symbol("AuthRepository") as Token<AuthRepository>,
  TransactionRepository: Symbol(
    "TransactionRepository"
  ) as Token<TransactionRepository>,
  InvestmentRepository: Symbol(
    "InvestmentRepository"
  ) as Token<InvestmentRepository>,
  PixRepository: Symbol("PixRepository") as Token<PixRepository>,
  CardRepository: Symbol("CardRepository") as Token<CardRepository>,
};

export function createDI(container: Container): DI {
  return {
    resolve<T>(token: Token<T>): T {
      return container.get(token);
    },
  };
}
