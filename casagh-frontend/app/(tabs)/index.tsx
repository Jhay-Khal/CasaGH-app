import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Chip } from '../../components/Chip';
import { ListingCard } from '../../components/ListingCard';
import { Input } from '../../components/Input';

export default function Explore() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="display" color={theme.colors.green900}>Explore</Text>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.ink} />
            </Pressable>
            <View style={styles.profileAvatar} />
          </View>
        </View>

        <Pressable onPress={() => router.push('/modals/filters')}>
          <View pointerEvents="none">
            <Input 
              placeholder="Where do you want to stay?" 
              style={{ marginBottom: 16 }}
              leftIcon={<Ionicons name="search" size={20} color={theme.colors.inkSoft} />}
            />
          </View>
        </Pressable>

        <View style={styles.chipRow}>
          <Chip label="All" active />
          <Chip label="Hostels" outline />
          <Chip label="Apartments" outline />
          <Chip label="Homestays" outline />
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
          onPress={() => router.push('/hostel/1')}
          onToggleSave={() => {}}
        />

        <ListingCard
          imageUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          name="Evandy Hostel"
          location="Bomso, Kumasi · 1.2km from KNUST"
          pricePerNight={120}
          rating={4.2}
          reviewCount={85}
          onPress={() => router.push('/hostel/2')}
          onToggleSave={() => {}}
        />
      </ScrollView>

      {/* Floating Map Button */}
      <Pressable style={styles.fab} onPress={() => router.push('/map')}>
        <Ionicons name="map" size={20} color={theme.colors.white} style={{ marginRight: 8 }} />
        <Text variant="h3" color={theme.colors.white}>Map</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4, paddingBottom: 48 },
  header: { marginBottom: 16, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 4 },
  profileAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.green100 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  fab: { position: 'absolute', bottom: 24, alignSelf: 'center', backgroundColor: theme.colors.ink, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
});
