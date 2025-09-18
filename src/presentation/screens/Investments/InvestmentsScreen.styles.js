import { Platform, StyleSheet } from 'react-native';
export const makeInvestmentsStyles = (theme) => StyleSheet.create({
    container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
    contentContainer: { paddingBottom: theme.spacing.xl },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
    hello: { color: theme.colors.muted, fontFamily: theme.fonts.regular },
    username: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, fontFamily: theme.fonts.bold },
    wrapper: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        ...(Platform.OS === 'ios'
            ? { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }
            : { elevation: 2 }),
    },
    total: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.lg, fontFamily: theme.fonts.bold },
    cardsRow: { flexDirection: 'row', gap: theme.spacing.md },
    card: { flex: 1, backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
    cardTitle: { color: theme.colors.cardText, marginBottom: theme.spacing.xs, fontFamily: theme.fonts.medium },
    cardValue: { color: theme.colors.cardText, fontWeight: '700', fontFamily: theme.fonts.bold },
    statsTitle: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm, fontWeight: '700', color: theme.colors.text, fontSize: 16, fontFamily: theme.fonts.bold },
    statsRow: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center' },
    chart: { width: '100%', height: 220, resizeMode: 'contain' },
    loadingGroup: { gap: theme.spacing.md },
    skeletonHeader: { marginBottom: theme.spacing.lg },
    skeletonCard: { flex: 1 },
    skeletonFooter: { marginTop: theme.spacing.lg },
});
