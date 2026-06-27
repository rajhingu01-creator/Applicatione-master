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
import { ArrowLeft, FileText, Shield } from "lucide-react-native";

const terms = [
  {
    title: "1. Acceptance of Terms",
    text: "By accessing or using Connectly, you agree to be bound by these Terms of Use and all applicable laws.",
  },
  {
    title: "2. Use of Services",
    text: "You agree to use Connectly only for lawful purposes and in accordance with these Terms.",
  },
  {
    title: "3. User Accounts",
    text: "You are responsible for maintaining the confidentiality of your account and password.",
  },
  {
    title: "4. Job Posting & Applications",
    text: "We are not responsible for the accuracy of job postings or user content.",
  },
  {
    title: "5. Termination",
    text: "We reserve the right to suspend or terminate your account if you violate these terms.",
  },
  {
    title: "6. Changes to Terms",
    text: "We may update these Terms from time to time. Continued use means you accept the changes.",
  },
];

const EmployerTermsOfUseScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardMinHeight = Math.max(Math.min(height - topInset - 24, 760), 680);

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
            <Text style={styles.headerTitle}>Terms of Use</Text>
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
              style={styles.documentIcon}
            >
              <FileText size={45} color="#FFFFFF" strokeWidth={1.7} />
              <View style={styles.signatureRow}>
                <Text style={styles.signatureText}>✕</Text>
                <View style={styles.signatureLine} />
              </View>
            </LinearGradient>
            <LinearGradient
              colors={["#7C57FF", "#5736F5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shieldBadge}
            >
              <Shield size={31} color="#FFFFFF" strokeWidth={2.3} />
            </LinearGradient>
          </View>

          <Text style={styles.pageTitle}>Terms of Use</Text>
          <Text style={styles.updatedText}>Last updated: 20 May 2025</Text>

          <Text style={styles.introText}>
            Welcome to Connectly. By using our app, you agree to these terms and
            conditions.
          </Text>

          <View style={styles.termsList}>
            {terms.map((item) => (
              <View key={item.title} style={styles.termBlock}>
                <Text style={styles.termTitle}>{item.title}</Text>
                <Text style={styles.termText}>{item.text}</Text>
              </View>
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
    marginBottom: 20,
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
    height: 114,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  documentIcon: {
    width: 72,
    height: 82,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6A3BFF",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  signatureRow: {
    position: "absolute",
    left: 13,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  signatureText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginRight: 4,
  },
  signatureLine: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  shieldBadge: {
    position: "absolute",
    right: "34%",
    bottom: 5,
    width: 50,
    height: 50,
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
    right: "30%",
    top: 11,
  },
  sparkleThree: {
    left: "25%",
    top: 47,
  },
  sparkleFour: {
    right: "24%",
    top: 44,
  },
  pageTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 3,
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
    marginTop: 24,
  },
  termsList: {
    marginTop: 22,
    gap: 19,
  },
  termBlock: {},
  termTitle: {
    color: "#5135F7",
    fontSize: 13.5,
    fontWeight: "900",
    marginBottom: 7,
  },
  termText: {
    color: "#59617C",
    fontSize: 12.4,
    lineHeight: 19,
    fontWeight: "800",
  },
  footerSpacer: {
    flex: 1,
    minHeight: 28,
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

export default EmployerTermsOfUseScreen;
