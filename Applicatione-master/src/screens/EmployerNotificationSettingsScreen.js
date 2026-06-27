import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  Clock,
  User,
  Users,
} from "lucide-react-native";

const NOTIFICATION_SETTINGS_KEY = "@employer_notification_settings";

const defaultSettings = {
  pushNotifications: true,
  emailNotifications: true,
  newApplications: true,
  interviewScheduled: true,
  messages: true,
  aiRecommendedCandidates: true,
  jobExpiryAlert: false,
};

const channelRows = [
  {
    title: "Push Notifications",
    description: "Enable push notifications",
    key: "pushNotifications",
  },
  {
    title: "Email Notifications",
    description: "Enable email notifications",
    key: "emailNotifications",
  },
];

const notificationRows = [
  {
    title: "New Applications",
    description: "When new candidates apply",
    key: "newApplications",
    Icon: User,
  },
  {
    title: "Interview Scheduled",
    description: "When interview is scheduled",
    key: "interviewScheduled",
    Icon: Briefcase,
  },
  {
    title: "Messages",
    description: "When you receive a message",
    key: "messages",
    Icon: Bell,
  },
  {
    title: "AI Recommended Candidates",
    description: "When AI finds good matches",
    key: "aiRecommendedCandidates",
    Icon: Users,
  },
  {
    title: "Job Expiry Alert",
    description: "When your job is about to expire",
    key: "jobExpiryAlert",
    Icon: Clock,
  },
];

const EmployerNotificationSettingsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardHeight = Math.max(Math.min(height - topInset - 24, 700), 580);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(
          NOTIFICATION_SETTINGS_KEY,
        );

        if (savedSettings && mounted) {
          setSettings({
            ...defaultSettings,
            ...JSON.parse(savedSettings),
          });
        }
      } catch {
        if (mounted) {
          setSettings(defaultSettings);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(settings),
      );
      Alert.alert("Saved", "Notification settings saved successfully.");
    } catch {
      Alert.alert("Unable to Save", "Please try again.");
    }
  };

  const renderSwitch = (key) => (
    <Switch
      value={settings[key]}
      onValueChange={(value) => updateSetting(key, value)}
      trackColor={{ false: "#D7D9E3", true: "#5B35F5" }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#D7D9E3"
      style={styles.switchControl}
    />
  );

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
        <View
          style={[styles.card, { width: cardWidth, minHeight: cardHeight }]}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notification Settings</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.channelGroup}>
            {channelRows.map((row) => (
              <View key={row.key} style={styles.channelRow}>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={styles.rowDescription}>{row.description}</Text>
                </View>
                {renderSwitch(row.key)}
              </View>
            ))}
          </View>

          <Text style={styles.sectionIntro}>You will be notified for</Text>

          <View style={styles.notificationList}>
            {notificationRows.map(({ title, description, key, Icon }) => (
              <View key={key} style={styles.notificationRow}>
                <View style={styles.iconWrap}>
                  <Icon size={15} color="#8A90A8" strokeWidth={2.2} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{title}</Text>
                  <Text style={styles.rowDescription}>{description}</Text>
                </View>
                {renderSwitch(key)}
              </View>
            ))}
          </View>

          <View style={styles.footerSpacer} />

          <TouchableOpacity activeOpacity={0.9} onPress={saveSettings}>
            <LinearGradient
              colors={["#4B28FF", "#F226A8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    marginBottom: 25,
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
  channelGroup: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F7",
    marginBottom: 19,
  },
  channelRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionIntro: {
    color: "#6F7690",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  notificationList: {
    gap: 17,
  },
  notificationRow: {
    minHeight: 39,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F7F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowCopy: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    color: "#20243A",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 4,
  },
  rowDescription: {
    color: "#70768F",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  switchControl: {
    transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }],
  },
  footerSpacer: {
    flex: 1,
    minHeight: 52,
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

export default EmployerNotificationSettingsScreen;
