import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  FileText,
  Globe,
  Lock,
  Share2,
  Shield,
  User,
} from "lucide-react-native";

const privacyItems = [
  {
    title: "1. Information We Collect",
    text: "We collect personal information you provide and data related to your activity.",
    Icon: FileText,
  },
  {
    title: "2. How We Use Information",
    text: "We use your data to provide, improve and personalize our services.",
    Icon: Shield,
  },
  {
    title: "3. Data Sharing",
    text: "We do not sell your personal data. We share data only as required for services.",
    Icon: Share2,
  },
  {
    title: "4. Data Security",
    text: "We implement industry-standard security measures to protect your data.",
    Icon: Lock,
  },
  {
    title: "5. Your Rights",
    text: "You can access, update or delete your data at any time.",
    Icon: User,
  },
  {
    title: "6. Cookies",
    text: "We use cookies to enhance your experience and analyze app usage.",
    Icon: Globe,
  },
];

const EmployerPrivacyPolicyScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardMinHeight = Math.max(Math.min(height - topInset - 24, 780), 690);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 10, paddingBottom: 18 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { width: cardWidth, minHeight: cardMinHeight }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.heroArt}>
            <Text style={[styles.sparkle, styles.sparkleOne]}>✦</Text>
            <Text style={[styles.sparkle, styles.sparkleTwo]}>✦</Text>
            <Text style={[styles.sparkle, styles.sparkleThree]}>✦</Text>
            <Text style={[styles.sparkle, styles.sparkleFour]}>✦</Text>
            <LinearGradient
              colors={["#8E6BFF", "#5532F4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shieldIcon}
            >
              <Shield size={82} color="#FFFFFF" strokeWidth={1.7} />
              <View style={styles.userCircle}>
                <User size={29} color="#FFFFFF" strokeWidth={2.3} />
              </View>
            </LinearGradient>
            <LinearGradient
              colors={["#7C57FF", "#5736F5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.lockBadge}
            >
              <Lock size={22} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </View>

          <Text style={styles.pageTitle}>Privacy Policy</Text>
          <Text style={styles.updatedText}>Last updated: 20 May 2025</Text>

          <Text style={styles.introText}>
            Your privacy is important to us. This policy explains how Connectly
            collects, uses, and protects your data.
          </Text>

          <View style={styles.privacyList}>
            {privacyItems.map(({ title, text, Icon }) => (
              <TouchableOpacity key={title} activeOpacity={0.78} style={styles.privacyRow}>
                <View style={styles.iconWrap}>
                  <Icon size={16} color="#744CFF" strokeWidth={2.25} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{title}</Text>
                  <Text style={styles.rowText}>{text}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerSpacer} />

          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.goBack()}>
            <LinearGradient
              colors={["#4B28FF", "#F226A8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>I Understand</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: "#8E86A8",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  headerRow: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#F5F3FA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECEEF6",
  },
  headerTitle: {
    color: "#20243A",
    fontSize: 17,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 38,
  },
  heroArt: {
    height: 116,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  shieldIcon: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6A3BFF",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  userCircle: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockBadge: {
    position: "absolute",
    right: "33%",
    bottom: 5,
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  sparkle: {
    position: "absolute",
    color: "#9D7BFF",
    fontSize: 13,
    fontWeight: "900",
  },
  sparkleOne: {
    left: "30%",
    top: 13,
  },
  sparkleTwo: {
    right: "29%",
    top: 18,
  },
  sparkleThree: {
    left: "28%",
    top: 54,
  },
  sparkleFour: {
    right: "25%",
    top: 57,
  },
  pageTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  updatedText: {
    color: "#8A90A8",
    fontSize: 12.5,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  introText: {
    color: "#59617C",
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "800",
    marginTop: 23,
    marginBottom: 18,
  },
  privacyList: {
    gap: 12,
  },
  privacyRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "#F6F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#EFE9FF",
  },
  rowCopy: {
    flex: 1,
    paddingRight: 10,
  },
  rowTitle: {
    color: "#5135F7",
    fontSize: 12.8,
    fontWeight: "900",
    marginBottom: 5,
  },
  rowText: {
    color: "#59617C",
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "800",
  },
  chevron: {
    color: "#9097AA",
    fontSize: 24,
    fontWeight: "800",
    marginTop: -2,
  },
  footerSpacer: {
    flex: 1,
    minHeight: 30,
  },
  actionButton: {
    height: 48,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});

export default EmployerPrivacyPolicyScreen;
