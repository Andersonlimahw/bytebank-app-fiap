import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../../store/authStore";
import { useFadeSlideInOnFocus } from "../../hooks/animations";
import AppConfig from "../../../config/appConfig";
import { useTheme } from "../../theme/theme";
import { makeLoginStyles } from "./LoginScreen.styles";
import { useI18n } from "../../i18n/I18nProvider";
import { BrandLogo } from "../../components/BrandLogo";
import { AuthScreenProps } from "../../navigation/types";
import { CommonActions } from "@react-navigation/native";
import { useEffect } from "react";
import { goToHome } from "@app/presentation/navigation/navigationUtils";

export const LoginScreen: React.FC<AuthScreenProps<'Login'>> = ({ navigation }) => {
  const { signIn, user } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [providerLoading, setProviderLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const { animatedStyle } = useFadeSlideInOnFocus();
  const { t } = useI18n();
  const theme = useTheme();
  const styles = useMemo(() => makeLoginStyles(theme), [theme]);

  return (
    <Animated.View style={[styles.container, animatedStyle as any]}>
      <BrandLogo />
      <Text style={styles.title}>{t("auth.welcome")}</Text>
      <Text style={styles.subtitle}>{t("auth.continue")}</Text>

      <View style={styles.spacerMd} />
      <Button
        title={t("auth.google")}
        loading={providerLoading}
        disabled={providerLoading || emailLoading}
        onPress={async () => {
          setError(null);
          try {
            setProviderLoading(true);
            console.log('Success on Google Sign-In');
            await signIn("google");
            // The RootNavigator will handle the navigation based on auth state
            // No need to navigate manually here
          } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            
            // Handle specific error cases
            let errorMessage = t("auth.googleLoginFailed");
            
            if (error?.code === 'SIGN_IN_CANCELLED') {
              errorMessage = t("auth.loginCancelled");
            } else if (error?.code === 'IN_PROGRESS') {
              // Another sign-in is in progress, handle if needed
              console.log('Sign in already in progress');
              return;
            } else if (error?.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
              errorMessage = t("auth.playServicesMissing");
            } else if (error?.code === 'SIGN_IN_REQUIRED') {
              errorMessage = t("auth.signInRequired");
            } else if (error?.message) {
              // Handle other Firebase/Google Sign-In specific errors
              if (error.message.includes('network error')) {
                errorMessage = t("common.networkError");
              } else if (error.message.includes('invalid token')) {
                errorMessage = t("auth.invalidToken");
              } else if (error.message.includes('Firebase config is missing')) {
                errorMessage = t("auth.firebaseNotConfigured");
              } else if (error.message.includes('Client ID não configurado')) {
                errorMessage = t("auth.notConfiguredFirebase");
              }
            }
            
            setError(errorMessage);
          } finally {
            setProviderLoading(false);
          }
        }}
      />
      <View style={styles.spacerSm} />
      {/* {Platform.OS === "ios" && (
        <Button
        title={t('auth.apple')}
          loading={providerLoading}
          disabled={providerLoading || emailLoading}
          onPress={async () => {
            setError(null);
            try {
              setProviderLoading(true);
              await signIn("apple");
            } catch (e: any) {
              let errorMessage = t('auth.appleLoginFailed');
              if (e?.message?.includes?.('cancel')) {
                errorMessage = t('auth.loginCancelled');
              } else if (e?.message?.toLowerCase?.().includes('network')) {
                errorMessage = t('common.networkError');
              } else if (e?.message?.includes?.('Firebase config is missing')) {
                errorMessage = t('auth.firebaseNotConfigured');
              } else if (e?.message) {
                errorMessage = e.message;
              }
              setError(errorMessage);
            } finally { setProviderLoading(false); }
        }}
      />
      )} */}
      {/* <View style={styles.spacerSm} />
      <Button
        title={t("auth.anonymous")}
        loading={providerLoading}
        disabled={providerLoading || emailLoading}
        onPress={async () => {
          setError(null);
          try {
            setProviderLoading(true);
            await signIn("anonymous");
          } catch (e: any) {
            setError(e?.message ?? t("auth.anonymousLoginFailed"));
          } finally {
            setProviderLoading(false);
          }
        }}
      />

      <View style={styles.spacerLg} />
      <Text style={styles.altTitle}>{t("auth.orUseEmail")}</Text>
      <Input
        placeholder={t("auth.email")}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel={t("auth.email")}
      />
      <Input
        placeholder={t("auth.password")}
        secureTextEntry
        showPasswordToggle
        value={password}
        onChangeText={setPassword}
        accessibilityLabel={t("auth.password")}
        errorText={error}
      />
      <Button
        title={t("auth.signInWithEmail")}
        loading={emailLoading}
        disabled={providerLoading || emailLoading}
        onPress={async () => {
          setError(null);
          const trimmedEmail = email.trim();
          const trimmedPassword = password.trim();
          if (!trimmedEmail || !trimmedPassword) {
            setError(t("auth.fillEmailPassword"));
            return;
          }
          try {
            setEmailLoading(true);
            await signIn("password", {
              email: trimmedEmail,
              password: trimmedPassword,
            }).then(() => {
              console.log("Sign-in successful");
              (navigation as any)?.navigate?.("Home");
            });
          } catch (e: any) {
            setError(e?.message ?? t("auth.googleLoginFailed"));
          } finally {
            setEmailLoading(false);
          }
        }}
      />
      <TouchableOpacity
        onPress={() => (navigation as any)?.navigate?.("Register")}
      >
        <Text style={styles.link}>{t("auth.noAccount")}</Text>
      </TouchableOpacity> */}
      {AppConfig.useMock && (
        <Text style={styles.hint}>{t("auth.mockHint")}</Text>
      )}
    </Animated.View>
  );
};

/** styles moved to LoginScreen.styles.ts */
