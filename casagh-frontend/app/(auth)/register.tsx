import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Alert } from 'react-native';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response: any = await api.post('/auth/register', { name, email, password });
      login(response.token, response.user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="h1" style={{ marginBottom: 8 }}>Create an account</Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginBottom: 32 }}>
            Join CasaGH to book your perfect stay
          </Text>

          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={name}
            onChangeText={setName}
          />
          <Input 
            label="Email" 
            placeholder="john.doe@student.knust.edu.gh" 
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
            label={loading ? "Signing up..." : "Sign Up"} 
            onPress={handleRegister} 
            style={{ marginTop: 24, marginBottom: 16 }}
            disabled={loading}
          />

          <View style={styles.footerRow}>
            <Text variant="bodyMd" color={theme.colors.inkSoft}>Already have an account? </Text>
            <Text variant="bodyMd" color={theme.colors.green700} style={{ fontFamily: theme.fontFamily.bodySemiBold }} onPress={() => router.back()}>
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
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});
