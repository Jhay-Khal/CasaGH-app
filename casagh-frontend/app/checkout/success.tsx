import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';

export default function Success() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text variant="display" color={theme.colors.green700}>✓</Text>
        </View>
        
        <Text variant="h1" style={{ marginBottom: 12, textAlign: 'center' }}>Booking Confirmed!</Text>
        <Text variant="bodyLg" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginBottom: 32 }}>
          Your payment was successful and your room is secured. Check your email for details.
        </Text>

        <Button 
          label="View Booking" 
          onPress={() => router.replace('/(tabs)/bookings')} 
          style={{ marginBottom: 16 }}
        />
        <Button 
          label="Back to Home" 
          variant="secondary" 
          onPress={() => router.replace('/(tabs)')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  content: { flex: 1, padding: theme.spacing.sp6, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.green100, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }
});
