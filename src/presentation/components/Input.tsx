import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text, StyleProp, TextStyle } from 'react-native';
import { theme } from '../theme/theme';

type Props = TextInputProps & {
  label?: string;
  errorText?: string | null;
};

export const Input: React.FC<Props> = ({ label, errorText, style, ...rest }) => {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          errorText ? styles.inputError : undefined,
          style as StyleProp<TextStyle>,
        ]}
        placeholderTextColor={theme.colors.muted}
        {...rest}
      />
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: theme.spacing.sm },
  label: { color: theme.colors.muted, marginBottom: theme.spacing.xs },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, marginTop: theme.spacing.xs },
});
