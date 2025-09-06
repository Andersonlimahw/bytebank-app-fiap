import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  label: string;
  icon: any;
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
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  icon: { width: 28, height: 28, resizeMode: 'contain', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', textAlign: 'center', color: '#111827' },
});

