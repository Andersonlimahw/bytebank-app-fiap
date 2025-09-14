import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { theme } from '../../theme/theme';
import type { TransactionType } from '../../../domain/entities/Transaction';
import type { TransactionRepository } from '../../../domain/repositories/TransactionRepository';
import { TOKENS } from '../../../core/di/container';
import { useDI } from '../../../store/diStore';
import { useAuth } from '../../../store/authStore';

export const AddTransactionScreen: React.FC<any> = ({ navigation }) => {
  const di = useDI();
  const repo = useMemo(() => di.resolve<TransactionRepository>(TOKENS.TransactionRepository), [di]);
  const { user } = useAuth();

  const [desc, setDesc] = useState('');
  const [amountText, setAmountText] = useState('');
  const [type, setType] = useState<TransactionType>('debit');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    if (!user) return;
    const normalized = amountText.replace(/\./g, '').replace(',', '.');
    const num = Number(normalized);
    if (!desc.trim() || isNaN(num)) {
      setError('Preencha descrição e um valor válido');
      return;
    }
    const cents = Math.round(num * 100);
    setLoading(true);
    try {
      await repo.add({
        userId: user.id,
        description: desc.trim(),
        type,
        amount: cents,
        category: category.trim() || undefined,
      } as any);
      navigation?.goBack?.();
    } catch (e: any) {
      Alert.alert('Erro', e?.message ?? 'Falha ao salvar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar transação</Text>
      <Input label="Descrição" value={desc} onChangeText={setDesc} placeholder="Ex.: Mercado, Transferência" />
      <Input label="Categoria (opcional)" value={category} onChangeText={setCategory} placeholder="Ex.: Alimentação" />
      <Input label="Valor (R$)" value={amountText} onChangeText={setAmountText} placeholder="0,00" keyboardType="decimal-pad" errorText={error} />

      <View style={styles.typeRow}>
        <TouchableOpacity
          onPress={() => setType('credit')}
          style={[styles.typeBtn, type === 'credit' ? styles.typeBtnActive : undefined]}
          accessibilityRole="button"
          accessibilityLabel="Selecionar crédito"
        >
          <Text style={[styles.typeText, type === 'credit' ? styles.typeTextActive : undefined]}>Crédito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType('debit')}
          style={[styles.typeBtn, { marginLeft: theme.spacing.sm }, type === 'debit' ? styles.typeBtnActive : undefined]}
          accessibilityRole="button"
          accessibilityLabel="Selecionar débito"
        >
          <Text style={[styles.typeText, type === 'debit' ? styles.typeTextActive : undefined]}>Débito</Text>
        </TouchableOpacity>
      </View>

      <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={save} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  title: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.sm },
  typeRow: { flexDirection: 'row', marginTop: theme.spacing.sm, marginBottom: theme.spacing.md },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: theme.radius.sm, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border, alignItems: 'center' },
  typeBtnActive: { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
  typeText: { fontWeight: '600', color: theme.colors.muted },
  typeTextActive: { color: theme.colors.primary },
});

