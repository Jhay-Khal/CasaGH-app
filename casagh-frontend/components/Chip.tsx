import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

interface ChipProps {
  label: string;
  active?: boolean;
  outline?: boolean;
  onPress?: () => void;
}

export function Chip({ label, active, outline, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && styles.chipActive,
        outline && !active && styles.chipOutline,
      ]}
    >
      <Text
        variant="bodySm"
        style={{ fontFamily: theme.fontFamily.bodySemiBold }}
        color={active ? theme.colors.white : outline ? theme.colors.inkSoft : theme.colors.green700}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: theme.colors.green100,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
  },
  chipActive: { backgroundColor: theme.colors.green700 },
  chipOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.line },
});
