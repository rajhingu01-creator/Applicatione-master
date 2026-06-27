import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Eye, Lock, Mail } from "lucide-react-native";

const SocialButton = ({ children }) => (
  <TouchableOpacity activeOpacity={0.82} style={styles.socialButton}>
    {children}
  </TouchableOpacity>
);

const EmployerIllustration = ({ width }) => (
  <View style={[styles.illustration, { width }]} pointerEvents="none">
    <View style={styles.artGlow} />
    <View style={styles.purpleLeafOne} />
    <View style={styles.purpleLeafTwo} />
    <View style={styles.purpleDotOne} />
    <View style={styles.purpleDotTwo} />

    <View style={styles.browserCard}>
      <LinearGradient
        colors={["#7A45FF", "#DA36DE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.browserTop}
      >
        <View style={styles.browserDot} />
        <View style={styles.browserDot} />
        <View style={styles.browserDot} />
        <View style={styles.browserTopSpacer} />
        <View style={styles.browserWhiteDot} />
        <View style={styles.browserWhiteDot} />
        <View style={styles.browserWhiteDot} />
      </LinearGradient>
      <View style={styles.browserBody}>
        <View style={styles.profileMini}>
          <View style={styles.profileAvatar} />
        </View>
        <View style={styles.browserLineShort} />
        <View style={styles.browserPurpleLine} />
        <View style={styles.browserLine} />
        <View style={styles.browserBlock} />
      </View>
    </View>

    <LinearGradient
      colors={["#9A48FF", "#F22FD9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.lockTile, styles.lockTileFront]}
    >
      <View style={styles.lockShackle} />
      <View style={styles.lockBody}>
        <View style={styles.lockKeyhole} />
      </View>
    </LinearGradient>

    <LinearGradient
      colors={["#6236E9", "#8D55FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatarCard}
    >
      <View style={styles.avatarGlow} />
      <View style={styles.avatarHead} />
      <View style={styles.avatarBody} />
      <View style={styles.avatarBase} />
      <View style={styles.avatarBadge}>
        <Text style={styles.avatarBadgeText}>✓</Text>
      </View>
    </LinearGradient>

    <View style={styles.deskShadow} />
  </View>
);

const HireEmployeesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const contentWidth = Math.min(width, 430);
  const cardWidth = Math.min(width - 38, 374);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundDecor} pointerEvents="none">
        <LinearGradient
          colors={["rgba(131,88,255,0.25)", "rgba(131,88,255,0)"]}
          style={styles.topBlob}
        />
        <LinearGradient
          colors={["rgba(128,83,255,0)", "rgba(128,83,255,0.25)"]}
          style={styles.bottomBlob}
        />
        <LinearGradient
          colors={["rgba(128,83,255,0)", "rgba(128,83,255,0.22)"]}
          style={styles.rightBlob}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screenContent}>
          <View style={[styles.content, { width: contentWidth }]}>
            <EmployerIllustration width={Math.min(cardWidth * 0.78, 292)} />

            <View style={[styles.card, { width: cardWidth }]}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputShell}>
                  <View style={styles.inputIconBox}>
                    <Mail size={22} color="#7A44FF" strokeWidth={2.2} />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your work email"
                    placeholderTextColor="#8B91A7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputShell}>
                  <View style={styles.inputIconBox}>
                    <Lock size={22} color="#7A44FF" strokeWidth={2.2} />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#8B91A7"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setShowPassword((value) => !value)}
                    style={styles.eyeButton}
                  >
                    <Eye size={22} color="#788097" strokeWidth={2.35} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.forgotButton}
                onPress={() =>
                  Alert.alert(
                    "Forgot password",
                    "Password reset is coming soon.",
                  )
                }
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.rememberRow}
                onPress={() => setRememberMe((value) => !value)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe ? <Text style={styles.checkText}>✓</Text> : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.primaryButton}
                onPress={() => navigation.navigate("OtpVerification")}
              >
                <LinearGradient
                  colors={["#6527FF", "#F008A9"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryGradient}
                >
                  <Text style={styles.primaryText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <SocialButton>
                  <Text style={styles.googleG}>G</Text>
                </SocialButton>
                <SocialButton>
                  <FontAwesome name="apple" size={28} color="#111827" />
                </SocialButton>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate("CompanyRegister")}
                >
                  <Text style={styles.footerLink}> Register Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: "hidden",
  },
  topBlob: {
    position: "absolute",
    left: -68,
    top: -98,
    width: 220,
    height: 260,
    borderRadius: 120,
    transform: [{ rotate: "34deg" }],
  },
  bottomBlob: {
    position: "absolute",
    left: -86,
    bottom: -86,
    width: 285,
    height: 230,
    borderRadius: 130,
    transform: [{ rotate: "-13deg" }],
  },
  rightBlob: {
    position: "absolute",
    right: -95,
    bottom: 120,
    width: 195,
    height: 238,
    borderRadius: 120,
    transform: [{ rotate: "22deg" }],
  },
  screenContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  content: {
    alignItems: "center",
    alignSelf: "center",
  },
  headerCopy: {
    alignItems: "center",
    marginBottom: 18,
  },
  welcomeText: {
    color: "#121933",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  subtitle: {
    color: "#74798D",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },
  illustration: {
    height: 170,
    marginBottom: -8,
    alignSelf: "center",
    zIndex: 2,
  },
  artGlow: {
    position: "absolute",
    left: 26,
    right: 26,
    bottom: 15,
    height: 30,
    borderRadius: 50,
    backgroundColor: "rgba(126,79,255,0.1)",
  },
  purpleLeafOne: {
    position: "absolute",
    right: 2,
    top: 78,
    width: 58,
    height: 100,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 8,
    backgroundColor: "rgba(142,88,255,0.2)",
    transform: [{ rotate: "31deg" }],
  },
  purpleLeafTwo: {
    position: "absolute",
    right: -14,
    top: 113,
    width: 42,
    height: 72,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    borderBottomLeftRadius: 8,
    backgroundColor: "rgba(142,88,255,0.26)",
    transform: [{ rotate: "40deg" }],
  },
  purpleDotOne: {
    position: "absolute",
    left: 16,
    top: 45,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#C76AFF",
    opacity: 0.78,
  },
  purpleDotTwo: {
    position: "absolute",
    right: 20,
    top: 40,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#C76AFF",
    opacity: 0.45,
  },
  browserCard: {
    position: "absolute",
    left: "17%",
    top: 12,
    width: "72%",
    height: 132,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#8B62FF",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
    overflow: "hidden",
  },
  browserTop: {
    height: 34,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  browserDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFB07A",
    marginRight: 7,
  },
  browserTopSpacer: {
    flex: 1,
  },
  browserWhiteDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.86)",
    marginLeft: 7,
  },
  browserBody: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 48,
    paddingRight: 18,
  },
  profileMini: {
    position: "absolute",
    left: 20,
    top: 18,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#EEE6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E758D2",
  },
  browserLineShort: {
    width: 58,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E7E2F4",
    marginBottom: 15,
  },
  browserPurpleLine: {
    width: 67,
    height: 17,
    borderRadius: 5,
    backgroundColor: "#7949F5",
    marginBottom: 8,
  },
  browserLine: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E7E2F4",
    marginBottom: 8,
  },
  browserBlock: {
    width: 92,
    height: 25,
    borderRadius: 7,
    backgroundColor: "#EEEAF8",
    marginTop: 3,
  },
  lockTile: {
    position: "absolute",
    left: "1%",
    top: 76,
    width: 94,
    height: 94,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D64CFF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  lockTileFront: {
    zIndex: 5,
  },
  lockShackle: {
    position: "absolute",
    top: 25,
    width: 35,
    height: 31,
    borderRadius: 17,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
  },
  lockBody: {
    width: 46,
    height: 37,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  lockKeyhole: {
    width: 9,
    height: 13,
    borderRadius: 5,
    backgroundColor: "#8E45FF",
  },
  plantWrap: {
    position: "absolute",
    left: "10%",
    bottom: 36,
    width: 50,
    height: 82,
  },
  plantLeaf: {
    position: "absolute",
    width: 18,
    height: 37,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 5,
    backgroundColor: "#7552D9",
  },
  plantLeafOne: {
    left: 2,
    top: 25,
    transform: [{ rotate: "-34deg" }],
  },
  plantLeafTwo: {
    left: 17,
    top: 15,
    transform: [{ rotate: "10deg" }],
  },
  plantLeafThree: {
    right: 3,
    top: 29,
    transform: [{ rotate: "42deg" }],
  },
  plantStem: {
    position: "absolute",
    left: 24,
    bottom: 18,
    width: 4,
    height: 46,
    borderRadius: 2,
    backgroundColor: "#5941BC",
  },
  plantPot: {
    position: "absolute",
    left: 10,
    bottom: 2,
    width: 33,
    height: 23,
    borderRadius: 5,
    backgroundColor: "#3E3288",
  },
  personWrap: {
    position: "absolute",
    right: "10%",
    top: 58,
    width: 104,
    height: 166,
    zIndex: 4,
  },
  personHairBack: {
    position: "absolute",
    left: 29,
    top: 1,
    width: 68,
    height: 38,
    borderRadius: 22,
    backgroundColor: "#14173E",
    transform: [{ rotate: "-9deg" }],
  },
  personHead: {
    position: "absolute",
    left: 33,
    top: 19,
    width: 47,
    height: 55,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
  },
  personEar: {
    position: "absolute",
    left: 76,
    top: 39,
    width: 13,
    height: 17,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  personHair: {
    position: "absolute",
    left: 24,
    top: 7,
    width: 72,
    height: 31,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 14,
    borderTopRightRadius: 20,
    backgroundColor: "#121538",
    transform: [{ rotate: "-14deg" }],
  },
  personEye: {
    position: "absolute",
    left: 62,
    top: 43,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1C1F45",
    zIndex: 5,
  },
  personSmile: {
    position: "absolute",
    left: 56,
    top: 58,
    width: 13,
    height: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: "#A893FF",
    borderRadius: 8,
    zIndex: 5,
  },
  personNeck: {
    position: "absolute",
    left: 51,
    top: 70,
    width: 22,
    height: 21,
    backgroundColor: "#F8F5FF",
  },
  personShirt: {
    position: "absolute",
    left: 35,
    top: 88,
    width: 40,
    height: 62,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#FFFFFF",
    zIndex: 2,
  },
  personJacket: {
    position: "absolute",
    left: 8,
    top: 86,
    width: 92,
    height: 80,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 17,
    backgroundColor: "#5A39D8",
  },
  personLapArm: {
    position: "absolute",
    left: 13,
    bottom: 9,
    width: 74,
    height: 23,
    borderRadius: 13,
    backgroundColor: "#462BB2",
    transform: [{ rotate: "9deg" }],
    zIndex: 4,
  },
  personArm: {
    position: "absolute",
    right: 4,
    bottom: 9,
    width: 39,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#F8F5FF",
    transform: [{ rotate: "-8deg" }],
    zIndex: 5,
  },

  avatarCard: {
    position: "absolute",
    right: "2%",
    top: 76,
    width: 104,
    height: 94,
    borderRadius: 22,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#6D48ED",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 7,
    zIndex: 4,
  },
  avatarGlow: {
    position: "absolute",
    right: -20,
    top: -24,
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  avatarHead: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    marginTop: 15,
  },
  avatarBody: {
    width: 62,
    height: 42,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#FFFFFF",
    marginTop: 7,
  },
  avatarBase: {
    position: "absolute",
    left: 15,
    bottom: 12,
    width: 74,
    height: 19,
    borderRadius: 11,
    backgroundColor: "rgba(61,38,173,0.55)",
  },
  avatarBadge: {
    position: "absolute",
    right: 11,
    bottom: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadgeText: {
    color: "#6A2BFF",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18,
  },
  deskShadow: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 13,
    height: 9,
    borderRadius: 8,
    backgroundColor: "rgba(149,122,214,0.13)",
  },
  card: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 18,
    shadowColor: "#8B79B9",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 10,
    zIndex: 1,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 14,
  },
  brandText: {
    color: "#101633",
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "900",
    letterSpacing: -0.9,
  },
  brandAccent: {
    color: "#6A2BFF",
  },
  brandSubText: {
    color: "#5F657A",
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "700",
    marginTop: -2,
  },
  fieldBlock: {
    marginBottom: 11,
  },
  label: {
    color: "#4F566D",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
  },
  inputShell: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: "#E1E3EA",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 9,
  },
  inputIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F2ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  input: {
    flex: 1,
    color: "#111633",
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 0,
  },
  eyeButton: {
    width: 35,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -2,
    marginBottom: 10,
  },
  forgotText: {
    color: "#6A2BFF",
    fontSize: 13,
    fontWeight: "900",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6A2BFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#6A2BFF",
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18,
  },
  rememberText: {
    color: "#4E5570",
    fontSize: 14,
    fontWeight: "900",
  },
  primaryButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#9C2CFF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 17,
    elevation: 8,
  },
  primaryGradient: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6E7EC",
  },
  dividerText: {
    color: "#7F8495",
    fontSize: 14,
    fontWeight: "800",
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 42,
    marginBottom: 16,
  },
  socialButton: {
    width: 58,
    height: 52,
    borderRadius: 13,
    borderWidth: 1.3,
    borderColor: "#E3E5EC",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    fontSize: 27,
    fontWeight: "900",
    color: "#4285F4",
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#777D91",
    fontSize: 14,
    fontWeight: "800",
  },
  footerLink: {
    color: "#6A2BFF",
    fontSize: 14,
    fontWeight: "900",
  },
});

export default HireEmployeesScreen;
