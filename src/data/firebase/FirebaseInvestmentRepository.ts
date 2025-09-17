import type { Investment } from '../../domain/entities/Investment';
import type { InvestmentRepository } from '../../domain/repositories/InvestmentRepository';
import firestore from '@react-native-firebase/firestore';

export class FirebaseInvestmentRepository implements InvestmentRepository {
  async listByUser(userId: string): Promise<Investment[]> {
    const snapshot = await firestore()
      .collection('investments')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Investment));
  }
}

