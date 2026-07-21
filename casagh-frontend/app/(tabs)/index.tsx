import React, { useState, useMemo, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Chip } from '../../components/Chip';
import { ListingCard } from '../../components/ListingCard';
import { Input } from '../../components/Input';
import { getProperties, getPropertyImage, getSavedProperties, saveProperty, unsaveProperty } from '../../services/api';
import { useFilters } from '../../context/FilterContext';

export default function Explore() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isOwner, setIsOwner] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const { filters, applyFilters, activeFilterCount, setProperties: setContextProperties } = useFilters();

  useFocusEffect(
    useCallback(() => {
      loadProperties();
      checkOwnerStatus();
      loadSavedIds();
    }, [])
  );

  async function loadProperties() {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
      setContextProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkOwnerStatus() {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setIsOwner(role === 'OWNER');
    } catch (error) {
      console.error('Failed to check user role:', error);
    }
  }

  async function loadSavedIds() {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) return;
      const id = parseInt(userIdStr, 10);
      setUserId(id);
      const saved = await getSavedProperties(id);
      const ids = new Set<number>(saved.map((item: any) => item.property?.id ?? item.id));
      setSavedIds(ids);
    } catch (error) {
      console.error('Failed to load saved properties:', error);
    }
  }

  async function handleToggleSave(propertyId: number) {
    if (!userId) {
      router.push('/(auth)/login');
      return;
    }
    const isSaved = savedIds.has(propertyId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(propertyId) : next.add(propertyId);
      return next;
    });
    try {
      if (isSaved) {
        await unsaveProperty(userId, propertyId);
      } else {
        await saveProperty(userId, propertyId);
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      setSavedIds((prev) => {
        const next = new Set(prev);
        isSaved ? next.add(propertyId) : next.delete(propertyId);
        return next;
      });
    }
  }

  const filtered = useMemo(() => {
    let list = filter === 'All'
      ? properties
      : properties.filter((p: any) => p.type === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p: any) =>
        p.title?.toLowerCase().includes(q) ||
        p.area?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      );
    }

    return applyFilters(list);
  }, [properties, filter, searchQuery, filters]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="home" size={18} color={theme.colors.gold} />
              </View>
              <View>
                <Text variant="display" color={theme.colors.navy}>CasaGH</Text>
                <Text variant="caption" color={theme.colors.teal700}>Find Home. Find Peace.</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Pressable style={styles.iconBtn} onPress={() => router.push('/notifications')}>
                <Ionicons name="notifications-outline" size={22} color={theme.colors.navy} />
              </Pressable>
              <Pressable style={styles.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person" size={18} color={theme.colors.teal700} />
              </Pressable>
            </View>
          </View>

          {/* Search Bar + Filter Button */}
          <View style={styles.searchRow}>
            <Input
              placeholder="Where do you want to stay?"
              style={styles.searchInputFlex}
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Ionicons name="search" size={20} color={theme.colors.inkSoft} />}
            />
            <Pressable style={styles.filterBtn} onPress={() => router.push('/modals/filters')}>
              <Ionicons name="options-outline" size={22} color={theme.colors.white} />
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text variant="caption" color={theme.colors.white}>{activeFilterCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Filter Chips */}
          <View style={styles.chipRow}>
            {[
              { label: 'All', value: 'All' },
              { label: 'Hostels', value: 'HOSTEL' },
              { label: 'Apartments', value: 'APARTMENT' },
              { label: 'Houses', value: 'HOUSE' },
            ].map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                active={filter === item.value}
                outline={filter !== item.value}
                onPress={() => setFilter(item.value)}
              />
            ))}
          </View>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text variant="h2" color={theme.colors.navy}>
              {filter === 'All' ? 'All Properties' : filter.charAt(0) + filter.slice(1).toLowerCase() + 's Near You'}
            </Text>
            <Text variant="caption" color={theme.colors.teal700}>
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Property List */}
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={theme.colors.teal700} />
              <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginTop: 12 }}>
                Loading properties…
              </Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="home-outline" size={40} color={theme.colors.teal700} />
              </View>
              <Text variant="h3" color={theme.colors.ink} style={{ marginTop: 16 }}>
                No properties found
              </Text>
              <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 4 }}>
                Try a different filter or check back later
              </Text>
            </View>
          ) : (
            filtered.map((property: any) => (
              <ListingCard
                key={property.id}
                imageUrl={getPropertyImage(property.type, property.id)}
                name={property.title}
                location={`${property.area}, ${property.city}`}
                pricePerNight={property.price}
                pricingUnit={property.pricingUnit}
                rating={4.5}
                reviewCount={0}
                verified={property.verificationStatus === 'APPROVED'}
                saved={savedIds.has(property.id)}
                onPress={() => router.push(`/hostel/${property.id}`)}
                onToggleSave={() => handleToggleSave(property.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FABs */}
      <View style={styles.fabWrap}>
        {isOwner && (
          <Pressable style={[styles.fab, styles.fabSecondary]} onPress={() => router.push('/upload')}>
            <Ionicons name="add" size={18} color={theme.colors.white} style={{ marginRight: 8 }} />
            <Text variant="h3" color={theme.colors.white}>List Property</Text>
          </Pressable>
        )}
        <Pressable style={styles.fab} onPress={() => router.push('/map')}>
          <Ionicons name="map" size={18} color={theme.colors.white} style={{ marginRight: 8 }} />
          <Text variant="h3" color={theme.colors.white}>Map View</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.teal50 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingBottom: 100 },
  content: { width: '100%', maxWidth: 480, paddingHorizontal: theme.spacing.sp4 },
  header: {
    marginBottom: 20, marginTop: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: theme.colors.navy,
    alignItems: 'center', justifyContent: 'center',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: theme.colors.teal700,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  searchInputFlex: { flex: 1, marginBottom: 0 },
  filterBtn: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: theme.colors.navy,
    alignItems: 'center', justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: theme.colors.gold,
    borderRadius: 10, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 20, marginBottom: 14,
  },
  loadingState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyState: { alignItems: 'center', marginTop: 40, paddingHorizontal: 24, paddingVertical: 32 },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center', justifyContent: 'center',
  },
  fabWrap: {
    position: 'absolute', bottom: 24, left: 0, right: 0,
    alignItems: 'center', gap: 10,
  },
  fab: {
    backgroundColor: theme.colors.navy,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 22, paddingVertical: 13,
    borderRadius: 30,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  fabSecondary: { backgroundColor: theme.colors.teal700 },
});