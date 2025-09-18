import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, Animated, } from "react-native";
import { formatCurrency } from "../../../utils/format";
import { QuickAction } from "../../components/QuickAction";
import { TransactionItem } from "../../components/TransactionItem";
import { useDashboardViewModel } from "../../viewmodels/useDashboardViewModel";
import { useTheme } from "../../theme/theme";
import { useI18n } from "../../i18n/I18nProvider";
import { makeDashboardStyles } from "./DashboardScreen.styles";
import { useFadeSlideInOnFocus, useChartEntranceAndPulse, } from "../../hooks/animations";
import { Avatar } from "../../components/Avatar";
import { useDigitalCardsViewModel } from "../../viewmodels/useDigitalCardsViewModel";
import { CardVisual } from "../../components/DigitalCard";
import HorizontalBarChart from "../../components/charts/HorizontalBarChart";
export const DashboardScreen = ({ navigation }) => {
    const { user, balance, transactions, loading, refresh, addDemoCredit, addDemoDebit, } = useDashboardViewModel();
    const { animatedStyle } = useFadeSlideInOnFocus();
    const { animatedStyle: chartStyle } = useChartEntranceAndPulse(transactions?.length ?? 0);
    const theme = useTheme();
    const { t } = useI18n();
    const styles = useMemo(() => makeDashboardStyles(theme), [theme]);
    const { cards } = useDigitalCardsViewModel();
    return (_jsx(Animated.ScrollView, { style: styles.container, contentContainerStyle: { paddingBottom: theme.spacing.xl }, showsVerticalScrollIndicator: false, children: _jsxs(Animated.View, { style: animatedStyle, children: [_jsxs(View, { style: styles.header, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.hello, children: t("home.hello") }), _jsx(Text, { style: styles.username, children: user?.name || t("home.userFallback") })] }), _jsx(Avatar, { username: user?.name, size: 40, onPress: () => navigation?.navigate?.("User") })] }), _jsx(Image, { source: require("../../../../public/assets/images/banners/home.png"), style: styles.banner }), _jsxs(View, { style: styles.card, children: [_jsx(Text, { style: styles.cardLabel, children: t("dashboard.totalBalance") }), _jsx(Text, { style: styles.cardValue, children: formatCurrency(balance) }), _jsxs(View, { style: styles.row, children: [_jsx(TouchableOpacity, { onPress: addDemoCredit, style: [
                                        styles.smallBtn,
                                        { backgroundColor: theme.colors.success },
                                    ], accessibilityRole: "button", accessibilityLabel: t("dashboard.demoCredit"), children: _jsx(Text, { style: styles.smallBtnText, children: t("dashboard.demoCredit") }) }), _jsx(TouchableOpacity, { onPress: addDemoDebit, style: [
                                        styles.smallBtn,
                                        {
                                            backgroundColor: theme.colors.danger,
                                            marginLeft: theme.spacing.sm,
                                        },
                                    ], accessibilityRole: "button", accessibilityLabel: t("dashboard.demoDebit"), children: _jsx(Text, { style: styles.smallBtnText, children: t("dashboard.demoDebit") }) })] })] }), _jsx(Text, { style: styles.sectionTitle, children: t("dashboard.shortcuts") }), _jsxs(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.actionsRow, children: [_jsx(QuickAction, { label: t("home.pix"), icon: require("../../../../public/assets/images/icons/Ícone Pix.png"), onPress: () => navigation?.navigate?.("Pix") }), _jsx(QuickAction, { label: t("home.cards"), icon: require("../../../../public/assets/images/icons/Ícone cartões.png"), style: styles.actionGap, onPress: () => navigation?.navigate?.("DigitalCards") }), _jsx(QuickAction, { label: t("home.loan"), icon: require("../../../../public/assets/images/icons/Ícone empréstimo.png"), style: styles.actionGap }), _jsx(QuickAction, { label: t("home.withdraw"), icon: require("../../../../public/assets/images/icons/Ícone Saque.png"), style: styles.actionGap }), _jsx(QuickAction, { label: t("home.insurance"), icon: require("../../../../public/assets/images/icons/Ícone seguros.png"), style: styles.actionGap }), _jsx(QuickAction, { label: t("home.donations"), icon: require("../../../../public/assets/images/icons/Ícone doações.png"), style: styles.actionGap })] }), _jsx(Text, { style: styles.sectionTitle, children: t("dashboard.myCards") }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { paddingVertical: 4 }, children: cards && cards.length > 0 ? (cards.map((c, idx) => (_jsx(TouchableOpacity, { onPress: () => navigation?.navigate?.("DigitalCards"), accessibilityRole: "button", accessibilityLabel: t("titles.digitalCards"), children: _jsx(CardVisual, { card: c, style: { marginRight: idx < cards.length - 1 ? 12 : 0 } }) }, c.id)))) : (_jsx(Image, { source: require("../../../../contents/figma/dashboard/cards/Cartão Byte digital.png"), style: styles.cardImage, accessibilityRole: "image", accessibilityLabel: t("dashboard.myCards") })) }), _jsx(Text, { style: styles.sectionTitle, children: t("dashboard.spendingSummary") }), _jsx(View, { style: { marginBottom: theme.spacing.sm }, children: _jsx(HorizontalBarChart, { data: buildSpendingChartData(transactions || [], t), formatValue: (v) => formatCurrency(v), testID: "dashboard-spending-chart" }) }), _jsx(Text, { style: styles.sectionTitle, children: t("dashboard.recentTransactions") }), _jsx(FlatList, { data: transactions, keyExtractor: (item) => item.id, renderItem: ({ item }) => _jsx(TransactionItem, { tx: item }), refreshing: loading, onRefresh: refresh, scrollEnabled: false })] }) }));
};
function buildSpendingChartData(transactions, t) {
    // Consider only debits for spending
    const debits = (transactions || []).filter((tx) => tx?.type === "debit");
    if (debits.length === 0)
        return [];
    const groups = new Map();
    for (const tx of debits) {
        const rawCat = tx?.category;
        const key = normalizeCategoryKey(rawCat || deriveCategoryFromDescription(String(tx?.description || "")));
        const prev = groups.get(key) || 0;
        groups.set(key, prev + (Number(tx?.amount) || 0));
    }
    // Sort by value desc and pick top 6
    const entries = Array.from(groups.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    return entries.map(([key, value]) => ({
        label: t(`charts.categories.${key}`),
        value,
    }));
}
function normalizeCategoryKey(k) {
    const known = [
        "groceries",
        "foodDrink",
        "shopping",
        "transport",
        "bills",
        "income",
        "other",
    ];
    const lc = (k || "").toLowerCase();
    const match = known.find((x) => x === lc);
    return match || "other";
}
function deriveCategoryFromDescription(desc) {
    const d = desc.toLowerCase();
    if (d.includes("grocery") ||
        d.includes("grocer") ||
        d.includes("market") ||
        d.includes("super"))
        return "groceries";
    if (d.includes("coffee") ||
        d.includes("cafe") ||
        d.includes("restaurant") ||
        d.includes("food") ||
        d.includes("pizza"))
        return "foodDrink";
    if (d.includes("uber") ||
        d.includes("lyft") ||
        d.includes("bus") ||
        d.includes("metro") ||
        d.includes("gas"))
        return "transport";
    if (d.includes("netflix") ||
        d.includes("energy") ||
        d.includes("water") ||
        d.includes("phone") ||
        d.includes("bill"))
        return "bills";
    if (d.includes("shop") || d.includes("store") || d.includes("mall"))
        return "shopping";
    return "other";
}
