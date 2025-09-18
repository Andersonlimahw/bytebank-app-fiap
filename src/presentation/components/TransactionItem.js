import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { formatCurrency, formatDateShort } from '../../utils/format';
import { useTheme } from '../theme/theme';
import { makeTransactionItemStyles } from './TransactionItem.styles';
import { useI18n } from '../i18n/I18nProvider';
import { SwipeableRow } from './SwipeableRow';
const TransactionItemBase = ({ tx, onPressTx, onEditTx, onDeleteTx, onFullSwipeDeleteTx, }) => {
    const theme = useTheme();
    const { t } = useI18n();
    const styles = useMemo(() => makeTransactionItemStyles(theme), [theme]);
    const sign = tx.type === 'credit' ? '+' : '-';
    const color = tx.type === 'credit' ? theme.colors.success : theme.colors.danger;
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(6)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
    }, [opacity, translateY]);
    // Bind tx-aware callbacks lazily and stably
    const handlePress = useCallback(() => {
        return onPressTx?.(tx);
    }, [onPressTx, tx]);
    const handleEdit = useCallback(() => {
        return onEditTx?.(tx);
    }, [onEditTx, tx]);
    const handleDelete = useCallback(() => {
        return onDeleteTx?.(tx);
    }, [onDeleteTx, tx]);
    const handleFullSwipeDelete = useCallback(() => {
        return onFullSwipeDeleteTx?.(tx);
    }, [onFullSwipeDeleteTx, tx]);
    const content = (_jsxs(Pressable, { onPress: handlePress, style: ({ pressed }) => [styles.row, pressed && styles.rowPressed], accessibilityRole: onPressTx ? 'button' : undefined, accessibilityLabel: onPressTx ? `${t('extract.optionsTitle')}: ${tx.description}` : undefined, children: [_jsxs(View, { style: styles.content, children: [_jsx(Text, { style: styles.title, numberOfLines: 1, ellipsizeMode: "tail", children: tx.description }), _jsx(Text, { style: styles.date, children: formatDateShort(new Date(tx.createdAt)) }), !!tx.category && _jsx(Text, { style: styles.category, children: tx.category })] }), _jsx(View, { style: styles.amountWrap, children: _jsxs(Text, { style: [styles.amount, { color }], numberOfLines: 1, children: [sign, " ", formatCurrency(tx.amount)] }) })] }));
    return (_jsx(Animated.View, { style: { opacity, transform: [{ translateY }] }, children: onEditTx || onDeleteTx || onFullSwipeDeleteTx ? (_jsx(SwipeableRow, { onEdit: handleEdit, onDelete: handleDelete, onFullSwipeDelete: handleFullSwipeDelete, children: content })) : (content) }));
};
export const TransactionItem = React.memo(TransactionItemBase, (a, b) => {
    const atx = a.tx;
    const btx = b.tx;
    return (atx.id === btx.id &&
        atx.amount === btx.amount &&
        atx.description === btx.description &&
        atx.type === btx.type &&
        atx.category === btx.category &&
        atx.createdAt === btx.createdAt &&
        a.onPressTx === b.onPressTx &&
        a.onEditTx === b.onEditTx &&
        a.onDeleteTx === b.onDeleteTx &&
        a.onFullSwipeDeleteTx === b.onFullSwipeDeleteTx);
});
