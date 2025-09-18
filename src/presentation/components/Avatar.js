import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Image, Text, View, TouchableOpacity, StyleSheet, } from "react-native";
import { useTheme } from "../theme/theme";
import { useI18n } from "../i18n/I18nProvider";
export const Avatar = ({ username, source = require("../../../public/assets/images/icons/Avatar.png"), size = 40, showName = false, onPress, style, }) => {
    const theme = useTheme();
    const { t } = useI18n();
    const styles = useMemo(() => StyleSheet.create({
        container: { flexDirection: "row", alignItems: "center" },
        avatar: {
            backgroundColor: theme.colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
        },
        username: {
            marginLeft: 8,
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.text,
            fontFamily: theme.fonts.medium,
        },
    }), [theme]);
    const Container = onPress ? TouchableOpacity : View;
    return (_jsxs(Container, { onPress: onPress, accessibilityRole: onPress ? "button" : undefined, style: [styles.container, style], children: [_jsx(Image, { source: source, style: [
                    styles.avatar,
                    { width: size, height: size, borderRadius: size / 2 },
                ] }), showName ? (_jsx(Text, { style: styles.username, numberOfLines: 1, children: username || t("user.userFallback") })) : null] }));
};
