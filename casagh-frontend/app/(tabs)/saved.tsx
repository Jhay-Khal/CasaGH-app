import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { ListingCard } from '../../components/ListingCard';

export default function Saved() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginBottom: 16 }}>
          You have 1 saved stay
        </Text>

        <ListingCard
          imageUrl="https://images.unsplash.com/photo-1555854877-bab0e564b8d5"
          name="Green Valley Hostel"
          location="Ayigya, Kumasi · 0.8km from KNUST"
          pricePerNight={85}
          rating={4.8}
          reviewCount={120}
          verified
          saved
          onPress={() => router.push('/hostel/1')}
          onToggleSave={() => {}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4 },
});
