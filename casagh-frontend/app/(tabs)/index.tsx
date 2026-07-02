import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Chip } from '../../components/Chip';
import { ListingCard } from '../../components/ListingCard';
import { Input } from '../../components/Input';
import { api } from '../api/client';
import { ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function Explore() {
  const [properties, setProperties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchProperties();
    }, [])
  );

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data: any = await api.get('/properties');
      // Spring Data Page returns elements in 'content' array
      setProperties(data.content || []);
    } catch (error: any) {
      console.error('Failed to fetch properties:', error);
      Alert.alert('Error', error.message || 'Failed to fetch properties. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };
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

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.green700} style={{ marginTop: 40 }} />
        ) : (
          properties.map((property) => (
            <ListingCard
              key={property.id}
              imageUrl={property.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5"}
              name={property.name || property.title}
              location={`${property.city}, ${property.region}`}
              pricePerNight={property.price || property.monthlyRent || 0}
              rating={4.8} // Placeholder for rating
              reviewCount={120} // Placeholder for reviews
              verified={property.status === 'VERIFIED'}
              onPress={() => router.push(`/hostel/${property.id}`)}
              onToggleSave={() => {}}
            />
          ))
        )}

        {/* Fallback to mock data if empty (for UI testing without DB) */}
        {!loading && properties.length === 0 && (
          <View style={{ padding: 20, alignItems: 'center' }}>
             <Text variant="bodyMd" color={theme.colors.inkSoft}>No properties found on the server.</Text>
          </View>
        )}

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
