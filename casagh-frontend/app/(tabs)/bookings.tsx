import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Badge } from '../../components/Badge';

export default function Bookings() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <Text variant="h2" style={{ marginBottom: 16 }}>Upcoming</Text>
        
        <Pressable style={styles.bookingCard} onPress={() => router.push('/checkout/success')}>
          <View style={styles.bookingHeader}>
            <Text variant="h3">Green Valley Hostel</Text>
            <Badge label="Confirmed" kind="success" />
          </View>
          <Text variant="bodyMd" color={theme.colors.inkSoft}>1 in a room · Aug 2026 - May 2027</Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 8 }}>Total: ₵2,550</Text>
        </Pressable>

        <View style={styles.divider} />

        <Text variant="h2" style={{ marginBottom: 16 }}>Past</Text>

        <View style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text variant="h3">Evandy Hostel</Text>
            <Badge label="Completed" kind="pending" />
          </View>
          <Text variant="bodyMd" color={theme.colors.inkSoft}>2 in a room · Aug 2025 - May 2026</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4 },
  bookingCard: { backgroundColor: theme.colors.white, padding: theme.spacing.sp4, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.line },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  divider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp6 },
});
