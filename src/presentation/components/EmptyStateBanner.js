import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/theme';
export const EmptyStateBanner = ({ title, description, actionLabel, onAction, style }) => {
    const theme = useTheme();
    const styles = useMemo(() => ({
        container: {
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            alignItems: 'center',
        },
        title: { color: theme.colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' },
        desc: { color: theme.colors.muted, fontSize: 13, marginTop: 8, textAlign: 'center' },
        action: {
            marginTop: theme.spacing.md,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.sm,
            paddingHorizontal: 14,
            paddingVertical: 10,
        },
        actionText: { color: theme.colors.cardText, fontWeight: '700' },
    }), [theme]);
    return (_jsxs(View, { style: [styles.container, style], accessibilityRole: "summary", accessibilityLabel: title, children: [_jsx(Text, { style: styles.title, children: title }), !!description && _jsx(Text, { style: styles.desc, children: description }), !!actionLabel && !!onAction && (_jsx(TouchableOpacity, { onPress: onAction, style: styles.action, accessibilityRole: "button", accessibilityLabel: actionLabel, children: _jsx(Text, { style: styles.actionText, children: actionLabel }) }))] }));
};
