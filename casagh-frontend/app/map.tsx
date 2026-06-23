import React from 'react';
import { View, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from '../components/Text';
import { ListingCard } from '../components/ListingCard';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h2">Map View</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.mapWrap}>
        {/* Mock Map Image */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80' }} 
          style={styles.mapImage} 
        />
        
        {/* Mock Marker */}
        <View style={[styles.marker, { top: '40%', left: '30%' }]}>
          <Text variant="bodySm" color={theme.colors.white} style={{ fontFamily: theme.fontFamily.bodyBold }}>₵85</Text>
        </View>

        <View style={[styles.markerActive, { top: '55%', left: '60%' }]}>
          <Text variant="bodySm" color={theme.colors.white} style={{ fontFamily: theme.fontFamily.bodyBold }}>₵120</Text>
        </View>

        {/* Floating Card at Bottom */}
        <View style={styles.floatingCardWrap}>
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  mapWrap: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  marker: { position: 'absolute', backgroundColor: theme.colors.green700, paddingHorizontal: 10, paddingVertical: 6, borderRadius: theme.radius.pill, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  markerActive: { position: 'absolute', backgroundColor: theme.colors.ink, paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.pill, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 6, transform: [{ scale: 1.1 }] },
  floatingCardWrap: { position: 'absolute', bottom: 32, left: 16, right: 16 },
});
