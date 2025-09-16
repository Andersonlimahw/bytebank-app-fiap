import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useI18n } from '../../i18n/I18nProvider';
import { useTheme } from '../../theme/theme';
import { makeDigitalCardsStyles } from './DigitalCardsScreen.styles';
import { CardVisual, deriveBrandFromNumber } from '../../components/DigitalCard';
import { useDigitalCardsViewModel } from '../../viewmodels/useDigitalCardsViewModel';

export const DigitalCardsScreen: React.FC<any> = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const styles = useMemo(() => makeDigitalCardsStyles(theme), [theme]);
  const { cards, loading, refresh, addCard, updateCard, removeCard, user } = useDigitalCardsViewModel();

  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [holderName, setHolderName] = useState('');
  const [number, setNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [brand, setBrand] = useState<'bytebank' | 'nubank' | 'oyapal' | 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'other'>('bytebank');
  const [nickname, setNickname] = useState('');

  const openNew = () => {
    setEditingId(null);
    setHolderName((user?.name || '').toUpperCase());
    setNumber('');
    setCvv('');
    setExpiry('');
    setBrand('bytebank');
    setNickname('');
    setFormVisible(true);
  };

  const openEdit = (id: string) => {
    const c = cards.find((x) => x.id === id);
    if (!c) return;
    setEditingId(id);
    setHolderName(c.holderName);
    setNumber(c.number);
    setCvv(c.cvv);
    setExpiry(c.expiry);
    setBrand((c.brand as any) || 'other');
    setNickname(c.nickname || '');
    setFormVisible(true);
  };

  const formatNumber = useCallback((val: string) => {
    const digits = (val || '').replace(/\D/g, '').slice(0, 19);
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ');
  }, []);

  const formatExpiry = useCallback((val: string) => {
    const digits = (val || '').replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    const mm = digits.slice(0, 2);
    const yy = digits.slice(2);
    return `${mm}/${yy}`;
  }, []);

  const onChangeName = useCallback((v: string) => setHolderName(v.toUpperCase()), []);
  const onChangeNumber = useCallback((v: string) => {
    const formatted = formatNumber(v);
    setNumber(formatted);
    const derived = deriveBrandFromNumber(formatted);
    if (derived) setBrand(derived);
  }, [formatNumber]);
  const onChangeExpiry = useCallback((v: string) => setExpiry(formatExpiry(v)), [formatExpiry]);
  const onChangeCvv = useCallback((v: string) => setCvv((v || '').replace(/\D/g, '').slice(0, 4)), []);

  const isValidExpiry = useCallback((v: string) => {
    const m = /^(\d{2})\/(\d{2})$/.exec(v);
    if (!m) return false;
    const mm = Number(m[1]);
    return mm >= 1 && mm <= 12;
  }, []);

  const luhnValid = useCallback((v: string) => {
    const digits = (v || '').replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }, []);

  const validCvv = useCallback((b: typeof brand, v: string) => {
    const d = (v || '').replace(/\D/g, '');
    if (b === 'amex') return d.length === 4; // Amex uses 4
    return d.length === 3; // Most others use 3
  }, [brand]);

  const onSave = async () => {
    if (!user) return;
    if (!holderName || !number || !cvv || !expiry || !isValidExpiry(expiry)) {
      Alert.alert(t('common.errorTitle'), t('transactions.errorFillDescAndValidValue'));
      return;
    }
    if (!luhnValid(number)) {
      Alert.alert(t('common.errorTitle'), 'Enter a valid card number');
      return;
    }
    if (!validCvv(brand, cvv)) {
      Alert.alert(t('common.errorTitle'), 'Enter a valid CVV');
      return;
    }
    const payload = {
      userId: user.id,
      holderName: holderName.trim(),
      number: number.replace(/\s/g, ''),
      cvv: cvv.trim(),
      expiry: expiry.trim(),
      brand,
      nickname: nickname || undefined,
    } as any;
    try {
      if (editingId) await updateCard(editingId, payload);
      else await addCard(payload);
      setFormVisible(false);
    } catch (e) {
      Alert.alert(t('common.errorTitle'), String((e as any)?.message || e));
    }
  };

  const onRemove = async (id: string) => {
    Alert.alert(t('common.delete'), t('extract.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: async () => { await removeCard(id); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        refreshing={loading}
        onRefresh={refresh}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('dashboard.myCards')}</Text>}
        renderItem={({ item }) => (
          <View style={styles.cardItem}>
            <CardVisual card={item} />
            <View style={styles.editRemoveRow}>
              <TouchableOpacity onPress={() => openEdit(item.id)}>
                <Text style={styles.smallLink}>{t('common.edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Text style={[styles.smallLink, { color: theme.colors.danger }]}>{t('common.delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openNew} accessibilityRole="button" accessibilityLabel={t('common.add')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <View style={styles.form}>
          <Text style={[styles.label, { fontWeight: '700', marginBottom: 8 }]}>{editingId ? t('common.edit') : t('common.add')}</Text>

          <Text style={styles.label}>Nickname</Text>
          <TextInput value={nickname} onChangeText={setNickname} placeholder="Ex: Meu Nubank" placeholderTextColor="#9CA3AF" style={styles.input} autoCapitalize="words" />

          <Text style={styles.label}>Holder name</Text>
          <TextInput value={holderName} onChangeText={onChangeName} placeholder="NAME SURNAME" placeholderTextColor="#9CA3AF" style={styles.input} autoCapitalize="characters" />

          <Text style={styles.label}>Number</Text>
          <TextInput value={number} onChangeText={onChangeNumber} placeholder="1234 5678 9012 3456" placeholderTextColor="#9CA3AF" style={styles.input} keyboardType="number-pad" />

          <Text style={styles.label}>Expiry (MM/YY)</Text>
          <TextInput value={expiry} onChangeText={onChangeExpiry} placeholder="MM/YY" placeholderTextColor="#9CA3AF" style={styles.input} keyboardType="number-pad" />

          <Text style={styles.label}>CVV</Text>
          <TextInput value={cvv} onChangeText={onChangeCvv} placeholder="123" placeholderTextColor="#9CA3AF" style={styles.input} keyboardType="number-pad" secureTextEntry />

          <Text style={styles.label}>Brand</Text>
          <View style={styles.row}>
            {(['bytebank','nubank','oyapal','visa','mastercard','amex','elo','hipercard','other'] as const).map((b) => (
              <TouchableOpacity key={b} onPress={() => setBrand(b)} style={[styles.btn, styles.btnCancel, { marginRight: 8, borderColor: brand === b ? theme.colors.primary : theme.colors.border }]}
                accessibilityRole="button" accessibilityLabel={`Brand ${b}`}>
                <Text style={[styles.btnText, { color: brand === b ? theme.colors.primary : theme.colors.text }]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setFormVisible(false)} style={[styles.btn, styles.btnCancel]}>
              <Text style={[styles.btnText, { color: theme.colors.text }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={[styles.btn, styles.btnSave]}>
              <Text style={styles.btnText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
