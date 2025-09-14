import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TouchableOpacity } from 'react-native';
import { Input } from '../../components/Input';
import { TransactionItem } from '../../components/TransactionItem';
import { theme } from '../../theme/theme';
import { useExtractViewModel } from '../../viewmodels/useExtractViewModel';
import type { Transaction, TransactionType } from '../../../domain/entities/Transaction';
import { Button } from '../../components/Button';

export const ExtractScreen: React.FC<any> = ({ navigation }) => {
  const { loading, transactions, search, setSearch, refresh, remove, update } = useExtractViewModel();

  const [editing, setEditing] = useState<Transaction | null>(null);
  const [desc, setDesc] = useState('');
  const [amountText, setAmountText] = useState('');
  const [type, setType] = useState<TransactionType>('debit');
  const [category, setCategory] = useState('');

  const openOptions = (tx: Transaction) => {
    Alert.alert(
      'Opções',
      tx.description,
      [
        { text: 'Editar', onPress: () => startEdit(tx) },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmDelete(tx),
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const startEdit = (tx: Transaction) => {
    setEditing(tx);
    setDesc(tx.description);
    setAmountText((tx.amount / 100).toFixed(2).replace('.', ','));
    setType(tx.type);
    setCategory(tx.category ?? '');
  };

  const confirmDelete = (tx: Transaction) => {
    Alert.alert(
      'Excluir transação?',
      'Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await remove(tx.id);
          },
        },
      ]
    );
  };

  const saveEdit = async () => {
    if (!editing) return;
    const normalized = amountText.replace(/\./g, '').replace(',', '.');
    const num = Number(normalized);
    if (isNaN(num)) {
      Alert.alert('Valor inválido', 'Informe um valor numérico.');
      return;
    }
    const cents = Math.round(num * 100);
    const payload = { description: desc.trim(), amount: cents, type, category: category.trim() || undefined };
    await update(editing.id, payload);
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato</Text>
      <Input
        placeholder="Buscar"
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Buscar no extrato"
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: theme.spacing.lg }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem tx={item} onPress={() => openOptions(item)} />
          )}
          refreshing={loading}
          onRefresh={refresh}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation?.navigate?.('AddTransaction')}
        accessibilityRole="button"
        accessibilityLabel="Adicionar transação"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar transação</Text>
            <Input label="Descrição" value={desc} onChangeText={setDesc} placeholder="Descrição" />
            <Input label="Categoria (opcional)" value={category} onChangeText={setCategory} placeholder="Ex.: Alimentação, Transferência" />
            <Input
              label="Valor (R$)"
              value={amountText}
              onChangeText={setAmountText}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
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

            <View style={styles.modalActions}>
              <Button title="Cancelar" onPress={() => setEditing(null)} style={{ backgroundColor: theme.colors.surface }} textStyle={{ color: theme.colors.text }} />
              <Button title="Salvar" onPress={saveEdit} style={{ marginLeft: theme.spacing.sm }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  title: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
  modalCard: { width: '100%', borderRadius: theme.radius.md, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
  modalTitle: { fontSize: theme.text.h2, fontWeight: '700', marginBottom: theme.spacing.sm, color: theme.colors.text },
  typeRow: { flexDirection: 'row', marginTop: theme.spacing.sm, marginBottom: theme.spacing.md },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: theme.radius.sm, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border, alignItems: 'center' },
  typeBtnActive: { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
  typeText: { fontWeight: '600', color: theme.colors.muted },
  typeTextActive: { color: theme.colors.primary },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md },
  fab: { position: 'absolute', right: 16, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  fabText: { color: theme.colors.cardText, fontSize: 28, lineHeight: 30 },
});
