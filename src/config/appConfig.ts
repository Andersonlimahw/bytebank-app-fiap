export type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

const getEnv = (key: string, fallback?: string) =>
  (process.env as any)[`EXPO_PUBLIC_${key}`] ?? fallback;

export const AppConfig = {
  useMock: (getEnv('USE_MOCK', 'true') || 'true').toString() === 'true',
  firebase: {
    apiKey: getEnv('FIREBASE_API_KEY', ''),
    authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('FIREBASE_PROJECT_ID', ''),
    appId: getEnv('FIREBASE_APP_ID', ''),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID')
  } as FirebaseConfig
};

