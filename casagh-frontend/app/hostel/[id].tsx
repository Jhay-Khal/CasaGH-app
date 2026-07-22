import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, StyleSheet, Pressable, Linking, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { getPropertyById, getPropertyImages } from '../../services/api';

const API_BASE = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api').replace('/api', '');

function resolveImageUrl(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5';
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

export default function HostelDetails() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id]);

  async function loadProperty() {
    try {
      const data = await getPropertyById(Number(id));
      const images = await getPropertyImages(Number(id));
      setProperty({ ...data, images });
    } catch (error) {
      console.error('Failed to load property:', error);
      Alert.alert('Error', 'Could not load property details');
    } finally {
      setLoading(false);
    }
  }

  const handleWhatsApp = async () => {
    const phone = property?.ownerPhone || '233551234567';
    const url = `whatsapp://send?phone=+${phone}&text=Hello,%20I%20am%20interested%20in%20your%20property.`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://wa.me/${phone}`);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open WhatsApp');
    }
  };

  const handleCall = async () => {
    const phone = property?.ownerPhone || '233551234567';
    try {
      await Linking.openURL(`tel:+${phone}`);
    } catch (e) {
      Alert.alert('Error', 'Could not open Phone dialer');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.green900} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="h3" color={theme.colors.inkSoft}>Property not found</Text>
        <Button label="Go Back" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const imageUrl = resolveImageUrl(property.images?.[0]?.imageUrl);
  const isVerified = property.verificationStatus === 'APPROVED';

  return (
    <View style={styles.container}>
      <>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Pressable style={styles.glassBackBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
            </Pressable>
            <Pressable style={styles.glassFavBtn}>
              <Ionicons name="heart-outline" size={24} color={theme.colors.ink} />
            </Pressable>
          </View>

          <View style={styles.details}>
            <View style={styles.titleRow}>
              <Text variant="h1">{property.title}</Text>
              {isVerified && <Badge label="Verified" kind="success" />}
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={theme.colors.inkSoft} style={{ marginRight: 6 }} />
              <Text variant="bodyMd" color={theme.colors.inkSoft}>
                {property.area}, {property.city}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text variant="h2" style={{ marginBottom: 12 }}>About this stay</Text>
            <Text variant="bodyLg" color={theme.colors.ink} style={{ lineHeight: 26 }}>
              {property.description || 'No description available.'}
            </Text>

            <View style={styles.divider} />

            <Text variant="h2" style={{ marginBottom: 16 }}>Property Details</Text>
            <View style={styles.amenityRow}>
              <View style={styles.amenityItem}>
                <Ionicons name="home" size={20} color={theme.colors.green700} />
                <Text variant="bodyMd">Type: {property.type}</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="location" size={20} color={theme.colors.green700} />
                <Text variant="bodyMd">Region: {property.region}</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="swap-horizontal" size={20} color={theme.colors.green700} />
                <Text variant="bodyMd">{property.isForRent ? 'Available for Rent' : 'For Sale'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Button variant="secondary" label="View Photo Gallery" onPress={() => router.push(`/hostel/gallery/${id}`)} leftIcon={<Ionicons name="images-outline" size={20} color={theme.colors.green700} />} style={{ marginBottom: 12 }} />
            <Button variant="secondary" label="Read Reviews" onPress={() => router.push(`/hostel/reviews/${id}`)} leftIcon={<Ionicons name="star-outline" size={20} color={theme.colors.green700} />} />

            <View style={styles.divider} />

            <Text variant="h2" style={{ marginBottom: 16 }}>Contact Host</Text>

            {property.owner?.id && (
              <Pressable
                style={[styles.contactBtn, { backgroundColor: theme.colors.green700, marginBottom: 12 }]}
                onPress={() =>
                  router.push({
                    pathname: `/chat/${property.owner.id}`,
                    params: { propertyId: property.id, hostName: property.owner.fullName || 'Host' },
                  })
                }
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text variant="h3" color="#fff">Message Host</Text>
              </Pressable>
            )}

            <View style={styles.contactRow}>
              <Pressable style={[styles.contactBtn, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text variant="h3" color="#fff">WhatsApp</Text>
              </Pressable>
              <Pressable style={[styles.contactBtn, { backgroundColor: '#007AFF' }]} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text variant="h3" color="#fff">Call</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View>
            <Text variant="h2" color={theme.colors.green700}>
              Starting from ₵{property.price}
            </Text>
          </View>
          <Button label="Select Room" onPress={() => router.push(`/hostel/room/${id}`)} fullWidth={false} style={{ minWidth: 140 }} disabled={loading} />
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  content: { paddingBottom: 100 },
  imageWrap: { width: '100%', height: 320, backgroundColor: theme.colors.green100 },
  image: { width: '100%', height: '100%' },
  glassBackBtn: {
    position: 'absolute', top: 48, left: 16,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  glassFavBtn: {
    position: 'absolute', top: 48, right: 16,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  details: { padding: theme.spacing.sp5, borderTopLeftRadius: theme.radius.lg, borderTopRightRadius: theme.radius.lg, marginTop: -20, backgroundColor: theme.colors.white },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  divider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp6 },
  amenityRow: { gap: 12 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: theme.radius.md, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: theme.spacing.sp4, backgroundColor: theme.colors.white,
    borderTopWidth: 1, borderTopColor: theme.colors.line,
    paddingBottom: 32,
  },
});