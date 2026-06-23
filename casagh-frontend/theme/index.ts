import { colors } from './colors';
import { spacing, radius, grid } from './spacing';
import { type, fontFamily, useAppFonts } from './typography';

export const theme = { colors, spacing, radius, grid, type, fontFamily };
export { useAppFonts };
export type Theme = typeof theme;
