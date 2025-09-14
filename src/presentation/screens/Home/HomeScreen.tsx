import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, Animated } from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { TransactionItem } from '../../components/TransactionItem';
import { useAuth } from '../../../store/authStore';
import { formatCurrency } from '../../../utils/format';
import { QuickAction } from '../../components/QuickAction';
import { theme } from '../../theme/theme';
import { useFadeSlideInOnFocus } from '../../hooks/animations';

export const HomeScreen: React.FC = () => {
  const { loading, transactions, balance, refresh } = useHomeViewModel();
  const { user, signOut } = useAuth();
  const { animatedStyle } = useFadeSlideInOnFocus();

  return (
    <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={animatedStyle as any}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.username}>{user?.name || 'Usuário'}</Text>
        </View>
        <Image source={require('../../../../public/assets/images/icons/Avatar.png')} style={styles.avatar} />
      </View>

      <Image source={require('../../../../contents/figma/home/Banner1-4.png')} style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo atual</Text>
        <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
        <Text onPress={signOut} style={styles.signOut}>Sair</Text>
      </View>

      <Text style={styles.sectionTitle}>Atalhos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
        <QuickAction label="Pix" icon={require('../../../../public/assets/images/icons/Ícone Pix.png')} />
        <QuickAction label="Cartões" icon={require('../../../../public/assets/images/icons/Ícone cartões.png')} style={styles.actionGap} />
        <QuickAction label="Empréstimo" icon={require('../../../../public/assets/images/icons/Ícone empréstimo.png')} style={styles.actionGap} />
        <QuickAction label="Saque" icon={require('../../../../public/assets/images/icons/Ícone Saque.png')} style={styles.actionGap} />
        <QuickAction label="Seguros" icon={require('../../../../public/assets/images/icons/Ícone seguros.png')} style={styles.actionGap} />
        <QuickAction label="Doações" icon={require('../../../../public/assets/images/icons/Ícone doações.png')} style={styles.actionGap} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Transações recentes</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem tx={item} />}
        refreshing={loading}
        onRefresh={refresh}
        scrollEnabled={false}
      />
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  hello: { color: theme.colors.muted },
  username: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  banner: { width: '100%', height: 120, resizeMode: 'cover', borderRadius: theme.radius.md, marginBottom: theme.spacing.lg },
  card: { backgroundColor: theme.colors.card, padding: theme.spacing.lg, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg },
  cardLabel: { color: '#9CA3AF' },
  cardValue: { color: theme.colors.cardText, fontSize: 28, fontWeight: '800', marginTop: 6 },
  signOut: { color: theme.colors.accent, marginTop: theme.spacing.sm },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: theme.spacing.sm, color: theme.colors.text },
  actionsRow: { paddingVertical: theme.spacing.sm },
  actionGap: { marginLeft: theme.spacing.md },
});
