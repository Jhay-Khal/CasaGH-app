import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp, View } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  style,
  leftIcon,
}: Props) {
  const textColor = variant === 'primary' ? theme.colors.white : theme.colors.green700;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        disabled && styles.disabled,
        style,
      ]}
    >
      {leftIcon && <View style={styles.iconWrap}>{leftIcon}</View>}
      <Text
        variant="h3"
        color={textColor}
        style={{ fontFamily: theme.fontFamily.headSemiBold }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    minHeight: 48,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.4 },
  iconWrap: { marginRight: 8 },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: theme.colors.green700,
    shadowColor: theme.colors.green900,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  secondary: { backgroundColor: theme.colors.green100 },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.green700,
  },
  ghost: { backgroundColor: 'transparent' },
};
