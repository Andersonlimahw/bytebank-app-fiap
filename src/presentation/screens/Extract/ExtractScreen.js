import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, Alert, Modal, Pressable, Animated, TouchableOpacity } from 'react-native';
import { Input } from '../../components/Input';
import { TransactionItem } from '../../components/TransactionItem';
import { useTheme } from '../../theme/theme';
import { makeExtractStyles } from './ExtractScreen.styles';
import { useExtractViewModel } from '../../viewmodels/useExtractViewModel';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import { Avatar } from '../../components/Avatar';
import { useAuth } from '../../../store/authStore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useI18n } from '../../i18n/I18nProvider';
export const ExtractScreen = () => {
    const navigation = useNavigation();
    const { loading, transactions, search, setSearch, refresh, remove, update, supportsRealtime } = useExtractViewModel();
    const { user } = useAuth();
    const { t } = useI18n();
    const theme = useTheme();
    const styles = useMemo(() => makeExtractStyles(theme), [theme]);
    // navigation object from hook is stable; avoid recreating callbacks per render
    const goUser = useCallback(() => navigation?.navigate?.('User'), [navigation]);
    const goAddTx = useCallback(() => navigation?.navigate?.('AddTransaction'), [navigation]);
    const [editing, setEditing] = useState(null);
    const [desc, setDesc] = useState('');
    const [amountText, setAmountText] = useState('');
    const [type, setType] = useState('debit');
    const [category, setCategory] = useState('');
    const closeEdit = useCallback(() => setEditing(null), []);
    const startEdit = useCallback((tx) => {
        setEditing(tx);
        setDesc(tx.description);
        setAmountText((tx.amount / 100).toFixed(2).replace('.', ','));
        setType(tx.type);
        setCategory(tx.category ?? '');
    }, []);
    const confirmDelete = useCallback((tx) => {
        Alert.alert(t('extract.deleteConfirmTitle'), t('extract.deleteConfirmMessage'), [
            { text: t('extract.cancel'), style: 'cancel' },
            {
                text: t('extract.delete'),
                style: 'destructive',
                onPress: async () => {
                    await remove(tx.id);
                },
            },
        ]);
    }, [remove]);
    const openOptions = useCallback((tx) => {
        Alert.alert(t('extract.optionsTitle'), tx.description, [
            { text: t('extract.edit'), onPress: () => startEdit(tx) },
            {
                text: t('extract.delete'),
                style: 'destructive',
                onPress: () => confirmDelete(tx),
            },
            { text: t('extract.cancel'), style: 'cancel' },
        ], { cancelable: true });
    }, [confirmDelete, startEdit]);
    const saveEdit = useCallback(async () => {
        if (!editing)
            return;
        const normalized = amountText.replace(/\./g, '').replace(',', '.');
        const num = Number(normalized);
        if (isNaN(num)) {
            Alert.alert(t('extract.invalidValueTitle'), t('extract.invalidValueMessage'));
            return;
        }
        const cents = Math.round(num * 100);
        const payload = { description: desc.trim(), amount: cents, type, category: category.trim() || undefined };
        await update(editing.id, payload);
        closeEdit();
    }, [editing, amountText, desc, type, category, update, closeEdit]);
    const fabScale = React.useRef(new Animated.Value(1)).current;
    const fabIn = useCallback(() => {
        Animated.spring(fabScale, { toValue: 0.94, useNativeDriver: true, speed: 24, bounciness: 0 }).start();
    }, [fabScale]);
    const fabOut = useCallback(() => {
        Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 6 }).start();
    }, [fabScale]);
    const scrollY = useRef(new Animated.Value(0)).current;
    const clamped = useMemo(() => Animated.diffClamp(scrollY, 0, 80), [scrollY]);
    const fabTranslateY = useMemo(() => clamped.interpolate({ inputRange: [0, 80], outputRange: [0, 100] }), [clamped]);
    const onScroll = useMemo(() => Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true }), [scrollY]);
    const keyExtractor = useCallback((item) => item.id, []);
    const fullSwipeDelete = useCallback((tx) => remove(tx.id), [remove]);
    const renderItem = useCallback(({ item }) => (_jsx(TransactionItem, { tx: item, onPressTx: openOptions, onEditTx: startEdit, onDeleteTx: confirmDelete, onFullSwipeDeleteTx: fullSwipeDelete })), [openOptions, startEdit, confirmDelete, fullSwipeDelete]);
    // When navigation focuses this screen and there is no realtime subscription,
    // trigger a refresh (avoid dependency on refresh identity to prevent loops).
    const refreshRef = useRef(refresh);
    useEffect(() => { refreshRef.current = refresh; }, [refresh]);
    // Keep a stable onRefresh handler for FlatList to avoid rebind churn
    const onRefreshList = useCallback(() => refreshRef.current?.(), []);
    useFocusEffect(useCallback(() => {
        if (!supportsRealtime) {
            refreshRef.current?.();
        }
        return undefined;
    }, [supportsRealtime]));
    return (_jsxs(View, { style: styles.container, children: [_jsxs(View, { style: styles.header, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.hello, children: t('extract.hello') }), _jsx(Text, { style: styles.username, children: user?.name || t('extract.userFallback') })] }), _jsx(Avatar, { username: user?.name, size: 40, onPress: goUser })] }), _jsx(Input, { placeholder: t('extract.searchPlaceholder'), value: search, onChangeText: setSearch, accessibilityLabel: t('extract.searchAccessibility') }), loading ? (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(Skeleton, { height: 44, style: styles.loadingSkeletonTop }), Array.from({ length: 6 }).map((_, i) => (_jsx(Skeleton, { height: 52, style: styles.loadingSkeletonItem }, i)))] })) : transactions.length === 0 ? (_jsxs(View, { style: styles.emptyContainer, children: [_jsx(Text, { style: styles.emptyText, children: t('extract.empty') }), _jsx(Button, { title: t('extract.addTransaction'), onPress: goAddTx })] })) : (_jsx(Animated.FlatList, { data: transactions, keyExtractor: keyExtractor, renderItem: renderItem, initialNumToRender: 12, maxToRenderPerBatch: 12, windowSize: 10, removeClippedSubviews: true, refreshing: loading, onRefresh: onRefreshList, contentContainerStyle: styles.listContent, showsVerticalScrollIndicator: false, onScroll: onScroll })), _jsx(Animated.View, { style: [styles.fab, { transform: [{ scale: fabScale }, { translateY: fabTranslateY }] }], children: _jsx(Pressable, { onPressIn: fabIn, onPressOut: fabOut, onPress: goAddTx, accessibilityRole: "button", accessibilityLabel: t('extract.addTransactionAccessibility'), style: styles.fabPressable, children: _jsx(Text, { style: styles.fabText, children: "+" }) }) }), _jsx(Modal, { visible: !!editing, transparent: true, animationType: "fade", onRequestClose: closeEdit, children: _jsx(View, { style: styles.modalOverlay, children: _jsxs(View, { style: styles.modalCard, children: [_jsx(Text, { style: styles.modalTitle, children: t('extract.editTransaction') }), _jsx(Input, { label: t('extract.description'), value: desc, onChangeText: setDesc, placeholder: t('extract.description') }), _jsx(Input, { label: t('extract.categoryOptional'), value: category, onChangeText: setCategory, placeholder: t('extract.categoryOptional') }), _jsx(Input, { label: t('extract.valueBRL'), value: amountText, onChangeText: setAmountText, placeholder: "0,00", keyboardType: "decimal-pad" }), _jsxs(View, { style: styles.typeRow, children: [_jsx(TouchableOpacity, { onPress: () => setType('credit'), style: [styles.typeBtn, type === 'credit' ? styles.typeBtnActive : undefined], accessibilityRole: "button", accessibilityLabel: t('extract.credit'), children: _jsx(Text, { style: [styles.typeText, type === 'credit' ? styles.typeTextActive : undefined], children: t('extract.credit') }) }), _jsx(TouchableOpacity, { onPress: () => setType('debit'), style: [styles.typeBtn, { marginLeft: theme.spacing.sm }, type === 'debit' ? styles.typeBtnActive : undefined], accessibilityRole: "button", accessibilityLabel: t('extract.debit'), children: _jsx(Text, { style: [styles.typeText, type === 'debit' ? styles.typeTextActive : undefined], children: t('extract.debit') }) })] }), _jsxs(View, { style: styles.modalActions, children: [_jsx(Button, { title: t('extract.cancel'), onPress: closeEdit, style: styles.modalCancelBtn, textStyle: { color: theme.colors.text } }), _jsx(Button, { title: t('extract.save'), onPress: saveEdit, style: styles.modalSaveBtn })] })] }) }) })] }));
};
