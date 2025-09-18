import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../../store/authStore';
import { useFadeSlideInOnFocus } from '../../hooks/animations';
import { useTheme } from '../../theme/theme';
import { useI18n } from '../../i18n/I18nProvider';
import { makeRegisterStyles } from './RegisterScreen.styles';
export const RegisterScreen = ({ navigation }) => {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { animatedStyle } = useFadeSlideInOnFocus();
    const theme = useTheme();
    const styles = useMemo(() => makeRegisterStyles(theme), [theme]);
    const { t } = useI18n();
    const handleRegister = async () => {
        setError(null);
        if (!email || !password) {
            setError(t('auth.fillEmailPassword'));
            return;
        }
        if (password.length < 6) {
            setError(t('auth.passwordMin'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('auth.passwordMismatch'));
            return;
        }
        setLoading(true);
        try {
            await signUp({ email, password });
            // After sign up, user is considered authenticated by repo; stack will switch automatically.
        }
        catch (e) {
            setError(e?.message ?? t('auth.registerFailed'));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Animated.View, { style: [styles.container, animatedStyle], children: [_jsx(Image, { source: require('../../../../contents/figma/login/Ilustração cadastro-1.png'), style: styles.illustration }), _jsx(Text, { style: styles.title, children: t('auth.noAccount') }), _jsx(Text, { style: styles.subtitle, children: " " }), _jsx(Input, { placeholder: t('auth.email'), autoCapitalize: "none", keyboardType: "email-address", value: email, onChangeText: setEmail, accessibilityLabel: t('auth.email') }), _jsx(Input, { placeholder: t('auth.password'), secureTextEntry: true, showPasswordToggle: true, value: password, onChangeText: setPassword, accessibilityLabel: t('auth.password') }), _jsx(Input, { placeholder: t('auth.confirmPassword'), secureTextEntry: true, showPasswordToggle: true, value: confirmPassword, onChangeText: setConfirmPassword, accessibilityLabel: t('auth.confirmPassword'), errorText: error }), _jsx(Button, { title: loading ? t('common.loading') : t('auth.createAccount'), onPress: handleRegister }), _jsx(TouchableOpacity, { onPress: () => navigation?.goBack?.(), children: _jsx(Text, { style: styles.link, children: t('auth.signInWithEmail') }) })] }));
};
