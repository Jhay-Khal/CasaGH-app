import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="display" style={{ marginBottom: 24, paddingHorizontal: theme.spacing.sp4 }}>Profile</Text>

        <View style={styles.header}>
          <View style={styles.avatarLarge} />
          <Text variant="h1" style={{ marginTop: 16 }}>John Doe</Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft}>john.doe@student.knust.edu.gh</Text>
        </View>

        <View style={styles.section}>
          <Text variant="h2" style={{ marginBottom: 16 }}>Account Settings</Text>
          <Button 
            label="Personal Information" 
            variant="secondary" 
            style={{ marginBottom: 12, justifyContent: 'flex-start' }} 
            leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.green700} />}
            onPress={() => router.push('/profile/edit')}
          />
          <Button 
            label="Payment Methods" 
            variant="secondary" 
            style={{ marginBottom: 12, justifyContent: 'flex-start' }} 
            leftIcon={<Ionicons name="card-outline" size={20} color={theme.colors.green700} />}
          />
          <Button 
            label="Notifications" 
            variant="secondary" 
            style={{ marginBottom: 12, justifyContent: 'flex-start' }} 
            leftIcon={<Ionicons name="notifications-outline" size={20} color={theme.colors.green700} />}
          />
          <Button 
            label="Sign Out" 
            variant="outline" 
            style={{ justifyContent: 'flex-start' }}
            leftIcon={<Ionicons name="log-out-outline" size={20} color={theme.colors.green700} />}
            onPress={() => router.replace('/onboarding')} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { paddingBottom: 48 },
  header: { alignItems: 'center', marginVertical: theme.spacing.sp6 },
  avatarLarge: { width: 96, height: 96, borderRadius: 48, backgroundColor: theme.colors.green100 },
  section: { backgroundColor: theme.colors.white, padding: theme.spacing.sp5, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.line, marginHorizontal: theme.spacing.sp4 }
});
