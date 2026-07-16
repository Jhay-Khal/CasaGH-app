import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { Text } from '../../../components/Text';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { getPropertyById } from '../../../services/api';

function parseDate(value: string): Date | null {
  // Expects YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00');
  return isNaN(date.getTime()) ? null : date;
}

function formatDisplay(value: string): string {
  const date = parseDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RoomSelection() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    loadProperty();
  }, [id]);

  async function loadProperty() {
    try {
      const data = await getPropertyById(Number(id));
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
      Alert.alert('Error', 'Could not load property details');
    } finally {
      setLoading(false);
    }
  }

  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);
  const nights =
    checkInDate && checkOutDate && checkOutDate > checkInDate
      ? Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = property ? nights * property.price : 0;

  function handleProceed() {
    if (!checkInDate) {
      Alert.alert('Missing date', 'Please enter a valid check-in date (YYYY-MM-DD).');
      return;
    }
    if (!checkOutDate) {
      Alert.alert('Missing date', 'Please enter a valid check-out date (YYYY-MM-DD).');
      return;
    }
    if (checkOutDate <= checkInDate) {
      Alert.alert('Invalid dates', 'Check-out date must be after check-in date.');
      return;
    }
    router.push({
      pathname: '/checkout',
      params: { propertyId: String(id), checkIn, checkOut },
    });
  }

  if (loading) {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={theme.colors.green700} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.centerFill}>
        <Text variant="h3" color={theme.colors.inkSoft}>Property not found</Text>
        <Button label="Go Back" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Property summary */}
        <View style={styles.propertyCard}>
          <View style={styles.propertyIconWrap}>
            <Ionicons name="home" size={22} color={theme.colors.green700} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="h3">{property.title}</Text>
            <Text variant="bodySm" color={theme.colors.inkSoft}>
              {property.area}, {property.city}
            </Text>
          </View>
          <Text variant="h3" color={theme.colors.green700}>₵{property.price}<Text variant="caption" color={theme.colors.inkSoft}>/night</Text></Text>
        </View>

        <Text variant="h2" style={{ marginTop: 28, marginBottom: 6 }}>Select your dates</Text>
        <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginBottom: 20 }}>
          Enter dates in YYYY-MM-DD format
        </Text>

        <Input
          label="Check-in date"
          placeholder="e.g. 2026-08-15"
          value={checkIn}
          onChangeText={setCheckIn}
        />
        {checkInDate && (
          <Text variant="caption" color={theme.colors.green700} style={{ marginTop: -8, marginBottom: 12 }}>
            {formatDisplay(checkIn)}
          </Text>
        )}

        <Input
          label="Check-out date"
          placeholder="e.g. 2026-08-20"
          value={checkOut}
          onChangeText={setCheckOut}
        />
        {checkOutDate && (
          <Text variant="caption" color={theme.colors.green700} style={{ marginTop: -8, marginBottom: 12 }}>
            {formatDisplay(checkOut)}
          </Text>
        )}

        {nights > 0 && property && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text variant="bodyMd" color={theme.colors.inkSoft}>
                ₵{property.price} × {nights} night{nights !== 1 ? 's' : ''}
              </Text>
              <Text variant="bodyMd">₵{totalPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text variant="h3">Total</Text>
              <Text variant="h3" color={theme.colors.green700}>₵{totalPrice.toLocaleString()}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Proceed to Checkout" onPress={handleProceed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4, paddingBottom: 120 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  propertyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginTop: 20,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp5,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryDivider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp3 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: theme.spacing.sp4, backgroundColor: theme.colors.white,
    borderTopWidth: 1, borderTopColor: theme.colors.line,
    paddingBottom: 32,
  },
});