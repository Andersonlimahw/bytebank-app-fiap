import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

WebBrowser.maybeCompleteAuthSession();

function getGoogleClientId(): string {
  const env = (process.env as any) || {};
  if (Platform.OS === "ios") {
    return (
      env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
      env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ||
      ""
    );
  }
  if (Platform.OS === "android") {
    return (
      env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
      env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ||
      ""
    );
  }
  return (
    env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ||
    ""
  );
}

export async function signInWithGoogleNative(): Promise<FirebaseAuthTypes.AuthCredential> {
  const clientId = getGoogleClientId();
  if (!clientId)
    throw new Error(
      "Google Client ID não configurado (EXPO_PUBLIC_GOOGLE_* envs)"
    );

  const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "bytebank",
  });

  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ["openid", "profile", "email"],
    extraParams: { nonce: Math.random().toString(36).slice(2) },
  });

  const response = await request.promptAsync(discovery);
  if (response.type !== "success") throw new Error("Google sign-in failed");

  const { id_token: idToken } = response.params;
  return auth.GoogleAuthProvider.credential(idToken);
}

export async function signInWithAppleNative(): Promise<FirebaseAuthTypes.AuthCredential> {
  const nonce = Math.random().toString(36).slice(2);
  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce,
  });

  return auth.AppleAuthProvider.credential(
    appleCredential.identityToken as string,
    nonce
  );
}
