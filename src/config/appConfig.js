import Config from "react-native-config";
const getEnv = (key, fallback) => {
    // Prefer runtime env from react-native-config; fallback to process.env if available
    const fromConfig = Config?.[key];
    const fromConfigExpo = Config?.[`EXPO_PUBLIC_${key}`];
    const env = typeof process !== "undefined" ? process.env : undefined;
    const fromNode = env?.[key];
    const fromNodeExpo = env?.[`EXPO_PUBLIC_${key}`];
    return fromConfig ?? fromConfigExpo ?? fromNode ?? fromNodeExpo ?? fallback;
};
// Auto-detect mock vs real mode:
// - If EXPO_PUBLIC_USE_MOCK is set, respect it.
// - Otherwise, enable real mode when required Firebase envs are present; fallback to mock.
function detectUseMock() {
    const raw = getEnv("USE_MOCK");
    if (raw !== undefined) {
        return raw.toString() === "true";
    }
    const hasFirebaseBasics = !!(getEnv("FIREBASE_API_KEY") &&
        getEnv("FIREBASE_PROJECT_ID") &&
        getEnv("FIREBASE_APP_ID"));
    return !hasFirebaseBasics;
}
export const AppConfig = {
    useMock: detectUseMock(),
    appearance: {
        brand: getEnv("BRAND", "bytebank"),
        mode: getEnv("THEME_MODE", "light") === "dark" ? "dark" : "light",
    },
    firebase: {
        apiKey: getEnv("FIREBASE_API_KEY", "AIzaSyDz5LzOWv0F4VD23s9J5z_UUxWqMwkUrf8"),
        authDomain: getEnv("FIREBASE_AUTH_DOMAIN", "projeto-bytebank.firebaseapp.com"),
        projectId: getEnv("FIREBASE_PROJECT_ID", "projeto-bytebank"),
        appId: getEnv("FIREBASE_APP_ID", "1:102802199932:web:28f905156987a9166880f9"),
        storageBucket: getEnv("FIREBASE_STORAGE_BUCKET", "projeto-bytebank.firebasestorage.app"),
        messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID", "102802199932"),
    },
};
