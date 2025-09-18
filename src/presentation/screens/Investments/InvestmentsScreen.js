import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View, Text, Animated } from 'react-native';
import { useInvestmentsViewModel } from '../../viewmodels/useInvestmentsViewModel';
import { useTheme } from '../../theme/theme';
import { makeInvestmentsStyles } from './InvestmentsScreen.styles';
import { formatCurrency } from '../../../utils/format';
import { Skeleton } from '../../components/Skeleton';
import { useFadeSlideInOnFocus, useChartEntranceAndPulse } from '../../hooks/animations';
import { Avatar } from '../../components/Avatar';
import { useI18n } from '../../i18n/I18nProvider';
import { useAuth } from '../../../store/authStore';
import HorizontalBarChart from '../../components/charts/HorizontalBarChart';
export const InvestmentsScreen = ({ navigation }) => {
    const { loading, total, rendaFixa, rendaVariavel, donutData } = useInvestmentsViewModel();
    const { animatedStyle } = useFadeSlideInOnFocus();
    const { animatedStyle: chartStyle } = useChartEntranceAndPulse(total);
    const { user } = useAuth();
    const theme = useTheme();
    const { t } = useI18n();
    const styles = useMemo(() => makeInvestmentsStyles(theme), [theme]);
    return (_jsxs(Animated.ScrollView, { style: styles.container, contentContainerStyle: styles.contentContainer, children: [_jsxs(Animated.View, { style: [styles.header, animatedStyle], children: [_jsxs(View, { children: [_jsx(Text, { style: styles.hello, children: t('home.hello') }), _jsx(Text, { style: styles.username, children: user?.name || t('home.userFallback') })] }), _jsx(Avatar, { username: user?.name, size: 40, onPress: () => navigation?.navigate?.('User') })] }), loading ? (_jsxs(View, { style: styles.loadingGroup, children: [_jsx(Skeleton, { height: 24, width: 160 }), _jsxs(View, { style: styles.wrapper, children: [_jsx(Skeleton, { height: 24, width: 200, style: styles.skeletonHeader }), _jsxs(View, { style: styles.cardsRow, children: [_jsx(Skeleton, { height: 72, style: styles.skeletonCard }), _jsx(Skeleton, { height: 72, style: styles.skeletonCard })] }), _jsx(Skeleton, { height: 20, width: 120, style: styles.skeletonFooter }), _jsx(Skeleton, { height: 180 })] })] })) : (_jsxs(Animated.View, { style: [styles.wrapper, animatedStyle], children: [_jsxs(Text, { style: styles.total, children: [t('investments.total'), ": ", formatCurrency(total)] }), _jsxs(View, { style: styles.cardsRow, children: [_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: styles.cardTitle, children: t('investments.fixedIncome') }), _jsx(Text, { style: styles.cardValue, children: formatCurrency(rendaFixa) })] }), _jsxs(View, { style: styles.card, children: [_jsx(Text, { style: styles.cardTitle, children: t('investments.variableIncome') }), _jsx(Text, { style: styles.cardValue, children: formatCurrency(rendaVariavel) })] })] }), _jsx(Text, { style: styles.statsTitle, children: t('investments.allocation') }), _jsx(View, { style: styles.statsRow, children: _jsx(Animated.View, { style: chartStyle, children: _jsx(HorizontalBarChart, { data: (donutData || []).map((d) => ({ label: mapInvestmentTypeToLabel(t, d.name), value: d.value })), formatValue: (v) => formatCurrency(v), testID: "investments-allocation-chart" }) }) })] }))] }));
};
/** styles moved to InvestmentsScreen.styles.ts */
// helpers
function mapInvestmentTypeToLabel(t, type) {
    switch (type) {
        case 'Fundos de investimento':
            return t('investments.categories.funds');
        case 'Tesouro Direto':
            return t('investments.categories.treasury');
        case 'Previdência Privada':
            return t('investments.categories.pension');
        case 'Bolsa de Valores':
            return t('investments.categories.stocks');
        default:
            return String(type);
    }
}
