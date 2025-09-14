import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  label: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
};

export const QuickAction: React.FC<Props> = ({ label, icon, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]} accessibilityRole="button" accessibilityLabel={label}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 88,
    height: 88,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  icon: { width: 28, height: 28, resizeMode: 'contain', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', textAlign: 'center', color: theme.colors.text },
});
