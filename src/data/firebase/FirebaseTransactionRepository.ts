import type { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import type { Transaction } from "../../domain/entities/Transaction";
import firestore from "@react-native-firebase/firestore";

export class FirebaseTransactionRepository implements TransactionRepository {
  async listRecent(userId: string, limit = 10): Promise<Transaction[]> {
    const snapshot = await firestore()
      .collection("transactions")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toMillis() ?? Date.now();
      return { id: doc.id, ...data, createdAt } as Transaction;
    });
  }

  async add(tx: Omit<Transaction, "id" | "createdAt">): Promise<string> {
    const doc = await firestore()
      .collection("transactions")
      .add({
        ...tx,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    return doc.id;
  }

  async getBalance(userId: string): Promise<number> {
    // For demo simplicity, compute from last 100 txs
    const txs = await this.listRecent(userId, 100);
    return txs.reduce(
      (acc, t) => acc + (t.type === "credit" ? t.amount : -t.amount),
      0
    );
  }

  async update(
    id: string,
    updates: Partial<
      Pick<Transaction, "description" | "amount" | "type" | "category">
    >
  ): Promise<void> {
    await firestore().collection("transactions").doc(id).update(updates);
  }

  async remove(id: string): Promise<void> {
    await firestore().collection("transactions").doc(id).delete();
  }

  subscribeRecent(
    userId: string,
    limit = 10,
    cb: (txs: Transaction[]) => void
  ): () => void {
    return firestore()
      .collection("transactions")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toMillis() ?? Date.now();
          return { id: doc.id, ...data, createdAt } as Transaction;
        });
        cb(list);
      });
  }
}
