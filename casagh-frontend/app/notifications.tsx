import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from '../components/Text';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import { ActivityIndicator } from 'react-native';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data: any = await api.get(`/notifications/${user.id}`);
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {!user ? (
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 20 }}>
            Please sign in to view notifications.
          </Text>
        ) : loading ? (
          <ActivityIndicator size="large" color={theme.colors.green700} style={{ marginTop: 40 }} />
        ) : notifications.length === 0 ? (
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 20 }}>
            No notifications yet.
          </Text>
        ) : (
          notifications.map(notif => {
            const isSuccess = notif.type === 'SUCCESS';
            const isWarning = notif.type === 'WARNING';
            const isMessage = notif.type === 'MESSAGE';
            
            let iconName = 'notifications';
            let iconColor: string = theme.colors.green700;
            let bgColor: string = theme.colors.green100;

            if (isSuccess) { iconName = 'checkmark-circle'; iconColor = theme.colors.green700; }
            if (isWarning) { iconName = 'alert-circle'; iconColor = theme.colors.warning; bgColor = '#fffbeb'; }
            if (isMessage) { iconName = 'chatbubble-ellipses'; iconColor = theme.colors.ink; bgColor = theme.colors.line; }

            return (
              <Pressable key={notif.id} style={[styles.card, !notif.isRead && styles.unreadCard]}>
                <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
                  <Ionicons name={iconName as any} size={24} color={iconColor} />
                </View>
                <View style={styles.textWrap}>
                  <Text variant="h3">{notif.title || notif.type}</Text>
                  <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginTop: 4 }}>{notif.message}</Text>
                  <Text variant="caption" color={theme.colors.inkSoft} style={{ marginTop: 8 }}>
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                {!notif.isRead && <View style={styles.unreadDot} />}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { padding: theme.spacing.sp4 },
  card: { flexDirection: 'row', padding: theme.spacing.sp4, backgroundColor: theme.colors.white, borderRadius: theme.radius.lg, marginBottom: theme.spacing.sp3, borderWidth: 1, borderColor: theme.colors.line, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  unreadCard: { backgroundColor: theme.colors.green50, borderColor: theme.colors.green700 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.sp4 },
  textWrap: { flex: 1 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.green700, marginTop: 4 },
});
