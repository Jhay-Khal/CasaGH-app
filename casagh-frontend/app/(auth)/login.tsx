import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

      // Save all user info to AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', String(response.id));
      await AsyncStorage.setItem('userEmail', response.email);
      await AsyncStorage.setItem('userRole', response.role);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: response.id,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        phone: response.phone,
      }));

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

          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoIcon}>
              <Ionicons name="home" size={28} color="#C9A84C" />
            </View>
            <Text style={styles.logoText}>CasaGH</Text>
            <Text style={styles.logoTagline}>Find Home. Find Peace.</Text>
          </View>

          <Text variant="h1" color="#0D1B4B" style={{ marginBottom: 8 }}>Welcome back</Text>
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
            label={loading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            style={{ marginTop: 24, marginBottom: 16, backgroundColor: '#3AAFA9' }}
          />

          <View style={styles.footerRow}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Don't have an account? </Text>
            <Text
              variant="bodyMd"
              color="#3AAFA9"
              style={{ fontFamily: theme.fontFamily.bodySemiBold }}
              onPress={() => router.push('/(auth)/register')}
            >
              Sign up
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 28, flexGrow: 1, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoIcon: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: '#0D1B4B',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28, fontWeight: 'bold',
    color: '#0D1B4B', letterSpacing: 0.5,
  },
  logoTagline: {
    fontSize: 13, color: '#3AAFA9',
    fontWeight: '500', marginTop: 2,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});