import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { ListingCard } from '../../components/ListingCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function Saved() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchSaved();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const data: any = await api.get(`/saved/${user?.id}`);
      setSavedProperties(data || []);
    } catch (error: any) {
      console.error('Failed to fetch saved properties:', error);
      Alert.alert('Error', error.message || 'Failed to fetch saved properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (propertyId: number) => {
    if (!user) return;
    try {
      await api.delete(`/saved/${user.id}/${propertyId}`);
      fetchSaved();
    } catch (error) {
      Alert.alert('Error', 'Failed to unsave property');
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {!user ? (
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 20 }}>
            Please sign in to view saved properties.
          </Text>
        ) : loading ? (
          <ActivityIndicator size="large" color={theme.colors.green700} style={{ marginTop: 40 }} />
        ) : savedProperties.length === 0 ? (
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 20 }}>
            No saved properties yet.
          </Text>
        ) : (
          <>
            <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginBottom: 16 }}>
              You have {savedProperties.length} saved stay(s)
            </Text>

            {savedProperties.map((sp: any) => {
              const property = sp.property;
              return (
                <ListingCard
                  key={sp.id}
                  imageUrl={property?.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5"}
                  name={property?.name || property?.title}
                  location={`${property?.city}, ${property?.region}`}
                  pricePerNight={property?.price || property?.monthlyRent || 0}
                  rating={4.8}
                  reviewCount={120}
                  verified={property?.status === 'VERIFIED'}
                  saved
                  onPress={() => router.push(`/hostel/${property?.id}`)}
                  onToggleSave={() => handleToggleSave(property?.id)}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4 },
});
