import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { register } from '../../services/api';
import { useAppAlert } from '../context/AppAlertContext';

export default function Register() {
  const { showAlert } = useAppAlert();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [role, setRole] = useState<'USER' | 'OWNER'>('USER');

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordStrength = () => {
    if (password.length < 6) return { text: 'Weak', color: '#E53935' };
    if (/[A-Z]/.test(password) && /\d/.test(password)) return { text: 'Strong', color: '#2E7D32' };
    return { text: 'Medium', color: '#FB8C00' };
  };

  async function handleRegister() {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!name.trim()) newErrors.name = 'Enter your full name';
    if (!emailRegex.test(email.trim())) newErrors.email = 'Enter a valid email';
    if (phone.length < 10) newErrors.phone = 'Invalid phone number';
    if (password.length < 8) newErrors.password = 'Minimum of 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const response = await register(name, email.trim(), password, phone, role);

      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', String(response.id));
      await AsyncStorage.setItem('userEmail', response.email);
      await AsyncStorage.setItem('userRole', response.role);

      showAlert('Success', 'Account created successfully!', () => {
        router.replace('/(tabs)');
      });
    } catch (error: any) {
      showAlert('Registration Failed', error?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable
            onPress={() => router.back()}
            style={{
              marginBottom: 20,
              alignSelf: 'flex-start',
            }}
          >
            <Ionicons name="arrow-back" size={28} color={theme.colors.green700} />
          </Pressable>

          <Text
            variant="h1"
            style={{
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Create an account
          </Text>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: '#E8F5F4',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 24,
            }}
          >
            <Ionicons name="home" size={48} color={theme.colors.green700} />
          </View>
          <Text
            variant="bodyMd"
            color={theme.colors.inkSoft}
            style={{
              marginBottom: 32,
              textAlign: 'center',
            }}
          >
            Join CasaGH to find your perfect property
          </Text>
          <Input
            label="Full Name"
            placeholder="Your full name"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
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
            label="Phone Number"
            placeholder="024XXXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
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

          <Text
            variant="bodyMd"
            style={{
              color: passwordStrength().color,
              marginBottom: 16,
              fontFamily: theme.fontFamily.bodySemiBold,
            }}
          >
            Password Strength: {passwordStrength().text}
          </Text>

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword}
            rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
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

          {loading ? (
            <View
              style={{
                marginTop: 28,
                marginBottom: 18,
                backgroundColor: '#3AAFA9',
                borderRadius: 14,
                height: 54,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <Button
              label="Create Account"
              onPress={handleRegister}
              style={{
                marginTop: 28,
                marginBottom: 18,
                backgroundColor: '#3AAFA9',
                borderRadius: 14,
              }}
            />
          )}
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