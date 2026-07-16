import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { login } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const response = await login(email, password);
      // Save token and user info
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', String(response.id));
      await AsyncStorage.setItem('userEmail', response.email);
      await AsyncStorage.setItem('userRole', response.role);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="h1" style={{ marginBottom: 8 }}>Welcome back</Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginBottom: 32 }}>
            Sign in to continue to CasaGH
          </Text>
          <Input 
            label="Email" 
            placeholder="your@email.com" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            label="Password" 
            placeholder="••••••••" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button 
            label={loading ? "Signing in..." : "Sign In"}
            onPress={handleLogin}
            style={{ marginTop: 24, marginBottom: 16 }}
          />
          <View style={styles.footerRow}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Don't have an account? </Text>
            <Text 
              variant="bodyMd" 
              color={theme.colors.green700} 
              style={{ fontFamily: theme.fontFamily.bodySemiBold }} 
              onPress={() => router.push('/(auth)/register')}>
              Sign up
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
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});