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
import { getPendingProperties, getVerifiedProperties, getRejectedProperties, approveProperty, rejectProperty } from '../../services/api';
import { useAppAlert } from '../context/AppAlertContext';

type ViewMode = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function AdminDashboard() {
  const { showAlert, showConfirm } = useAppAlert();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('PENDING');

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
    loadProperties(viewMode);
  }

  async function loadProperties(mode: ViewMode) {
    setLoading(true);
    try {
      let data;
      if (mode === 'PENDING') data = await getPendingProperties();
      else if (mode === 'APPROVED') data = await getVerifiedProperties();
      else data = await getRejectedProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  }

  function switchView(mode: ViewMode) {
    setViewMode(mode);
    loadProperties(mode);
  }

  function handleApprove(id: number, title: string) {
    showConfirm({
      title: 'Approve Property?',
      message: `Approve "${title}"? This will make it live on CasaGH.`,
      confirmLabel: 'Approve',
      onConfirm: async () => {
        try {
          await approveProperty(id);
          setProperties(prev => prev.filter(p => p.id !== id));
          showAlert('Approved', `"${title}" has been approved and is now live!`);
        } catch (error) {
          showAlert('Error', 'Failed to approve property. Please try again.');
        }
      },
    });
  }

  function handleReject(id: number, title: string) {
    showConfirm({
      title: 'Reject Property?',
      message: `Reject "${title}"? This will remove it from the platform.`,
      confirmLabel: 'Reject',
      destructive: true,
      onConfirm: async () => {
        try {
          await rejectProperty(id);
          setProperties(prev => prev.filter(p => p.id !== id));
          showAlert('Rejected', `"${title}" has been rejected.`);
        } catch (error) {
          showAlert('Error', 'Failed to reject property. Please try again.');
        }
      },
    });
  }

  if (!isAdmin) return null;

  const emptyMessages: Record<ViewMode, { title: string; subtitle: string }> = {
    PENDING: { title: 'All caught up!', subtitle: 'No properties pending review right now.' },
    APPROVED: { title: 'Nothing approved yet', subtitle: 'Approved properties will appear here.' },
    REJECTED: { title: 'No rejections', subtitle: 'Rejected properties will appear here.' },
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0D1B4B" />
        </Pressable>
        <Text variant="h2" color="#0D1B4B">Admin Dashboard</Text>
        <Pressable onPress={() => loadProperties(viewMode)} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={22} color="#3AAFA9" />
        </Pressable>
      </View>

      {/* View Toggle */}
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'PENDING' && styles.toggleBtnActive]}
          onPress={() => switchView('PENDING')}
        >
          <Text variant="bodySm" color={viewMode === 'PENDING' ? '#fff' : '#0D1B4B'} style={{ fontWeight: '600' }}>
            Pending
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'APPROVED' && styles.toggleBtnActive]}
          onPress={() => switchView('APPROVED')}
        >
          <Text variant="bodySm" color={viewMode === 'APPROVED' ? '#fff' : '#0D1B4B'} style={{ fontWeight: '600' }}>
            Approved
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'REJECTED' && styles.toggleBtnActive]}
          onPress={() => switchView('REJECTED')}
        >
          <Text variant="bodySm" color={viewMode === 'REJECTED' ? '#fff' : '#0D1B4B'} style={{ fontWeight: '600' }}>
            Rejected
          </Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text variant="h1" color="#3AAFA9">{properties.length}</Text>
          <Text variant="caption" color={theme.colors.inkSoft}>
            {viewMode === 'PENDING' ? 'Pending Review' : viewMode === 'APPROVED' ? 'Approved & Live' : 'Rejected'}
          </Text>
        </View>
      </View>

      <Text variant="h3" color="#0D1B4B" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        {viewMode === 'PENDING' ? 'Pending Properties' : viewMode === 'APPROVED' ? 'Approved Properties' : 'Rejected Properties'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3AAFA9" style={{ marginTop: 40 }} />
      ) : properties.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={48} color="#3AAFA9" />
          <Text variant="h3" color={theme.colors.inkSoft} style={{ marginTop: 12 }}>
            {emptyMessages[viewMode].title}
          </Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 4 }}>
            {emptyMessages[viewMode].subtitle}
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

              {/* Action Buttons — only for Pending view */}
              {viewMode === 'PENDING' && (
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
              )}

              {/* Approved badge */}
              {viewMode === 'APPROVED' && (
                <View style={[styles.statusBadge, { backgroundColor: '#E0F5F4' }]}>
                  <Ionicons name="checkmark-circle" size={16} color="#3AAFA9" />
                  <Text variant="bodyMd" color="#3AAFA9" style={{ marginLeft: 6, fontWeight: '600' }}>
                    Live on CasaGH
                  </Text>
                </View>
              )}

              {/* Rejected badge + re-approve option */}
              {viewMode === 'REJECTED' && (
                <>
                  <View style={[styles.statusBadge, { backgroundColor: '#FBE7E5' }]}>
                    <Ionicons name="close-circle" size={16} color="#C2402F" />
                    <Text variant="bodyMd" color="#C2402F" style={{ marginLeft: 6, fontWeight: '600' }}>
                      Rejected
                    </Text>
                  </View>
                  <Pressable
                    style={[styles.approveBtn, { marginTop: 10 }]}
                    onPress={() => handleApprove(property.id, property.title)}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text variant="bodyMd" color="#fff" style={{ marginLeft: 6, fontWeight: '600' }}>
                      Approve Instead
                    </Text>
                  </Pressable>
                </>
              )}
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
  toggleRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 16, paddingTop: 16,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 10,
    borderRadius: 10, alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#DCE8F0',
  },
  toggleBtnActive: {
    backgroundColor: '#3AAFA9',
    borderColor: '#3AAFA9',
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
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 16, paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
  emptyState: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', marginTop: 80,
  },
});