import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { Text } from '../../../components/Text';
import { api } from '../../api/client';
import { ActivityIndicator } from 'react-native';

export default function Reviews() {
  const { id } = useLocalSearchParams();
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data: any = await api.get(`/reviews/property/${id}`);
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 8 }}>Based on {reviews.length} reviews</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.green700} style={{ marginTop: 40 }} />
        ) : (
          reviews.map(rev => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.revHeader}>
                <Image source={{ uri: rev.user?.avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa8ea' }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text variant="h3">{rev.user?.name || "Guest"}</Text>
                  <Text variant="caption" color={theme.colors.inkSoft}>{new Date(rev.createdAt).toDateString()}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color={theme.colors.white} style={{ marginRight: 4 }} />
                  <Text variant="caption" color={theme.colors.white} style={{ fontFamily: theme.fontFamily.bodyBold }}>{rev.rating}.0</Text>
                </View>
              </View>
              <Text variant="bodyMd" style={{ marginTop: 12, lineHeight: 22 }}>{rev.comment}</Text>
            </View>
          ))
        )}
        {!loading && reviews.length === 0 && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>No reviews yet.</Text>
          </View>
        )}
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
