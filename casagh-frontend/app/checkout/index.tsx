import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export default function Checkout() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.summaryCard}>
          <Text variant="h2" style={{ marginBottom: 8 }}>Booking Summary</Text>
          <Text variant="bodyLg">Green Valley Hostel</Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft}>2 in a room · Academic Year</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodyLg">Total Amount</Text>
            <Text variant="h2" color={theme.colors.green700}>₵4,200</Text>
          </View>
        </View>

        <Text variant="h2" style={{ marginTop: 24, marginBottom: 16 }}>Payment Details</Text>
        <Input label="Mobile Money Number" placeholder="055 123 4567" keyboardType="phone-pad" />
        <Input label="Network" placeholder="MTN / Telecel / AT" />

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          label="Pay ₵4,200 & Book" 
          onPress={() => router.push('/checkout/success')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4, paddingBottom: 100 },
  summaryCard: { backgroundColor: theme.colors.white, padding: theme.spacing.sp5, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.line },
  divider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: theme.spacing.sp4, backgroundColor: theme.colors.white,
    borderTopWidth: 1, borderTopColor: theme.colors.line,
    paddingBottom: 32
  }
});
