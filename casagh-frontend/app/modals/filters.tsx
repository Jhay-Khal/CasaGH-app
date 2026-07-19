import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { useFilters } from '../../context/FilterContext';

const ROOM_TYPES = ['1', '2', '3', '4'];
const AMENITIES = ['Air Conditioning', 'Wi-Fi included', 'Backup Generator', 'Study Room', 'Gym'];

export default function FiltersModal() {
  const { filters, setRoomType, setMaxPrice, toggleAmenity, clearFilters, applyFilters, properties } = useFilters();
  const resultCount = applyFilters(properties).length;

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
          {ROOM_TYPES.map((rt) => (
            <Chip
              key={rt}
              label={`${rt} in a room`}
              active={filters.roomType === rt}
              outline={filters.roomType !== rt}
              onPress={() => setRoomType(rt)}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <Text variant="h3" style={{ marginBottom: 12 }}>Max Price: ₵{filters.maxPrice}</Text>
        <Slider
          minimumValue={1000}
          maximumValue={5000}
          step={100}
          value={filters.maxPrice}
          onValueChange={setMaxPrice}
          minimumTrackTintColor={theme.colors.green700}
          maximumTrackTintColor={theme.colors.line}
          thumbTintColor={theme.colors.green700}
        />
        <View style={styles.priceLabels}>
          <Text variant="bodySm" color={theme.colors.inkSoft}>₵1,000</Text>
          <Text variant="bodySm" color={theme.colors.inkSoft}>₵5,000+</Text>
        </View>

        <View style={styles.divider} />

        <Text variant="h3" style={{ marginBottom: 12 }}>Amenities</Text>
        <View style={styles.amenitiesGrid}>
          {AMENITIES.map((a) => {
            const checked = filters.amenities.has(a);
            return (
              <Pressable key={a} style={styles.checkboxRow} onPress={() => toggleAmenity(a)}>
                <Ionicons
                  name={checked ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={checked ? theme.colors.green700 : theme.colors.inkSoft}
                />
                <Text variant="bodyMd">{a}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="ghost" label="Clear all" onPress={clearFilters} fullWidth={false} />
        <Button
          label={`Show ${resultCount} ${resultCount === 1 ? 'Hostel' : 'Hostels'}`}
          onPress={() => router.back()}
          fullWidth={false}
          style={{ flex: 1, marginLeft: 16 }}
        />
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
  priceLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  amenitiesGrid: { gap: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', padding: theme.spacing.sp4, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: theme.colors.line, paddingBottom: 32 },
});