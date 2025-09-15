import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import { useInvestmentsViewModel } from '../../viewmodels/useInvestmentsViewModel';
import { theme } from '../../theme/theme';
import { formatCurrency } from '../../../utils/format';
import { Skeleton } from '../../components/Skeleton';
import { useFadeSlideInOnFocus, useChartEntranceAndPulse } from '../../hooks/animations';

export const InvestmentsScreen: React.FC = () => {
  const { loading, total, rendaFixa, rendaVariavel } = useInvestmentsViewModel();
  const { animatedStyle } = useFadeSlideInOnFocus();
  const { animatedStyle: chartStyle } = useChartEntranceAndPulse(total);

  return (
    <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
      <Animated.Text style={[styles.title, animatedStyle as any]}>Investimentos</Animated.Text>

      {loading ? (
        <View style={{ gap: theme.spacing.md }}>
          <Skeleton height={24} width={160} />
          <View style={styles.wrapper}>
            <Skeleton height={24} width={200} style={{ marginBottom: theme.spacing.lg }} />
            <View style={styles.cardsRow as any}>
              <Skeleton height={72} style={{ flex: 1 }} />
              <Skeleton height={72} style={{ flex: 1 }} />
            </View>
            <Skeleton height={20} width={120} style={{ marginTop: theme.spacing.lg }} />
            <Skeleton height={180} />
          </View>
        </View>
      ) : (
        <Animated.View style={[styles.wrapper, animatedStyle as any]}>
          <Text style={styles.total}>Total: {formatCurrency(total)}</Text>

          <View style={styles.cardsRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Renda Fixa</Text>
              <Text style={styles.cardValue}>{formatCurrency(rendaFixa)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Renda variável</Text>
              <Text style={styles.cardValue}>{formatCurrency(rendaVariavel)}</Text>
            </View>
          </View>

          <Text style={styles.statsTitle}>Estatísticas</Text>
          {/* Placeholder chart image (similar pattern used in Dashboard) */}
          <View style={styles.statsRow}>
            <Animated.Image source={require('../../../../public/assets/images/icons/Gráfico pizza.png')} style={[styles.chart, chartStyle as any]} />
          </View>
        </Animated.View>
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  title: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.lg },
  wrapper: { backgroundColor: theme.colors.card, borderRadius: theme.radius.md, padding: theme.spacing.lg },
  total: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.lg },
  cardsRow: { flexDirection: 'row', gap: theme.spacing.md } as any,
  card: { flex: 1, backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  cardTitle: { color: '#fff', marginBottom: theme.spacing.xs },
  cardValue: { color: '#fff', fontWeight: '700' },
  statsTitle: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm, fontWeight: '700', color: theme.colors.text, fontSize: 16 },
  statsRow: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center' },
  chart: { width: '100%', height: 220, resizeMode: 'contain' },
});
