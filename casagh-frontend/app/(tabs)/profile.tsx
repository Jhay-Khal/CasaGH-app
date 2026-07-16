import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../../services/api';

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function roleBadgeStyle(role: string) {
  switch (role) {
    case 'ADMIN':
      return { bg: theme.colors.dangerBg, text: theme.colors.danger };
    case 'OWNER':
      return { bg: theme.colors.goldBg, text: '#8A6B1F' };
    default:
      return { bg: theme.colors.teal100, text: theme.colors.teal700 };
  }
}

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  danger?: boolean;
}

function MenuRow({ icon, label, onPress, isLast, danger }: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuRow,
        !isLast && styles.menuRowBorder,
        pressed && styles.menuRowPressed,
      ]}
    >
      <View style={[styles.menuIconWrap, danger && { backgroundColor: theme.colors.dangerBg }]}>
        <Ionicons name={icon} size={18} color={danger ? theme.colors.danger : theme.colors.teal700} />
      </View>
      <Text
        variant="bodyMd"
        color={danger ? theme.colors.danger : theme.colors.ink}
        style={{ flex: 1, marginLeft: 12, fontFamily: theme.fontFamily.bodySemiBold }}
      >
        {label}
      </Text>
      {!danger && <Ionicons name="chevron-forward" size={18} color={theme.colors.inkSoft} />}
    </Pressable>
  );
}

export default function Profile() {
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  async function loadUserData() {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const role = await AsyncStorage.getItem('userRole');
      const userIdStr = await AsyncStorage.getItem('userId');
      if (email) setUserEmail(email);
      if (role) setUserRole(role);

      if (userIdStr) {
        const user = await getUser(parseInt(userIdStr, 10));
        setFullName(user.fullName || '');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  async function handleSignOut() {
    try {
      await AsyncStorage.multiRemove(['token', 'userId', 'userEmail', 'userRole']);
      router.replace('/onboarding');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  const badge = roleBadgeStyle(userRole);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <Text variant="display" color={theme.colors.navy} style={{ marginBottom: 24 }}>
            Profile
          </Text>

          <View style={styles.header}>
            <View style={styles.avatarLarge}>
              <Text variant="h1" color={theme.colors.white}>
                {getInitials(fullName || userEmail)}
              </Text>
            </View>
            <Text variant="h2" style={{ marginTop: 16 }}>
              {fullName || (userEmail ? userEmail.split('@')[0] : 'Guest')}
            </Text>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>
              {userEmail || 'Not logged in'}
            </Text>
            {userRole ? (
              <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                <Text
                  variant="caption"
                  color={badge.text}
                  style={{ fontFamily: theme.fontFamily.bodySemiBold, letterSpacing: 0.5 }}
                >
                  {userRole}
                </Text>
              </View>
            ) : null}
          </View>

          <Text variant="caption" color={theme.colors.teal700} style={styles.sectionLabel}>
            ACCOUNT
          </Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="person-outline"
              label="Personal Information"
              onPress={() => router.push('/profile/edit')}
            />
            <MenuRow icon="card-outline" label="Payment Methods" />
            <MenuRow icon="notifications-outline" label="Notifications" isLast />
          </View>

          <Text variant="caption" color={theme.colors.teal700} style={styles.sectionLabel}>
            SESSION
          </Text>
          <View style={styles.menuCard}>
            <MenuRow icon="log-out-outline" label="Sign Out" onPress={handleSignOut} isLast danger />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.teal50 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingBottom: 40 },
  content: { width: '100%', maxWidth: 480, paddingHorizontal: theme.spacing.sp4, paddingTop: 12 },
  header: { alignItems: 'center', marginBottom: 28 },
  avatarLarge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: theme.colors.teal700,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.green900,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  roleBadge: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
  },
  sectionLabel: { marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 },
  menuCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.sp4,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  menuRowPressed: {
    backgroundColor: theme.colors.teal50,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});