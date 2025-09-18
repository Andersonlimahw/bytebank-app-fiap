import { Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleAuth from "@invertase/react-native-apple-authentication";
import Config from "react-native-config";

function configureGoogle() {
  // Configure once; repeated calls are safe
  // Be tolerant when react-native-config isn't linked during dev
  const cfg: any = Config as any;
  const webClientId = cfg?.GOOGLE_WEB_CLIENT_ID;
  const iosClientId = cfg?.GOOGLE_IOS_CLIENT_ID;
  const androidClientId = cfg?.GOOGLE_ANDROID_CLIENT_ID;
  GoogleSignin.configure({
    webClientId: webClientId || undefined,
    iosClientId: iosClientId || undefined,
    offlineAccess: true,
    profileImageSize: 120,
    forceCodeForRefreshToken: false,
  });
}

export async function signInWithGoogleNative(): Promise<FirebaseAuthTypes.AuthCredential> {
  configureGoogle();
  await GoogleSignin.hasPlayServices?.({ showPlayServicesUpdateDialog: true });
  const userInfo = await GoogleSignin.signIn();
  const idToken = userInfo.idToken;
  if (!idToken) throw new Error("Google sign-in failed: missing idToken");
  return auth.GoogleAuthProvider.credential(idToken);
}

export async function signInWithAppleNative(): Promise<FirebaseAuthTypes.AuthCredential> {
  if (Platform.OS !== "ios") throw new Error("Apple Sign-In is iOS only");
  const nonce = Math.random().toString(36).slice(2);
  const response = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    nonce,
  });
  const identityToken = response.identityToken;
  if (!identityToken) throw new Error("Apple Sign-In failed: missing identityToken");
  return auth.AppleAuthProvider.credential(identityToken, nonce);
}
