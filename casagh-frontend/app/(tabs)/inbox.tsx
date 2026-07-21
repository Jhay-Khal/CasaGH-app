import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { getReceivedMessages, getSentMessages } from '../../services/api';

export default function Inbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [])
  );

  async function loadMessages() {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) {
        setLoading(false);
        return;
      }
      const userId = parseInt(userIdStr, 10);
      setCurrentUserId(userId);
      const [received, sent] = await Promise.all([
        getReceivedMessages(userId),
        getSentMessages(userId),
      ]);
      const combined = [...received, ...sent].sort(
        (a: any, b: any) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      setMessages(combined);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }

  // Group messages by the OTHER person in the conversation (whichever side you're not on)
  const conversations = messages.reduce((acc: any, msg: any) => {
    const isMine = msg.sender?.id === currentUserId;
    const otherPerson = isMine ? msg.receiver : msg.sender;
    const otherId = otherPerson?.id;
    if (otherId == null) return acc;

    const time = msg.sentAt
      ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    if (!acc[otherId]) {
      acc[otherId] = {
        id: otherId,
        name: otherPerson?.fullName || `User ${otherId}`,
        lastMessage: msg.content,
        time,
        unread: !isMine && !msg.isRead ? 1 : 0,
        propertyId: msg.property?.id,
      };
    } else {
      if (!isMine && !msg.isRead) acc[otherId].unread += 1;
      acc[otherId].lastMessage = msg.content;
      acc[otherId].propertyId = msg.property?.id ?? acc[otherId].propertyId;
      acc[otherId].time = time;
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
              onPress={() =>
                router.push({
                  pathname: `/chat/${chat.id}`,
                  params: { propertyId: chat.propertyId, hostName: chat.name },
                })
              }
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