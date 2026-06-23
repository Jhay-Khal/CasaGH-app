export const spacing = {
  sp1: 4,
  sp2: 8,
  sp3: 12,
  sp4: 16,
  sp5: 20,
  sp6: 24,
  sp8: 32,
  sp10: 40,
  sp12: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

// 4-column mobile grid: 16px margin, 12px gutter.
// Use with a flex/grid helper or a library like react-native-flex-grid if needed.
export const grid = {
  mobile: { columns: 4, margin: spacing.sp4, gutter: spacing.sp3 },
  tablet: { columns: 8, margin: spacing.sp6, gutter: spacing.sp4 },
  desktop: { columns: 12, margin: spacing.sp8, gutter: spacing.sp6 },
};
