import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import type { Transaction } from '../../domain/entities/Transaction';

function seed(userId: string): Transaction[] {
  const now = new Date();
  return [
    { id: 't1', userId, description: 'Salary', type: 'credit', amount: 500000, createdAt: new Date(now.getFullYear(), now.getMonth(), 1).getTime() },
    { id: 't2', userId, description: 'Groceries', type: 'debit', amount: 8500, createdAt: new Date(now.getFullYear(), now.getMonth(), 3).getTime() },
    { id: 't3', userId, description: 'Coffee', type: 'debit', amount: 450, createdAt: new Date(now.getFullYear(), now.getMonth(), 4).getTime() },
    { id: 't4', userId, description: 'Transfer In', type: 'credit', amount: 12000, createdAt: new Date(now.getFullYear(), now.getMonth(), 6).getTime() },
  ];
}

export class MockTransactionRepository implements TransactionRepository {
  private byUser = new Map<string, Transaction[]>();

  private ensure(userId: string) {
    if (!this.byUser.has(userId)) this.byUser.set(userId, seed(userId));
    return this.byUser.get(userId)!;
  }

  async listRecent(userId: string, limit = 10): Promise<Transaction[]> {
    const txs = [...this.ensure(userId)].sort((a, b) => b.createdAt - a.createdAt);
    return txs.slice(0, limit);
  }

  async add(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const id = 'tx-' + Math.random().toString(36).slice(2);
    const full: Transaction = { ...tx, id, createdAt: Date.now() } as Transaction;
    const arr = this.ensure(tx.userId);
    arr.unshift(full);
    this.byUser.set(tx.userId, arr);
    return id;
  }

  async getBalance(userId: string): Promise<number> {
    const tx = this.ensure(userId);
    return tx.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0);
  }

  async update(id: string, updates: Partial<Pick<Transaction, 'description' | 'amount' | 'type' | 'category'>>): Promise<void> {
    for (const [userId, list] of this.byUser.entries()) {
      const idx = list.findIndex((t) => t.id === id);
      if (idx >= 0) {
        const current = list[idx];
        const updated = { ...current, ...updates } as Transaction;
        list[idx] = updated;
        this.byUser.set(userId, list);
        return;
      }
    }
  }

  async remove(id: string): Promise<void> {
    for (const [userId, list] of this.byUser.entries()) {
      const next = list.filter((t) => t.id !== id);
      if (next.length !== list.length) {
        this.byUser.set(userId, next);
        return;
      }
    }
  }
}
