import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, Alert, Modal, Pressable, Animated, TouchableOpacity } from 'react-native';
import { Input } from '../../components/Input';
import { TransactionItem } from '../../components/TransactionItem';
import { theme } from '../../theme/theme';
import { extractStyles as styles } from './ExtractScreen.styles';
import { useExtractViewModel } from '../../viewmodels/useExtractViewModel';
import type { Transaction, TransactionType } from '../../../domain/entities/Transaction';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';

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

  const fabScale = React.useRef(new Animated.Value(1)).current;
  const fabIn = () => Animated.spring(fabScale, { toValue: 0.94, useNativeDriver: true, speed: 24, bounciness: 0 }).start();
  const fabOut = () => Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 6 }).start();
  const scrollY = useRef(new Animated.Value(0)).current;
  const clamped = Animated.diffClamp(scrollY, 0, 80);
  const fabTranslateY = clamped.interpolate({ inputRange: [0, 80], outputRange: [0, 100] });

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
        <View style={styles.loadingContainer}>
          <Skeleton height={44} style={styles.loadingSkeletonTop} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={52} style={styles.loadingSkeletonItem} />
          ))}
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
          <Button title="Adicionar transação" onPress={() => navigation?.navigate?.('AddTransaction')} />
        </View>
      ) : (
        <Animated.FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              tx={item}
              onPress={() => openOptions(item)}
              onEdit={() => startEdit(item)}
              onDelete={() => confirmDelete(item)}
            />
          )}
          refreshing={loading}
          onRefresh={refresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        />
      )}

      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }, { translateY: fabTranslateY }] }]}> 
        <Pressable
          onPressIn={fabIn}
          onPressOut={fabOut}
          onPress={() => navigation?.navigate?.('AddTransaction')}
          accessibilityRole="button"
          accessibilityLabel="Adicionar transação"
          style={styles.fabPressable}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </Animated.View>

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
              <Button title="Cancelar" onPress={() => setEditing(null)} style={styles.modalCancelBtn} textStyle={{ color: theme.colors.text }} />
              <Button title="Salvar" onPress={saveEdit} style={styles.modalSaveBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/** styles moved to ExtractScreen.styles.ts */
