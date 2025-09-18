import firestore from "@react-native-firebase/firestore";
export class FirebaseCardRepository {
    async listByUser(userId) {
        const snapshot = await firestore()
            .collection("cards")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toMillis() ?? Date.now();
            const updatedAt = data.updatedAt?.toMillis();
            return { id: doc.id, ...data, createdAt, updatedAt };
        });
    }
    async add(card) {
        const doc = await firestore()
            .collection("cards")
            .add({
            ...card,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        return doc.id;
    }
    async update(id, updates) {
        await firestore()
            .collection("cards")
            .doc(id)
            .update({
            ...updates,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    }
    async remove(id) {
        await firestore().collection("cards").doc(id).delete();
    }
    subscribe(userId, cb) {
        return firestore()
            .collection("cards")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
            const cards = snapshot.docs.map((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toMillis() ?? Date.now();
                const updatedAt = data.updatedAt?.toMillis();
                return { id: doc.id, ...data, createdAt, updatedAt };
            });
            cb(cards);
        });
    }
}
