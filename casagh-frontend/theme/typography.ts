// Fonts: Inter for headers, Open Sans for body.
// Install:
//   npx expo install @expo-google-fonts/inter @expo-google-fonts/open-sans expo-font expo-splash-screen

import {
  useFonts,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import {
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';

export const fontFamily = {
  headSemiBold: 'Inter_600SemiBold',
  headBold: 'Inter_700Bold',
  headExtraBold: 'Inter_800ExtraBold',
  bodyRegular: 'OpenSans_400Regular',
  bodyMedium: 'OpenSans_500Medium',
  bodySemiBold: 'OpenSans_600SemiBold',
  bodyBold: 'OpenSans_700Bold',
} as const;

// Call this once at the root of the app (e.g. App.tsx) and gate rendering
// behind `fontsLoaded` so text never flashes in a system font.
export function useAppFonts() {
  return useFonts({
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });
}

// Mobile-first type scale. Sizes are for phone widths (<600px);
// bump via a useWindowDimensions check for tablet (see typography.md note).
export const type = {
  display: { fontFamily: fontFamily.headExtraBold, fontSize: 28, lineHeight: 34 },
  h1:      { fontFamily: fontFamily.headBold, fontSize: 24, lineHeight: 30 },
  h2:      { fontFamily: fontFamily.headBold, fontSize: 20, lineHeight: 26 },
  h3:      { fontFamily: fontFamily.headSemiBold, fontSize: 17, lineHeight: 22 },
  bodyLg:  { fontFamily: fontFamily.bodyRegular, fontSize: 16, lineHeight: 24 },
  bodyMd:  { fontFamily: fontFamily.bodyRegular, fontSize: 14, lineHeight: 20 },
  bodySm:  { fontFamily: fontFamily.bodyRegular, fontSize: 12, lineHeight: 16 },
  caption: { fontFamily: fontFamily.bodyBold, fontSize: 11, lineHeight: 14, letterSpacing: 0.5, textTransform: 'uppercase' as const },
} as const;
