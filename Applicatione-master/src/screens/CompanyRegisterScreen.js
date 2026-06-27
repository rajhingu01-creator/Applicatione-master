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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Eye, EyeOff } from "lucide-react-native";

const RegisterHeroArtwork = () => (
  <View style={styles.heroArtwork} pointerEvents="none">
    <View style={styles.heroCircle} />
    <View style={styles.heroDot} />
    <View style={styles.heroTinyCircle} />

    <View style={styles.plantLeft}>
      <View style={[styles.plantLeaf, styles.plantLeafOne]} />
      <View style={[styles.plantLeaf, styles.plantLeafTwo]} />
      <View style={styles.plantBase} />
    </View>

    <LinearGradient
      colors={["#9A59FF", "#6B3EF2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.companyBuilding}
    >
      <View style={styles.buildingRoof} />
      <View style={styles.windowGrid}>
        <View style={styles.buildingWindow} />
        <View style={styles.buildingWindow} />
        <View style={styles.buildingWindow} />
        <View style={styles.buildingWindow} />
      </View>
      <View style={styles.doorWrap}>
        <View style={styles.doorLine} />
      </View>
    </LinearGradient>

    <LinearGradient
      colors={["#EA3BAF", "#7448FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.profileBubble}
    >
      <View style={styles.profileHead} />
      <View style={styles.profileBody} />
    </LinearGradient>

    <LinearGradient
      colors={["#8C55FF", "#6F42F5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.shieldCard}
    >
      <Ionicons name="shield-checkmark" size={54} color="#FFFFFF" />
    </LinearGradient>

    <View style={styles.plantRight}>
      <View style={[styles.tallLeaf, styles.tallLeafOne]} />
      <View style={[styles.tallLeaf, styles.tallLeafTwo]} />
      <View style={styles.plantStem} />
    </View>
  </View>
);

const FieldIcon = ({ name }) => (
  <View style={styles.inputIconBox}>
    <Ionicons name={name} size={18} color="#7A42FF" />
  </View>
);

const CompanyRegisterScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const contentWidth = Math.min(width - 24, 390);

  const handleCreateAccount = () => {
    if (!acceptedTerms) {
      Alert.alert("Terms Required", "Please agree to Terms & Conditions.");
      return;
    }

    navigation.navigate("OtpVerification");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundDecor} pointerEvents="none">
        <LinearGradient
          colors={["rgba(126,73,255,0.16)", "rgba(126,73,255,0)"]}
          style={styles.topBlob}
        />
        <LinearGradient
          colors={["rgba(126,73,255,0)", "rgba(126,73,255,0.18)"]}
          style={styles.bottomBlob}
        />
        <View style={styles.dotPattern} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screenContent}>
          <View style={[styles.content, { width: contentWidth }]}>
            <Text style={styles.stepTitle}>
              Register <Text style={styles.stepAccent}>Company</Text>
            </Text>

            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroTitle}>
                  Create Your{"\n"}
                  <Text style={styles.heroAccent}>Account</Text>
                </Text>
                <Text style={styles.heroSubtitle}>
                  Join thousands of companies hiring the right talent.
                </Text>
              </View>
              <RegisterHeroArtwork />
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputShell}>
                  <FieldIcon name="person" />
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your name"
                    placeholderTextColor="#8D94AA"
                  />
                </View>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Work Email</Text>
                <View style={styles.inputShell}>
                  <FieldIcon name="mail" />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@company.com"
                    placeholderTextColor="#8D94AA"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.fieldBlockSmall}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputShell}>
                  <FieldIcon name="lock-closed" />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#8D94AA"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setShowPassword((value) => !value)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#7D849D" strokeWidth={2.3} />
                    ) : (
                      <Eye size={18} color="#7D849D" strokeWidth={2.3} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.strengthRow}>
                  <Text style={styles.strengthText}>Password strength: </Text>
                  <Text style={styles.strengthStrong}>Strong</Text>
                </View>
                <View style={styles.strengthTrack}>
                  <LinearGradient
                    colors={["#7344FF", "#B834FF", "#E73BA0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.strengthFill}
                  />
                </View>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputShell}>
                  <FieldIcon name="lock-closed" />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="#8D94AA"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setShowConfirmPassword((value) => !value)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} color="#7D849D" strokeWidth={2.3} />
                    ) : (
                      <Eye size={18} color="#7D849D" strokeWidth={2.3} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.termsRow}
                onPress={() => setAcceptedTerms((value) => !value)}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptedTerms && styles.checkboxChecked,
                  ]}
                >
                  {acceptedTerms ? (
                    <Text style={styles.checkText}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.termsText}>I agree to the </Text>
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.primaryButton}
                onPress={handleCreateAccount}
              >
                <LinearGradient
                  colors={["#6428FF", "#B420E5", "#F2398C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryGradient}
                >
                  <Text style={styles.primaryText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate("HireEmployees")}
                >
                  <Text style={styles.footerLink}> Login</Text>
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
    backgroundColor: "#FBF8FF",
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
    left: -78,
    top: -88,
    width: 245,
    height: 260,
    borderRadius: 130,
    transform: [{ rotate: "28deg" }],
  },
  bottomBlob: {
    position: "absolute",
    right: -90,
    bottom: -95,
    width: 250,
    height: 270,
    borderRadius: 135,
    transform: [{ rotate: "-18deg" }],
  },
  dotPattern: {
    position: "absolute",
    left: -9,
    bottom: 40,
    width: 64,
    height: 120,
    borderRadius: 20,
    opacity: 0.16,
    backgroundColor: "#A681FF",
  },
  screenContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 10 : 8,
    paddingBottom: 10,
  },
  content: {
    alignSelf: "center",
  },
  stepTitle: {
    color: "#1E2340",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900",
    marginBottom: 22,
  },
  stepAccent: {
    color: "#7A39FF",
  },
  heroRow: {
    minHeight: 126,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heroCopy: {
    width: "47%",
    paddingTop: 2,
    zIndex: 2,
  },
  heroTitle: {
    color: "#242A45",
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginBottom: 11,
  },
  heroAccent: {
    color: "#7535FF",
  },
  heroSubtitle: {
    color: "#6A7084",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "700",
  },
  heroArtwork: {
    width: 190,
    height: 146,
    marginTop: -18,
    marginRight: -2,
  },
  heroCircle: {
    position: "absolute",
    right: 28,
    top: 8,
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: "rgba(126,73,255,0.08)",
  },
  heroDot: {
    position: "absolute",
    right: 8,
    top: 13,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#B98EFF",
  },
  heroTinyCircle: {
    position: "absolute",
    left: 17,
    bottom: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#B45CFF",
    opacity: 0.62,
  },
  companyBuilding: {
    position: "absolute",
    right: 45,
    top: 29,
    width: 76,
    height: 105,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingTop: 25,
    shadowColor: "#6D3DF2",
    shadowOffset: { width: 0, height: 13 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 7,
  },
  buildingRoof: {
    position: "absolute",
    top: -14,
    left: 9,
    right: 9,
    height: 14,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#7545F4",
  },
  windowGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buildingWindow: {
    width: 18,
    height: 22,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.58)",
    marginBottom: 13,
  },
  doorWrap: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: 28,
    height: 37,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
  },
  doorLine: {
    width: 2,
    height: 36,
    backgroundColor: "#6840EA",
    opacity: 0.45,
  },
  profileBubble: {
    position: "absolute",
    left: 50,
    top: 43,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E846B2",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  profileHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    marginBottom: 4,
  },
  profileBody: {
    width: 34,
    height: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  shieldCard: {
    position: "absolute",
    right: 0,
    bottom: 1,
    width: 67,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7744FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },
  plantLeft: {
    position: "absolute",
    left: 37,
    bottom: 4,
    width: 39,
    height: 55,
  },
  plantLeaf: {
    position: "absolute",
    width: 13,
    height: 39,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 4,
    backgroundColor: "#B749F7",
  },
  plantLeafOne: {
    left: 7,
    bottom: 8,
    transform: [{ rotate: "-28deg" }],
  },
  plantLeafTwo: {
    right: 6,
    bottom: 5,
    backgroundColor: "#7E43F8",
    transform: [{ rotate: "20deg" }],
  },
  plantBase: {
    position: "absolute",
    bottom: 0,
    left: 5,
    width: 32,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#8447F7",
  },
  plantRight: {
    position: "absolute",
    right: 0,
    top: 39,
    width: 44,
    height: 78,
  },
  tallLeaf: {
    position: "absolute",
    width: 16,
    height: 58,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    backgroundColor: "#9360FF",
  },
  tallLeafOne: {
    right: 12,
    top: 0,
    transform: [{ rotate: "20deg" }],
  },
  tallLeafTwo: {
    right: 24,
    top: 29,
    height: 39,
    backgroundColor: "#D238CA",
    transform: [{ rotate: "-36deg" }],
  },
  plantStem: {
    position: "absolute",
    right: 23,
    bottom: 0,
    width: 3,
    height: 60,
    borderRadius: 2,
    backgroundColor: "#7651D8",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 19,
    shadowColor: "#9C82D8",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 9,
  },
  fieldBlock: {
    marginBottom: 15,
  },
  fieldBlockSmall: {
    marginBottom: 14,
  },
  label: {
    color: "#30364F",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 7,
  },
  inputShell: {
    height: 43,
    borderRadius: 11,
    borderWidth: 1.15,
    borderColor: "#E0E3EC",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 9,
  },
  inputIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F1E9FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#151A33",
    fontSize: 13,
    fontWeight: "700",
    paddingVertical: 0,
  },
  eyeButton: {
    width: 32,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  strengthRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 7,
    marginBottom: 5,
  },
  strengthText: {
    color: "#8A90A4",
    fontSize: 10,
    fontWeight: "800",
  },
  strengthStrong: {
    color: "#1EBB67",
    fontSize: 10,
    fontWeight: "900",
  },
  strengthTrack: {
    height: 3,
    borderRadius: 6,
    backgroundColor: "#ECE8F7",
    overflow: "hidden",
    marginLeft: 42,
    marginRight: 42,
  },
  strengthFill: {
    width: "83%",
    height: "100%",
    borderRadius: 6,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 17,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#6B2EFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#6B2EFF",
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 16,
  },
  termsText: {
    color: "#667088",
    fontSize: 11.5,
    fontWeight: "800",
  },
  termsLink: {
    color: "#6B2EFF",
    fontSize: 11.5,
    fontWeight: "900",
  },
  primaryButton: {
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#B124E6",
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 7,
  },
  primaryGradient: {
    height: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 19,
    marginBottom: 12,
    paddingHorizontal: 7,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E9EAF1",
  },
  dividerText: {
    color: "#7F8495",
    fontSize: 12,
    fontWeight: "800",
    marginHorizontal: 13,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#384057",
    fontSize: 12,
    fontWeight: "900",
  },
  footerLink: {
    color: "#6A2BFF",
    fontSize: 12,
    fontWeight: "900",
  },
});

export default CompanyRegisterScreen;
