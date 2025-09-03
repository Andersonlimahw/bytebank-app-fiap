import React, { createContext, useContext, useMemo } from 'react';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export type Token<T> = symbol & { __type?: T };

export class Container {
  private registry = new Map<symbol, unknown>();

  set<T>(token: Token<T>, value: T) {
    this.registry.set(token, value as unknown);
  }

  get<T>(token: Token<T>): T {
    if (!this.registry.has(token)) {
      throw new Error(`DI: token not registered: ${String(token)}`);
    }
    return this.registry.get(token) as T;
  }
}

const ContainerContext = createContext<Container | null>(null);

export function useContainer(): Container {
  const c = useContext(ContainerContext);
  if (!c) throw new Error('DI: Container not available');
  return c;
}

export function ContainerProvider({ container, children }: { container: Container; children: React.ReactNode }) {
  const memo = useMemo(() => container, [container]);
  return <ContainerContext.Provider value={memo}>{children}</ContainerContext.Provider>;
}

// Simple DI facade used by viewmodels
export type DI = { resolve<T>(token: Token<T>): T };

export const TOKENS = {
  AuthRepository: Symbol('AuthRepository') as Token<AuthRepository>,
  TransactionRepository: Symbol('TransactionRepository') as Token<TransactionRepository>,
};

export function createDI(container: Container): DI {
  return {
    resolve<T>(token: Token<T>): T {
      return container.get(token);
    },
  };
}
