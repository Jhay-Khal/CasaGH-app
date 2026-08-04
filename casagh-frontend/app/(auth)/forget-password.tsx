import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../theme";
import { Text } from "../../components/Text";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAppAlert } from "../context/AppAlertContext";
import { forgotPassword } from "../../services/api";

export default function ForgotPassword() {
  const { showAlert } = useAppAlert();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleResetPassword() {
    if (!emailRegex.test(email)) {
      showAlert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email.trim());
      showAlert(
        "Reset Link Sent",
        "If an account exists with this email, a password reset link has been sent.",
        () => {
          router.back();
        }
      );
    } catch (error: any) {
      showAlert(
        "Something went wrong",
        error?.message ?? "Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color="#0D1B4B"
              />
            </Pressable>

            <Text style={styles.headerTitle}>
              Reset Password
            </Text>

            <View style={{ width: 44 }} />
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="lock-closed"
                size={40}
                color="#3AAFA9"
              />
            </View>

            <Text style={styles.brand}>
              CasaGH
            </Text>

            <Text style={styles.title}>
              Forgot Password?
            </Text>

            <Text style={styles.subtitle}>
              Don't worry. Enter your email address and we'll send you a password reset link.
            </Text>
          </View>

          {/* Email */}
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color="#8E8E93" />}
          />

          {/* Button */}
          <Button
            label={
              loading
                ? "Sending..."
                : "Send Reset Link"
            }
            onPress={handleResetPassword}
            disabled={loading}
            style={styles.button}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <Text color={theme.colors.inkSoft}>
              Remember your password?
            </Text>

            <Pressable
              onPress={() => router.back()}
            >
              <Text style={styles.signIn}>
                Sign In
              </Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D1B4B",
  },

  hero: {
    alignItems: "center",
    marginBottom: 45,
  },

  iconContainer: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#EDF9F8",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 6,
  },

  brand: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0D1B4B",
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0D1B4B",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  button: {
    marginTop: 28,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#3AAFA9",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  signIn: {
    marginLeft: 6,
    color: "#3AAFA9",
    fontWeight: "700",
  },
});