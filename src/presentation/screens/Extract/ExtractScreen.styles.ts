import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const extractStyles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  hello: { color: theme.colors.muted },
  username: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text },
  loadingContainer: { marginTop: theme.spacing.md },
  loadingSkeletonTop: { marginBottom: theme.spacing.sm },
  loadingSkeletonItem: { marginBottom: theme.spacing.xs },
  emptyContainer: { alignItems: 'center', marginTop: theme.spacing.lg },
  emptyText: { color: theme.colors.muted, marginBottom: theme.spacing.md },
  listContent: { paddingBottom: theme.spacing.xl },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
  modalCard: {
    width: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
      : { elevation: 4 }),
  },
  modalTitle: { fontSize: theme.text.h2, fontWeight: '700', marginBottom: theme.spacing.sm, color: theme.colors.text },
  typeRow: { flexDirection: 'row', marginTop: theme.spacing.sm, marginBottom: theme.spacing.md },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: theme.radius.sm, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border, alignItems: 'center' },
  typeBtnActive: { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
  typeText: { fontWeight: '600', color: theme.colors.muted },
  typeTextActive: { color: theme.colors.primary },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md },
  modalCancelBtn: { backgroundColor: theme.colors.surface },
  modalSaveBtn: { marginLeft: theme.spacing.sm },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }
      : { elevation: 4 }),
  },
  fabText: { color: theme.colors.cardText, fontSize: 28, lineHeight: 30 },
  fabPressable: { alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
});
