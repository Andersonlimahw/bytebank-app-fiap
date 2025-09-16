import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import type { Transaction } from '../../domain/entities/Transaction';
import { FirebaseAPI } from '../../infrastructure/firebase/firebase';
import { collection, query, where, orderBy, limit as qlimit, addDoc, getDocs, serverTimestamp, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

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
    return snap.docs.map((d) => {
      const data = d.data() as any;
      const createdAt = data.createdAt?.toMillis ? data.createdAt.toMillis() : Number(data.createdAt) || Date.now();
      return { id: d.id, ...data, createdAt } as Transaction;
    });
  }

  async add(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const db = FirebaseAPI.db;
    const res = await addDoc(
      collection(db, 'transactions'),
      {
        ...tx,
        createdAt: serverTimestamp(),
      }
    );
    return res.id;
  }

  async getBalance(userId: string): Promise<number> {
    // For demo simplicity, compute from last 100 txs
    const txs = await this.listRecent(userId, 100);
    return txs.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0);
  }

  async update(id: string, updates: Partial<Pick<Transaction, 'description' | 'amount' | 'type' | 'category'>>): Promise<void> {
    const db = FirebaseAPI.db;
    const ref = doc(db, 'transactions', id);
    await updateDoc(ref, { ...updates });
  }

  async remove(id: string): Promise<void> {
    const db = FirebaseAPI.db;
    const ref = doc(db, 'transactions', id);
    await deleteDoc(ref);
  }

  subscribeRecent(userId: string, limit = 10, cb: (txs: Transaction[]) => void): () => void {
    const db = FirebaseAPI.db;
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      qlimit(limit)
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data() as any;
        const createdAt = data.createdAt?.toMillis ? data.createdAt.toMillis() : Number(data.createdAt) || Date.now();
        return { id: d.id, ...data, createdAt } as Transaction;
      });
      cb(list);
    });
    return unsub;
  }
}
