import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { theme } from '../../theme/theme';
import { addTransactionStyles as styles } from './AddTransactionScreen.styles';
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
          style={[styles.typeBtn, styles.typeBtnSpacer, type === 'debit' ? styles.typeBtnActive : undefined]}
          accessibilityRole="button"
          accessibilityLabel="Selecionar débito"
        >
          <Text style={[styles.typeText, type === 'debit' ? styles.typeTextActive : undefined]}>Débito</Text>
        </TouchableOpacity>
      </View>

      <Button title={'Salvar'} loading={loading} disabled={loading} onPress={save} />
    </View>
  );
};

// styles moved to AddTransactionScreen.styles.ts
