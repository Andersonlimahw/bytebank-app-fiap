import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Platform, Animated } from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../../store/authStore";
import { useFadeSlideInOnFocus } from "../../hooks/animations";
import { AppConfig } from "../../../config/appConfig";
import { theme } from "../../theme/theme";
import { loginStyles as styles } from "./LoginScreen.styles";
import { useI18n } from "../../i18n/I18nProvider";

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [providerLoading, setProviderLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const { animatedStyle } = useFadeSlideInOnFocus();
  const { t } = useI18n();

  return (
    <Animated.View style={[styles.container, animatedStyle as any]}>
      <Image
        source={require("../../../../contents/figma/login/Ilustração-1.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>{t('auth.welcome')}</Text>
      <Text style={styles.subtitle}>{t('auth.continue')}</Text>

      <View style={styles.spacerMd} />
      <Button
        title={t('auth.google')}
        loading={providerLoading}
        disabled={providerLoading || emailLoading}
        onPress={async () => {
          setError(null);
          try {
            setProviderLoading(true);
            await signIn("google");
          } catch (e: any) {
            // Provide more specific error messages for Google authentication
            let errorMessage = "Falha no login Google";
            if (e?.message?.includes("Client ID não configurado")) {
              errorMessage = "Google authentication não está configurado. Verifique as configurações.";
            } else if (e?.message?.includes("cancelado")) {
              errorMessage = "Login cancelado pelo usuário.";
            } else if (e?.message?.toLowerCase?.().includes("network") || e?.message?.includes("Failed to fetch")) {
              errorMessage = "Sem conexão. Verifique sua internet e tente novamente.";
            } else if (e?.message?.includes("hasPlayServices")) {
              errorMessage = "Google Play Services não disponível. Tente outro método de login.";
            } else if (e?.message?.includes("Token inválido")) {
              errorMessage = "Erro de autenticação. Tente novamente.";
            } else if (e?.message?.includes?.('Firebase config is missing')) {
              errorMessage = "Firebase não configurado. Defina EXPO_PUBLIC_FIREBASE_* e reinicie o app.";
            } else if (e?.message) {
              errorMessage = e.message;
            }
            setError(errorMessage);
          }
          finally { setProviderLoading(false); }
        }}
      />
      <View style={styles.spacerSm} />
      {Platform.OS === "ios" && (
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
              setError(e?.message ?? "Falha no login Apple");
            } finally { setProviderLoading(false); }
          }}
        />
      )}
      <View style={styles.spacerSm} />
      <Button
        title={t('auth.anonymous')}
        loading={providerLoading}
        disabled={providerLoading || emailLoading}
        onPress={async () => {
          setError(null);
          try {
            setProviderLoading(true);
            await signIn("anonymous");
          } catch (e: any) {
            setError(e?.message ?? "Falha no login anônimo");
          } finally { setProviderLoading(false); }
        }}
      />

      <View style={styles.spacerLg} />
      <Text style={styles.altTitle}>Or use email</Text>
      <Input
        placeholder={t('auth.email')}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email"
      />
      <Input
        placeholder={t('auth.password')}
        secureTextEntry
        showPasswordToggle
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
        errorText={error}
      />
      <Button
        title={t('auth.signInWithEmail')}
        loading={emailLoading}
        disabled={providerLoading || emailLoading}
        onPress={async () => {
          setError(null);
          const trimmedEmail = email.trim();
          const trimmedPassword = password.trim();
          if (!trimmedEmail || !trimmedPassword) {
            setError("Informe email e senha");
            return;
          }
          try {
            setEmailLoading(true);
            await signIn("password", {
              email: trimmedEmail,
              password: trimmedPassword,
            });
          } catch (e: any) {
            setError(e?.message ?? "Sign-in failed");
          } finally {
            setEmailLoading(false);
          }
        }}
      />
      <TouchableOpacity
        onPress={() => (navigation as any)?.navigate?.("Register")}
      >
        <Text style={styles.link}>{t('auth.noAccount')}</Text>
      </TouchableOpacity>
      {AppConfig.useMock && (
        <Text style={styles.hint}>{t('auth.mockHint')}</Text>
      )}
    </Animated.View>
  );
};

/** styles moved to LoginScreen.styles.ts */
