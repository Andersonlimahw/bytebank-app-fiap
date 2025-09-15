import { StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const transactionItemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  rowPressed: { backgroundColor: theme.colors.surface },
  title: { fontWeight: '600', fontSize: 16, color: theme.colors.text },
  date: { color: theme.colors.muted, marginTop: 2 },
  category: { color: theme.colors.accent, marginTop: 2, fontSize: 12 },
  amount: { fontWeight: '700' },
  content: { flex: 1 },
});
