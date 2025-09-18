import firestore from "@react-native-firebase/firestore";
export class FirebaseTransactionRepository {
    async listRecent(userId, limit = 10) {
        const snapshot = await firestore()
            .collection("transactions")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .limit(limit)
            .get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toMillis() ?? Date.now();
            return { id: doc.id, ...data, createdAt };
        });
    }
    async add(tx) {
        const doc = await firestore()
            .collection("transactions")
            .add({
            ...tx,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        return doc.id;
    }
    async getBalance(userId) {
        // For demo simplicity, compute from last 100 txs
        const txs = await this.listRecent(userId, 100);
        return txs.reduce((acc, t) => acc + (t.type === "credit" ? t.amount : -t.amount), 0);
    }
    async update(id, updates) {
        await firestore().collection("transactions").doc(id).update(updates);
    }
    async remove(id) {
        await firestore().collection("transactions").doc(id).delete();
    }
    subscribeRecent(userId, limit = 10, cb) {
        return firestore()
            .collection("transactions")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .limit(limit)
            .onSnapshot((snapshot) => {
            const list = snapshot.docs.map((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toMillis() ?? Date.now();
                return { id: doc.id, ...data, createdAt };
            });
            cb(list);
        });
    }
}
