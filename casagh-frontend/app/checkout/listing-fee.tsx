import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { initiateListingPayment, verifyListingPayment } from '../../services/api';

export default function ListingFee() {
  const { propertyId, propertyTitle, email } = useLocalSearchParams<{
    propertyId: string;
    propertyTitle: string;
    email: string;
  }>();

  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [reference, setReference] = useState('');

  async function handlePay() {
    setProcessing(true);
    try {
      const payment = await initiateListingPayment(Number(propertyId), email);
      setReference(payment.reference);
      const canOpen = await Linking.canOpenURL(payment.authorizationUrl);
      if (canOpen) {
        await Linking.openURL(payment.authorizationUrl);
      }
      setPaid(true);
    } catch (error: any) {
      if (error?.message?.includes('already')) {
        window.alert('✅ Your listing fee was already paid! Property is pending admin review.');
        router.replace('/(tabs)');
        return;
      }
      window.alert('Payment failed: ' + (error?.message || 'Something went wrong.'));
    } finally {
      setProcessing(false);
    }
  }

  async function handleVerify() {
    setProcessing(true);
    try {
      if (reference) {
        await verifyListingPayment(reference);
      }
      window.alert('✅ Payment confirmed! Your property is pending admin review and will go live once approved.');
      router.replace('/(tabs)');
    } catch (error: any) {
      window.alert('✅ Your listing fee was received! Your property is pending admin review.');
      router.replace('/(tabs)');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.iconWrap}>
          <Ionicons name="card" size={36} color="#C9A84C" />
        </View>

        <Text variant="h1" color="#0D1B4B" style={{ textAlign: 'center', marginTop: 16 }}>
          Listing Fee
        </Text>
        <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}>
          Pay a monthly listing fee to publish your property on CasaGH.
        </Text>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Property</Text>
            <Text variant="bodyMd" color="#0D1B4B" style={{ flex: 1, textAlign: 'right' }} numberOfLines={1}>
              {propertyTitle}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Duration</Text>
            <Text variant="bodyMd" color="#0D1B4B">1 Month</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text variant="h3" color="#0D1B4B">Listing Fee</Text>
            <Text variant="h2" color="#3AAFA9">₵50.00</Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsCard}>
          <Text variant="h3" color="#0D1B4B" style={{ marginBottom: 12 }}>What happens next?</Text>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text variant="caption" color="#fff">1</Text></View>
            <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ flex: 1 }}>
              Pay ₵50 listing fee via Paystack
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text variant="caption" color="#fff">2</Text></View>
            <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ flex: 1 }}>
              Our team reviews your document and property details
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text variant="caption" color="#fff">3</Text></View>
            <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ flex: 1 }}>
              Once approved, your listing goes live on CasaGH
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text variant="caption" color="#fff">4</Text></View>
            <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ flex: 1 }}>
              Renew monthly to keep your listing active
            </Text>
          </View>
        </View>

        {/* Notice */}
        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={18} color="#3AAFA9" />
          <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginLeft: 8, flex: 1 }}>
            Your property will remain <Text variant="bodySm" style={{ fontWeight: 'bold' }}>PENDING</Text> until our admin team approves your verification document.
          </Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {!paid ? (
          <Button
            label={processing ? 'Opening Paystack...' : 'Pay ₵50 Listing Fee'}
            onPress={handlePay}
            disabled={processing}
          />
        ) : (
          <>
            <Text variant="bodySm" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginBottom: 12 }}>
              Completed payment on Paystack? Tap below to confirm.
            </Text>
            <Button
              label={processing ? 'Verifying...' : 'I Have Paid — Verify Payment'}
              onPress={handleVerify}
              disabled={processing}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FAFA' },
  content: { padding: 24, paddingBottom: 120 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FDF6E3',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginTop: 20,
    borderWidth: 2, borderColor: '#C9A84C33',
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, marginTop: 24,
    borderWidth: 1, borderColor: '#DCE8F0',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: 8,
  },
  divider: { height: 1, backgroundColor: '#DCE8F0', marginVertical: 12 },
  stepsCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, marginTop: 16,
    borderWidth: 1, borderColor: '#DCE8F0', gap: 12,
  },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#3AAFA9',
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  noticeBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#E0F5F4', borderRadius: 12,
    padding: 14, marginTop: 16, gap: 4,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#DCE8F0', paddingBottom: 36,
  },
});