import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';
import { brandLogos } from '../theme/brandAssets';
import { getBrandLogoText } from '../../store/themeStore';
export const BrandLogo = ({ size = 96, style, brand, mode }) => {
    const theme = useTheme();
    const b = brand ?? theme.brand;
    const m = mode ?? theme.mode;
    const logo = brandLogos[b]?.[m];
    const styles = useMemo(() => StyleSheet.create({
        text: { fontSize: Math.round(size / 3), fontWeight: '800', color: theme.colors.primary, fontFamily: theme.fonts.bold },
        img: { width: size, height: size, resizeMode: 'contain' },
    }), [theme, size]);
    return (_jsx(View, { children: logo ? _jsx(Image, { source: logo, style: [styles.img, style] }) : _jsx(Text, { style: styles.text, children: getBrandLogoText(b) }) }));
};
