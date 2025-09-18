import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useI18n } from '../../i18n/I18nProvider';
export const HorizontalBarChart = ({ data, total, formatValue, testID }) => {
    const theme = useTheme();
    const { t } = useI18n();
    const sum = useMemo(() => (typeof total === 'number' ? total : data.reduce((s, d) => s + d.value, 0)), [data, total]);
    const colors = useMemo(() => buildPalette(theme), [theme]);
    if (!data || data.length === 0 || sum <= 0) {
        return (_jsx(View, { style: [styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }], testID: testID, children: _jsx(Text, { style: [styles.noData, { color: theme.colors.muted }], children: t('charts.noData') }) }));
    }
    return (_jsx(View, { style: [styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }], testID: testID, children: data.map((d, idx) => {
            const pct = sum > 0 ? Math.max(0, Math.min(100, (d.value / sum) * 100)) : 0;
            const barColor = colors[idx % colors.length];
            return (_jsxs(View, { style: styles.row, children: [_jsxs(View, { style: styles.rowHeader, children: [_jsx(Text, { style: [styles.label, { color: theme.colors.text }], numberOfLines: 1, children: d.label }), _jsx(Text, { style: [styles.value, { color: theme.colors.muted }], children: formatValue ? formatValue(d.value) : String(d.value) })] }), _jsx(View, { style: [styles.track, { backgroundColor: theme.colors.border }], accessibilityRole: "progressbar", accessibilityValue: { now: Math.round(pct), min: 0, max: 100 }, children: _jsx(View, { style: [styles.fill, { width: `${pct}%`, backgroundColor: barColor }] }) })] }, `${d.label}-${idx}`));
        }) }));
};
function buildPalette(theme) {
    // A simple, high-contrast palette leveraging theme
    const c = theme.colors;
    return [c.primary, c.accent, c.success, c.danger, c.text, '#8B5CF6', '#14B8A6', '#F59E0B'];
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 12,
        padding: 12,
        borderWidth: StyleSheet.hairlineWidth,
    },
    row: { marginBottom: 12 },
    rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    label: { fontWeight: '600', flex: 1, marginRight: 8 },
    value: { fontSize: 12 },
    track: { width: '100%', height: 10, borderRadius: 8, overflow: 'hidden' },
    fill: { height: '100%' },
    noData: { textAlign: 'center', fontStyle: 'italic' },
});
export default HorizontalBarChart;
