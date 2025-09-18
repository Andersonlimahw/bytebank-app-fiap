import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../config/appConfig';
const brandPalettes = {
    bytebank: {
        light: {
            primary: '#4F46E5',
            background: '#ffffff',
            text: '#111827',
            muted: '#6b7280',
            border: '#e5e7eb',
            card: '#111827',
            cardText: '#ffffff',
            surface: '#F3F4F6',
            success: '#16a34a',
            danger: '#dc2626',
            accent: '#A78BFA',
        },
        dark: {
            primary: '#818CF8',
            background: '#0B1020',
            text: '#E5E7EB',
            muted: '#9CA3AF',
            border: '#1F2937',
            card: '#111827',
            cardText: '#F9FAFB',
            surface: '#0F172A',
            success: '#22C55E',
            danger: '#EF4444',
            accent: '#C4B5FD',
        },
        logoText: 'ByteBank',
    },
    heliobank: {
        light: {
            primary: '#0EA5E9',
            background: '#ffffff',
            text: '#0F172A',
            muted: '#64748B',
            border: '#E2E8F0',
            card: '#0F172A',
            cardText: '#ffffff',
            surface: '#F1F5F9',
            success: '#10B981',
            danger: '#F43F5E',
            accent: '#22D3EE',
        },
        dark: {
            primary: '#38BDF8',
            background: '#0B1220',
            text: '#E2E8F0',
            muted: '#94A3B8',
            border: '#172036',
            card: '#0F172A',
            cardText: '#F8FAFC',
            surface: '#0B1324',
            success: '#34D399',
            danger: '#FB7185',
            accent: '#67E8F9',
        },
        fonts: Platform.select({
            ios: { regular: 'System', medium: 'System', bold: 'System' },
            android: { regular: 'Roboto', medium: 'Roboto-Medium', bold: 'Roboto-Bold' },
            default: { regular: 'System', medium: 'System', bold: 'System' },
        }),
        logoText: 'HelioBank',
    },
};
export function getAvailableBrands() {
    return Object.keys(brandPalettes);
}
export function getBrandLogoText(brand) {
    return brandPalettes[brand]?.logoText || 'App';
}
function buildTheme(brand, mode) {
    const palette = brandPalettes[brand][mode];
    const defaultFonts = Platform.select({
        ios: { regular: 'System', medium: 'System', bold: 'System' },
        android: { regular: 'Roboto', medium: 'Roboto-Medium', bold: 'Roboto-Bold' },
        default: { regular: 'System', medium: 'System', bold: 'System' },
    });
    const fonts = { ...defaultFonts, ...(brandPalettes[brand].fonts || {}) };
    const logoText = brandPalettes[brand].logoText || 'App';
    return {
        brand,
        mode,
        colors: palette,
        radius: { sm: 8, md: 12, lg: 20 },
        spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
        text: { h1: 24, h2: 20, body: 14 },
        fonts,
        logoText,
    };
}
export const useThemeStore = create()(devtools(persist((set, get) => ({
    brand: AppConfig?.appearance?.brand || 'bytebank',
    mode: AppConfig?.appearance?.mode || 'light',
    setBrand: (brand) => set({ brand }),
    setMode: (mode) => set({ mode }),
    toggleMode: () => set({ mode: get().mode === 'light' ? 'dark' : 'light' }),
}), {
    name: 'bb_theme',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({ brand: state.brand, mode: state.mode }),
})));
export function useTheme() {
    const brand = useThemeStore((s) => s.brand);
    const mode = useThemeStore((s) => s.mode);
    return buildTheme(brand, mode);
}
export function useThemeActions() {
    const setBrand = useThemeStore((s) => s.setBrand);
    const setMode = useThemeStore((s) => s.setMode);
    const toggleMode = useThemeStore((s) => s.toggleMode);
    return { setBrand, setMode, toggleMode };
}
export function getNavigationTheme(theme) {
    return {
        dark: theme.mode === 'dark',
        colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.accent,
        },
    };
}
