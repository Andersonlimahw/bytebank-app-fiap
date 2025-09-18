import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandLogo } from './BrandLogo';
import { useTheme, useThemeActions } from '../theme/theme';
import { getAvailableBrands } from '../theme/theme';
import { useI18n } from '../i18n/I18nProvider';
export const BrandSelector = ({ compact = false }) => {
    const theme = useTheme();
    const { setBrand } = useThemeActions();
    const brands = useMemo(() => getAvailableBrands(), []);
    const { t } = useI18n();
    const styles = useMemo(() => StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'center' },
        chip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.sm,
            backgroundColor: theme.colors.surface,
        },
        chipActive: { borderColor: theme.colors.primary },
        chipText: { marginLeft: 8, color: theme.colors.text, fontFamily: theme.fonts.medium },
        spacer: { width: 12 },
    }), [theme]);
    const displayName = (id) => {
        // Prefer theme-specific logoText when active brand, otherwise title-case id
        if (id === theme.brand)
            return theme.logoText;
        return id.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase());
    };
    return (_jsx(View, { style: styles.row, children: brands.map((b, i) => (_jsxs(React.Fragment, { children: [_jsxs(TouchableOpacity, { onPress: () => setBrand(b), style: [styles.chip, b === theme.brand && styles.chipActive], accessibilityRole: "button", accessibilityLabel: `${t('common.selectBrand')}: ${b}`, children: [_jsx(BrandLogo, { size: compact ? 20 : 28, brand: b, mode: theme.mode }), !compact && _jsx(Text, { style: styles.chipText, children: displayName(b) })] }), i < brands.length - 1 && _jsx(View, { style: styles.spacer })] }, b))) }));
};
