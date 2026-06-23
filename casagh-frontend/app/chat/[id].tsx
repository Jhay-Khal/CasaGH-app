import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  
  const hostName = id === '1' ? 'Evandy Hostel' : 'Green Valley Hostel';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h2">{hostName}</Text>
        <Pressable style={styles.backBtn}>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.ink} />
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="caption" style={styles.dateBanner}>Today</Text>
          
          <View style={styles.bubbleLeft}>
            <Text variant="bodyMd" color={theme.colors.ink}>Hello! Are you interested in a 2-in-a-room?</Text>
            <Text variant="caption" color={theme.colors.inkSoft} style={styles.timeLabel}>10:40 AM</Text>
          </View>
          
          <View style={styles.bubbleRight}>
            <Text variant="bodyMd" color={theme.colors.white}>Yes, do you have any left with AC?</Text>
            <Text variant="caption" color={theme.colors.green100} style={styles.timeLabel}>10:41 AM</Text>
          </View>

          <View style={styles.bubbleLeft}>
            <Text variant="bodyMd" color={theme.colors.ink}>Yes, we have study rooms available too.</Text>
            <Text variant="caption" color={theme.colors.inkSoft} style={styles.timeLabel}>10:42 AM</Text>
          </View>
        </ScrollView>

        <View style={styles.inputArea}>
          <Pressable style={styles.attachBtn}>
            <Ionicons name="add" size={24} color={theme.colors.inkSoft} />
          </Pressable>
          <TextInput 
            style={styles.textInput} 
            placeholder="Type a message..." 
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={theme.colors.inkSoft}
          />
          <Pressable style={[styles.sendBtn, message.length > 0 && styles.sendBtnActive]}>
            <Ionicons name="send" size={20} color={message.length > 0 ? theme.colors.white : theme.colors.inkSoft} style={{ marginLeft: 2 }} />
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
  dateBanner: { alignSelf: 'center', backgroundColor: theme.colors.line, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  bubbleLeft: { backgroundColor: theme.colors.white, padding: 12, borderRadius: 16, borderTopLeftRadius: 4, alignSelf: 'flex-start', maxWidth: '80%', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  bubbleRight: { backgroundColor: theme.colors.green700, padding: 12, borderRadius: 16, borderTopRightRadius: 4, alignSelf: 'flex-end', maxWidth: '80%', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  timeLabel: { marginTop: 4, alignSelf: 'flex-end', fontSize: 10 },
  inputArea: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.sp3, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: theme.colors.line },
  attachBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  textInput: { flex: 1, height: 40, backgroundColor: theme.colors.green50, borderRadius: 20, paddingHorizontal: 16, fontFamily: theme.fontFamily.bodyRegular, color: theme.colors.ink },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.green50, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  sendBtnActive: { backgroundColor: theme.colors.green700 },
});
