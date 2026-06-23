import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { theme, useAppFonts } from './theme';
import { Text } from './components/Text';
import { Button } from './components/Button';
import { Chip } from './components/Chip';
import { Badge } from './components/Badge';
import { ListingCard } from './components/ListingCard';

export default function App() {
  const [fontsLoaded] = useAppFonts();
  if (!fontsLoaded) return null; // swap for an Expo splash screen in production

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h1">Hostels in Kumasi</Text>
        <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 4, marginBottom: 16 }}>
          12 stays near KNUST
        </Text>

        <View style={styles.chipRow}>
          <Chip label="All" active />
          <Chip label="Female only" outline />
          <Chip label="Under ₵100" outline />
        </View>

        <View style={{ height: theme.spacing.sp4 }} />

        <ListingCard
          imageUrl="https://images.unsplash.com/photo-1555854877-bab0e564b8d5"
          name="Green Valley Hostel"
          location="Ayigya, Kumasi · 0.8km from KNUST"
          pricePerNight={85}
          rating={4.8}
          reviewCount={120}
          verified
        />

        <View style={styles.badgeRow}>
          <Badge label="Confirmed" kind="success" />
          <Badge label="Pending payment" kind="pending" />
        </View>

        <Button label="Book this room" onPress={() => {}} style={{ marginTop: 16 }} />
        <Button label="Save for later" variant="secondary" onPress={() => {}} style={{ marginTop: 12 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4, paddingBottom: 48 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
});
