import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Variant = keyof typeof theme.type;

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
}

export function Text({ variant = 'bodyMd', color, style, ...rest }: Props) {
  return (
    <RNText
      style={[
        styles.base,
        theme.type[variant],
        { color: color ?? defaultColorFor(variant) },
        style,
      ]}
      {...rest}
    />
  );
}

function defaultColorFor(variant: Variant) {
  if (variant === 'display' || variant === 'h1' || variant === 'h2' || variant === 'h3') {
    return theme.colors.green900;
  }
  if (variant === 'caption') return theme.colors.green700;
  return theme.colors.ink;
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
