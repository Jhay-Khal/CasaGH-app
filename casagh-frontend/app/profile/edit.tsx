import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { getUser, updateUser } from '../../services/api';

export default function EditProfile() {
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) {
        setLoading(false);
        return;
      }
      const id = parseInt(userIdStr, 10);
      setUserId(id);
      const user = await getUser(id);
      setName(user.fullName || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    } catch (error) {
      console.error('Failed to load user:', error);
      Alert.alert('Error', 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!userId) return;
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Invalid phone', 'Please enter a valid phone number.');
      return;
    }

    setSaving(true);
    try {
      await updateUser(userId, name.trim(), phone.trim());
      await AsyncStorage.setItem('userFullName', name.trim());
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      Alert.alert('Update failed', error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={theme.colors.green700} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)/profile')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h1">Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            <Text variant="h1" color={theme.colors.white}>
              {name ? name.trim().charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        </View>

        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="024XXXXXXX" />
        <Input label="Email" value={email} editable={false} style={styles.disabledInput} />
        <Text variant="caption" color={theme.colors.inkSoft} style={{ marginTop: -8, marginBottom: 8 }}>
          Email can't be changed
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button label={saving ? 'Saving…' : 'Save Changes'} onPress={handleSave} disabled={saving} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { padding: theme.spacing.sp5, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.green700, alignItems: 'center', justifyContent: 'center' },
  disabledInput: { backgroundColor: theme.colors.surface, color: theme.colors.inkSoft },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: theme.spacing.sp4, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: theme.colors.line, paddingBottom: 32 },
});