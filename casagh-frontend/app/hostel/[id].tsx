import React from 'react';
import { ScrollView, View, Image, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { api } from '../api/client';
import { ActivityIndicator } from 'react-native';

export default function HostelDetails() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/properties/${id}`);
      setProperty(data);
    } catch (error: any) {
      console.error('Failed to fetch property details:', error);
      Alert.alert('Error', error.message || 'Failed to fetch property details.');
    } finally {
      setLoading(false);
    }
  };

  const name = property?.name || property?.title || "Hostel";
  const imageUrl = property?.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5";
  const price = property?.price || property?.monthlyRent || 0;
  const isVerified = property?.status === 'VERIFIED';

  const handleWhatsApp = async () => {
    const url = 'whatsapp://send?phone=+233551234567&text=Hello,%20I%20am%20interested%20in%20your%20hostel.';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL('https://wa.me/233551234567');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open WhatsApp');
    }
  };

  const handleCall = async () => {
    const url = 'tel:+233551234567';
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Error', 'Could not open Phone dialer');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.green700} style={{ marginTop: 60 }} />
      ) : (
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
            <Text variant="h1">{name}</Text>
            {isVerified && <Badge label="Verified host" kind="success" />}
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.inkSoft} style={{ marginRight: 6 }} />
            <Text variant="bodyMd" color={theme.colors.inkSoft}>
              {property?.city || 'Kumasi'}, {property?.region || 'Ashanti Region'}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text variant="h2" style={{ marginBottom: 12 }}>About this stay</Text>
          <Text variant="bodyLg" color={theme.colors.ink} style={{ lineHeight: 26 }}>
            {property?.description || "This is a beautiful and serene environment located very close to KNUST campus. It features 24/7 security, continuous water supply, and high-speed Wi-Fi."}
          </Text>

          <View style={styles.divider} />
          
          <Text variant="h2" style={{ marginBottom: 16 }}>Amenities</Text>
          <View style={styles.amenityRow}>
            <View style={styles.amenityItem}>
              <Ionicons name="wifi" size={20} color={theme.colors.green700} />
              <Text variant="bodyMd">High-Speed Wi-Fi</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.green700} />
              <Text variant="bodyMd">24/7 Security</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons name="flash" size={20} color={theme.colors.green700} />
              <Text variant="bodyMd">Backup Generator</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons name="book" size={20} color={theme.colors.green700} />
              <Text variant="bodyMd">Study Rooms</Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <Button variant="secondary" label="View Photo Gallery" onPress={() => router.push(`/hostel/gallery/${id}`)} leftIcon={<Ionicons name="images-outline" size={20} color={theme.colors.green700} />} style={{ marginBottom: 12 }} />
          <Button variant="secondary" label="Read 120 Reviews" onPress={() => router.push(`/hostel/reviews/${id}`)} leftIcon={<Ionicons name="star-outline" size={20} color={theme.colors.green700} />} />
          
          <View style={styles.divider} />
          
          <Text variant="h2" style={{ marginBottom: 16 }}>Contact Host</Text>
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
            Starting from ₵{price}
          </Text>
        </View>
        <Button label="Select Room" onPress={() => router.push(`/hostel/room/${id}`)} fullWidth={false} style={{ minWidth: 140 }} disabled={loading} />
      </View>
      </>
      )}
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
    paddingBottom: 32 // Safe area approx
  }
});
