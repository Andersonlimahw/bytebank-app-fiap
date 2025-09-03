import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import type { Transaction } from '../../domain/entities/Transaction';
import { FirebaseAPI } from '../../infrastructure/firebase/firebase';
import { collection, query, where, orderBy, limit as qlimit, addDoc, getDocs, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export class FirebaseTransactionRepository implements TransactionRepository {
  async listRecent(userId: string, limit = 10): Promise<Transaction[]> {
    const db = FirebaseAPI.db;
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      qlimit(limit)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  }

  async add(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const db = FirebaseAPI.db;
    const res = await addDoc(collection(db, 'transactions'), {
      ...tx,
      createdAt: Date.now()
    });
    return res.id;
  }

  async getBalance(userId: string): Promise<number> {
    // For demo simplicity, compute from last 100 txs
    const txs = await this.listRecent(userId, 100);
    return txs.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0);
  }
}

