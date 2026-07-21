import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { sendMessage, getSentMessages, getReceivedMessages } from '../../services/api';

export default function ChatScreen() {
  const { id, propertyId, hostName: hostNameParam } = useLocalSearchParams<{ id: string; propertyId?: string; hostName?: string }>();
  const otherUserId = Number(id);

  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserThenMessages();
    }, [id])
  );

  async function loadUserThenMessages() {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) {
        setLoading(false);
        return;
      }
      const uid = parseInt(userIdStr, 10);
      setUserId(uid);
      await fetchConversation(uid);
    } catch (error) {
      console.error('Failed to load chat:', error);
      setLoading(false);
    }
  }

  async function fetchConversation(uid: number) {
    try {
      setLoading(true);
      const [sent, received] = await Promise.all([
        getSentMessages(uid),
        getReceivedMessages(uid),
      ]);
      const conversation = [...sent, ...received].filter(
        (m: any) => m.sender?.id === otherUserId || m.receiver?.id === otherUserId
      );
      conversation.sort(
        (a: any, b: any) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      setMessages(conversation);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }

  function resolvePropertyId(): number | null {
    if (propertyId) return Number(propertyId);
    const last = messages[messages.length - 1];
    return last?.property?.id ?? null;
  }

  async function handleSend() {
    if (!message.trim() || !userId || sending) return;
    const pid = resolvePropertyId();
    if (!pid) {
      Alert.alert('Cannot send', "This conversation isn't linked to a property yet.");
      return;
    }
    try {
      setSending(true);
      const newMessage = await sendMessage(userId, otherUserId, pid, message.trim());
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const hostName = hostNameParam || 'Chat';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h2">{hostName}</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.green700} style={{ marginTop: 40 }} />
          ) : messages.length === 0 ? (
            <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 40 }}>
              No messages yet. Say hello!
            </Text>
          ) : (
            messages.map((msg: any) => {
              const isMine = msg.sender?.id === userId;
              return (
                <View key={msg.id} style={isMine ? styles.bubbleRight : styles.bubbleLeft}>
                  <Text variant="bodyMd" color={isMine ? theme.colors.white : theme.colors.ink}>
                    {msg.content}
                  </Text>
                  <Text
                    variant="caption"
                    color={isMine ? theme.colors.green100 : theme.colors.inkSoft}
                    style={styles.timeLabel}
                  >
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={theme.colors.inkSoft}
          />
          <Pressable
            style={[styles.sendBtn, message.length > 0 && styles.sendBtnActive]}
            onPress={handleSend}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={message.length > 0 ? theme.colors.white : theme.colors.inkSoft}
                style={{ marginLeft: 2 }}
              />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp2, paddingVertical: theme.spacing.sp2, backgroundColor: theme.colors.white, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { padding: theme.spacing.sp4, paddingBottom: 32 },
  bubbleLeft: { backgroundColor: theme.colors.white, padding: 12, borderRadius: 16, borderTopLeftRadius: 4, alignSelf: 'flex-start', maxWidth: '80%', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  bubbleRight: { backgroundColor: theme.colors.green700, padding: 12, borderRadius: 16, borderTopRightRadius: 4, alignSelf: 'flex-end', maxWidth: '80%', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  timeLabel: { marginTop: 4, alignSelf: 'flex-end', fontSize: 10 },
  inputArea: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.sp3, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: theme.colors.line },
  textInput: { flex: 1, height: 40, backgroundColor: theme.colors.green50, borderRadius: 20, paddingHorizontal: 16, fontFamily: theme.fontFamily.bodyRegular, color: theme.colors.ink },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.green50, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  sendBtnActive: { backgroundColor: theme.colors.green700 },
});