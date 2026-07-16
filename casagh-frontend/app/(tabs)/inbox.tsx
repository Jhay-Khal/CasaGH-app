import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { getReceivedMessages } from '../../services/api';

export default function Inbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const data = await getReceivedMessages(user.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }

  // Group messages by sender to show as conversations
  const conversations = messages.reduce((acc: any, msg: any) => {
    const key = msg.senderId;
    if (!acc[key]) {
      acc[key] = {
        id: msg.senderId,
        name: msg.senderName || `User ${msg.senderId}`,
        lastMessage: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: msg.isRead ? 0 : 1,
        propertyId: msg.propertyId,
      };
    } else {
      if (!msg.isRead) acc[key].unread += 1;
      acc[key].lastMessage = msg.content;
    }
    return acc;
  }, {});

  const conversationList = Object.values(conversations);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="display" color={theme.colors.green900}>Inbox</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.green900} style={{ marginTop: 40 }} />
      ) : conversationList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="h3" color={theme.colors.inkSoft}>No messages yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {conversationList.map((chat: any) => (
            <Pressable
              key={chat.id}
              style={styles.chatRow}
              onPress={() => router.push(`/chat/${chat.id}`)}
            >
              <View style={styles.avatarPlaceholder}>
                <Text variant="h2" color={theme.colors.green700}>
                  {chat.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                  <Text variant="h3">{chat.name}</Text>
                  <Text
                    variant="caption"
                    color={chat.unread > 0 ? theme.colors.green700 : theme.colors.inkSoft}
                  >
                    {chat.time}
                  </Text>
                </View>
                <View style={styles.chatFooter}>
                  <Text
                    variant="bodyMd"
                    color={theme.colors.inkSoft}
                    numberOfLines={1}
                    style={[{ flex: 1 }, chat.unread > 0 && { color: theme.colors.ink }]}
                  >
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.badge}>
                      <Text variant="caption" color={theme.colors.white}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  content: { paddingBottom: 100 },
  chatRow: { flexDirection: 'row', padding: theme.spacing.sp4, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.green100, marginRight: theme.spacing.sp3, alignItems: 'center', justifyContent: 'center' },
  chatDetails: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: theme.colors.green700, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8, minWidth: 20, alignItems: 'center' },
});