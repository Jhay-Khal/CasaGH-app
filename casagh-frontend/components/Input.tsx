import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, style, ...rest }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text variant="bodySm" style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        style,
      ]}>
        {leftIcon && <View style={styles.iconWrap}>{leftIcon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.inkSoft}
          {...rest}
        />
      </View>
      {error && <Text variant="caption" color={theme.colors.danger} style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: theme.spacing.sp4 },
  label: { marginBottom: 4, fontFamily: theme.fontFamily.bodySemiBold },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
  },
  iconWrap: { marginRight: 8 },
  input: {
    flex: 1,
    fontFamily: theme.fontFamily.bodyRegular,
    color: theme.colors.ink,
    height: '100%',
  },
  inputError: { borderColor: theme.colors.danger },
  errorText: { marginTop: 4 },
});
