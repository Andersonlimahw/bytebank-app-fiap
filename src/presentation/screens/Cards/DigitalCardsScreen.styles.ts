import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../theme/theme';

export const makeDigitalCardsStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, padding: theme.spacing.lg },
    row: { flexDirection: 'row', alignItems: 'center' },
    list: { paddingVertical: theme.spacing.md },
    cardItem: { marginBottom: theme.spacing.md },
    emptyText: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.spacing.lg },
    fab: {
      position: 'absolute', right: 20, bottom: 28,
      backgroundColor: theme.colors.primary,
      width: 56, height: 56, borderRadius: 28,
      alignItems: 'center', justifyContent: 'center',
    },
    fabText: { color: '#fff', fontSize: 24, fontWeight: '700' },
    form: { padding: theme.spacing.lg },
    field: { marginBottom: theme.spacing.md },
    label: { color: theme.colors.muted, marginBottom: 6 },
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.sm,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md },
    btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: theme.radius.sm },
    btnCancel: { backgroundColor: theme.colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border, marginRight: 8 },
    btnSave: { backgroundColor: theme.colors.primary },
    btnText: { color: theme.colors.cardText, fontWeight: '700' },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    editRemoveRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    smallLink: { color: theme.colors.accent, fontWeight: '600' },
  });

