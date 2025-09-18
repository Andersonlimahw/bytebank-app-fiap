import { Platform } from "react-native";
import auth from "@react-native-firebase/auth";
import { signInWithGoogleNative, signInWithAppleNative } from "../../infrastructure/auth/nativeAuth";
function mapUser(u) {
    return {
        id: u.uid,
        name: u.displayName || "User",
        email: u.email || undefined,
        photoUrl: u.photoURL || undefined,
    };
}
export class FirebaseAuthRepository {
    async getCurrentUser() {
        const currentUser = auth().currentUser;
        return currentUser ? mapUser(currentUser) : null;
    }
    onAuthStateChanged(cb) {
        return auth().onAuthStateChanged((u) => cb(u ? mapUser(u) : null));
    }
    async signIn(provider, options) {
        if (provider === "password") {
            if (!options?.email || !options?.password) {
                throw new Error("Email and password are required");
            }
            const res = await auth().signInWithEmailAndPassword(options.email, options.password);
            return mapUser(res.user);
        }
        if (provider === "anonymous") {
            const res = await auth().signInAnonymously();
            if (!res.user)
                throw new Error("Anonymous sign-in failed");
            return mapUser(res.user);
        }
        // Native apps: handle Google/Apple using Expo Auth Session
        if (Platform.OS !== "web") {
            if (provider === "google") {
                const credential = await signInWithGoogleNative();
                const res = await auth().signInWithCredential(credential);
                return mapUser(res.user);
            }
            if (provider === "apple") {
                const credential = await signInWithAppleNative();
                const res = await auth().signInWithCredential(credential);
                return mapUser(res.user);
            }
        }
        throw new Error(`Provider ${provider} not supported on ${Platform.OS}`);
    }
    async signOut() {
        await auth().signOut();
    }
    async signUp(options) {
        const res = await auth().createUserWithEmailAndPassword(options.email, options.password);
        return mapUser(res.user);
    }
}
