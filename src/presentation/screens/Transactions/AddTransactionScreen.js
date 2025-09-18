import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/theme';
import { makeAddTransactionStyles } from './AddTransactionScreen.styles';
import { TOKENS } from '../../../core/di/container';
import { useDI } from '../../../store/diStore';
import { useAuth } from '../../../store/authStore';
import { useI18n } from '../../i18n/I18nProvider';
export const AddTransactionScreen = ({ navigation }) => {
    const di = useDI();
    const repo = useMemo(() => di.resolve(TOKENS.TransactionRepository), [di]);
    const { user } = useAuth();
    const theme = useTheme();
    const styles = useMemo(() => makeAddTransactionStyles(theme), [theme]);
    const { t } = useI18n();
    const [desc, setDesc] = useState('');
    const [amountText, setAmountText] = useState('');
    const [type, setType] = useState('debit');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const save = async () => {
        setError(null);
        if (!user)
            return;
        const normalized = amountText.replace(/\./g, '').replace(',', '.');
        const num = Number(normalized);
        if (!desc.trim() || isNaN(num)) {
            setError(t('transactions.errorFillDescAndValidValue'));
            return;
        }
        const cents = Math.round(num * 100);
        setLoading(true);
        try {
            await repo.add({
                userId: user.id,
                description: desc.trim(),
                type,
                amount: cents,
                category: category.trim() || undefined,
            });
            navigation?.goBack?.();
        }
        catch (e) {
            Alert.alert(t('common.errorTitle') || 'Erro', e?.message ?? t('common.update'));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(View, { style: styles.container, children: [_jsx(Text, { style: styles.title, children: t('transactions.title') }), _jsx(Input, { label: t('transactions.description'), value: desc, onChangeText: setDesc, placeholder: t('transactions.description') }), _jsx(Input, { label: t('transactions.categoryOptional'), value: category, onChangeText: setCategory, placeholder: t('transactions.categoryOptional') }), _jsx(Input, { label: t('transactions.valueBRL'), value: amountText, onChangeText: setAmountText, placeholder: "0,00", keyboardType: "decimal-pad", errorText: error }), _jsxs(View, { style: styles.typeRow, children: [_jsx(TouchableOpacity, { onPress: () => setType('credit'), style: [styles.typeBtn, type === 'credit' ? styles.typeBtnActive : undefined], accessibilityRole: "button", accessibilityLabel: t('transactions.credit'), children: _jsx(Text, { style: [styles.typeText, type === 'credit' ? styles.typeTextActive : undefined], children: t('transactions.credit') }) }), _jsx(TouchableOpacity, { onPress: () => setType('debit'), style: [styles.typeBtn, styles.typeBtnSpacer, type === 'debit' ? styles.typeBtnActive : undefined], accessibilityRole: "button", accessibilityLabel: t('transactions.debit'), children: _jsx(Text, { style: [styles.typeText, type === 'debit' ? styles.typeTextActive : undefined], children: t('transactions.debit') }) })] }), _jsx(Button, { title: t('transactions.save'), loading: loading, disabled: loading, onPress: save })] }));
};
