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
import { ArrowLeft } from "lucide-react-native";

const APPLICATION_SETTINGS_KEY = "@employer_application_settings";

const defaultSettings = {
  autoAccept: false,
  resumeRequired: true,
  coverLetterRequired: false,
  deadline: "30 Days",
};

const toggleRows = [
  {
    title: "Auto Accept Applications",
    description: "Automatically accept applications from verified candidates.",
    key: "autoAccept",
  },
  {
    title: "Resume Required",
    description: "Make resume mandatory for job applications.",
    key: "resumeRequired",
  },
  {
    title: "Cover Letter Required",
    description: "Make cover letter mandatory for job applications.",
    key: "coverLetterRequired",
  },
];

const deadlineOptions = ["7 Days", "15 Days", "30 Days", "45 Days", "60 Days"];

const EmployerApplicationSettingsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardHeight = Math.max(Math.min(height - topInset - 24, 690), 560);
  const [settings, setSettings] = useState(defaultSettings);
  const [deadlineOpen, setDeadlineOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(
          APPLICATION_SETTINGS_KEY,
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
        APPLICATION_SETTINGS_KEY,
        JSON.stringify(settings),
      );
      Alert.alert("Saved", "Application settings saved successfully.");
    } catch {
      Alert.alert("Unable to Save", "Please try again.");
    }
  };

  const openAutoRejectRules = () => {
    Alert.alert("Auto Reject Rules", "Auto reject rules setup is coming soon.");
  };

  const renderToggle = ({ title, description, key }) => (
    <View key={key} style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: "#D7D9E3", true: "#5B35F5" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D7D9E3"
        style={styles.switchControl}
      />
    </View>
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
        <View style={[styles.card, { width: cardWidth, minHeight: cardHeight }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Application Settings</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.toggleGroup}>{toggleRows.map(renderToggle)}</View>

          <View style={styles.deadlineBlock}>
            <Text style={styles.sectionLabel}>Application Deadline</Text>
            <Text style={styles.sectionDescription}>
              Default deadline for applications.
            </Text>
            <TouchableOpacity
              activeOpacity={0.82}
              style={[styles.selectBox, deadlineOpen && styles.selectBoxOpen]}
              onPress={() => setDeadlineOpen((current) => !current)}
            >
              <Text style={styles.selectText}>{settings.deadline}</Text>
              <Text style={[styles.chevron, deadlineOpen && styles.chevronOpen]}>
                ⌄
              </Text>
            </TouchableOpacity>

            {deadlineOpen ? (
              <View style={styles.optionList}>
                {deadlineOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.78}
                    style={styles.optionRow}
                    onPress={() => {
                      updateSetting("deadline", option);
                      setDeadlineOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        settings.deadline === option && styles.optionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.rulesCard}
            onPress={openAutoRejectRules}
          >
            <View style={styles.rulesCopy}>
              <Text style={styles.sectionLabel}>Auto Reject Rules</Text>
              <Text style={styles.sectionDescription}>
                Set rules to automatically reject unqualified applications.
              </Text>
            </View>
            <Text style={styles.rulesChevron}>›</Text>
          </TouchableOpacity>

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
  toggleGroup: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F7",
    marginBottom: 20,
  },
  toggleRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleCopy: {
    flex: 1,
    paddingRight: 18,
  },
  toggleTitle: {
    color: "#20243A",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 5,
  },
  toggleDescription: {
    color: "#70768F",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  switchControl: {
    transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }],
  },
  deadlineBlock: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: "#20243A",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 5,
  },
  sectionDescription: {
    color: "#70768F",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  selectBox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E3E5EF",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 8,
    shadowColor: "#9197AD",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  selectBoxOpen: {
    borderColor: "#B9A8FF",
  },
  selectText: {
    flex: 1,
    color: "#4B5068",
    fontSize: 12.5,
    fontWeight: "800",
  },
  chevron: {
    color: "#969BB0",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 10,
    marginTop: -4,
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
    marginTop: 4,
  },
  optionList: {
    borderWidth: 1,
    borderColor: "#E7E7F0",
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  optionRow: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F7",
  },
  optionText: {
    color: "#656B82",
    fontSize: 12.5,
    fontWeight: "800",
  },
  optionTextActive: {
    color: "#5B35F5",
  },
  rulesCard: {
    minHeight: 78,
    borderWidth: 1,
    borderColor: "#E8E9F1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: "#9197AD",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rulesCopy: {
    flex: 1,
    paddingRight: 12,
  },
  rulesChevron: {
    color: "#8D93A7",
    fontSize: 24,
    fontWeight: "800",
    marginTop: -2,
  },
  footerSpacer: {
    flex: 1,
    minHeight: 54,
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

export default EmployerApplicationSettingsScreen;
