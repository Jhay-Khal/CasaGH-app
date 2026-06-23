import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';

const CONVERSATIONS = [
  { id: '1', name: 'Evandy Hostel', lastMessage: 'Yes, we have study rooms available.', time: '10:42 AM', unread: 2, avatar: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' },
  { id: '2', name: 'Green Valley Hostel', lastMessage: 'Your booking has been confirmed! 🎉', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5' },
];

export default function Inbox() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="display" color={theme.colors.green900}>Inbox</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {CONVERSATIONS.map(chat => (
          <Pressable key={chat.id} style={styles.chatRow} onPress={() => router.push(`/chat/${chat.id}`)}>
            <Image source={{ uri: chat.avatar }} style={styles.avatar} />
            <View style={styles.chatDetails}>
              <View style={styles.chatHeader}>
                <Text variant="h3">{chat.name}</Text>
                <Text variant="caption" color={chat.unread > 0 ? theme.colors.green700 : theme.colors.inkSoft} style={chat.unread > 0 && { fontFamily: theme.fontFamily.bodySemiBold }}>
                  {chat.time}
                </Text>
              </View>
              <View style={styles.chatFooter}>
                <Text variant="bodyMd" color={theme.colors.inkSoft} numberOfLines={1} style={[{ flex: 1 }, chat.unread > 0 && { fontFamily: theme.fontFamily.bodySemiBold, color: theme.colors.ink }]}>
                  {chat.lastMessage}
                </Text>
                {chat.unread > 0 && (
                  <View style={styles.badge}>
                    <Text variant="caption" color={theme.colors.white} style={{ fontFamily: theme.fontFamily.bodyBold }}>{chat.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}
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
