import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function Inbox() {
  const { user } = useAuth();
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchMessages();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data: any = await api.get(`/messages/received/${user?.id}`);
      
      // Basic grouping by property for inbox UI
      const grouped = new Map();
      data.forEach((msg: any) => {
        const pId = msg.propertyId;
        if (!grouped.has(pId) || new Date(msg.createdAt) > new Date(grouped.get(pId).createdAt)) {
          grouped.set(pId, { ...msg, unread: 0 }); // Placeholder for unread count
        }
      });
      
      setConversations(Array.from(grouped.values()));
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
      Alert.alert('Error', error.message || 'Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="display" color={theme.colors.green900}>Inbox</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!user ? (
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 20 }}>
            Please sign in to view messages.
          </Text>
        ) : loading ? (
          <ActivityIndicator size="large" color={theme.colors.green700} style={{ marginTop: 40 }} />
        ) : conversations.length === 0 ? (
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 20 }}>
            No messages yet.
          </Text>
        ) : (
          conversations.map((chat: any) => (
            <Pressable key={chat.id} style={styles.chatRow} onPress={() => router.push(`/chat/${chat.propertyId}`)}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' }} style={styles.avatar} />
              <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                  <Text variant="h3">Hostel {chat.propertyId}</Text>
                  <Text variant="caption" color={chat.unread > 0 ? theme.colors.green700 : theme.colors.inkSoft} style={chat.unread > 0 && { fontFamily: theme.fontFamily.bodySemiBold }}>
                    {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.chatFooter}>
                  <Text variant="bodyMd" color={theme.colors.inkSoft} numberOfLines={1} style={[{ flex: 1 }, chat.unread > 0 && { fontFamily: theme.fontFamily.bodySemiBold, color: theme.colors.ink }]}>
                    {chat.content}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.badge}>
                      <Text variant="caption" color={theme.colors.white} style={{ fontFamily: theme.fontFamily.bodyBold }}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  content: { paddingBottom: 100 },
  chatRow: { flexDirection: 'row', padding: theme.spacing.sp4, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.green100, marginRight: theme.spacing.sp3 },
  chatDetails: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: theme.colors.green700, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8, minWidth: 20, alignItems: 'center' },
});
