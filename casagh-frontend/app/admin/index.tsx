import React, { useState, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable,
  ActivityIndicator, SafeAreaView, Linking,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { getPendingProperties, approveProperty, rejectProperty } from '../../services/api';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkAdmin();
    }, [])
  );

  async function checkAdmin() {
    const role = await AsyncStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      router.replace('/(tabs)');
      return;
    }
    setIsAdmin(true);
    loadPending();
  }

  async function loadPending() {
    setLoading(true);
    try {
      const data = await getPendingProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load pending properties:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: number, title: string) {
    const confirmed = window.confirm(`Approve "${title}"? This will make it live on CasaGH.`);
    if (!confirmed) return;
    try {
      await approveProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      window.alert(`✅ "${title}" has been approved and is now live!`);
    } catch (error) {
      window.alert('Failed to approve property. Please try again.');
    }
  }

  async function handleReject(id: number, title: string) {
    const confirmed = window.confirm(`Reject "${title}"? This will remove it from the platform.`);
    if (!confirmed) return;
    try {
      await rejectProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      window.alert(`❌ "${title}" has been rejected.`);
    } catch (error) {
      window.alert('Failed to reject property. Please try again.');
    }
  }

  if (!isAdmin) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0D1B4B" />
        </Pressable>
        <Text variant="h2" color="#0D1B4B">Admin Dashboard</Text>
        <Pressable onPress={loadPending} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={22} color="#3AAFA9" />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text variant="h1" color="#3AAFA9">{properties.length}</Text>
          <Text variant="caption" color={theme.colors.inkSoft}>Pending Review</Text>
        </View>
      </View>

      <Text variant="h3" color="#0D1B4B" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        Pending Properties
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3AAFA9" style={{ marginTop: 40 }} />
      ) : properties.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={48} color="#3AAFA9" />
          <Text variant="h3" color={theme.colors.inkSoft} style={{ marginTop: 12 }}>
            All caught up!
          </Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 4 }}>
            No properties pending review right now.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {properties.map((property: any) => (
            <View key={property.id} style={styles.card}>

              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.typeTag}>
                  <Text variant="caption" color="#3AAFA9">{property.type}</Text>
                </View>
                <Text variant="caption" color={theme.colors.inkSoft}>ID #{property.id}</Text>
              </View>

              <Text variant="h3" color="#0D1B4B" style={{ marginTop: 8 }}>{property.title}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={theme.colors.inkSoft} />
                <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginLeft: 4 }}>
                  {property.area}, {property.city}, {property.region}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={14} color={theme.colors.inkSoft} />
                <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginLeft: 4 }}>
                  ₵{property.price} {property.isForRent ? '/ night' : '(For Sale)'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="card-outline"
                  size={14}
                  color={property.listingFeePaid ? '#3AAFA9' : '#C2402F'}
                />
                <Text
                  variant="bodySm"
                  color={property.listingFeePaid ? '#3AAFA9' : '#C2402F'}
                  style={{ marginLeft: 4 }}
                >
                  Listing fee: {property.listingFeePaid ? 'Paid ✅' : 'Not paid ❌'}
                </Text>
              </View>

              {/* Document */}
              {property.documentUrl ? (
                <Pressable
                  style={styles.docRow}
                  onPress={() => Linking.openURL(`http://localhost:8080/${property.documentUrl}`)}
                >
                  <Ionicons name="document-text" size={16} color="#3AAFA9" />
                  <Text variant="bodySm" color="#3AAFA9" style={{ marginLeft: 6 }}>
                    View Document →
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.docRow}>
                  <Ionicons name="document-text-outline" size={16} color="#C2402F" />
                  <Text variant="bodySm" color="#C2402F" style={{ marginLeft: 6 }}>
                    No document uploaded ❌
                  </Text>
                </View>
              )}

              <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginTop: 8 }} numberOfLines={2}>
                {property.description}
              </Text>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <Pressable
                  style={styles.rejectBtn}
                  onPress={() => handleReject(property.id, property.title)}
                >
                  <Ionicons name="close" size={16} color="#C2402F" />
                  <Text variant="bodyMd" color="#C2402F" style={{ marginLeft: 6, fontWeight: '600' }}>
                    Reject
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.approveBtn}
                  onPress={() => handleApprove(property.id, property.title)}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text variant="bodyMd" color="#fff" style={{ marginLeft: 6, fontWeight: '600' }}>
                    Approve
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FAFA' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#DCE8F0',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F0FAFA',
    alignItems: 'center', justifyContent: 'center',
  },
  refreshBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E0F5F4',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#DCE8F0',
    minWidth: 120,
  },
  list: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#DCE8F0',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  typeTag: {
    backgroundColor: '#E0F5F4', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  docRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 8, padding: 8,
    backgroundColor: '#F0FAFA', borderRadius: 8,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12,
    borderRadius: 10, borderWidth: 1.5, borderColor: '#C2402F',
  },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12,
    borderRadius: 10, backgroundColor: '#3AAFA9',
  },
  emptyState: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', marginTop: 80,
  },
});