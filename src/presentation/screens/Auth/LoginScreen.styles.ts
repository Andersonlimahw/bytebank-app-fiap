import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.text.h1,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: 4,
    marginBottom: theme.spacing.md,
  },
  altTitle: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
    color: theme.colors.muted,
  },
  hint: {
    marginTop: theme.spacing.md,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  link: { marginTop: theme.spacing.sm, color: theme.colors.primary },
  spacerSm: { height: theme.spacing.sm },
  spacerMd: { height: theme.spacing.md },
  spacerLg: { height: theme.spacing.lg },
});
