import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const pixStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg },
  sectionTitle: { fontSize: theme.text.h2, fontWeight: '600', color: theme.colors.text, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  actionsRow: { paddingVertical: theme.spacing.sm },
  action: { alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, minWidth: 96 },
  actionLabel: { marginTop: 6, color: theme.colors.text },
  actionGap: { marginLeft: theme.spacing.sm },
  card: { backgroundColor: '#fff', borderRadius: theme.radius.lg, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 12, marginTop: 8 },
  btn: { marginTop: 12, backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: theme.radius.md, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  listItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md },
  smallBtnText: { color: theme.colors.text },
  meta: { color: theme.colors.muted, fontSize: 12 },
  qrBox: { marginTop: 8, padding: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface },
});

