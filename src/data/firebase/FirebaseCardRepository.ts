import type { CardRepository } from "../../domain/repositories/CardRepository";
import type { DigitalCard } from "../../domain/entities/Card";
import firestore from "@react-native-firebase/firestore";

export class FirebaseCardRepository implements CardRepository {
  async listByUser(userId: string): Promise<DigitalCard[]> {
    const snapshot = await firestore()
      .collection("cards")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toMillis() ?? Date.now();
      const updatedAt = data.updatedAt?.toMillis();
      return { id: doc.id, ...data, createdAt, updatedAt } as DigitalCard;
    });
  }

  async add(
    card: Omit<DigitalCard, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const doc = await firestore()
      .collection("cards")
      .add({
        ...card,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    return doc.id;
  }

  async update(
    id: string,
    updates: Partial<Omit<DigitalCard, "id" | "userId" | "createdAt">>
  ): Promise<void> {
    await firestore()
      .collection("cards")
      .doc(id)
      .update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async remove(id: string): Promise<void> {
    await firestore().collection("cards").doc(id).delete();
  }

  subscribe(userId: string, cb: (cards: DigitalCard[]) => void): () => void {
    return firestore()
      .collection("cards")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const cards = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toMillis() ?? Date.now();
          const updatedAt = data.updatedAt?.toMillis();
          return { id: doc.id, ...data, createdAt, updatedAt } as DigitalCard;
        });
        cb(cards);
      });
  }
}
