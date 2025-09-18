import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Animated, } from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../../store/authStore";
import { useFadeSlideInOnFocus } from "../../hooks/animations";
import { AppConfig } from "../../../config/appConfig";
import { useTheme } from "../../theme/theme";
import { makeLoginStyles } from "./LoginScreen.styles";
import { useI18n } from "../../i18n/I18nProvider";
import { BrandLogo } from "../../components/BrandLogo";
export const LoginScreen = ({ navigation }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [providerLoading, setProviderLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const { animatedStyle } = useFadeSlideInOnFocus();
    const { t } = useI18n();
    const theme = useTheme();
    const styles = useMemo(() => makeLoginStyles(theme), [theme]);
    return (_jsxs(Animated.View, { style: [styles.container, animatedStyle], children: [_jsx(BrandLogo, {}), _jsx(Text, { style: styles.title, children: t("auth.welcome") }), _jsx(Text, { style: styles.subtitle, children: t("auth.continue") }), _jsx(View, { style: styles.spacerMd }), _jsx(Button, { title: t("auth.google"), loading: providerLoading, disabled: providerLoading || emailLoading, onPress: async () => {
                    setError(null);
                    try {
                        setProviderLoading(true);
                        await signIn("google");
                    }
                    catch (e) {
                        // Provide more specific error messages for Google authentication
                        let errorMessage = t("auth.googleLoginFailed");
                        if (e?.message?.includes("Client ID não configurado")) {
                            errorMessage = t("auth.notConfiguredFirebase");
                        }
                        else if (e?.message?.includes("cancelado")) {
                            errorMessage = t("auth.loginCancelled");
                        }
                        else if (e?.message?.toLowerCase?.().includes("network") ||
                            e?.message?.includes("Failed to fetch")) {
                            errorMessage = t("common.networkError");
                        }
                        else if (e?.message?.includes("hasPlayServices")) {
                            errorMessage = t("auth.playServicesMissing");
                        }
                        else if (e?.message?.includes("Token inválido")) {
                            errorMessage = t("auth.invalidToken");
                        }
                        else if (e?.message?.includes?.("Firebase config is missing")) {
                            errorMessage = t("auth.firebaseNotConfigured");
                        }
                        else if (e?.message) {
                            errorMessage = e.message;
                        }
                        setError(errorMessage);
                    }
                    finally {
                        setProviderLoading(false);
                    }
                } }), _jsx(View, { style: styles.spacerSm }), _jsx(View, { style: styles.spacerSm }), _jsx(View, { style: styles.spacerLg }), _jsx(Text, { style: styles.altTitle, children: t("auth.orUseEmail") }), _jsx(Input, { placeholder: t("auth.email"), autoCapitalize: "none", keyboardType: "email-address", value: email, onChangeText: setEmail, accessibilityLabel: t("auth.email") }), _jsx(Input, { placeholder: t("auth.password"), secureTextEntry: true, showPasswordToggle: true, value: password, onChangeText: setPassword, accessibilityLabel: t("auth.password"), errorText: error }), _jsx(Button, { title: t("auth.signInWithEmail"), loading: emailLoading, disabled: providerLoading || emailLoading, onPress: async () => {
                    setError(null);
                    const trimmedEmail = email.trim();
                    const trimmedPassword = password.trim();
                    if (!trimmedEmail || !trimmedPassword) {
                        setError(t("auth.fillEmailPassword"));
                        return;
                    }
                    try {
                        setEmailLoading(true);
                        await signIn("password", {
                            email: trimmedEmail,
                            password: trimmedPassword,
                        });
                    }
                    catch (e) {
                        setError(e?.message ?? t("auth.googleLoginFailed"));
                    }
                    finally {
                        setEmailLoading(false);
                    }
                } }), _jsx(TouchableOpacity, { onPress: () => navigation?.navigate?.("Register"), children: _jsx(Text, { style: styles.link, children: t("auth.noAccount") }) }), AppConfig.useMock && (_jsx(Text, { style: styles.hint, children: t("auth.mockHint") }))] }));
};
