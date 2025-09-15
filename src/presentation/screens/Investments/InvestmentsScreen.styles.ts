import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const investmentsStyles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  contentContainer: { paddingBottom: theme.spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  hello: { color: theme.colors.muted },
  username: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text },
  wrapper: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }
      : { elevation: 2 }),
  },
  total: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.lg },
  cardsRow: { flexDirection: 'row', gap: theme.spacing.md } as any,
  card: { flex: 1, backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  cardTitle: { color: '#fff', marginBottom: theme.spacing.xs },
  cardValue: { color: '#fff', fontWeight: '700' },
  statsTitle: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm, fontWeight: '700', color: theme.colors.text, fontSize: 16 },
  statsRow: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center' },
  chart: { width: '100%', height: 220, resizeMode: 'contain' },
  loadingGroup: { gap: theme.spacing.md } as any,
  skeletonHeader: { marginBottom: theme.spacing.lg },
  skeletonCard: { flex: 1 } as any,
  skeletonFooter: { marginTop: theme.spacing.lg },
});
