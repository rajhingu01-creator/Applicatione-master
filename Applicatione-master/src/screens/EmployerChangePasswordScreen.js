import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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
import { ArrowLeft, Lock } from "lucide-react-native";

const getStrength = (password) => {
  if (password.length >= 10) {
    return 4;
  }

  if (password.length >= 8) {
    return 3;
  }

  if (password.length >= 5) {
    return 2;
  }

  return password.length ? 1 : 0;
};

const EmployerChangePasswordScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardHeight = Math.max(Math.min(height - topInset - 24, 700), 580);
  const [currentPassword, setCurrentPassword] = useState("password123");
  const [newPassword, setNewPassword] = useState("newpass123");
  const [confirmPassword, setConfirmPassword] = useState("newpass123");
  const [visibleFields, setVisibleFields] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const strength = useMemo(() => getStrength(newPassword), [newPassword]);
  const strengthLabel = strength >= 3 ? "Strong" : strength === 2 ? "Medium" : "Weak";

  const toggleVisible = (key) => {
    setVisibleFields((current) => ({ ...current, [key]: !current[key] }));
  };

  const updatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Details", "Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "New password and confirm password must match.");
      return;
    }

    Alert.alert("Updated", "Password updated successfully.");
  };

  const renderPasswordField = ({
    label,
    value,
    onChangeText,
    visibleKey,
    showStrength = false,
  }) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visibleFields[visibleKey]}
          placeholder="Enter password"
          placeholderTextColor="#A3A7B8"
          autoCapitalize="none"
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.eyeButton}
          onPress={() => toggleVisible(visibleKey)}
        >
          <Text style={styles.eyeText}>{visibleFields[visibleKey] ? "◉" : "◌"}</Text>
        </TouchableOpacity>
      </View>

      {showStrength ? (
        <View style={styles.strengthBlock}>
          <View style={styles.strengthBars}>
            {[1, 2, 3, 4].map((bar) => (
              <View
                key={bar}
                style={[
                  styles.strengthBar,
                  bar <= strength ? styles.strengthBarActive : styles.strengthBarInactive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.strengthText}>{strengthLabel}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: topInset + 10, paddingBottom: 18 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { width: cardWidth, minHeight: cardHeight }]}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Change Password</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.artWrap}>
              <View style={[styles.sparkle, styles.sparkleOne]} />
              <View style={[styles.sparkle, styles.sparkleTwo]} />
              <View style={[styles.sparkleSmall, styles.sparkleThree]} />
              <View style={[styles.sparkleSmall, styles.sparkleFour]} />
              <View style={styles.artShadow} />
              <LinearGradient
                colors={["#B98CFF", "#5532F4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shieldShape}
              >
                <Lock size={25} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>
            </View>

            <View style={styles.formBlock}>
              {renderPasswordField({
                label: "Current Password",
                value: currentPassword,
                onChangeText: setCurrentPassword,
                visibleKey: "current",
              })}
              {renderPasswordField({
                label: "New Password",
                value: newPassword,
                onChangeText: setNewPassword,
                visibleKey: "next",
                showStrength: true,
              })}
              {renderPasswordField({
                label: "Confirm New Password",
                value: confirmPassword,
                onChangeText: setConfirmPassword,
                visibleKey: "confirm",
              })}
            </View>

            <View style={styles.footerSpacer} />

            <TouchableOpacity activeOpacity={0.9} onPress={updatePassword}>
              <LinearGradient
                colors={["#4B28FF", "#F226A8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Update Password</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: "#8E86A8",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  headerRow: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F1FA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#20243A",
    fontSize: 17,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 30,
  },
  artWrap: {
    height: 118,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  artShadow: {
    position: "absolute",
    bottom: 22,
    width: 122,
    height: 28,
    borderRadius: 30,
    backgroundColor: "#EEE6FF",
  },
  shieldShape: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6B3EF6",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  sparkle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#A883FF",
  },
  sparkleSmall: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#C7B0FF",
  },
  sparkleOne: {
    left: 78,
    top: 25,
  },
  sparkleTwo: {
    right: 77,
    top: 32,
  },
  sparkleThree: {
    left: 48,
    top: 65,
  },
  sparkleFour: {
    right: 48,
    top: 70,
  },
  formBlock: {
    gap: 17,
  },
  fieldBlock: {
    minHeight: 70,
  },
  label: {
    color: "#20243A",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 8,
  },
  inputWrap: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E3E5EF",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    shadowColor: "#9197AD",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    flex: 1,
    color: "#20243A",
    fontSize: 13,
    fontWeight: "800",
  },
  eyeButton: {
    width: 42,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeText: {
    color: "#8A90A8",
    fontSize: 17,
    fontWeight: "900",
  },
  strengthBlock: {
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 5,
  },
  strengthBar: {
    flex: 1,
    height: 5,
    borderRadius: 4,
  },
  strengthBarActive: {
    backgroundColor: "#30C467",
  },
  strengthBarInactive: {
    backgroundColor: "#DFF5E8",
  },
  strengthText: {
    color: "#30A95C",
    fontSize: 10.5,
    fontWeight: "900",
  },
  footerSpacer: {
    flex: 1,
    minHeight: 48,
  },
  saveButton: {
    height: 48,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});

export default EmployerChangePasswordScreen;
