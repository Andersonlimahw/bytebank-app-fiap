import React, { useMemo } from 'react';
import { View, Text, Image, FlatList, ScrollView, Animated } from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { TransactionItem } from '../../components/TransactionItem';
import { useAuth } from '../../../store/authStore';
import { formatCurrency } from '../../../utils/format';
import { QuickAction } from '../../components/QuickAction';
import { useTheme } from '../../theme/theme';
import { makeHomeStyles } from './HomeScreen.styles';
import { useFadeSlideInOnFocus } from '../../hooks/animations';
import { Avatar } from '../../components/Avatar';
import { useI18n } from '../../i18n/I18nProvider';

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { loading, transactions, balance, refresh } = useHomeViewModel();
  const { user, signOut } = useAuth();
  const { animatedStyle } = useFadeSlideInOnFocus();
  const { t } = useI18n();
  const theme = useTheme();
  const styles = useMemo(() => makeHomeStyles(theme), [theme]);

  return (
    <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={animatedStyle as any}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>{t('home.hello')}</Text>
          <Text style={styles.username}>{user?.name || 'Usuário'}</Text>
        </View>
        <Avatar username={user?.name} size={40} onPress={() => (navigation as any)?.navigate?.('User')} />
      </View>

      <Image source={require('../../../../contents/figma/home/Banner1-4.png')} style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('home.balance')}</Text>
        <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
        <Text onPress={signOut} style={styles.signOut}>{t('home.signOut')}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t('home.shortcuts')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
        <QuickAction label={t('home.pix')} icon={require('../../../../public/assets/images/icons/Ícone Pix.png')} onPress={() => (navigation as any)?.navigate?.('Pix')} />
        <QuickAction label="Cartões" icon={require('../../../../public/assets/images/icons/Ícone cartões.png')} style={styles.actionGap} />
        <QuickAction label="Empréstimo" icon={require('../../../../public/assets/images/icons/Ícone empréstimo.png')} style={styles.actionGap} />
        <QuickAction label="Saque" icon={require('../../../../public/assets/images/icons/Ícone Saque.png')} style={styles.actionGap} />
        <QuickAction label="Seguros" icon={require('../../../../public/assets/images/icons/Ícone seguros.png')} style={styles.actionGap} />
        <QuickAction label="Doações" icon={require('../../../../public/assets/images/icons/Ícone doações.png')} style={styles.actionGap} />
      </ScrollView>

      <Text style={styles.sectionTitle}>{t('home.recentTransactions')}</Text>
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

/** styles moved to HomeScreen.styles.ts */
