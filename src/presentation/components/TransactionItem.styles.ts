import { StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const transactionItemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  rowPressed: { backgroundColor: theme.colors.surface },
  title: { fontWeight: '600', fontSize: 16, color: theme.colors.text },
  date: { color: theme.colors.muted, marginTop: 2 },
  category: { color: theme.colors.accent, marginTop: 2, fontSize: 12 },
  amount: { fontWeight: '700', textAlign: 'right' },
  amountWrap: {
    minWidth: 96,
    paddingLeft: theme.spacing.sm,
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  },
  content: { flex: 1, minWidth: 0, paddingRight: theme.spacing.lg },
});
