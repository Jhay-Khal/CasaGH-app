import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { Text } from '../../../components/Text';

const REVIEWS = [
  { id: '1', name: 'Alice Osei', date: 'Aug 2025', rating: 5, text: 'Amazing hostel! The Wi-Fi is super fast and the study rooms are very quiet. Definitely worth the price.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa8ea' },
  { id: '2', name: 'Kwame Mensah', date: 'May 2025', rating: 4, text: 'Great place, very secure. The only downside is the distance to the main gate, but shuttles are available.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d' },
  { id: '3', name: 'Sandra Yeboah', date: 'Jan 2025', rating: 5, text: 'I stayed here for 2 years and never had an issue with water or electricity. The management is very responsive.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' },
];

export default function Reviews() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h1">Reviews</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text variant="display" color={theme.colors.green900}>4.8</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={20} color={theme.colors.warning} />)}
          </View>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 8 }}>Based on 120 reviews</Text>
        </View>

        {REVIEWS.map(rev => (
          <View key={rev.id} style={styles.reviewCard}>
            <View style={styles.revHeader}>
              <Image source={{ uri: rev.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text variant="h3">{rev.name}</Text>
                <Text variant="caption" color={theme.colors.inkSoft}>{rev.date}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={theme.colors.white} style={{ marginRight: 4 }} />
                <Text variant="caption" color={theme.colors.white} style={{ fontFamily: theme.fontFamily.bodyBold }}>{rev.rating}.0</Text>
              </View>
            </View>
            <Text variant="bodyMd" style={{ marginTop: 12, lineHeight: 22 }}>{rev.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, backgroundColor: theme.colors.white, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { padding: theme.spacing.sp4, paddingBottom: 100 },
  summaryBox: { alignItems: 'center', padding: theme.spacing.sp6, backgroundColor: theme.colors.white, borderRadius: theme.radius.lg, marginBottom: theme.spacing.sp5, borderWidth: 1, borderColor: theme.colors.line },
  starsRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  reviewCard: { backgroundColor: theme.colors.white, padding: theme.spacing.sp5, borderRadius: theme.radius.lg, marginBottom: theme.spacing.sp4, borderWidth: 1, borderColor: theme.colors.line },
  revHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.green100, marginRight: 12 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.warning, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.pill },
});
