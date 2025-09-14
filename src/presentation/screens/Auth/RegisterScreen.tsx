import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../../store/authStore';
import { useFadeSlideInOnFocus } from '../../hooks/animations';
import { theme } from '../../theme/theme';

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const { signUp } = useAuth();
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

      <Input
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email"
      />
      <Input
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Senha"
      />
      <Input
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        accessibilityLabel="Confirmar senha"
        errorText={error}
      />

      <Button title={loading ? 'Criando...' : 'Criar conta'} onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation?.goBack?.()}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.xl, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  illustration: { width: 160, height: 160, resizeMode: 'contain', marginBottom: theme.spacing.md },
  title: { fontSize: theme.text.h1, fontWeight: '700', color: theme.colors.text },
  subtitle: { color: theme.colors.muted, marginTop: 4, marginBottom: theme.spacing.md },
  link: { marginTop: theme.spacing.md, color: theme.colors.primary },
});
