import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const Button: React.FC<Props> = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity onPress={onPress} style={[styles.btn, style]}
    accessibilityRole="button" accessibilityLabel={title}>
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: { backgroundColor: theme.colors.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: theme.radius.md },
  text: { color: theme.colors.cardText, fontWeight: '600', textAlign: 'center' }
});
