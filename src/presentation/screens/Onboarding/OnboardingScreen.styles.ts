import { StyleSheet, Dimensions } from 'react-native';
import type { AppTheme } from '../../theme/theme';

const { width } = Dimensions.get('window');

export const makeOnboardingStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    slide: { flex: 1, paddingHorizontal: theme.spacing.lg, alignItems: 'center', justifyContent: 'center' },
    image: { width: width * 0.8, height: width * 0.8, resizeMode: 'contain', marginBottom: theme.spacing.md },
    title: { fontSize: theme.text.h1, fontWeight: '800', textAlign: 'center', color: theme.colors.text, fontFamily: theme.fonts.bold },
    subtitle: { fontSize: theme.text.body, color: theme.colors.muted, textAlign: 'center', marginTop: theme.spacing.xs, fontFamily: theme.fonts.regular },
    footer: { padding: theme.spacing.md },
    dots: { flexDirection: 'row', alignSelf: 'center', marginBottom: theme.spacing.sm },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.border, marginHorizontal: 4 },
    dotActive: { backgroundColor: theme.colors.text },
    actions: { flexDirection: 'row', justifyContent: 'center' },
    spacer: { width: theme.spacing.md },
  });
