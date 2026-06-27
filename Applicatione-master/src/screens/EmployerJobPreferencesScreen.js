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

const JOB_PREFERENCES_KEY = "@employer_job_preferences";

const defaultPreferences = {
  location: "Ahmedabad, Gujarat",
  salaryRange: "₹ 4 LPA - ₹ 8 LPA",
  jobType: "Full Time",
  aiMatch: true,
  autoRecommendation: true,
  showSalary: false,
};

const selectFields = [
  {
    label: "Default Job Location",
    key: "location",
    options: [
      "Ahmedabad, Gujarat",
      "Surat, Gujarat",
      "Vadodara, Gujarat",
      "Rajkot, Gujarat",
      "Remote",
    ],
  },
  {
    label: "Default Salary Range",
    key: "salaryRange",
    options: [
      "₹ 2 LPA - ₹ 4 LPA",
      "₹ 4 LPA - ₹ 8 LPA",
      "₹ 8 LPA - ₹ 12 LPA",
      "₹ 12 LPA - ₹ 18 LPA",
      "₹ 18 LPA+",
    ],
  },
  {
    label: "Default Job Type",
    key: "jobType",
    options: ["Full Time", "Part Time", "Contract", "Internship", "Remote"],
  },
];

const toggleRows = [
  {
    title: "AI Match Candidates",
    description: "Allow AI to match relevant candidates automatically.",
    key: "aiMatch",
  },
  {
    title: "Auto Recommendation",
    description: "Get AI recommended candidates for your jobs.",
    key: "autoRecommendation",
  },
  {
    title: "Show Salary to Candidates",
    description: "Display salary range in job post.",
    key: "showSalary",
  },
];

const EmployerJobPreferencesScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardHeight = Math.max(Math.min(height - topInset - 24, 690), 560);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [openSelect, setOpenSelect] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadPreferences = async () => {
      try {
        const savedPreferences = await AsyncStorage.getItem(JOB_PREFERENCES_KEY);

        if (savedPreferences && mounted) {
          setPreferences({
            ...defaultPreferences,
            ...JSON.parse(savedPreferences),
          });
        }
      } catch {
        if (mounted) {
          setPreferences(defaultPreferences);
        }
      }
    };

    loadPreferences();

    return () => {
      mounted = false;
    };
  }, []);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem(
        JOB_PREFERENCES_KEY,
        JSON.stringify(preferences),
      );
      Alert.alert("Saved", "Job preferences saved successfully.");
    } catch {
      Alert.alert("Unable to Save", "Please try again.");
    }
  };

  const renderSelect = ({ label, key, options }) => {
    const isOpen = openSelect === key;

    return (
      <View key={key} style={styles.fieldBlock}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          activeOpacity={0.82}
          style={[styles.selectBox, isOpen && styles.selectBoxOpen]}
          onPress={() => setOpenSelect(isOpen ? null : key)}
        >
          <Text numberOfLines={1} style={styles.selectText}>
            {preferences[key]}
          </Text>
          <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>⌄</Text>
        </TouchableOpacity>

        {isOpen ? (
          <View style={styles.optionList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.78}
                style={styles.optionRow}
                onPress={() => {
                  updatePreference(key, option);
                  setOpenSelect(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences[key] === option && styles.optionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  const renderToggle = ({ title, description, key }) => (
    <View key={key} style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={preferences[key]}
        onValueChange={(value) => updatePreference(key, value)}
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
            <Text style={styles.headerTitle}>Job Preferences</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.formBlock}>{selectFields.map(renderSelect)}</View>

          <View style={styles.toggleGroup}>{toggleRows.map(renderToggle)}</View>

          <View style={styles.footerSpacer} />

          <TouchableOpacity activeOpacity={0.9} onPress={savePreferences}>
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
    marginBottom: 24,
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
  formBlock: {
    marginBottom: 30,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  label: {
    color: "#20243A",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 8,
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
  toggleGroup: {
    gap: 24,
  },
  toggleRow: {
    minHeight: 46,
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
    marginBottom: 4,
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
  footerSpacer: {
    flex: 1,
    minHeight: 38,
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

export default EmployerJobPreferencesScreen;
