import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...rest
}: Props) {
  return (
    <View style={styles.container}>
      {label && (
        <Text
          variant="bodySm"
          style={styles.label}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          error && styles.inputError,
          style,
        ]}
      >
        {leftIcon && (
          <View style={styles.iconWrap}>
            {leftIcon}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.inkSoft}
          {...rest}
        />

        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={22}
              color="#8E8E93"
            />
          </Pressable>
        )}
      </View>

      {!!error && (
        <Text
          variant="caption"
          color={theme.colors.danger}
          style={styles.errorText}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sp4,
  },

  label: {
    marginBottom: 6,
    fontFamily:
      theme.fontFamily.bodySemiBold,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 56,

    borderRadius: 14,

    borderWidth: 1.2,

    borderColor: theme.colors.line,

    backgroundColor:
      theme.colors.white,

    paddingHorizontal: 16,
  },

  input: {
    flex: 1,

    height: '100%',

    color: theme.colors.ink,

    fontSize: 16,

    fontFamily:
      theme.fontFamily.bodyRegular,
  },

  iconWrap: {
    marginRight: 12,
  },

  inputError: {
    borderColor:
      theme.colors.danger,
  },

  errorText: {
    marginTop: 6,
  },
});