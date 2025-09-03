import type { Transaction } from '../entities/Transaction';

export interface TransactionRepository {
  listRecent(userId: string, limit?: number): Promise<Transaction[]>;
  add(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<string>; // returns id
  getBalance(userId: string): Promise<number>; // cents
}

