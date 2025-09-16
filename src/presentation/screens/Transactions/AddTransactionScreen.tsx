import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/theme';
import { makeAddTransactionStyles } from './AddTransactionScreen.styles';
import type { TransactionType } from '../../../domain/entities/Transaction';
import type { TransactionRepository } from '../../../domain/repositories/TransactionRepository';
import { TOKENS } from '../../../core/di/container';
import { useDI } from '../../../store/diStore';
import { useAuth } from '../../../store/authStore';
import { useI18n } from '../../i18n/I18nProvider';

export const AddTransactionScreen: React.FC<any> = ({ navigation }) => {
  const di = useDI();
  const repo = useMemo(() => di.resolve<TransactionRepository>(TOKENS.TransactionRepository), [di]);
  const { user } = useAuth();
  const theme = useTheme();
  const styles = useMemo(() => makeAddTransactionStyles(theme), [theme]);
  const { t } = useI18n();

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
      setError(t('transactions.errorFillDescAndValidValue'));
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
      Alert.alert(t('common.errorTitle') || 'Erro', e?.message ?? t('common.update') );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('transactions.title')}</Text>
      <Input label={t('transactions.description')} value={desc} onChangeText={setDesc} placeholder={t('transactions.description')} />
      <Input label={t('transactions.categoryOptional')} value={category} onChangeText={setCategory} placeholder={t('transactions.categoryOptional')} />
      <Input label={t('transactions.valueBRL')} value={amountText} onChangeText={setAmountText} placeholder="0,00" keyboardType="decimal-pad" errorText={error} />

      <View style={styles.typeRow}>
        <TouchableOpacity
          onPress={() => setType('credit')}
          style={[styles.typeBtn, type === 'credit' ? styles.typeBtnActive : undefined]}
          accessibilityRole="button"
          accessibilityLabel={t('transactions.credit')}
        >
          <Text style={[styles.typeText, type === 'credit' ? styles.typeTextActive : undefined]}>{t('transactions.credit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType('debit')}
          style={[styles.typeBtn, styles.typeBtnSpacer, type === 'debit' ? styles.typeBtnActive : undefined]}
          accessibilityRole="button"
          accessibilityLabel={t('transactions.debit')}
        >
          <Text style={[styles.typeText, type === 'debit' ? styles.typeTextActive : undefined]}>{t('transactions.debit')}</Text>
        </TouchableOpacity>
      </View>

      <Button title={t('transactions.save')} loading={loading} disabled={loading} onPress={save} />
    </View>
  );
};

// styles moved to AddTransactionScreen.styles.ts
