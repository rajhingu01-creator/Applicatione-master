import React from "react";
import {
  Alert,
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
import { ArrowLeft, Bell, Clock, HelpCircle, Info } from "lucide-react-native";

const supportRows = [
  {
    title: "Help Center",
    description: "Browse articles and find answers to common questions.",
    Icon: HelpCircle,
  },
  {
    title: "Raise a Ticket",
    description: "Submit a request and we will get back to you.",
    Icon: Info,
  },
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time.",
    Icon: Bell,
  },
  {
    title: "FAQ",
    description: "View frequently asked questions.",
    Icon: HelpCircle,
  },
];

const EmployerHelpSupportScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardHeight = Math.max(Math.min(height - topInset - 24, 700), 580);

  const openSupportAction = (title) => {
    Alert.alert(title, `${title} section is coming soon.`);
  };

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
        <View style={[styles.card, { width: cardWidth, minHeight: cardHeight }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={styles.headerSpacer} />
          </View>

          <LinearGradient
            colors={["#5B35F5", "#8E27E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Need Help?</Text>
              <Text style={styles.heroText}>We are here to help you!</Text>
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.contactButton}
                onPress={() => openSupportAction("Contact Support")}
              >
                <Text style={styles.contactButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chatArt}>
              <View style={styles.chatBubble}>
                <Text style={styles.chatDots}>•••</Text>
              </View>
              <View style={styles.chatTail} />
            </View>
          </LinearGradient>

          <View style={styles.supportList}>
            {supportRows.map(({ title, description, Icon }) => (
              <TouchableOpacity
                key={title}
                activeOpacity={0.82}
                style={styles.supportRow}
                onPress={() => openSupportAction(title)}
              >
                <View style={styles.iconWrap}>
                  <Icon size={16} color="#8A5BFF" strokeWidth={2.3} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{title}</Text>
                  <Text style={styles.rowDescription}>{description}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerSpacer} />

          <View style={styles.responseCard}>
            <View style={styles.clockWrap}>
              <Clock size={18} color="#756B9A" strokeWidth={2.3} />
            </View>
            <Text style={styles.responseText}>Response time: Within 24 hours</Text>
          </View>
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
    marginBottom: 22,
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
  heroCard: {
    minHeight: 138,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 18,
    overflow: "hidden",
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 18,
  },
  contactButton: {
    height: 38,
    width: 130,
    borderRadius: 8,
    backgroundColor: "rgba(45,22,190,0.44)",
    alignItems: "center",
    justifyContent: "center",
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  chatArt: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  chatBubble: {
    width: 62,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#EFE7FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3113A8",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  chatDots: {
    color: "#6A3BFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: -5,
  },
  chatTail: {
    position: "absolute",
    bottom: 21,
    left: 25,
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#EFE7FF",
    transform: [{ rotate: "45deg" }],
  },
  supportList: {
    gap: 12,
  },
  supportRow: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: "#E8E9F1",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#9197AD",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  rowCopy: {
    flex: 1,
    paddingRight: 10,
  },
  rowTitle: {
    color: "#20243A",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 5,
  },
  rowDescription: {
    color: "#70768F",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  chevron: {
    color: "#A1A6B7",
    fontSize: 24,
    fontWeight: "800",
    marginTop: -2,
  },
  footerSpacer: {
    flex: 1,
    minHeight: 18,
  },
  responseCard: {
    minHeight: 54,
    borderRadius: 13,
    backgroundColor: "#F5F0FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  clockWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  responseText: {
    flex: 1,
    color: "#756B9A",
    fontSize: 12.5,
    fontWeight: "900",
  },
});

export default EmployerHelpSupportScreen;
