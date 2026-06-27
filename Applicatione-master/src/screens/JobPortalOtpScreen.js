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
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";

const OTP_LENGTH = 6;
const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const JobPortalOtpScreen = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 42, 390);
  const compact = height < 720 || width < 370;
  const otpInputRef = useRef(null);
  const [otpCode, setOtpCode] = useState("482163");
  const mobileNumber = route?.params?.mobileNumber ?? "+91 98765 43210";
  const digitGap = compact ? 7 : 9;
  const digitBoxSize = Math.min((contentWidth - digitGap * 5) / 6, 45);
  const otpDigits = Array.from(
    { length: OTP_LENGTH },
    (_, index) => otpCode[index] ?? "",
  );

  const handleOtpChange = (value) => {
    setOtpCode(value.replace(/\D/g, "").slice(0, OTP_LENGTH));
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

        <View style={styles.screenBody}>
          <View style={[styles.mainBlock, compact && styles.mainBlockCompact]}>
            <Text style={[styles.title, compact && styles.titleCompact]}>
              Verify Your Number
            </Text>
            <Text style={styles.subtitle}>Enter the 6 digit code sent to</Text>
            <Text style={styles.phoneText}>{mobileNumber}</Text>

            <TouchableOpacity
              activeOpacity={1}
              style={[styles.otpRow, { gap: digitGap }]}
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
              {otpDigits.map((digit, index) => (
                <View
                  key={`job-portal-otp-${index}`}
                  style={[
                    styles.otpBox,
                    {
                      width: digitBoxSize,
                      height: digitBoxSize + 6,
                    },
                  ]}
                >
                  <Text style={styles.otpDigit}>{digit}</Text>
                </View>
              ))}
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Resend code in </Text>
              <Text style={styles.timerText}>00:25</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate("JobPortalSkills")}
          >
            <LinearGradient
              colors={["#673BF2", "#4B2BE7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.verifyButton,
                compact && styles.verifyButtonCompact,
              ]}
            >
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  screenBody: {
    flex: 1,
    justifyContent: "space-between",
  },
  mainBlock: {
    alignItems: "center",
    paddingTop: 45,
  },
  mainBlockCompact: {
    paddingTop: 28,
  },
  title: {
    color: "#1A1B2D",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    letterSpacing: -0.35,
    textAlign: "center",
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  subtitle: {
    color: "#3F4052",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 22,
  },
  phoneText: {
    color: "#282A3D",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 3,
  },
  otpRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 52,
    position: "relative",
  },
  hiddenOtpInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpBox: {
    borderWidth: 1.3,
    borderColor: "#E7E7F0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  otpDigit: {
    color: "#2B2C3E",
    fontSize: 15,
    fontWeight: "900",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  resendText: {
    color: "#8C8D9E",
    fontSize: 13,
    fontWeight: "800",
  },
  timerText: {
    color: "#5935EC",
    fontSize: 13,
    fontWeight: "900",
  },
  verifyButton: {
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
  verifyButtonCompact: {
    height: 51,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});

export default JobPortalOtpScreen;
