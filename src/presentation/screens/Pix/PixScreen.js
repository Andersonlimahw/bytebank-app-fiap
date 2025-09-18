import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Alert, Share } from 'react-native';
import { useTheme } from '../../theme/theme';
import { makePixStyles } from './PixScreen.styles';
import { usePixViewModel } from '../../viewmodels/usePixViewModel';
import { formatCurrency } from '../../../utils/format';
import { useI18n } from '../../i18n/I18nProvider';
export const PixScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => makePixStyles(theme), [theme]);
    const { t } = useI18n();
    const { loading, error, keys, favorites, transfers, limits, sendByKey, payQr, createQr, addKey, removeKey, addFav, removeFav, updateLimits, refresh, } = usePixViewModel();
    const [section, setSection] = useState('send');
    const [send, setSend] = useState({ key: '', amount: '', desc: '' });
    const [qrInput, setQrInput] = useState('');
    const [receive, setReceive] = useState({ amount: '', desc: '', generated: '' });
    const [newFav, setNewFav] = useState({ alias: '', key: '', name: '' });
    const [newKey, setNewKey] = useState({ type: 'random' });
    const [limitsEdit, setLimitsEdit] = useState({});
    const loadingText = useMemo(() => (loading ? t('pix.loading') : ''), [loading, t]);
    const handleSend = async () => {
        const amountCents = Math.round(parseFloat((send.amount || '0').replace(',', '.')) * 100);
        if (!send.key || !amountCents)
            return Alert.alert(t('pix.alert.invalidDataTitle'), t('pix.alert.enterKeyAndAmount'));
        try {
            await sendByKey(send.key.trim(), amountCents, send.desc || undefined);
            setSend({ key: '', amount: '', desc: '' });
            Alert.alert(t('pix.alert.pixSentTitle'), t('pix.alert.pixSentMessage'));
        }
        catch (e) {
            Alert.alert(t('pix.alert.pixErrorTitle'), e?.message || t('pix.alert.pixErrorMessage'));
        }
    };
    const handlePayQr = async () => {
        if (!qrInput)
            return Alert.alert(t('pix.alert.enterQrTitle'), t('pix.alert.enterQrMessage'));
        try {
            await payQr(qrInput.trim());
            setQrInput('');
            Alert.alert(t('pix.alert.pixPaidTitle'), t('pix.alert.pixPaidMessage'));
        }
        catch (e) {
            Alert.alert(t('pix.alert.pixPayErrorTitle'), e?.message || t('pix.alert.pixPayErrorMessage'));
        }
    };
    const handleGenerateQr = async () => {
        const amountCents = receive.amount ? Math.round(parseFloat(receive.amount.replace(',', '.')) * 100) : undefined;
        const { qr } = await createQr(amountCents, receive.desc || undefined);
        setReceive((s) => ({ ...s, generated: qr }));
    };
    const applyLimits = async () => {
        const daily = limitsEdit.daily ? Math.round(parseFloat(limitsEdit.daily.replace(',', '.')) * 100) : undefined;
        const nightly = limitsEdit.nightly ? Math.round(parseFloat(limitsEdit.nightly.replace(',', '.')) * 100) : undefined;
        const per = limitsEdit.per ? Math.round(parseFloat(limitsEdit.per.replace(',', '.')) * 100) : undefined;
        try {
            await updateLimits({
                dailyLimitCents: daily,
                nightlyLimitCents: nightly,
                perTransferLimitCents: per,
            });
            setLimitsEdit({});
            Alert.alert(t('pix.alert.limitsUpdated'));
        }
        catch (e) {
            Alert.alert(t('pix.alert.errorTitle'), e?.message || t('pix.alert.limitsUpdateError'));
        }
    };
    return (_jsxs(ScrollView, { style: styles.container, contentContainerStyle: styles.content, children: [_jsx(Text, { style: styles.sectionTitle, children: t('pix.actionsTitle') }), _jsx(TouchableOpacity, { onPress: refresh, style: { alignSelf: 'flex-start', marginBottom: 8 }, children: _jsx(Text, { style: styles.meta, children: t('pix.refresh') }) }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.actionsRow, children: [
                    ['send', t('pix.tabs.send')],
                    ['payqr', t('pix.tabs.payqr')],
                    ['receive', t('pix.tabs.receive')],
                    ['keys', t('pix.tabs.keys')],
                    ['favorites', t('pix.tabs.favorites')],
                    ['history', t('pix.tabs.history')],
                    ['limits', t('pix.tabs.limits')],
                ].map(([id, label], idx) => (_jsx(TouchableOpacity, { style: [styles.action, idx > 0 && styles.actionGap, section === id && { borderWidth: 2, borderColor: theme.colors.primary }], onPress: () => setSection(id), accessibilityRole: "button", accessibilityLabel: label, children: _jsx(Text, { style: styles.actionLabel, children: label }) }, id))) }), !!error && (_jsx(View, { style: [styles.card, { borderColor: theme.colors.danger, backgroundColor: theme.colors.surface }], children: _jsx(Text, { style: { color: theme.colors.danger }, children: error }) })), section === 'send' && (_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: { fontWeight: '600' }, children: t('pix.sendByKey') }), _jsx(TextInput, { placeholder: t('pix.keyPlaceholder'), value: send.key, onChangeText: (t) => setSend((s) => ({ ...s, key: t })), style: styles.input, autoCapitalize: "none" }), _jsx(TextInput, { placeholder: t('pix.amountPlaceholder'), value: send.amount, onChangeText: (t) => setSend((s) => ({ ...s, amount: t })), style: styles.input, keyboardType: "decimal-pad" }), _jsx(TextInput, { placeholder: t('pix.descOptional'), value: send.desc, onChangeText: (t) => setSend((s) => ({ ...s, desc: t })), style: styles.input }), _jsx(TouchableOpacity, { style: styles.btn, onPress: handleSend, accessibilityRole: "button", children: _jsx(Text, { style: styles.btnText, children: t('pix.sendPix') }) }), !!loadingText && _jsx(Text, { style: styles.meta, children: loadingText })] })), section === 'payqr' && (_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: { fontWeight: '600' }, children: t('pix.payQrTitle') }), _jsx(Text, { style: styles.meta, children: t('pix.pasteQrContent') }), _jsx(TextInput, { placeholder: t('pix.qrInputPlaceholder'), value: qrInput, onChangeText: setQrInput, style: [styles.input, { height: 100 }], multiline: true }), _jsx(TouchableOpacity, { style: styles.btn, onPress: handlePayQr, accessibilityRole: "button", children: _jsx(Text, { style: styles.btnText, children: t('pix.pay') }) }), !!loadingText && _jsx(Text, { style: styles.meta, children: loadingText })] })), section === 'receive' && (_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: { fontWeight: '600' }, children: t('pix.receiveByQr') }), _jsx(TextInput, { placeholder: t('pix.valueOptional'), value: receive.amount, onChangeText: (t) => setReceive((s) => ({ ...s, amount: t })), style: styles.input, keyboardType: "decimal-pad" }), _jsx(TextInput, { placeholder: t('pix.descOptional'), value: receive.desc, onChangeText: (t) => setReceive((s) => ({ ...s, desc: t })), style: styles.input }), _jsx(TouchableOpacity, { style: styles.btn, onPress: handleGenerateQr, accessibilityRole: "button", children: _jsx(Text, { style: styles.btnText, children: t('pix.generateQr') }) }), !!receive.generated && (_jsxs(View, { style: styles.qrBox, children: [_jsx(Text, { selectable: true, children: t('pix.generatedPayload') }), _jsx(Text, { selectable: true, children: receive.generated }), _jsx(TouchableOpacity, { style: [styles.btn, { marginTop: 12 }], onPress: async () => {
                                    try {
                                        await Share.share({ message: receive.generated });
                                    }
                                    catch { }
                                }, children: _jsx(Text, { style: styles.btnText, children: t('pix.share') }) })] }))] })), section === 'keys' && (_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: { fontWeight: '600', marginBottom: 8 }, children: t('pix.keysTitle') }), _jsxs(View, { children: [(keys || []).map((k) => (_jsxs(View, { style: styles.listItem, children: [_jsxs(Text, { children: [t(`pix.type.${k.type}`), " \u2022 ", k.value] }), _jsx(View, { style: [styles.row, { marginTop: 6 }], children: _jsx(TouchableOpacity, { style: styles.smallBtn, onPress: async () => { try {
                                                await removeKey(k.id);
                                            }
                                            catch (e) {
                                                Alert.alert(t('pix.alert.errorTitle'), e?.message || t('pix.alert.errorRemovingKey'));
                                            } }, children: _jsx(Text, { style: styles.smallBtnText, children: t('pix.remove') }) }) })] }, k.id))), (!keys || keys.length === 0) && _jsx(Text, { style: styles.meta, children: t('pix.noKeysYet') })] }), _jsx(Text, { style: { fontWeight: '600', marginTop: 12 }, children: t('pix.addKeyTitle') }), _jsx(View, { style: [styles.row, { marginTop: 8, flexWrap: 'wrap' }], children: ['email', 'phone', 'cpf', 'random'].map((typeId) => (_jsx(TouchableOpacity, { style: [styles.smallBtn, { marginRight: 8, marginBottom: 8 }], onPress: () => setNewKey({ type: typeId }), children: _jsxs(Text, { style: styles.smallBtnText, children: [newKey.type === typeId ? '• ' : '', t(`pix.type.${typeId}`)] }) }, typeId))) }), newKey.type !== 'random' && (_jsx(TextInput, { placeholder: newKey.type === 'email' ? t('pix.placeholders.emailExample') : newKey.type === 'phone' ? t('pix.placeholders.phoneExample') : t('pix.placeholders.cpfExample'), value: newKey.value, onChangeText: (t) => setNewKey((s) => ({ ...s, value: t })), style: styles.input, autoCapitalize: newKey.type === 'email' ? 'none' : 'none', keyboardType: newKey.type === 'phone' || newKey.type === 'cpf' ? 'number-pad' : 'email-address' })), _jsx(TouchableOpacity, { style: styles.btn, onPress: async () => {
                            try {
                                await addKey(newKey.type, newKey.value);
                                setNewKey({ type: 'random', value: undefined });
                            }
                            catch (e) {
                                Alert.alert(t('pix.alert.errorTitle'), e?.message || t('pix.alert.errorAddingKey'));
                            }
                        }, accessibilityRole: "button", children: _jsxs(Text, { style: styles.btnText, children: [t('pix.addKeyButton'), " ", t(`pix.type.${newKey.type}`)] }) })] })), section === 'favorites' && (_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: { fontWeight: '600' }, children: t('pix.favoritesTitle') }), _jsxs(View, { style: { marginTop: 8 }, children: [(favorites || []).map((f) => (_jsxs(View, { style: styles.listItem, children: [_jsxs(Text, { children: [f.alias, " \u2022 ", f.keyValue] }), _jsx(View, { style: [styles.row, { marginTop: 6 }], children: _jsx(TouchableOpacity, { style: styles.smallBtn, onPress: async () => { try {
                                                await removeFav(f.id);
                                            }
                                            catch (e) {
                                                Alert.alert(t('pix.alert.errorTitle'), e?.message || t('pix.alert.errorRemovingFavorite'));
                                            } }, children: _jsx(Text, { style: styles.smallBtnText, children: t('pix.remove') }) }) })] }, f.id))), (!favorites || favorites.length === 0) && _jsx(Text, { style: styles.meta, children: t('pix.noFavoritesYet') })] }), _jsx(Text, { style: { fontWeight: '600', marginTop: 12 }, children: t('pix.addFavoriteTitle') }), _jsx(TextInput, { placeholder: t('pix.alias'), value: newFav.alias, onChangeText: (t) => setNewFav((s) => ({ ...s, alias: t })), style: styles.input }), _jsx(TextInput, { placeholder: t('pix.pixKey'), value: newFav.key, onChangeText: (t) => setNewFav((s) => ({ ...s, key: t })), style: styles.input, autoCapitalize: "none" }), _jsx(TextInput, { placeholder: t('pix.nameOptional'), value: newFav.name, onChangeText: (t) => setNewFav((s) => ({ ...s, name: t })), style: styles.input }), _jsx(TouchableOpacity, { style: styles.btn, onPress: async () => { if (!newFav.alias || !newFav.key)
                            return; try {
                            await addFav(newFav.alias, newFav.key, newFav.name || undefined);
                            setNewFav({ alias: '', key: '', name: '' });
                        }
                        catch (e) {
                            Alert.alert(t('pix.alert.errorTitle'), e?.message || t('pix.alert.errorAddingFavorite'));
                        } }, children: _jsx(Text, { style: styles.btnText, children: t('common.add') }) })] })), section === 'history' && (_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: { fontWeight: '600' }, children: t('pix.tabs.history') }), _jsx(FlatList, { data: transfers, keyExtractor: (i) => i.id, scrollEnabled: false, renderItem: ({ item }) => (_jsxs(View, { style: styles.listItem, children: [_jsxs(Text, { children: [item.method === 'qr' ? t('pix.viaQr') : t('pix.viaKey'), " \u2022 ", formatCurrency(item.amount), " \u2022 ", item.status] }), _jsx(Text, { style: styles.meta, children: item.description || item.toKey })] })) }), !!loadingText && _jsx(Text, { style: styles.meta, children: loadingText })] })), section === 'limits' && (_jsxs(View, { style: styles.card, children: [_jsx(Text, { style: { fontWeight: '600' }, children: t('pix.limitsTitle') }), _jsxs(Text, { style: { marginTop: 6 }, children: [t('pix.currentDaily'), ": ", limits ? formatCurrency(limits.dailyLimitCents) : '-'] }), _jsxs(Text, { children: [t('pix.currentNightly'), ": ", limits ? formatCurrency(limits.nightlyLimitCents) : '-'] }), _jsxs(Text, { children: [t('pix.currentPerTransfer'), ": ", limits ? formatCurrency(limits.perTransferLimitCents) : '-'] }), _jsx(TextInput, { placeholder: t('pix.newDailyLimit'), value: limitsEdit.daily, onChangeText: (t) => setLimitsEdit((s) => ({ ...s, daily: t })), style: styles.input, keyboardType: "decimal-pad" }), _jsx(TextInput, { placeholder: t('pix.newNightlyLimit'), value: limitsEdit.nightly, onChangeText: (t) => setLimitsEdit((s) => ({ ...s, nightly: t })), style: styles.input, keyboardType: "decimal-pad" }), _jsx(TextInput, { placeholder: t('pix.newPerTransferLimit'), value: limitsEdit.per, onChangeText: (t) => setLimitsEdit((s) => ({ ...s, per: t })), style: styles.input, keyboardType: "decimal-pad" }), _jsx(TouchableOpacity, { style: styles.btn, onPress: applyLimits, children: _jsx(Text, { style: styles.btnText, children: t('pix.updateLimits') }) })] })), _jsx(View, { style: { height: 24 } })] }));
};
