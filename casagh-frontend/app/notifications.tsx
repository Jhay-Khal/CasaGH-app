import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from '../components/Text';

const NOTIFICATIONS = [
  { id: '1', title: 'Booking Confirmed!', message: 'Your room at Green Valley Hostel is confirmed for the academic year.', time: '2m ago', type: 'success', unread: true },
  { id: '2', title: 'Payment Reminder', message: 'You have a pending payment of ₵4,200 due in 3 days.', time: '1h ago', type: 'warning', unread: true },
  { id: '3', title: 'New Message from Host', message: 'Evandy Hostel: "Hello, yes we have study rooms available."', time: 'Yesterday', type: 'message', unread: false },
  { id: '4', title: 'Flash Promo!', message: 'Get 10% off early bookings at selected hostels. Tap to view.', time: '2 days ago', type: 'promo', unread: false },
];

export default function Notifications() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h1">Notifications</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {NOTIFICATIONS.map(notif => {
          const isSuccess = notif.type === 'success';
          const isWarning = notif.type === 'warning';
          const isMessage = notif.type === 'message';
          
          let iconName = 'notifications';
          let iconColor: string = theme.colors.green700;
          let bgColor: string = theme.colors.green100;

          if (isSuccess) { iconName = 'checkmark-circle'; iconColor = theme.colors.green700; }
          if (isWarning) { iconName = 'alert-circle'; iconColor = theme.colors.warning; bgColor = '#fffbeb'; }
          if (isMessage) { iconName = 'chatbubble-ellipses'; iconColor = theme.colors.ink; bgColor = theme.colors.line; }

          return (
            <Pressable key={notif.id} style={[styles.card, notif.unread && styles.unreadCard]}>
              <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
                <Ionicons name={iconName as any} size={24} color={iconColor} />
              </View>
              <View style={styles.textWrap}>
                <Text variant="h3">{notif.title}</Text>
                <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 4 }}>{notif.message}</Text>
                <Text variant="caption" color={theme.colors.inkSoft} style={{ marginTop: 8 }}>{notif.time}</Text>
              </View>
              {notif.unread && <View style={styles.unreadDot} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { padding: theme.spacing.sp4 },
  card: { flexDirection: 'row', padding: theme.spacing.sp4, backgroundColor: theme.colors.white, borderRadius: theme.radius.lg, marginBottom: theme.spacing.sp3, borderWidth: 1, borderColor: theme.colors.line, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  unreadCard: { backgroundColor: theme.colors.green50, borderColor: theme.colors.green700 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.sp4 },
  textWrap: { flex: 1 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.green700, marginTop: 4 },
});
