import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { register } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'USER' | 'OWNER'>('USER');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      const response = await register(name, email, password, phone, role);
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', String(response.id));
      await AsyncStorage.setItem('userEmail', response.email);
      await AsyncStorage.setItem('userRole', response.role);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="h1" style={{ marginBottom: 8 }}>Create an account</Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginBottom: 32 }}>
            Join CasaGH to find your perfect property
          </Text>
          <Input 
            label="Full Name" 
            placeholder="Your full name" 
            value={name}
            onChangeText={setName}
          />
          <Input 
            label="Email" 
            placeholder="your@email.com" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Phone Number"
            placeholder="024XXXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input 
            label="Password" 
            placeholder="••••••••" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text variant="bodyMd" style={{ marginTop: 16, marginBottom: 8, fontFamily: theme.fontFamily.bodySemiBold }}>
            I want to
          </Text>
          <View style={styles.roleRow}>
            <Pressable
              style={[styles.roleOption, role === 'USER' && styles.roleOptionActive]}
              onPress={() => setRole('USER')}
            >
              <Text
                variant="bodyMd"
                color={role === 'USER' ? theme.colors.white : theme.colors.ink}
                style={{ fontFamily: theme.fontFamily.bodySemiBold }}
              >
                Find a property
              </Text>
            </Pressable>
            <Pressable
              style={[styles.roleOption, role === 'OWNER' && styles.roleOptionActive]}
              onPress={() => setRole('OWNER')}
            >
              <Text
                variant="bodyMd"
                color={role === 'OWNER' ? theme.colors.white : theme.colors.ink}
                style={{ fontFamily: theme.fontFamily.bodySemiBold }}
              >
                List a property
              </Text>
            </Pressable>
          </View>

          <Button 
            label={loading ? "Creating account..." : "Sign Up"}
            onPress={handleRegister}
            style={{ marginTop: 24, marginBottom: 16 }}
          />
          <View style={styles.footerRow}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Already have an account? </Text>
            <Text 
              variant="bodyMd" 
              color={theme.colors.green700} 
              style={{ fontFamily: theme.fontFamily.bodySemiBold }} 
              onPress={() => router.replace('/(auth)/login')}>
              Sign in
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  content: { padding: theme.spacing.sp6, flexGrow: 1, justifyContent: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  roleOptionActive: {
    backgroundColor: theme.colors.green700,
    borderColor: theme.colors.green700,
  },
});