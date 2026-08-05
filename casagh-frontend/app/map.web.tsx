import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from '../components/Text';
import { getProperties } from '../services/api';
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
  const leafletRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const searchDebounceRef = useRef<any>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

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

      leafletRef.current = L;
      const map = L.map(mapDivRef.current).setView([6.6885, -1.6244], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      properties.forEach((property: any) => {
        const { lat, lng } = getPropertyCoords(property);
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
              <div style="background:${theme.colors.green700};color:#fff;padding:6px 10px;border-radius:999px;font-weight:600;font-size:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25);">₵${property.price}</div>
              <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid ${theme.colors.green700};margin-top:-1px;"></div>
            </div>
          `,
          iconSize: undefined,
        });
        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on('click', () => router.push(`/hostel/${property.id}`));
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

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const L = leafletRef.current;
        const map = mapInstanceRef.current;
        if (!L || !map) {
          setLocating(false);
          return;
        }

        map.setView([latitude, longitude], 15);

        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        const youIcon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;background:#4285F4;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(66,133,244,0.3);"></div>`,
          iconSize: [16, 16],
        });
        userMarkerRef.current = L.marker([latitude, longitude], { icon: youIcon }).addTo(map);

        setLocating(false);
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Location permission denied. Please enable it in your browser settings.');
        } else {
          alert('Unable to get your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleSearch(text: string) {
    setSearchText(text);

    // Clear any pending debounced search
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (text.trim().length < 3) {
      setSearchResults([]);
      setSearching(false);
      // Cancel any in-flight request since the query is no longer valid
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
      return;
    }

    setSearching(true);

    // Wait for the user to pause typing before firing the request
    searchDebounceRef.current = setTimeout(async () => {
      // Cancel any previous in-flight request before starting a new one
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
      const controller = new AbortController();
      searchAbortRef.current = controller;

      try {
        // Bias results toward Ghana; free OpenStreetMap geocoding service
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text
        )}&countrycodes=gh&limit=5`;
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en' },
          signal: controller.signal,
        });
        const data = await res.json();
        setSearchResults(data);
      } catch (error: any) {
        // Ignore expected cancellations from debouncing; only log real failures
        if (error?.name !== 'AbortError') {
          console.error('Search failed:', error);
          setSearchResults([]);
        }
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function handleSelectSearchResult(result: any) {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([parseFloat(result.lat), parseFloat(result.lon)], 15);
    setSearchResults([]);
    setSearchText(result.display_name.split(',').slice(0, 2).join(','));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.push('/'))} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h2">Map View</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.colors.inkSoft} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search an area, e.g. Ayeduase"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searching && <ActivityIndicator size="small" color={theme.colors.green700} />}
        </View>

        {searchResults.length > 0 && (
          <View style={styles.searchResults}>
            {searchResults.map((result: any, idx: number) => (
              <Pressable
                key={idx}
                style={styles.searchResultItem}
                onPress={() => handleSelectSearchResult(result)}
              >
                <Ionicons name="location-outline" size={16} color={theme.colors.inkSoft} />
                <Text style={styles.searchResultText} numberOfLines={1}>
                  {result.display_name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
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

        <Pressable style={styles.locateBtn} onPress={handleUseMyLocation} disabled={locating}>
          {locating ? (
            <ActivityIndicator size="small" color={theme.colors.green700} />
          ) : (
            <Ionicons name="locate" size={22} color={theme.colors.green700} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { paddingHorizontal: theme.spacing.sp4, paddingBottom: theme.spacing.sp2, zIndex: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.line, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.ink },
  searchResults: { backgroundColor: theme.colors.white, borderRadius: 12, marginTop: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4, maxHeight: 220, overflow: 'hidden' },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  searchResultText: { flex: 1, fontSize: 13, color: theme.colors.ink },
  mapWrap: { flex: 1, position: 'relative' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  locateBtn: { position: 'absolute', bottom: 32, right: 16, width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4, zIndex: 1000 },
});
