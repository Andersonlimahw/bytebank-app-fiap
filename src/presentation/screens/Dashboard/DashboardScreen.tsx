import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, Animated } from 'react-native';
import { formatCurrency } from '../../../utils/format';
import { QuickAction } from '../../components/QuickAction';
import { TransactionItem } from '../../components/TransactionItem';
import { useDashboardViewModel } from '../../viewmodels/useDashboardViewModel';
import { useTheme } from '../../theme/theme';
import { useI18n } from '../../i18n/I18nProvider';
import { makeDashboardStyles } from './DashboardScreen.styles';
import { useFadeSlideInOnFocus, useChartEntranceAndPulse } from '../../hooks/animations';
import { Avatar } from '../../components/Avatar';

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user, balance, transactions, loading, refresh, addDemoCredit, addDemoDebit } = useDashboardViewModel();
  const { animatedStyle } = useFadeSlideInOnFocus();
  const { animatedStyle: chartStyle } = useChartEntranceAndPulse(transactions?.length ?? 0);
  const theme = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeDashboardStyles(theme), [theme]);

  return (
    <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={animatedStyle as any}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>{t('home.hello')}</Text>
          <Text style={styles.username}>{user?.name || t('home.userFallback')}</Text>
        </View>
        <Avatar username={user?.name} size={40} onPress={() => (navigation as any)?.navigate?.('User')} />
      </View>

      <Image source={require('../../../../contents/figma/dashboard/Mobile _ Inicial.png')} style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('dashboard.totalBalance')}</Text>
        <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={addDemoCredit} style={[styles.smallBtn, { backgroundColor: theme.colors.success }]}
            accessibilityRole="button" accessibilityLabel={t('dashboard.demoCredit')}>
            <Text style={styles.smallBtnText}>{t('dashboard.demoCredit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addDemoDebit} style={[styles.smallBtn, { backgroundColor: theme.colors.danger, marginLeft: theme.spacing.sm }]}
            accessibilityRole="button" accessibilityLabel={t('dashboard.demoDebit')}>
            <Text style={styles.smallBtnText}>{t('dashboard.demoDebit')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t('dashboard.shortcuts')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
        <QuickAction label={t('home.pix')} icon={require('../../../../public/assets/images/icons/Ícone Pix.png')} onPress={() => (navigation as any)?.navigate?.('Pix')} />
        <QuickAction label={t('home.cards')} icon={require('../../../../public/assets/images/icons/Ícone cartões.png')} style={styles.actionGap} />
        <QuickAction label={t('home.loan')} icon={require('../../../../public/assets/images/icons/Ícone empréstimo.png')} style={styles.actionGap} />
        <QuickAction label={t('home.withdraw')} icon={require('../../../../public/assets/images/icons/Ícone Saque.png')} style={styles.actionGap} />
        <QuickAction label={t('home.insurance')} icon={require('../../../../public/assets/images/icons/Ícone seguros.png')} style={styles.actionGap} />
        <QuickAction label={t('home.donations')} icon={require('../../../../public/assets/images/icons/Ícone doações.png')} style={styles.actionGap} />
      </ScrollView>

      <Text style={styles.sectionTitle}>{t('dashboard.myCards')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
        <Image source={require('../../../../contents/figma/dashboard/cards/Cartão Byte digital.png')} style={styles.cardImage} />
        <Image source={require('../../../../contents/figma/dashboard/cards/Cartão Byte Físico.png')} style={[styles.cardImage, { marginLeft: 12 }]} />
      </ScrollView>

      <Text style={styles.sectionTitle}>{t('dashboard.spendingSummary')}</Text>
      <Animated.Image source={require('../../../../public/assets/images/icons/Gráfico pizza.png')} style={[styles.chart, chartStyle as any]} />
      <Text style={styles.caption}>{t('dashboard.distributionExample')}</Text>

      <Text style={styles.sectionTitle}>{t('dashboard.recentTransactions')}</Text>
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

/** styles moved to DashboardScreen.styles.ts */
