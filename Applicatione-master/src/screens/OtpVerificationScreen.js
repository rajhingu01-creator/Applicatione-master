import React, { useRef, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const OTP_LENGTH = 6;

const topInset =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const OtpHeroArtwork = () => (
  <View style={styles.heroArtwork} pointerEvents="none">
    <View style={styles.heroGlow} />
    <View style={styles.blueLeafOne} />
    <View style={styles.blueLeafTwo} />
    <View style={styles.pinkLeafOne} />
    <View style={styles.pinkLeafTwo} />
    <View style={styles.heroDotOne} />
    <View style={styles.heroDotTwo} />
    <Text style={styles.plane}>✈</Text>
    <Text style={styles.planeTrail}>⌁</Text>

    <LinearGradient
      colors={["#163DFF", "#7943FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.envelopeBack}
    />

    <View style={styles.letterCard}>
      <LinearGradient
        colors={["#7B4DFF", "#A348FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.letterShield}
      >
        <Ionicons name="lock-closed" size={26} color="#FFFFFF" />
      </LinearGradient>
      <View style={styles.starsRow}>
        <Text style={styles.starText}>✱✱✱✱✱</Text>
      </View>
    </View>

    <LinearGradient
      colors={["#10A7FF", "#8D41FF", "#FF39B8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.envelopeBody}
    >
      <View style={styles.envelopeLeftFold} />
      <View style={styles.envelopeRightFold} />
      <View style={styles.envelopeFrontFold} />
    </LinearGradient>
  </View>
);

const OtpIcon = () => (
  <View style={styles.otpIconWrap}>
    <LinearGradient
      colors={["#0D67FF", "#9143FF", "#F337AA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.otpIconEnvelope}
    >
      <View style={styles.otpIconFoldLeft} />
      <View style={styles.otpIconFoldRight} />
    </LinearGradient>
    <View style={styles.checkBadge}>
      <Ionicons name="checkmark" size={17} color="#FFFFFF" />
    </View>
  </View>
);

const OtpVerificationScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 24, 390);
  const digitBoxSize = Math.min((contentWidth - 72) / 6, 43);
  const otpInputRef = useRef(null);
  const [otpCode, setOtpCode] = useState("");
  const otpDigits = Array.from(
    { length: OTP_LENGTH },
    (_, index) => otpCode[index] ?? "",
  );
  const focusedOtpIndex = Math.min(otpCode.length, OTP_LENGTH - 1);

  const handleOtpChange = (value) => {
    setOtpCode(value.replace(/\D/g, "").slice(0, OTP_LENGTH));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundDecor} pointerEvents="none">
        <LinearGradient
          colors={["rgba(234,49,164,0.34)", "rgba(234,49,164,0)"]}
          style={styles.topPinkBlob}
        />
        <LinearGradient
          colors={["rgba(18,178,255,0.34)", "rgba(18,178,255,0)"]}
          style={styles.bottomBlueBlob}
        />
        <LinearGradient
          colors={["rgba(126,73,255,0.24)", "rgba(126,73,255,0)"]}
          style={styles.leftPurpleBlob}
        />
      </View>

      <View style={styles.screenContent}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.topBlock}>
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#111633" />
            </TouchableOpacity>

            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroTitle}>
                  Verify Your{"\n"}
                  <Text style={styles.heroTitleAccent}>Email</Text>
                </Text>
                <Text style={styles.heroSubtitle}>
                  We have sent a 6 digit verification code to{"\n"}
                  <Text style={styles.heroEmail}>name@company.com</Text>
                </Text>
              </View>
              <OtpHeroArtwork />
            </View>
          </View>

          <View style={styles.card}>
            <OtpIcon />
            <Text style={styles.cardTitle}>Enter 6 Digit Code</Text>
            <Text style={styles.cardSubtitle}>
              Enter the 6 digit code sent to
            </Text>
            <Text style={styles.cardEmail}>name@company.com</Text>

            <TouchableOpacity
              activeOpacity={1}
              style={styles.otpRow}
              onPress={() => otpInputRef.current?.focus()}
            >
              <TextInput
                ref={otpInputRef}
                value={otpCode}
                onChangeText={handleOtpChange}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={OTP_LENGTH}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                caretHidden
                style={styles.hiddenOtpInput}
              />
              {otpDigits.map((digit, index) => {
                const isActive = index === focusedOtpIndex;

                return (
                  <View
                    key={`otp-${index}`}
                    style={[
                      styles.otpBox,
                      isActive && styles.otpBoxActive,
                      {
                        width: digitBoxSize,
                        height: digitBoxSize + 5,
                        borderRadius: 10,
                      },
                    ]}
                  >
                    {digit ? (
                      <Text style={styles.otpDigit}>{digit}</Text>
                    ) : (
                      <Text style={styles.otpPlaceholder}>—</Text>
                    )}
                  </View>
                );
              })}
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Resend code in </Text>
              <Text style={styles.timerText}>00:45</Text>
            </View>

            <View style={styles.secureBox}>
              <LinearGradient
                colors={["#7C3DFF", "#4E2AE8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.secureIcon}
              >
                <Ionicons name="shield-checkmark" size={25} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.secureCopy}>
                <Text style={styles.secureTitle}>Secure & Protected</Text>
                <Text style={styles.secureText}>
                  Your verification code is safe with us.{"\n"}
                  Please do not share it with anyone.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.primaryButton}
              onPress={() => navigation.navigate("CompanyProfile")}
            >
              <LinearGradient
                colors={["#0F4BFF", "#8B2CFF", "#F12A94"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryText}>Verify OTP</Text>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Didn’t receive the code?</Text>
              <TouchableOpacity activeOpacity={0.75}>
                <Text style={styles.footerLink}> Resend Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#F9F4FF",
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: "hidden",
  },
  topPinkBlob: {
    position: "absolute",
    right: -94,
    top: -82,
    width: 285,
    height: 300,
    borderRadius: 150,
  },
  bottomBlueBlob: {
    position: "absolute",
    left: -105,
    bottom: -85,
    width: 290,
    height: 255,
    borderRadius: 145,
  },
  leftPurpleBlob: {
    position: "absolute",
    left: -70,
    top: -80,
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  screenContent: {
    flex: 1,
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
    paddingHorizontal: 12,
    paddingTop: topInset,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "flex-start",
  },
  topBlock: {
    width: "100%",
    marginBottom: 4,
  },
  backButton: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8165C8",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 10,
  },
  heroRow: {
    minHeight: 142,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  heroCopy: {
    width: "50%",
    paddingTop: 5,
    zIndex: 2,
  },

  heroTitle: {
    color: "#6232FF",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginBottom: 8,
  },
  heroTitleAccent: {
    color: "#B932D8",
  },
  heroSubtitle: {
    color: "#6C7285",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  heroEmail: {
    color: "#5F2DFF",
    fontWeight: "900",
  },
  heroArtwork: {
    width: 170,
    height: 138,
    marginTop: -1,
    marginRight: -12,
    transform: [{ scale: 0.82 }],
  },
  heroGlow: {
    position: "absolute",
    left: 24,
    right: 10,
    bottom: 20,
    height: 52,
    borderRadius: 50,
    backgroundColor: "rgba(124,65,255,0.12)",
  },
  blueLeafOne: {
    position: "absolute",
    left: 11,
    bottom: 35,
    width: 20,
    height: 67,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 5,
    backgroundColor: "#39AFFF",
    transform: [{ rotate: "33deg" }],
    opacity: 0.82,
  },
  blueLeafTwo: {
    position: "absolute",
    left: 28,
    bottom: 28,
    width: 18,
    height: 55,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 5,
    backgroundColor: "#36C5F4",
    transform: [{ rotate: "-7deg" }],
    opacity: 0.78,
  },
  pinkLeafOne: {
    position: "absolute",
    right: 6,
    bottom: 35,
    width: 22,
    height: 70,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 5,
    backgroundColor: "#F137A5",
    transform: [{ rotate: "-30deg" }],
    opacity: 0.82,
  },
  pinkLeafTwo: {
    position: "absolute",
    right: 28,
    bottom: 24,
    width: 17,
    height: 54,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomRightRadius: 5,
    backgroundColor: "#EF67C5",
    transform: [{ rotate: "7deg" }],
    opacity: 0.78,
  },
  heroDotOne: {
    position: "absolute",
    left: 9,
    top: 58,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#26B8F4",
  },
  heroDotTwo: {
    position: "absolute",
    right: 10,
    top: 83,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E936AE",
  },
  plane: {
    position: "absolute",
    right: 20,
    top: -10,
    color: "#7435FF",
    fontSize: 33,
    transform: [{ rotate: "-18deg" }],
  },
  planeTrail: {
    position: "absolute",
    right: -2,
    top: 29,
    color: "#7D44FF",
    fontSize: 30,
    opacity: 0.6,
    transform: [{ rotate: "13deg" }],
  },
  envelopeBack: {
    position: "absolute",
    left: 46,
    top: 33,
    width: 126,
    height: 105,
    borderRadius: 15,
    transform: [{ rotate: "-7deg" }],
  },
  letterCard: {
    position: "absolute",
    left: 61,
    top: 19,
    width: 112,
    height: 112,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 13,
    shadowColor: "#7B63C8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.13,
    shadowRadius: 14,
    elevation: 6,
  },
  letterShield: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  starsRow: {
    height: 20,
  },
  starText: {
    color: "#6A35F5",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 1,
  },
  envelopeBody: {
    position: "absolute",
    left: 37,
    bottom: 15,
    width: 145,
    height: 95,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#8A43FF",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  envelopeLeftFold: {
    position: "absolute",
    left: -18,
    bottom: -16,
    width: 98,
    height: 98,
    backgroundColor: "rgba(255,255,255,0.16)",
    transform: [{ rotate: "45deg" }],
  },
  envelopeRightFold: {
    position: "absolute",
    right: -18,
    bottom: -16,
    width: 98,
    height: 98,
    backgroundColor: "rgba(255,255,255,0.18)",
    transform: [{ rotate: "45deg" }],
  },
  envelopeFrontFold: {
    position: "absolute",
    left: 28,
    bottom: -47,
    width: 92,
    height: 92,
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: [{ rotate: "45deg" }],
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 13,
    shadowColor: "#8F7CC3",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
    elevation: 10,
  },
  otpIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1ECFF",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  otpIconEnvelope: {
    width: 41,
    height: 30,
    borderRadius: 5,
    overflow: "hidden",
  },
  otpIconFoldLeft: {
    position: "absolute",
    left: -7,
    bottom: -12,
    width: 31,
    height: 31,
    backgroundColor: "rgba(255,255,255,0.18)",
    transform: [{ rotate: "45deg" }],
  },
  otpIconFoldRight: {
    position: "absolute",
    right: -7,
    bottom: -12,
    width: 31,
    height: 31,
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: [{ rotate: "45deg" }],
  },
  checkBadge: {
    position: "absolute",
    right: 9,
    bottom: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#69D74F",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#141936",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#687087",
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  cardEmail: {
    color: "#5F2DFF",
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 13,
  },
  otpRow: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  otpBox: {
    borderWidth: 1.2,
    borderColor: "#E1E4EE",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxActive: {
    borderWidth: 2,
    borderColor: "#5B2DFF",
    shadowColor: "#5B2DFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.17,
    shadowRadius: 13,
    elevation: 6,
  },
  hiddenOtpInput: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    color: "transparent",
    opacity: 0.01,
  },
  otpDigit: {
    color: "#5731FF",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    includeFontPadding: false,
    textAlign: "center",
    textAlignVertical: "center",
  },
  otpPlaceholder: {
    color: "#E3E5EE",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    includeFontPadding: false,
    textAlign: "center",
    textAlignVertical: "center",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  resendText: {
    color: "#687087",
    fontSize: 11.5,
    fontWeight: "800",
  },
  timerText: {
    color: "#F42F9E",
    fontSize: 11.5,
    fontWeight: "900",
  },
  secureBox: {
    minHeight: 50,
    borderRadius: 11,
    backgroundColor: "#F5EEFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 11,
  },
  secureIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  secureCopy: {
    flex: 1,
    minWidth: 0,
  },
  secureTitle: {
    color: "#5C2DFF",
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: "900",
    marginBottom: 1,
  },
  secureText: {
    color: "#5C647C",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "700",
  },
  primaryButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#8A2CFF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 17,
    elevation: 8,
    marginBottom: 10,
  },
  primaryGradient: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "900",
    marginRight: 42,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#6E758B",
    fontSize: 11.5,
    fontWeight: "700",
  },
  footerLink: {
    color: "#6A2BFF",
    fontSize: 11.5,
    fontWeight: "900",
  },
});

export default OtpVerificationScreen;
