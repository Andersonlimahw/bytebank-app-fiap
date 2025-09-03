import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { Button } from '../../components/Button';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

export const LoginScreen: React.FC = () => {
  const { signIn } = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Image source={require('../../../../contents/figma/bytebank-figma/Logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to ByteBank</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={{ height: 12 }} />
      <Button title="Continue with Google" onPress={() => signIn('google')} />
      <View style={{ height: 10 }} />
      <Button title="Continue with Apple" onPress={() => signIn('apple')} />
      <View style={{ height: 10 }} />
      <Button title="Continue Anonymously" onPress={() => signIn('anonymous')} />

      <View style={{ height: 16 }} />
      <Text style={styles.altTitle}>Or use email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Sign in with Email"
        onPress={async () => {
          setError(null);
          try {
            await signIn('password', { email, password });
          } catch (e: any) {
            setError(e?.message ?? 'Sign-in failed');
          }
        }}
      />

      <Text style={styles.hint}>Mock mode is enabled by default. Configure Firebase to use real providers.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 96, height: 96, resizeMode: 'contain', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#6b7280', marginTop: 4, marginBottom: 16 },
  altTitle: { alignSelf: 'flex-start', marginBottom: 8, color: '#6b7280' },
  input: { width: '100%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  error: { color: '#dc2626', alignSelf: 'flex-start', marginBottom: 8 },
  hint: { marginTop: 16, color: '#6b7280', textAlign: 'center' }
});
