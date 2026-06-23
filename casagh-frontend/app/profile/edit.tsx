import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export default function EditProfile() {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('055 123 4567');
  const [university, setUniversity] = useState('KNUST');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h1">Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            <Ionicons name="camera" size={32} color={theme.colors.green700} />
          </View>
          <Text variant="bodyMd" color={theme.colors.green700} style={{ marginTop: 12, fontFamily: theme.fontFamily.bodySemiBold }}>
            Change Photo
          </Text>
        </View>

        <Input label="Full Name" value={name} onChangeText={setName} />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label="University" value={university} onChangeText={setUniversity} />

      </ScrollView>

      <View style={styles.footer}>
        <Button label="Save Changes" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { padding: theme.spacing.sp5, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.green100, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.colors.line },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: theme.spacing.sp4, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: theme.colors.line, paddingBottom: 32 },
});
