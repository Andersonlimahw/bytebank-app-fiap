import type { Investment } from '../../domain/entities/Investment';
import type { InvestmentRepository } from '../../domain/repositories/InvestmentRepository';
import { FirebaseAPI } from '../../infrastructure/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export class FirebaseInvestmentRepository implements InvestmentRepository {
  async listByUser(userId: string): Promise<Investment[]> {
    const db = FirebaseAPI.db;
    const q = query(collection(db, 'investments'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Investment));
  }
}

