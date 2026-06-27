import React, { useState } from "react";
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
import { Check, ChevronLeft, Eye, EyeOff } from "lucide-react-native";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const JobPortalRegisterScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 42, 390);
  const compact = height < 720 || width < 370;
  const [fullName, setFullName] = useState("Meet Vasoya");
  const [email, setEmail] = useState("meetv@gmail.com");
  const [mobileNumber, setMobileNumber] = useState("+91 98765 43210");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

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
            Create Account
          </Text>
          <Text style={styles.subtitle}>Let's get you started</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="Meet Vasoya"
              placeholderTextColor="#A4A5B3"
            />
          </View>

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
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              style={styles.input}
              placeholder="+91 98765 43210"
              placeholderTextColor="#A4A5B3"
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#A4A5B3"
              />
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.eyeButton}
                onPress={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#8D8EA1" strokeWidth={2.4} />
                ) : (
                  <Eye size={18} color="#8D8EA1" strokeWidth={2.4} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.76}
            style={styles.termsRow}
            onPress={() => setAgreed((value) => !value)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed ? (
                <Check size={12} color="#FFFFFF" strokeWidth={3.4} />
              ) : null}
            </View>
            <Text style={styles.termsText}>
              I agree to{" "}
              <Text style={styles.termsLink}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() =>
              navigation.navigate("JobPortalOtp", { mobileNumber })
            }
          >
            <LinearGradient
              colors={["#673BF2", "#4B2BE7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.registerButton,
                compact && styles.registerButtonCompact,
              ]}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginMuted}>Already have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => navigation.navigate("JobPortalLogin")}
            >
              <Text style={styles.loginLink}>Login</Text>
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
    marginTop: 5,
    marginBottom: 25,
  },
  fieldBlock: {
    marginBottom: 17,
  },
  label: {
    color: "#303244",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
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
    paddingRight: 52,
  },
  eyeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    height: 50,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -1,
    marginBottom: 24,
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
  termsText: {
    color: "#565767",
    fontSize: 13,
    fontWeight: "700",
  },
  termsLink: {
    color: "#5635EC",
    fontWeight: "900",
  },
  registerButton: {
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
  registerButtonCompact: {
    height: 51,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loginMuted: {
    color: "#6F7081",
    fontSize: 14,
    fontWeight: "700",
  },
  loginLink: {
    color: "#5635EC",
    fontSize: 14,
    fontWeight: "900",
  },
});

export default JobPortalRegisterScreen;
