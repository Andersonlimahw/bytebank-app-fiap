import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { FirebaseAPI } from '../firebase/firebase';

WebBrowser.maybeCompleteAuthSession();

function getGoogleClientId(): string {
  const env = (process.env as any) || {};
  if (Platform.OS === 'ios') {
    return env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || '';
  }
  if (Platform.OS === 'android') {
    return env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || '';
  }
  return env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || '';
}

// Enhanced Google Sign-In with multiple approaches for better compatibility
export async function signInWithGoogleNative(): Promise<User> {
  // Use Expo AuthSession for Google Sign-In (works in managed/bare)
  return await signInWithGoogleAuthSession();
}

// Fallback Google Sign-In using Expo AuthSession
async function signInWithGoogleAuthSession(): Promise<User> {
  const clientId = getGoogleClientId();
  if (!clientId) throw new Error('Google Client ID não configurado (EXPO_PUBLIC_GOOGLE_* envs)');

  const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  const redirectUri = AuthSession.makeRedirectUri();
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ['openid', 'profile', 'email'],
    extraParams: { nonce: Math.random().toString(36).slice(2) },
  });

  await request.makeAuthUrlAsync(discovery);
  const result = await request.promptAsync(discovery);
  if (result.type !== 'success') {
    throw new Error('Login Google cancelado');
  }

  const idToken = (result.params as any).id_token as string | undefined;
  if (!idToken) throw new Error('Token inválido do Google');

  FirebaseAPI.ensureFirebase();
  const credential = GoogleAuthProvider.credential(idToken);
  const auth = getAuth();
  const res = await signInWithCredential(auth, credential);
  return res.user;
}

export async function signInWithAppleNative(): Promise<User> {
  if (Platform.OS !== 'ios') throw new Error('Apple Sign-In disponível apenas no iOS');

  const appleCred = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const idToken = appleCred?.identityToken;
  if (!idToken) throw new Error('Apple não retornou identityToken');

  FirebaseAPI.ensureFirebase();
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken });
  const auth = getAuth();
  const res = await signInWithCredential(auth, credential);
  return res.user;
}
