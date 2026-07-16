import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { verifyPayment } from '../../services/api';

type VerifyState = 'checking' | 'success' | 'failed';

export default function CheckoutSuccess() {
  const { reference } = useLocalSearchParams<{ reference: string }>();
  const [state, setState] = useState<VerifyState>('checking');
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    checkPayment();
  }, [reference]);

  async function checkPayment() {
    if (!reference) {
      setState('failed');
      return;
    }
    try {
      const result = await verifyPayment(reference);
      if (result.verified) {
        setBooking(result.booking);
        setState('success');
      } else {
        setState('failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setState('failed');
    }
  }

  if (state === 'checking') {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={theme.colors.green700} />
        <Text variant="h3" color={theme.colors.inkSoft} style={{ marginTop: 20 }}>
          Confirming your payment…
        </Text>
        <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginTop: 6, textAlign: 'center', paddingHorizontal: 40 }}>
          This should only take a moment
        </Text>
      </View>
    );
  }

  if (state === 'failed') {
    return (
      <View style={styles.centerFill}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.dangerBg }]}>
          <Ionicons name="close" size={40} color={theme.colors.danger} />
        </View>
        <Text variant="h2" style={{ marginTop: 20, textAlign: 'center' }}>
          Payment not confirmed
        </Text>
        <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
          We couldn't confirm your payment yet. If you completed checkout, tap below to check again.
        </Text>
        <Button label="Check Again" onPress={checkPayment} style={{ marginTop: 28, minWidth: 200 }} />
        <Button
          label="Back to Explore"
          variant="secondary"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: 12, minWidth: 200 }}
        />
      </View>
    );
  }

  // state === 'success'
  return (
    <ScrollView contentContainerStyle={styles.successContent}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.green100 }]}>
        <Ionicons name="checkmark" size={44} color={theme.colors.green700} />
      </View>
      <Text variant="h1" style={{ marginTop: 20, textAlign: 'center' }}>
        Booking Confirmed!
      </Text>
      <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
        Your payment was successful and your booking is confirmed.
      </Text>

      {booking && (
        <View style={styles.detailsCard}>
          <View style={styles.row}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Check-in</Text>
            <Text variant="bodyMd">{booking.checkInDate}</Text>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Check-out</Text>
            <Text variant="bodyMd">{booking.checkOutDate}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text variant="h3">Total Paid</Text>
            <Text variant="h3" color={theme.colors.green700}>₵{booking.totalPrice?.toLocaleString()}</Text>
          </View>
        </View>
      )}

      <Button
        label="View My Bookings"
        onPress={() => router.replace('/(tabs)/bookings')}
        style={{ marginTop: 28, width: '100%' }}
      />
      <Button
        label="Back to Explore"
        variant="secondary"
        onPress={() => router.replace('/(tabs)')}
        style={{ marginTop: 12, width: '100%' }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.white, paddingHorizontal: 24 },
  successContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp5,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    width: '100%',
    marginTop: 24,
    backgroundColor: theme.colors.green50,
    padding: theme.spacing.sp5,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp3 },
});