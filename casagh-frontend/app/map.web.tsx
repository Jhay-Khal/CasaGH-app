import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from '../components/Text';
import { ListingCard } from '../components/ListingCard';
import { getProperties, getPropertyImage } from '../services/api';
import { getPropertyCoords } from '../services/geo';

declare global {
  interface Window {
    L: any;
  }
}

function loadLeaflet(): Promise<any> {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
}

export default function MapScreen() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties for map:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading || !mapDivRef.current) return;

    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !mapDivRef.current) return;

      const map = L.map(mapDivRef.current).setView([6.6885, -1.6244], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      properties.forEach((property: any) => {
        const { lat, lng } = getPropertyCoords(property);
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${theme.colors.green700};color:#fff;padding:6px 10px;border-radius:999px;font-weight:600;font-size:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25);">₵${property.price}</div>`,
          iconSize: undefined,
        });
        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on('click', () => setSelected(property));
      });
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, properties]);

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
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={theme.colors.green700} />
          </View>
        ) : (
          // @ts-ignore -- plain div only valid on web, this file only loads on web
          <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        )}

        {selected && (
          <View style={styles.floatingCardWrap}>
            <ListingCard
              imageUrl={getPropertyImage(selected.type, selected.id)}
              name={selected.title}
              location={`${selected.area}, ${selected.city}`}
              pricePerNight={selected.price}
              pricingUnit={selected.pricingUnit}
              rating={4.5}
              reviewCount={0}
              verified={selected.verificationStatus === 'APPROVED'}
              onPress={() => router.push(`/hostel/${selected.id}`)}
              onToggleSave={() => {}}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  mapWrap: { flex: 1, position: 'relative' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  floatingCardWrap: { position: 'absolute', bottom: 32, left: 16, right: 16 },
});