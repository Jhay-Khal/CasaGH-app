import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { ListingCard } from '../../components/ListingCard';
import { getSavedProperties, unsaveProperty, getPropertyImage } from '../../services/api';

export default function Saved() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  async function loadSaved() {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) {
        setLoading(false);
        return;
      }
      const id = parseInt(userIdStr, 10);
      setUserId(id);
      const data = await getSavedProperties(id);
      setSaved(data);
    } catch (error) {
      console.error('Failed to load saved properties:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsave(propertyId: number) {
    if (!userId) return;
    try {
      await unsaveProperty(userId, propertyId);
      setSaved((prev) => prev.filter((s: any) => (s.property?.id || s.id) !== propertyId));
    } catch (error) {
      console.error('Failed to unsave property:', error);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <View style={styles.header}>
            <Text variant="display" color={theme.colors.navy}>Saved</Text>
            <View style={styles.headerIconWrap}>
              <Ionicons name="heart" size={18} color={theme.colors.danger} />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.teal700} style={{ marginTop: 60 }} />
          ) : saved.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="heart-outline" size={32} color={theme.colors.teal700} />
              </View>
              <Text variant="h3" style={{ marginTop: 14 }}>No saved properties yet</Text>
              <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginTop: 4, textAlign: 'center' }}>
                Tap the heart icon on any property to save it here for later
              </Text>
            </View>
          ) : (
            <>
              <Text variant="caption" color={theme.colors.teal700} style={{ marginBottom: 14 }}>
                {saved.length} saved {saved.length === 1 ? 'stay' : 'stays'}
              </Text>
              {saved.map((item: any) => {
                const property = item.property || item;
                return (
                  <ListingCard
                    key={property.id}
                    imageUrl={
                      property.images?.[0]?.imageUrl ||
                      getPropertyImage(property.type, property.id)
                    }
                    name={property.title}
                    location={`${property.area}, ${property.city}`}
                    pricePerNight={property.price}
                    rating={4.5}
                    reviewCount={0}
                    verified={property.verificationStatus === 'APPROVED'}
                    saved
                    onPress={() => router.push(`/hostel/${property.id}`)}
                    onToggleSave={() => handleUnsave(property.id)}
                  />
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.teal50 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingBottom: 40 },
  content: { width: '100%', maxWidth: 480, paddingHorizontal: theme.spacing.sp4, paddingTop: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    padding: theme.spacing.sp6,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});