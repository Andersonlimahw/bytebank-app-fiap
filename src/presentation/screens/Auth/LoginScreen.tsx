import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "@app/store/authStore";
import { useFadeSlideInOnFocus } from "../../hooks/animations";
import { theme } from "../../theme/theme";

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { animatedStyle } = useFadeSlideInOnFocus();

  return (
    <Animated.View style={[styles.container, animatedStyle as any]}>
      <Image
        source={require("../../../../contents/figma/login/Ilustração-1.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to ByteBank</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={{ height: theme.spacing.md }} />
      <Button
        title="Continue with Google"
        onPress={async () => {
          setError(null);
          try {
            await signIn("google");
          } catch (e: any) {
            setError(e?.message ?? "Falha no login Google");
          }
        }}
      />
      <View style={{ height: theme.spacing.sm }} />
      {Platform.OS === "ios" && (
        <Button
          title="Continue with Apple"
          onPress={async () => {
            setError(null);
            try {
              await signIn("apple");
            } catch (e: any) {
              setError(e?.message ?? "Falha no login Apple");
            }
          }}
        />
      )}
      <View style={{ height: theme.spacing.sm }} />
      <Button
        title="Continue Anonymously"
        onPress={async () => {
          setError(null);
          try {
            await signIn("anonymous");
          } catch (e: any) {
            setError(e?.message ?? "Falha no login anônimo");
          }
        }}
      />

      <View style={{ height: theme.spacing.lg }} />
      <Text style={styles.altTitle}>Or use email</Text>
      <Input
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email"
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
        errorText={error}
      />
      <Button
        title="Sign in with Email"
        onPress={async () => {
          setError(null);
          const trimmedEmail = email.trim();
          const trimmedPassword = password.trim();
          if (!trimmedEmail || !trimmedPassword) {
            setError("Informe email e senha");
            return;
          }
          try {
            await signIn("password", {
              email: trimmedEmail,
              password: trimmedPassword,
            });
          } catch (e: any) {
            setError(e?.message ?? "Sign-in failed");
          }
        }}
      />
      <TouchableOpacity
        onPress={() => (navigation as any)?.navigate?.("Register")}
      >
        <Text style={styles.link}>No account? Create one</Text>
      </TouchableOpacity>
      {process.env.USE_MOCK === "true" && (
        <Text style={styles.hint}>
          Mock mode is enabled by default. Configure Firebase to use real
          providers.
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: "contain",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.text.h1,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: 4,
    marginBottom: theme.spacing.md,
  },
  altTitle: {
    alignSelf: "flex-start",
    marginBottom: theme.spacing.sm,
    color: theme.colors.muted,
  },
  hint: {
    marginTop: theme.spacing.md,
    color: theme.colors.muted,
    textAlign: "center",
  },
  link: { marginTop: theme.spacing.sm, color: theme.colors.primary },
});
