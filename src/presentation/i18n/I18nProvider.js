import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pt } from './locales/pt';
import { en } from './locales/en';
import { es } from './locales/es';
const dictionaries = { pt, en, es };
const I18nContext = createContext(undefined);
function get(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
}
export const I18nProvider = ({ initialLang = 'pt', children }) => {
    const [lang, setLangState] = useState(initialLang);
    const dict = dictionaries[lang] || dictionaries.pt;
    // Persist language and auto-detect from device on first mount
    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem('i18n.lang');
                if (saved === 'pt' || saved === 'en' || saved === 'es') {
                    setLangState(saved);
                    return;
                }
            }
            catch { }
            const device = getDeviceLocale();
            const best = mapLocaleToLang(device);
            setLangState(best);
        })();
    }, []);
    const setLang = async (l) => {
        setLangState(l);
        try {
            await AsyncStorage.setItem('i18n.lang', l);
        }
        catch { }
    };
    const value = useMemo(() => ({ lang, setLang, t: (path) => get(dict, path) ?? path }), [lang, dict]);
    return _jsx(I18nContext.Provider, { value: value, children: children });
};
export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx)
        throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}
// Helpers
function getDeviceLocale() {
    try {
        if (Platform.OS === 'ios') {
            const settings = NativeModules?.SettingsManager?.settings;
            const locale = settings?.AppleLocale || (settings?.AppleLanguages && settings?.AppleLanguages[0]);
            if (typeof locale === 'string')
                return locale;
        }
        else {
            const locale = NativeModules?.I18nManager?.localeIdentifier;
            if (typeof locale === 'string')
                return locale;
        }
    }
    catch { }
    return 'en-US';
}
function mapLocaleToLang(locale) {
    const lc = (locale || '').toLowerCase();
    if (lc.startsWith('pt'))
        return 'pt';
    if (lc.startsWith('es'))
        return 'es';
    return 'en';
}
