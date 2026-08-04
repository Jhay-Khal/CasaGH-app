import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';
import { Text } from '../components/Text';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<number | null>(null);

  React.useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) {
        setLoading(false);
        return;
      }
      const id = parseInt(userIdStr, 10);
      setUserId(id);
      const data = await getNotifications(id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notifId: number) => {
    try {
      await markNotificationRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await markAllNotificationsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h1">Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Text variant="caption" color={theme.colors.teal700}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.teal700} style={{ marginTop: 40 }} />
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="notifications-outline" size={36} color={theme.colors.teal700} />
            </View>
            <Text variant="h3" style={{ marginTop: 16 }}>No notifications yet</Text>
            <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginTop: 4, textAlign: 'center' }}>
              You'll be notified about bookings, messages, and property updates here.
            </Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const isRead = notif.read;
            let iconName: any = 'notifications';
            let iconColor: string = theme.colors.teal700;
            let bgColor: string = theme.colors.teal100;

            if (notif.type === 'BOOKING') {
              iconName = 'calendar';
              iconColor = theme.colors.teal700;
              bgColor = theme.colors.teal100;
            } else if (notif.type === 'MESSAGE') {
              iconName = 'chatbubble-ellipses';
              iconColor = theme.colors.navy;
              bgColor = '#E8EAF6';
            } else if (notif.type === 'PAYMENT') {
              iconName = 'card';
              iconColor = '#059669';
              bgColor = '#ECFDF5';
            } else if (notif.type === 'APPROVAL') {
              iconName = 'checkmark-circle';
              iconColor = '#059669';
              bgColor = '#ECFDF5';
            } else if (notif.type === 'REJECTION') {
              iconName = 'close-circle';
              iconColor = '#EF4444';
              bgColor = '#FEF2F2';
            }

            return (
              <Pressable
                key={notif.id}
                style={[styles.card, !isRead && styles.unreadCard]}
                onPress={() => !isRead && handleMarkRead(notif.id)}
              >
                <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
                  <Ionicons name={iconName} size={22} color={iconColor} />
                </View>
                <View style={styles.textWrap}>
                  <Text variant="h3">{notif.type || 'Notification'}</Text>
                  <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 4 }}>
                    {notif.message}
                  </Text>
                  <Text variant="caption" color={theme.colors.inkSoft} style={{ marginTop: 8 }}>
                    {new Date(notif.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </Text>
                </View>
                {!isRead && <View style={styles.unreadDot} />}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sp4,
    paddingVertical: theme.spacing.sp3,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  markAllBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  content: { padding: theme.spacing.sp4 },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: theme.spacing.sp4,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sp3,
    borderWidth: 1,
    borderColor: theme.colors.line,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: theme.colors.teal50,
    borderColor: theme.colors.teal700,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sp4,
  },
  textWrap: { flex: 1 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.teal700,
    marginTop: 4,
  },
});