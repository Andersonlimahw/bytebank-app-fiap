import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, } from "react-native";
import { useI18n } from "../../i18n/I18nProvider";
import { useTheme } from "../../theme/theme";
import { makeDigitalCardsStyles } from "./DigitalCardsScreen.styles";
import { CardVisual, deriveBrandFromNumber, } from "../../components/DigitalCard";
import { useDigitalCardsViewModel } from "../../viewmodels/useDigitalCardsViewModel";
import { EmptyStateBanner } from "../../components/EmptyStateBanner";
export const DigitalCardsScreen = () => {
    const { t } = useI18n();
    const theme = useTheme();
    const styles = useMemo(() => makeDigitalCardsStyles(theme), [theme]);
    const { cards, loading, refresh, addCard, updateCard, removeCard, user } = useDigitalCardsViewModel();
    const [formVisible, setFormVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [holderName, setHolderName] = useState("");
    const [number, setNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [expiry, setExpiry] = useState("");
    const [brand, setBrand] = useState("bytebank");
    const [nickname, setNickname] = useState("");
    const openNew = () => {
        setEditingId(null);
        setHolderName((user?.name || "").toUpperCase());
        setNumber("");
        setCvv("");
        setExpiry("");
        setBrand("bytebank");
        setNickname("");
        setFormVisible(true);
    };
    const openEdit = (id) => {
        const c = cards.find((x) => x.id === id);
        if (!c)
            return;
        setEditingId(id);
        setHolderName(c.holderName);
        setNumber(c.number);
        setCvv(c.cvv);
        setExpiry(c.expiry);
        setBrand(c.brand || "other");
        setNickname(c.nickname || "");
        setFormVisible(true);
    };
    const formatNumber = useCallback((val) => {
        const digits = (val || "").replace(/\D/g, "").slice(0, 19);
        const groups = digits.match(/.{1,4}/g) || [];
        return groups.join(" ");
    }, []);
    const formatExpiry = useCallback((val) => {
        const digits = (val || "").replace(/\D/g, "").slice(0, 4);
        if (digits.length <= 2)
            return digits;
        const mm = digits.slice(0, 2);
        const yy = digits.slice(2);
        return `${mm}/${yy}`;
    }, []);
    const onChangeName = useCallback((v) => setHolderName(v.toUpperCase()), []);
    const onChangeNumber = useCallback((v) => {
        const formatted = formatNumber(v);
        setNumber(formatted);
        const derived = deriveBrandFromNumber(formatted);
        if (derived)
            setBrand(derived);
    }, [formatNumber]);
    const onChangeExpiry = useCallback((v) => setExpiry(formatExpiry(v)), [formatExpiry]);
    const onChangeCvv = useCallback((v) => setCvv((v || "").replace(/\D/g, "").slice(0, 4)), []);
    const isValidExpiry = useCallback((v) => {
        const m = /^(\d{2})\/(\d{2})$/.exec(v);
        if (!m)
            return false;
        const mm = Number(m[1]);
        return mm >= 1 && mm <= 12;
    }, []);
    const luhnValid = useCallback((v) => {
        const digits = (v || "").replace(/\D/g, "");
        if (digits.length < 13 || digits.length > 19)
            return false;
        let sum = 0;
        let alt = false;
        for (let i = digits.length - 1; i >= 0; i--) {
            let n = parseInt(digits[i], 10);
            if (alt) {
                n *= 2;
                if (n > 9)
                    n -= 9;
            }
            sum += n;
            alt = !alt;
        }
        return sum % 10 === 0;
    }, []);
    const validCvv = useCallback((b, v) => {
        const d = (v || "").replace(/\D/g, "");
        if (b === "amex")
            return d.length === 4; // Amex uses 4
        return d.length === 3; // Most others use 3
    }, [brand]);
    const onSave = async () => {
        if (!user)
            return;
        if (!holderName || !number || !cvv || !expiry || !isValidExpiry(expiry)) {
            Alert.alert(t("common.errorTitle"), t("transactions.errorFillDescAndValidValue"));
            return;
        }
        if (!luhnValid(number)) {
            Alert.alert(t("common.errorTitle"), t("cards.errors.invalidNumber"));
            return;
        }
        if (!validCvv(brand, cvv)) {
            Alert.alert(t("common.errorTitle"), t("cards.errors.invalidCVV"));
            return;
        }
        const payload = {
            userId: user.id,
            holderName: holderName.trim(),
            number: number.replace(/\s/g, ""),
            cvv: cvv.trim(),
            expiry: expiry.trim(),
            brand,
            nickname: nickname || undefined,
        };
        try {
            if (editingId)
                await updateCard(editingId, payload);
            else
                await addCard(payload);
            setFormVisible(false);
        }
        catch (e) {
            Alert.alert(t("common.errorTitle"), String(e?.message || e));
        }
    };
    const onRemove = async (id) => {
        Alert.alert(t("common.delete"), t("extract.deleteConfirmMessage"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.delete"),
                style: "destructive",
                onPress: async () => {
                    await removeCard(id);
                },
            },
        ]);
    };
    return (_jsxs(View, { style: styles.container, children: [_jsx(FlatList, { data: cards, refreshing: loading, onRefresh: refresh, keyExtractor: (item) => item.id, contentContainerStyle: styles.list, ListEmptyComponent: _jsx(EmptyStateBanner, { title: t("cards.empty.title"), description: t("cards.empty.description"), actionLabel: t("cards.empty.action"), onAction: openNew, style: { marginTop: 24 } }), renderItem: ({ item }) => (_jsxs(View, { style: styles.cardItem, children: [_jsx(CardVisual, { card: item }), _jsxs(View, { style: styles.editRemoveRow, children: [_jsx(TouchableOpacity, { onPress: () => openEdit(item.id), children: _jsx(Text, { style: styles.smallLink, children: t("common.edit") }) }), _jsx(TouchableOpacity, { onPress: () => onRemove(item.id), children: _jsx(Text, { style: [styles.smallLink, { color: theme.colors.danger }], children: t("common.delete") }) })] })] })) }), _jsx(TouchableOpacity, { style: styles.fab, onPress: openNew, accessibilityRole: "button", accessibilityLabel: t("common.add"), children: _jsx(Text, { style: styles.fabText, children: "+" }) }), _jsx(Modal, { animationType: "slide", transparent: true, visible: formVisible, onRequestClose: () => setFormVisible(false), children: _jsxs(View, { style: styles.form, children: [_jsx(Text, { style: [styles.title, { fontWeight: "700", marginBottom: 8 }], children: editingId ? t("cards.form.titleEdit") : t("cards.form.titleAdd") }), _jsx(Text, { style: styles.label, children: t("cards.form.nickname") }), _jsx(TextInput, { value: nickname, onChangeText: setNickname, placeholder: t("cards.form.nicknamePlaceholder"), placeholderTextColor: theme.colors.muted, style: styles.input, autoCapitalize: "words" }), _jsx(Text, { style: styles.label, children: t("cards.form.holderName") }), _jsx(TextInput, { value: holderName, onChangeText: onChangeName, placeholder: t("cards.form.holderNamePlaceholder"), placeholderTextColor: theme.colors.muted, style: styles.input, autoCapitalize: "characters" }), _jsx(Text, { style: styles.label, children: t("cards.form.number") }), _jsx(TextInput, { value: number, onChangeText: onChangeNumber, placeholder: t("cards.form.numberPlaceholder"), placeholderTextColor: theme.colors.muted, style: styles.input, keyboardType: "number-pad" }), _jsx(Text, { style: styles.label, children: t("cards.form.expiry") }), _jsx(TextInput, { value: expiry, onChangeText: onChangeExpiry, placeholder: t("cards.form.expiryPlaceholder"), placeholderTextColor: theme.colors.muted, style: styles.input, keyboardType: "number-pad" }), _jsx(Text, { style: styles.label, children: t("cards.form.cvv") }), _jsx(TextInput, { value: cvv, onChangeText: onChangeCvv, placeholder: t("cards.form.cvvPlaceholder"), placeholderTextColor: theme.colors.muted, style: styles.input, keyboardType: "number-pad", secureTextEntry: true }), _jsx(Text, { style: styles.label, children: t("cards.form.brand") }), _jsx(View, { style: styles.row, children: [
                                "bytebank",
                                "nubank",
                                "oyapal",
                                "visa",
                                "mastercard",
                                "amex",
                                "elo",
                                "hipercard",
                                "other",
                            ].map((b) => (_jsx(TouchableOpacity, { onPress: () => setBrand(b), style: [
                                    styles.btn,
                                    styles.btnCancel,
                                    {
                                        marginRight: 8,
                                        borderColor: brand === b ? theme.colors.primary : theme.colors.border,
                                    },
                                ], accessibilityRole: "button", accessibilityLabel: `${t("cards.form.brand")} ${b}`, children: _jsx(Text, { style: [
                                        styles.btnText,
                                        {
                                            color: brand === b ? theme.colors.primary : theme.colors.text,
                                        },
                                    ], children: b }) }, b))) }), _jsxs(View, { style: styles.actions, children: [_jsx(TouchableOpacity, { onPress: () => setFormVisible(false), style: [styles.btn, styles.btnCancel], children: _jsx(Text, { style: [styles.btnText, { color: theme.colors.text }], children: t("cards.form.cancel") }) }), _jsx(TouchableOpacity, { onPress: onSave, style: [styles.btn, styles.btnSave], children: _jsx(Text, { style: styles.btnText, children: t("cards.form.save") }) })] })] }) })] }));
};
