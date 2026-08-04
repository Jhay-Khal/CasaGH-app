import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Badge } from '../../components/Badge';
import { getUserBookings, getPropertyImage, getPropertyImages } from '../../services/api';

const API_BASE = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api').replace('/api', '');

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [imageMap, setImageMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) {
        setLoading(false);
        return;
      }
      const data = await getUserBookings(parseInt(userIdStr, 10));
      setBookings(data);

      // Fetch real images for each booked property
      const map: Record<number, string> = {};
      await Promise.all(
        data.map(async (booking: any) => {
          const property = booking.property;
          if (!property) return;
          const images = await getPropertyImages(property.id);
          const resolved = resolveImageUrl(images?.[0]?.imageUrl);
          map[property.id] = resolved || getPropertyImage(property.type, property.id);
        })
      );
      setImageMap(map);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date();
  const upcoming = bookings.filter((b) => new Date(b.checkOutDate) >= today);
  const past = bookings.filter((b) => new Date(b.checkOutDate) < today);
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  function renderBookingCard(booking: any) {
    const isConfirmed = booking.status === 'CONFIRMED';
    const isPast = new Date(booking.checkOutDate) < today;
    const property = booking.property;
    const imageUrl = property
      ? imageMap[property.id] || getPropertyImage(property.type, property.id)
      : null;

    return (
      <Pressable
        key={booking.id}
        style={styles.bookingCard}
        onPress={() => property && router.push(`/hostel/${property.id}`)}
      >
        <View style={styles.cardImageWrap}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.cardImageFallback]}>
              <Ionicons name="home" size={22} color={theme.colors.green700} />
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.bookingHeader}>
            <Text variant="h3" numberOfLines={1} style={{ flex: 1 }}>
              {property?.title || 'Property'}
            </Text>
            <Badge
              label={isPast ? 'Completed' : isConfirmed ? 'Confirmed' : 'Pending'}
              kind={isPast ? 'pending' : isConfirmed ? 'success' : 'pending'}
            />
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={13} color={theme.colors.inkSoft} style={{ marginRight: 4 }} />
            <Text variant="bodySm" color={theme.colors.inkSoft} numberOfLines={1}>
              {property?.area}, {property?.city}
            </Text>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateChip}>
              <Ionicons name="calendar-outline" size={12} color={theme.colors.green700} />
              <Text variant="caption" color={theme.colors.green700} style={{ marginLeft: 4 }}>
                {formatDate(booking.checkInDate)}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={12} color={theme.colors.inkSoft} style={{ marginHorizontal: 6 }} />
            <View style={styles.dateChip}>
              <Text variant="caption" color={theme.colors.green700}>
                {formatDate(booking.checkOutDate)}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text variant="caption" color={theme.colors.inkSoft}>Total paid</Text>
            <Text variant="h3" color={theme.colors.green700}>
              ₵{booking.totalPrice?.toLocaleString()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={theme.colors.green700} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <View style={styles.header}>
            <View>
              <Text variant="display" color={theme.colors.navy}>My Bookings</Text>
              <Text variant="caption" color={theme.colors.teal700}>
                {bookings.length} total · {confirmedCount} confirmed
              </Text>
            </View>
            <View style={styles.headerIconWrap}>
              <Ionicons name="calendar" size={20} color={theme.colors.navy} />
            </View>
          </View>

          <Text variant="h2" style={{ marginBottom: 14 }}>Upcoming</Text>
          {upcoming.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="calendar-outline" size={32} color={theme.colors.green700} />
              </View>
              <Text variant="h3" color={theme.colors.ink} style={{ marginTop: 14 }}>
                No upcoming bookings
              </Text>
              <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginTop: 4, textAlign: 'center' }}>
                Find a place you love and book your stay
              </Text>
              <Pressable style={styles.browseBtn} onPress={() => router.replace('/(tabs)')}>
                <Text variant="bodyMd" color={theme.colors.white} style={{ fontFamily: theme.fontFamily.bodySemiBold }}>
                  Browse Properties
                </Text>
              </Pressable>
            </View>
          ) : (
            upcoming.map(renderBookingCard)
          )}

          {past.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text variant="h2" style={{ marginBottom: 14 }}>Past</Text>
              {past.map(renderBookingCard)}
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
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.teal50 },
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
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    marginBottom: theme.spacing.sp3,
    overflow: 'hidden',
    shadowColor: theme.colors.green900,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardImageWrap: { width: 96 },
  cardImage: { width: 96, height: '100%', minHeight: 132 },
  cardImageFallback: { backgroundColor: theme.colors.green100, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, padding: theme.spacing.sp3 },
  bookingHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.teal100,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.pill,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
  },
  divider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp6 },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.sp6,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    marginBottom: theme.spacing.sp4,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseBtn: {
    marginTop: 20,
    backgroundColor: theme.colors.green700,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.radius.pill,
  },
});