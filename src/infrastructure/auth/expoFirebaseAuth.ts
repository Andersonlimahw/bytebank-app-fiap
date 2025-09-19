import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { initFirebase, getFirebaseAuth } from '../firebase/expoFirebaseApp';

WebBrowser.maybeCompleteAuthSession();

type GoogleClientConfig = {
  expoClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
};

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

function getGoogleClientConfig(): GoogleClientConfig {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
  return {
    expoClientId: extra.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: extra.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: extra.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: extra.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  };
}

function pickGoogleClientId(config: GoogleClientConfig): string | undefined {
  if (Platform.OS === 'ios') {
    return config.iosClientId ?? config.expoClientId;
  }
  if (Platform.OS === 'android') {
    return config.androidClientId ?? config.expoClientId;
  }
  // Web
  return config.webClientId ?? config.expoClientId;
}

export function observeAuthState(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export function currentUser(): User | null {
  return getFirebaseAuth().currentUser;
}

export async function signInWithGoogle(): Promise<User> {
  const config = getGoogleClientConfig();
  const clientId = pickGoogleClientId(config);
  if (!clientId) {
    throw new Error('Missing Google client id. Configure EXPO_PUBLIC_GOOGLE_* env vars.');
  }

  initFirebase();

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'bytebank' });
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ['openid', 'profile', 'email'],
  });

  await request.makeAuthUrlAsync(discovery);
  const result = await request.promptAsync(discovery);

  if (result.type !== 'success') {
    const reason = result.type === 'error' ? result.error?.message : 'Login cancelado pelo usuário';
    throw new Error(reason ?? 'Falha na autenticação com o Google');
  }

  const idToken = (result.params as Record<string, string | undefined>).id_token;
  if (!idToken) {
    throw new Error('Google did not return an id_token.');
  }

  const auth = getFirebaseAuth();
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

export function getAuthInstance(): Auth {
  return getFirebaseAuth();
}
