import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Globe,
  User,
  AtSign,
  Phone,
  ArrowLeft,
  Check,
} from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { API_URL } from "../utils/api";
import { spacingForWidth } from "../utils/responsive";

const RegisterScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const horizontalPadding = compact ? 14 : 15;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !username || !email || !phone || !password) {
      alert("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms and Conditions");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          contactNumber: phone.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data && data.data.token) {
          await AsyncStorage.setItem("userToken", data.data.token);
        }
        alert("Registration successful!");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Network error. Make sure backend is running and IP is correct.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            { paddingHorizontal: horizontalPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageSelector}>
              <Globe size={14} color="#666" />
              <Text style={styles.languageText}>English</Text>
              <ChevronDown size={14} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <View
            style={[styles.logoSection, compact && styles.logoSectionCompact]}
          >
            <View style={styles.indiaFlag}>
              <View
                style={[styles.flagStrip, { backgroundColor: "#FF9933" }]}
              />
              <View
                style={[styles.flagStrip, { backgroundColor: "#FFFFFF" }]}
              />
              <View
                style={[styles.flagStrip, { backgroundColor: "#128807" }]}
              />
            </View>
            <Text style={styles.logoText}>changis</Text>
            <Text style={styles.titleText}>Create your account</Text>
            <Text style={styles.subtitleText}>
              Join Changis and start your journey.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputWrapper}>
              <User size={16} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
              <User size={16} color="#4CAF50" />
            </View>

            <View style={styles.inputWrapper}>
              <AtSign size={16} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <Text style={styles.fieldInfo}>
              This will be your unique username
            </Text>

            <View style={styles.inputWrapper}>
              <Mail size={16} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.phoneInputRow}>
              <View style={[styles.inputWrapper, styles.countryCode]}>
                <Phone size={16} color="#999" style={styles.inputIcon} />
                <Text style={styles.countryCodeText}>+91</Text>
                <ChevronDown size={14} color="#999" />
              </View>
              <View style={[styles.inputWrapper, styles.phoneNumber]}>
                <TextInput
                  style={styles.input}
                  placeholder="Mobile number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={16} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={16} color="#999" />
                ) : (
                  <Eye size={16} color="#999" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldInfo}>
              At least 8 characters with letters and numbers
            </Text>

            <View style={styles.inputWrapper}>
              <Lock size={16} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} color="#999" />
                ) : (
                  <Eye size={16} color="#999" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreed(!agreed)}
            >
              <View
                style={[
                  styles.customCheckbox,
                  agreed && styles.checkboxChecked,
                ]}
              >
                {agreed && <Check size={12} color="#fff" strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxText}>
                I agree to the{" "}
                <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#FF8C00", "#008000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.createButton, isLoading && { opacity: 0.7 }]}
              >
                <Text style={styles.createButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.separatorWrapper}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or continue with</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialButtonContent}>
                  <FontAwesome
                    name="google"
                    size={16}
                    color="#DB4437"
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialButtonContent}>
                  <FontAwesome
                    name="apple"
                    size={16}
                    color="#000"
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialButtonContent}>
                  <FontAwesome
                    name="facebook"
                    size={16}
                    color="#4267B2"
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>
                    Continue with Facebook
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 40 : 10,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    marginTop: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  languageText: {
    marginHorizontal: 4,
    fontSize: 12,
    color: "#000",
  },
  logoSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  logoSectionCompact: {
    marginTop: 0,
    marginBottom: 6,
  },
  indiaFlag: {
    width: 20,
    height: 14,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  flagStrip: {
    flex: 1,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  subtitleText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    marginBottom: 10,
  },
  formSection: {
    width: "100%",
    justifyContent: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F3F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
    height: 42,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#000",
  },
  usernameHint: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "600",
  },
  fieldInfo: {
    fontSize: 10,
    color: "#999",
    marginLeft: 5,
    marginBottom: 6,
    marginTop: -4,
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  countryCode: {
    width: 80,
  },
  countryCodeText: {
    fontSize: 13,
    color: "#000",
    marginHorizontal: 4,
  },
  phoneNumber: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#008000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#008000",
  },
  checkboxText: {
    fontSize: 11,
    color: "#333",
    flex: 1,
    lineHeight: 16,
  },
  linkText: {
    color: "#008000",
    fontWeight: "500",
  },
  createButton: {
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  createButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  separatorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  separatorText: {
    marginHorizontal: 8,
    color: "#999",
    fontSize: 12,
  },
  socialButtons: {
    gap: 6,
    marginBottom: 12,
  },
  socialButton: {
    height: 38,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  footerText: {
    color: "#666",
    fontSize: 13,
  },
  loginLink: {
    color: "#008000",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
