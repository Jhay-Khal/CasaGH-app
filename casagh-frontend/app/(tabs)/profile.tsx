import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { useAuth } from '../context/AuthContext';

// A helper for the menu items
const MenuItem = ({ icon, title, onPress }: { icon: any, title: string, onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={24} color={theme.colors.green700} />
      <Text variant="bodyLg" style={styles.menuItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={theme.colors.green700} />
  </TouchableOpacity>
);

export default function Profile() {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarLarge}>
              <Text variant="h1" color={theme.colors.white} style={styles.avatarLetter}>{user?.name?.[0] || 'U'}</Text>
            </View>
            <View style={styles.headerText}>
              <Text variant="h1" color={theme.colors.green700}>{user?.name || 'Guest User'}</Text>
              <Text variant="bodyMd" color={theme.colors.green700}>{user?.email || 'Sign in to sync data'}</Text>
            </View>
          </View>
        </View>

        {/* Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIcon}>
            <Ionicons name="business" size={40} color={theme.colors.green700} />
          </View>
          <View style={styles.bannerContent}>
            <Text variant="h2" color={theme.colors.green700} style={{ marginBottom: 4 }}>CasaGH Your Stay</Text>
            <Text variant="bodySm" color={theme.colors.inkSoft}>
              Accommodation, storage reservations, transport and student life made easy, right on your campus.
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem icon="person" title="Personal Info" onPress={() => router.push('/profile/edit')} />
          <View style={styles.divider} />
          <MenuItem icon="receipt" title="Deposits & Transaction" />
          <View style={styles.divider} />
          <MenuItem icon="briefcase" title="How CasaGH Works" />
          <View style={styles.divider} />
          <MenuItem icon="people" title="Our Referral Program" />
          <View style={styles.divider} />
          <MenuItem icon="help-circle" title="About Us" />
          <View style={styles.divider} />
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text variant="bodyMd" style={{ fontFamily: theme.fontFamily.bodyBold, color: theme.colors.inkSoft }}>
            Joined CasaGH on July 14, 2025
          </Text>
          <Text variant="bodySm" color={theme.colors.line} style={{ marginTop: 4 }}>
            App v4.0.3 · OTA 019ee3fa
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={theme.colors.green700} />
            <Text variant="bodyMd" color={theme.colors.green700} style={styles.btnText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.green700} />
            <Text variant="bodyMd" color={theme.colors.green700} style={styles.btnText}>Delete account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  content: { paddingBottom: 48, paddingTop: 16 },
  header: { paddingHorizontal: theme.spacing.sp5, marginBottom: theme.spacing.sp5 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarLarge: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: theme.colors.green700,
    justifyContent: 'center', alignItems: 'center'
  },
  avatarLetter: { fontSize: 32, lineHeight: 32 },
  headerText: { flex: 1 },

  bannerCard: {
    marginHorizontal: theme.spacing.sp5,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.line,
    flexDirection: 'row', gap: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
    marginBottom: 32
  },
  bannerIcon: { width: 64, height: 64, backgroundColor: theme.colors.green100, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  bannerContent: { flex: 1 },

  menuSection: { paddingHorizontal: theme.spacing.sp5, marginBottom: 32 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuItemText: { color: theme.colors.ink, fontFamily: theme.fontFamily.bodySemiBold },
  divider: { height: 1, backgroundColor: theme.colors.line, opacity: 0.5 },

  footerInfo: { alignItems: 'center', marginBottom: 32 },

  actionRow: { flexDirection: 'row', gap: 16, paddingHorizontal: theme.spacing.sp5, justifyContent: 'center' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 24, borderWidth: 1, borderColor: theme.colors.green700
  },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 24, backgroundColor: theme.colors.green100
  },
  btnText: { fontFamily: theme.fontFamily.bodySemiBold }
});
