import React from 'react';
import { Stack } from 'expo-router';
import { useAppFonts } from '../theme';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

export default function Layout() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.colors.green700} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.green50 } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="hostel/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="hostel/room/[id]" options={{ title: 'Select a Room', headerShown: true, headerBackVisible: false, headerTintColor: theme.colors.green900 }} />
      <Stack.Screen name="checkout/index" options={{ title: 'Checkout', headerShown: true, headerBackVisible: false, headerTintColor: theme.colors.green900 }} />
      <Stack.Screen name="checkout/success" />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="modals/filters" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="hostel/gallery/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="hostel/reviews/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
}
