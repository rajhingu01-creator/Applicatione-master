import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Check, ChevronLeft } from "lucide-react-native";
import { API_URL } from "../utils/api";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const JobPortalLoginScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 42, 390);
  const compact = height < 720 || width < 370;
  const [email, setEmail] = useState("meetv@gmail.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: email.trim(),
          password,
        }),
      });
      const data = await response.json();

      if (data.success) {
        if (data.data?.token) {
          await AsyncStorage.setItem("userToken", data.data.token);
        }
        navigation.reset({
          index: 0,
          routes: [{ name: "JobPortalHome" }],
        });
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Job portal login error:", error);
      alert("Network error. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 4 : 12),
            paddingBottom: compact ? 18 : 28,
          },
        ]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.72}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={22} color="#9092A0" strokeWidth={2.7} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>connectifyjobportal</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={[styles.formCard, compact && styles.formCardCompact]}>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            Welcome Back!
          </Text>
          <Text style={styles.subtitle}>Login to your account</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholder="meetv@gmail.com"
              placeholderTextColor="#A4A5B3"
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#A4A5B3"
              />
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.forgotButton}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.76}
            style={styles.rememberRow}
            onPress={() => setRememberMe((value) => !value)}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxActive]}
            >
              {rememberMe ? (
                <Check size={12} color="#FFFFFF" strokeWidth={3.4} />
              ) : null}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#673BF2", "#4B2BE7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.loginButton,
                compact && styles.loginButtonCompact,
                isLoading && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Logging In..." : "Login"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.continueText}>or continue with</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity activeOpacity={0.8} style={styles.socialButton}>
              <Text style={styles.googleText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.socialButton}>
              <Text style={styles.linkedinText}>in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupMuted}>Don't have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => navigation.navigate("JobPortalRegister")}
            >
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  topBar: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: "#C8C8D6",
    fontSize: 9,
    fontWeight: "800",
  },
  topSpacer: {
    width: 34,
  },
  formCard: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 8,
  },
  formCardCompact: {
    justifyContent: "flex-start",
  },
  title: {
    color: "#1A1B2D",
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    color: "#4D4E61",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 26,
  },
  fieldBlock: {
    marginBottom: 20,
  },
  label: {
    color: "#303244",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 9,
  },
  input: {
    height: 50,
    borderWidth: 1.3,
    borderColor: "#E5E5EE",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#232435",
    fontSize: 15,
    fontWeight: "800",
    backgroundColor: "#FFFFFF",
  },
  passwordRow: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 82,
  },
  forgotButton: {
    position: "absolute",
    right: 0,
    top: 0,
    height: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotText: {
    color: "#6440F0",
    fontSize: 13,
    fontWeight: "900",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -3,
    marginBottom: 31,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.4,
    borderColor: "#6A45F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  checkboxActive: {
    backgroundColor: "#5B35ED",
  },
  rememberText: {
    color: "#565767",
    fontSize: 14,
    fontWeight: "700",
  },
  loginButton: {
    height: 55,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5634EC",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  loginButtonCompact: {
    height: 51,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  continueText: {
    color: "#8A8B9B",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 18,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  socialButton: {
    width: 74,
    height: 52,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: "#ECECF3",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  googleText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#4285F4",
  },
  linkedinText: {
    fontSize: 23,
    fontWeight: "900",
    color: "#0A66C2",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  signupMuted: {
    color: "#6F7081",
    fontSize: 14,
    fontWeight: "700",
  },
  signupLink: {
    color: "#5635EC",
    fontSize: 14,
    fontWeight: "900",
  },
});

export default JobPortalLoginScreen;
