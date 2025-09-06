import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Input } from '../../components/Input';
import { TransactionItem } from '../../components/TransactionItem';
import { theme } from '../../theme/theme';
import { useExtractViewModel } from '../../viewmodels/useExtractViewModel';

export const ExtractScreen: React.FC = () => {
  const { loading, transactions, search, setSearch, refresh } = useExtractViewModel();

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
          renderItem={({ item }) => <TransactionItem tx={item} />}
          refreshing={loading}
          onRefresh={refresh}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  title: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.sm },
});

