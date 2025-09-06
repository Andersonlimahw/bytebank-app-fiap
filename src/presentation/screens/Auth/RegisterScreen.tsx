import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Button } from '../../components/Button';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { useFadeSlideInOnFocus } from '../../hooks/animations';

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const { signUp } = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { animatedStyle } = useFadeSlideInOnFocus();

  const handleRegister = async () => {
    setError(null);
    if (!email || !password) {
      setError('Preencha email e senha');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    setLoading(true);
    try {
      await signUp({ email, password });
      // After sign up, user is considered authenticated by repo; stack will switch automatically.
    } catch (e: any) {
      setError(e?.message ?? 'Falha ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle as any]}>
      <Image source={require('../../../../contents/figma/login/Ilustração cadastro-1.png')} style={styles.illustration} />
      <Text style={styles.title}>Crie sua conta</Text>
      <Text style={styles.subtitle}>É rápido e seguro</Text>

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
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button title={loading ? 'Criando...' : 'Criar conta'} onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation?.goBack?.()}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  illustration: { width: 160, height: 160, resizeMode: 'contain', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#6b7280', marginTop: 4, marginBottom: 16 },
  input: { width: '100%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  error: { color: '#dc2626', alignSelf: 'flex-start', marginBottom: 8 },
  link: { marginTop: 16, color: '#2563eb' },
});
