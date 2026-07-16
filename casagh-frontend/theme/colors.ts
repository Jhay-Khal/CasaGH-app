export const colors = {
  // CasaGH Brand Colors — Green theme
  teal900: '#14532D',   // dark green — headings, nav active
  teal700: '#1B7A4C',   // primary brand — buttons, links
  teal600: '#166B40',   // pressed/hover state
  teal100: '#DCFCE7',   // chips, tinted backgrounds
  teal50:  '#F0FDF4',   // page background tint
  gold: '#C9A84C',      // accent — pin, highlights
  goldBg: '#FDF6E3',    // gold tint background
  navy: '#0D1B4B',      // "CasaGH" text, primary headings
  navyLight: '#1A2E6B', // secondary navy
  white: '#FFFFFF',
  ink: '#0D1B4B',       // primary text (navy)
  inkSoft: '#5B6B80',   // secondary text
  line: '#DCE8F0',      // borders/dividers
  danger: '#C2402F',
  warning: '#9A6A18',
  warningBg: '#FCF1DD',
  dangerBg: '#F8E5E2',
  // Green aliases (now actually green)
  green900: '#14532D',
  green700: '#1B7A4C',
  green600: '#166B40',
  green500: '#22A35D',
  green100: '#DCFCE7',
  green50:  '#F0FDF4',
} as const;

export type ColorToken = keyof typeof colors;