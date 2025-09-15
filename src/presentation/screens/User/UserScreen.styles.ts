import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const userStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  section: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  card: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#00000010', backgroundColor: '#fafafa', padding: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  label: { fontSize: 14, color: theme.colors.muted },
  value: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#00000014', marginVertical: 6 },
  link: { fontSize: 16, color: theme.colors.primary, fontWeight: '600' },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  nameBlock: { marginLeft: 12 },
  name: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  sub: { fontSize: 13, color: theme.colors.muted },
  footer: { padding: theme.spacing.md, alignItems: 'center', justifyContent: 'center' },
  version: { color: theme.colors.muted, fontSize: 12 },
});

