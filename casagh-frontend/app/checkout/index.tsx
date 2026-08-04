import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { getPropertyById, createBooking, initiatePayment } from '../../services/api';
import { useAppAlert } from '../context/AppAlertContext';

function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + 'T00:00:00');
  return date < today;
}

function getTodayStr(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function Checkout() {
  const { propertyId, checkIn, checkOut } = useLocalSearchParams<{
    propertyId: string;
    checkIn?: string;
    checkOut?: string;
  }>();

  const { showAlert } = useAppAlert();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [datesValid, setDatesValid] = useState(true);

  const isSale = !checkIn && !checkOut;

  useEffect(() => {
    if (!isSale) {
      validateDates();
    }
    loadProperty();
  }, [propertyId]);

  function validateDates() {
    if (!checkIn || !checkOut) {
      setDatesValid(false);
      return;
    }
    const checkInDate = new Date(checkIn + 'T00:00:00');
    const checkOutDate = new Date(checkOut + 'T00:00:00');

    if (isPastDate(checkIn)) {
      setDatesValid(false);
      showAlert('Invalid Check-in Date', 'Check-in date cannot be in the past. Please go back and select a valid date.', () => {
        router.back();
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      setDatesValid(false);
      showAlert('Invalid Dates', 'Check-out date must be after check-in date. Please go back and select valid dates.', () => {
        router.back();
      });
      return;
    }

    setDatesValid(true);
  }

  async function loadProperty() {
    try {
      const data = await getPropertyById(Number(propertyId));
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
      showAlert('Error', 'Could not load property details');
    } finally {
      setLoading(false);
    }
  }

  const nights =
    !isSale && checkIn && checkOut
      ? Math.round(
          (new Date(checkOut + 'T00:00:00').getTime() - new Date(checkIn + 'T00:00:00').getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalPrice = property
    ? (isSale ? property.price : nights * property.price)
    : 0;

  async function handlePay() {
    if (!isSale && !datesValid) {
      showAlert('Invalid dates', 'Please go back and select valid check-in and check-out dates.');
      return;
    }
    if (!property || (!isSale && nights <= 0)) {
      showAlert('Error', 'Missing booking details. Please go back and select your dates again.');
      return;
    }

    setProcessing(true);
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (!userIdStr || !userEmail) {
        showAlert('Not signed in', 'Please log in to complete your booking.');
        setProcessing(false);
        return;
      }
      const userId = parseInt(userIdStr, 10);

      // For sale properties, there's no date range — use today as a placeholder
      // single-day record, since the purchase isn't date-bound.
      const bookingCheckIn = isSale ? getTodayStr() : checkIn!;
      const bookingCheckOut = isSale ? getTodayStr() : checkOut!;

      // 1. Create the booking (status: PENDING)
      const booking = await createBooking(Number(propertyId), userId, bookingCheckIn, bookingCheckOut);

      // 2. Initialize Paystack transaction with email
      const payment = await initiatePayment(booking.id, userEmail);

      // 3. Open Paystack's hosted checkout page
      const canOpen = await Linking.canOpenURL(payment.authorizationUrl);
      if (canOpen) {
        await Linking.openURL(payment.authorizationUrl);
      }

      // 4. Move to success screen
      router.push({
        pathname: '/checkout/success',
        params: { reference: payment.reference },
      });
    } catch (error: any) {
      showAlert('Payment failed', error?.message || 'Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="home" size={20} color={theme.colors.green700} />
            <Text variant="h2" style={{ marginLeft: 8 }}>
              {isSale ? 'Purchase Summary' : 'Booking Summary'}
            </Text>
          </View>

          <Text variant="bodyLg" style={{ marginTop: 16 }}>{property?.title}</Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft}>
            {property?.area}, {property?.city}
          </Text>

          <View style={styles.divider} />

          {isSale ? (
            <View style={styles.row}>
              <Text variant="bodyMd" color={theme.colors.inkSoft}>Sale Price</Text>
              <Text variant="bodyMd">₵{property?.price?.toLocaleString()}</Text>
            </View>
          ) : (
            <>
              <View style={styles.row}>
                <Text variant="bodyMd" color={theme.colors.inkSoft}>Check-in</Text>
                <Text variant="bodyMd">{checkIn}</Text>
              </View>
              <View style={[styles.row, { marginTop: 8 }]}>
                <Text variant="bodyMd" color={theme.colors.inkSoft}>Check-out</Text>
                <Text variant="bodyMd">{checkOut}</Text>
              </View>
              <View style={[styles.row, { marginTop: 8 }]}>
                <Text variant="bodyMd" color={theme.colors.inkSoft}>Duration</Text>
                <Text variant="bodyMd">{nights} night{nights !== 1 ? 's' : ''}</Text>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text variant="bodyLg">Total Amount</Text>
            <Text variant="h2" color={theme.colors.green700}>₵{totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.paymentNotice}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.green700} />
          <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginLeft: 10, flex: 1 }}>
            You'll be redirected to Paystack's secure checkout to complete payment via card or mobile money.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={processing ? 'Processing…' : `Pay ₵${totalPrice.toLocaleString()}${isSale ? '' : ' & Book'}`}
          onPress={handlePay}
          disabled={processing || loading || (!isSale && !datesValid)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4, paddingBottom: 120 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summaryCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp5,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    padding: theme.spacing.sp4,
    backgroundColor: theme.colors.green100,
    borderRadius: theme.radius.md,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: theme.spacing.sp4, backgroundColor: theme.colors.white,
    borderTopWidth: 1, borderTopColor: theme.colors.line,
    paddingBottom: 32,
  },
});