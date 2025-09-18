import { StyleSheet } from 'react-native';
export const makeSkeletonStyles = (theme) => StyleSheet.create({
    base: {
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
    },
});
