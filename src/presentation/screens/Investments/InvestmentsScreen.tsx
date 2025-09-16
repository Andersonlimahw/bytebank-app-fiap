import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, Animated } from 'react-native';
import { useInvestmentsViewModel } from '../../viewmodels/useInvestmentsViewModel';
import { useTheme } from '../../theme/theme';
import { makeInvestmentsStyles } from './InvestmentsScreen.styles';
import { formatCurrency } from '../../../utils/format';
import { Skeleton } from '../../components/Skeleton';
import { useFadeSlideInOnFocus, useChartEntranceAndPulse } from '../../hooks/animations';
import { Avatar } from '../../components/Avatar';
import { useAuth } from '../../../store/authStore';

export const InvestmentsScreen: React.FC<any> = ({ navigation }) => {
  const { loading, total, rendaFixa, rendaVariavel } = useInvestmentsViewModel();
  const { animatedStyle } = useFadeSlideInOnFocus();
  const { animatedStyle: chartStyle } = useChartEntranceAndPulse(total);
  const { user } = useAuth();
  const theme = useTheme();
  const styles = useMemo(() => makeInvestmentsStyles(theme), [theme]);

  return (
    <Animated.ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
    >
      <Animated.View style={[styles.header, animatedStyle as any]}>
        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.username}>{user?.name || 'Usuário'}</Text>
        </View>
        <Avatar username={user?.name} size={40} onPress={() => (navigation as any)?.navigate?.('User')} />
      </Animated.View>

      {loading ? (
        <View style={styles.loadingGroup as any}>
          <Skeleton height={24} width={160} />
          <View style={styles.wrapper}>
            <Skeleton height={24} width={200} style={styles.skeletonHeader} />
            <View style={styles.cardsRow as any}>
              <Skeleton height={72} style={styles.skeletonCard} />
              <Skeleton height={72} style={styles.skeletonCard} />
            </View>
            <Skeleton height={20} width={120} style={styles.skeletonFooter} />
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

/** styles moved to InvestmentsScreen.styles.ts */
