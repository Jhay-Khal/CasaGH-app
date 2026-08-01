import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { login } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppAlert } from '../context/AppAlertContext';

export default function Login() {
  const { showAlert } = useAppAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleLogin() {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!emailRegex.test(email)) newErrors.email = 'Enter a valid email';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const response = await login(email, password);

      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', String(response.id));
      await AsyncStorage.setItem('userEmail', response.email);
      await AsyncStorage.setItem('userRole', response.role);

      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          id: response.id,
          email: response.email,
          fullName: response.fullName,
          role: response.role,
          phone: response.phone,
        })
      );

      showAlert('Welcome Back!', 'Login successful.', () => {
        router.replace('/(tabs)');
      });
    } catch {
      showAlert('Login Failed', 'Invalid email or password.');
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

          <Text
            variant="h1"
            color="#0D1B4B"
            style={{
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Welcome Back
          </Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginBottom: 32, textAlign: 'center' }}>
            Sign in to continue to CasaGH
          </Text>

          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            error={errors.password}
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          <View
            style={{
              alignItems: 'flex-end',
              marginBottom: 18,
            }}
          >
            <Pressable
              onPress={() => {
                router.push('/forget-password');
              }}
            >
              <Text
                color="#3AAFA9"
                style={{
                  fontFamily: theme.fontFamily.bodySemiBold,
                }}
              >
                Forgot Password?
              </Text>
            </Pressable>
          </View>
          <Button
            label={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={loading}
            style={{
              marginTop: 24,
              marginBottom: 16,
              backgroundColor: '#3AAFA9',
            }}
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