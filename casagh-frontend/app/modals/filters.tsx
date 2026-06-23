import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';

export default function FiltersModal() {
  const [priceRange, setPriceRange] = useState(2500);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">Filters</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={theme.colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h3" style={{ marginBottom: 12 }}>Room Type</Text>
        <View style={styles.chipRow}>
          <Chip label="1 in a room" outline />
          <Chip label="2 in a room" active />
          <Chip label="3 in a room" outline />
          <Chip label="4 in a room" outline />
        </View>

        <View style={styles.divider} />

        <Text variant="h3" style={{ marginBottom: 12 }}>Max Price: ₵{priceRange}</Text>
        {/* Mock slider for UI purposes */}
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: '60%' }]} />
          <View style={[styles.sliderThumb, { left: '60%' }]} />
        </View>
        <View style={styles.priceLabels}>
          <Text variant="bodySm" color={theme.colors.inkSoft}>₵1,000</Text>
          <Text variant="bodySm" color={theme.colors.inkSoft}>₵5,000+</Text>
        </View>

        <View style={styles.divider} />

        <Text variant="h3" style={{ marginBottom: 12 }}>Amenities</Text>
        <View style={styles.amenitiesGrid}>
          <View style={styles.checkboxRow}><Ionicons name="square-outline" size={24} color={theme.colors.inkSoft} /><Text variant="bodyMd">Air Conditioning</Text></View>
          <View style={styles.checkboxRow}><Ionicons name="checkbox" size={24} color={theme.colors.green700} /><Text variant="bodyMd">Wi-Fi included</Text></View>
          <View style={styles.checkboxRow}><Ionicons name="checkbox" size={24} color={theme.colors.green700} /><Text variant="bodyMd">Backup Generator</Text></View>
          <View style={styles.checkboxRow}><Ionicons name="square-outline" size={24} color={theme.colors.inkSoft} /><Text variant="bodyMd">Study Room</Text></View>
          <View style={styles.checkboxRow}><Ionicons name="square-outline" size={24} color={theme.colors.inkSoft} /><Text variant="bodyMd">Gym</Text></View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="ghost" label="Clear all" onPress={() => {}} fullWidth={false} />
        <Button label="Show 12 Hostels" onPress={() => router.back()} fullWidth={false} style={{ flex: 1, marginLeft: 16 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp5, paddingVertical: theme.spacing.sp4, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  closeBtn: { padding: 4 },
  content: { padding: theme.spacing.sp5, paddingBottom: 100 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  divider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp6 },
  sliderTrack: { height: 4, backgroundColor: theme.colors.line, borderRadius: 2, marginVertical: 12, position: 'relative' },
  sliderFill: { position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: theme.colors.green700, borderRadius: 2 },
  sliderThumb: { position: 'absolute', top: -10, width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.white, borderWidth: 2, borderColor: theme.colors.green700, marginLeft: -12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  priceLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  amenitiesGrid: { gap: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', padding: theme.spacing.sp4, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: theme.colors.line, paddingBottom: 32 },
});
