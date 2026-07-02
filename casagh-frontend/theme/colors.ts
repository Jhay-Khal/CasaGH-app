export const colors = {
  green900: '#0E3B23',  // headings, nav active text
  green700: '#16a34a',  // primary brand — buttons, links, prices
  green600: '#15803d',  // pressed/hover state
  green500: '#22c55e',  // icons, secondary accents
  green100: '#dcfce7',  // chips, tinted backgrounds
  green50:  '#f0fdf4',  // page background tint

  white: '#FFFFFF',
  ink: '#102016',       // primary text
  inkSoft: '#5B6B61',   // secondary text
  line: '#DCE8E0',      // borders/dividers

  danger: '#C2402F',    // errors only — use sparingly
  warning: '#9A6A18',
  warningBg: '#FCF1DD',
  dangerBg: '#F8E5E2',

  brandRed: '#921A1D',  // Profile screen branding
  brandRedBg: '#FCEBEA', // Profile screen light bg
} as const;

export type ColorToken = keyof typeof colors;
