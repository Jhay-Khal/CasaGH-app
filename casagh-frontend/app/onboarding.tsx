import React from 'react';
import { View, StyleSheet, Image, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../components/Text';

const { height } = Dimensions.get('window');

export default function Onboarding() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />

        {/* Logo on image */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconWrap}>
            <Ionicons name="home" size={22} color="#C9A84C" />
          </View>
          <View>
            <Text style={styles.logoText}>CasaGH</Text>
            <Text style={styles.logoTagline}>Find Home. Find Peace.</Text>
          </View>
        </View>

        {/* Stats row inside image */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10+</Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.content}>

        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={11} color="#3AAFA9" style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>Verified Listings</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="location" size={11} color="#3AAFA9" style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>Ghana Wide</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="star" size={11} color="#C9A84C" style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>Trusted</Text>
          </View>
        </View>

        <Text style={styles.heading}>Find your perfect{'\n'}home in Ghana</Text>
        <Text style={styles.subtext}>
          Browse verified apartments, hostels, and houses. Safe, simple, and smart.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        {/* Browse as Guest */}
        <TouchableOpacity
          style={styles.ghostButton}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.85}
        >
          <Text style={styles.ghostButtonText}>Browse as guest</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing you agree to our{' '}
          <Text style={styles.termsLink}>Terms</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B4B',
  },
  imageContainer: {
    height: height * 0.52,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 27, 75, 0.3)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(13, 27, 75, 0.75)',
  },
  logoContainer: {
    position: 'absolute',
    top: 28,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#0D1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C9A84C',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  logoTagline: {
    fontSize: 12,
    color: '#3AAFA9',
    fontWeight: '600',
    marginTop: 1,
  },
  statsRow: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: '#3AAFA9',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: 'center',
    gap: 14,
    marginTop: -24,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#F0FAFA',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#3AAFA9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    color: '#0D1B4B',
    fontWeight: '600',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0D1B4B',
    lineHeight: 38,
  },
  subtext: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#3AAFA9',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#3AAFA9',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ghostButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C9A84C',
  },
  ghostButtonText: {
    color: '#C9A84C',
    fontSize: 15,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
  },
  termsLink: {
    color: '#3AAFA9',
    fontWeight: '600',
  },
});