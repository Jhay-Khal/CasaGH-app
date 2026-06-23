import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

type BadgeKind = 'success' | 'pending' | 'error';

export function Badge({ label, kind = 'success' }: { label: string; kind?: BadgeKind }) {
  const map = {
    success: { bg: theme.colors.green100, fg: theme.colors.green700 },
    pending: { bg: theme.colors.warningBg, fg: theme.colors.warning },
    error: { bg: theme.colors.dangerBg, fg: theme.colors.danger },
  } as const;

  const { bg, fg } = map[kind];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text variant="bodySm" color={fg} style={{ fontFamily: theme.fontFamily.headBold }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
    alignSelf: 'flex-start',
  },
});
