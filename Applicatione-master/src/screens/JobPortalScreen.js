import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const JobPortalIllustration = ({ compact }) => (
  <View style={[styles.illustration, compact && styles.illustrationCompact]}>
    <View style={styles.illustrationCircle} />
    <View style={[styles.decorSquare, styles.decorSquareLeft]} />
    <View style={[styles.decorSquare, styles.decorSquareRight]} />
    <View style={[styles.decorSquare, styles.decorSquareSmall]} />

    <View style={styles.leftPlant}>
      <View style={[styles.leaf, styles.leafOne]} />
      <View style={[styles.leaf, styles.leafTwo]} />
      <View style={[styles.leaf, styles.leafThree]} />
      <View style={styles.plantPot} />
    </View>

    <View style={styles.rightPlant}>
      <View style={styles.stem} />
      <View style={[styles.tallLeaf, styles.tallLeafOne]} />
      <View style={[styles.tallLeaf, styles.tallLeafTwo]} />
      <View style={styles.briefcasePot}>
        <View style={styles.briefcaseHandle} />
        <View style={styles.briefcaseLatch} />
      </View>
    </View>

    <View style={styles.personWrap}>
      <View style={styles.backLeg} />
      <View style={styles.frontLeg} />
      <View style={styles.shoeBack} />
      <View style={styles.shoeFront} />
      <View style={styles.body}>
        <View style={styles.shirt} />
      </View>
      <View style={styles.leftArm} />
      <View style={styles.rightArm} />
      <View style={styles.phone}>
        <View style={styles.phoneTopDot} />
      </View>
      <View style={styles.neck} />
      <View style={styles.head}>
        <View style={styles.ear} />
      </View>
      <View style={styles.hair} />
      <View style={styles.faceEye} />
      <View style={styles.faceSmile} />
    </View>

    <View style={styles.groundLine} />
  </View>
);

const JobPortalScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 46, 390);
  const compact = height < 720 || width < 370;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 10 : 20),
          },
        ]}
      >
        <View style={styles.heroCopy}>
          <Text style={[styles.logo, compact && styles.logoCompact]}>
            <Text style={styles.logoDark}>Job</Text>
            <Text style={styles.logoAccent}>Portal</Text>
          </Text>
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
            Find the right job for{"\n"}your career
          </Text>
        </View>

        <JobPortalIllustration compact={compact} />

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate("JobPortalRegister")}
          >
            <LinearGradient
              colors={["#673BF2", "#4B2BE7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.primaryButton,
                compact && styles.primaryButtonCompact,
              ]}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.82}
            style={[
              styles.secondaryButton,
              compact && styles.secondaryButtonCompact,
            ]}
            onPress={() => navigation.navigate("JobPortalLogin")}
          >
            <Text style={styles.secondaryButtonText}>I'm Already a Member</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 34,
  },
  heroCopy: {
    alignItems: "center",
    marginTop: 18,
  },
  logo: {
    fontSize: 42,
    lineHeight: 52,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  logoCompact: {
    fontSize: 37,
    lineHeight: 46,
  },
  logoDark: {
    color: "#131444",
  },
  logoAccent: {
    color: "#4A2DE1",
  },
  subtitle: {
    color: "#272735",
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
  },
  subtitleCompact: {
    fontSize: 15.5,
    lineHeight: 23,
    marginTop: 9,
  },
  illustration: {
    width: 330,
    height: 255,
    position: "relative",
    marginTop: 4,
  },
  illustrationCompact: {
    transform: [{ scale: 0.88 }],
    marginTop: -8,
    marginBottom: -12,
  },
  illustrationCircle: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    left: 80,
    top: 28,
    backgroundColor: "#F0ECFF",
  },
  decorSquare: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 3,
    backgroundColor: "#D9D0FF",
  },
  decorSquareLeft: {
    left: 48,
    top: 52,
  },
  decorSquareRight: {
    right: 44,
    top: 66,
    opacity: 0.7,
  },
  decorSquareSmall: {
    right: 102,
    top: 130,
    width: 10,
    height: 10,
    opacity: 0.7,
  },
  leftPlant: {
    position: "absolute",
    left: 12,
    bottom: 30,
    width: 58,
    height: 95,
  },
  leaf: {
    position: "absolute",
    width: 20,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#237E72",
  },
  leafOne: {
    left: 16,
    top: 9,
    transform: [{ rotate: "-28deg" }],
  },
  leafTwo: {
    left: 28,
    top: 19,
    transform: [{ rotate: "24deg" }],
  },
  leafThree: {
    left: 7,
    top: 33,
    height: 39,
    transform: [{ rotate: "-44deg" }],
  },
  plantPot: {
    position: "absolute",
    left: 15,
    bottom: 0,
    width: 32,
    height: 24,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#121D4F",
  },
  rightPlant: {
    position: "absolute",
    right: 14,
    bottom: 29,
    width: 82,
    height: 142,
  },
  stem: {
    position: "absolute",
    left: 30,
    bottom: 39,
    width: 4,
    height: 76,
    borderRadius: 2,
    backgroundColor: "#237E72",
    transform: [{ rotate: "14deg" }],
  },
  tallLeaf: {
    position: "absolute",
    width: 25,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#2C8F82",
  },
  tallLeafOne: {
    left: 37,
    top: 7,
    transform: [{ rotate: "37deg" }],
  },
  tallLeafTwo: {
    left: 8,
    top: 55,
    transform: [{ rotate: "-44deg" }],
  },
  briefcasePot: {
    position: "absolute",
    right: 5,
    bottom: 0,
    width: 61,
    height: 42,
    borderRadius: 7,
    backgroundColor: "#131A48",
  },
  briefcaseHandle: {
    position: "absolute",
    top: -9,
    left: 20,
    width: 22,
    height: 15,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: "#131A48",
  },
  briefcaseLatch: {
    position: "absolute",
    top: 17,
    left: 27,
    width: 8,
    height: 5,
    borderRadius: 2,
    backgroundColor: "#FFD963",
  },
  personWrap: {
    position: "absolute",
    left: 78,
    bottom: 29,
    width: 178,
    height: 198,
  },
  backLeg: {
    position: "absolute",
    right: 3,
    bottom: 12,
    width: 94,
    height: 28,
    borderRadius: 16,
    backgroundColor: "#19245B",
    transform: [{ rotate: "-11deg" }],
  },
  frontLeg: {
    position: "absolute",
    left: 42,
    bottom: 4,
    width: 115,
    height: 29,
    borderRadius: 16,
    backgroundColor: "#222B70",
    transform: [{ rotate: "-28deg" }],
  },
  shoeBack: {
    position: "absolute",
    right: 0,
    bottom: 13,
    width: 32,
    height: 13,
    borderRadius: 8,
    backgroundColor: "#11153B",
  },
  shoeFront: {
    position: "absolute",
    left: 139,
    bottom: 6,
    width: 31,
    height: 13,
    borderRadius: 8,
    backgroundColor: "#11153B",
  },
  body: {
    position: "absolute",
    left: 43,
    top: 82,
    width: 75,
    height: 84,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: "#223889",
    transform: [{ rotate: "-7deg" }],
  },
  shirt: {
    position: "absolute",
    left: 28,
    top: 7,
    width: 20,
    height: 66,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  leftArm: {
    position: "absolute",
    left: 31,
    top: 115,
    width: 73,
    height: 18,
    borderRadius: 10,
    backgroundColor: "#F2A296",
    transform: [{ rotate: "-24deg" }],
  },
  rightArm: {
    position: "absolute",
    left: 102,
    top: 90,
    width: 51,
    height: 18,
    borderRadius: 10,
    backgroundColor: "#F2A296",
    transform: [{ rotate: "-32deg" }],
  },
  phone: {
    position: "absolute",
    right: 19,
    top: 58,
    width: 26,
    height: 39,
    borderRadius: 5,
    backgroundColor: "#17205E",
    transform: [{ rotate: "-11deg" }],
  },
  phoneTopDot: {
    position: "absolute",
    top: 5,
    left: 10,
    width: 6,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#7361FF",
  },
  neck: {
    position: "absolute",
    left: 77,
    top: 69,
    width: 20,
    height: 23,
    borderRadius: 8,
    backgroundColor: "#EB978B",
  },
  head: {
    position: "absolute",
    left: 64,
    top: 33,
    width: 50,
    height: 55,
    borderRadius: 24,
    backgroundColor: "#F2A296",
  },
  ear: {
    position: "absolute",
    right: -5,
    top: 24,
    width: 11,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#ED9A90",
  },
  hair: {
    position: "absolute",
    left: 58,
    top: 24,
    width: 55,
    height: 29,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 14,
    backgroundColor: "#11194A",
    transform: [{ rotate: "-8deg" }],
  },
  faceEye: {
    position: "absolute",
    left: 92,
    top: 58,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#14143A",
  },
  faceSmile: {
    position: "absolute",
    left: 87,
    top: 72,
    width: 13,
    height: 6,
    borderBottomWidth: 2,
    borderColor: "#974A54",
    borderRadius: 8,
  },
  groundLine: {
    position: "absolute",
    left: 22,
    right: 20,
    bottom: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#29235D",
    opacity: 0.75,
  },
  actions: {
    width: "100%",
    marginTop: 4,
  },
  primaryButton: {
    height: 60,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5634EC",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryButtonCompact: {
    height: 55,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryButton: {
    height: 58,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F1FA",
    marginTop: 22,
  },
  secondaryButtonCompact: {
    height: 53,
    marginTop: 16,
  },
  secondaryButtonText: {
    color: "#2B2B3B",
    fontSize: 17,
    fontWeight: "900",
  },
});

export default JobPortalScreen;
