import React from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Text } from '../components/Text';
import { Button } from '../components/Button';

export default function Onboarding() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>
      
      <View style={styles.content}>
        <Text variant="display" color={theme.colors.green900} style={{ marginBottom: 12 }}>
          Find your perfect student stay
        </Text>
        <Text variant="bodyLg" color={theme.colors.inkSoft} style={{ marginBottom: 32 }}>
          Book hostels, apartments, and homestays safely and securely.
        </Text>
        
        <Button 
          label="Get Started" 
          onPress={() => router.replace('/(auth)/login')} 
          style={{ marginBottom: 16 }}
        />
        <Button 
          label="Browse as guest" 
          variant="ghost" 
          onPress={() => router.replace('/(tabs)')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  imageContainer: { flex: 1.5, width: '100%' },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.1)' },
  content: { flex: 1, padding: theme.spacing.sp6, justifyContent: 'center', backgroundColor: theme.colors.white, borderTopLeftRadius: theme.radius.lg, borderTopRightRadius: theme.radius.lg, marginTop: -20 },
});
