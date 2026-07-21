import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';

function priceUnitLabel(unit?: string): string {
  if (unit === 'ACADEMIC_YEAR') return '/year';
  if (unit === 'TOTAL') return '';
  return '/night'; // default, covers 'NIGHT' and undefined/legacy properties
}

interface Props {
  imageUrl: string;
  name: string;
  location: string;
  pricePerNight: number;
  pricingUnit?: string;
  currency?: string;
  rating: number;
  reviewCount: number;
  verified?: boolean;
  saved?: boolean;
  onPress?: () => void;
  onToggleSave?: () => void;
}

export function ListingCard({
  imageUrl,
  name,
  location,
  pricePerNight,
  pricingUnit,
  currency = '₵',
  rating,
  reviewCount,
  verified,
  saved,
  onPress,
  onToggleSave,
}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {verified && (
          <View style={styles.verifiedBadge}>
            <Text variant="bodySm" style={{ fontFamily: theme.fontFamily.headBold }} color={theme.colors.green700}>
              Verified host
            </Text>
          </View>
        )}
        <Pressable style={styles.favButton} onPress={onToggleSave}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? theme.colors.danger : theme.colors.ink} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text variant="h3">{name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={theme.colors.inkSoft} style={{ marginRight: 4 }} />
          <Text variant="bodySm" color={theme.colors.inkSoft}>
            {location}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text variant="h3" color={theme.colors.green700}>
            {currency}{pricePerNight}
            {priceUnitLabel(pricingUnit) ? (
              <Text variant="bodySm" color={theme.colors.inkSoft}> {priceUnitLabel(pricingUnit)}</Text>
            ) : null}
          </Text>
          <Text variant="bodyMd" style={{ fontFamily: theme.fontFamily.bodySemiBold }}>
            <Ionicons name="star" size={14} color={theme.colors.warning} /> {rating.toFixed(1)} <Text variant="bodySm" color={theme.colors.inkSoft}>({reviewCount})</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.line,
    marginBottom: theme.spacing.sp4,
    shadowColor: theme.colors.green900,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageWrap: { height: 160, backgroundColor: theme.colors.green100 },
  image: { width: '100%', height: '100%' },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
  },
  favButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: theme.spacing.sp4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sp3,
  },
});