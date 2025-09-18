import firestore from '@react-native-firebase/firestore';
export class FirebaseInvestmentRepository {
    async listByUser(userId) {
        const snapshot = await firestore()
            .collection('investments')
            .where('userId', '==', userId)
            .get();
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
}
