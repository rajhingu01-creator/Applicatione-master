import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Edit3 } from "lucide-react-native";

const COMPANY_PROFILE_KEY = "@employer_company_profile";

const defaultProfile = {
  companyName: "Meet Infotech",
  industry: "IT Services & Consulting",
  companySize: "51-200 Employees",
  website: "https://meetinfotech.com",
  location: "Ahmedabad, Gujarat, India",
  aboutCompany:
    "We are a product engineering company building scalable web and mobile applications with modern technologies.",
};

const getInitials = (name) => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return "MI";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

const EmployerCompanyProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(COMPANY_PROFILE_KEY);

        if (savedProfile && mounted) {
          setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
        }
      } catch {
        if (mounted) {
          setProfile(defaultProfile);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const initials = useMemo(
    () => getInitials(profile.companyName),
    [profile.companyName],
  );

  const updateProfile = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem(COMPANY_PROFILE_KEY, JSON.stringify(profile));
      Alert.alert("Saved", "Company profile changes saved successfully.");
    } catch {
      Alert.alert("Unable to Save", "Please try again.");
    }
  };

  const showComingSoon = () => {
    Alert.alert("Upload Logo", "Logo upload option is coming soon.");
  };

  const renderInput = (label, key, placeholder, props = {}) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={profile[key]}
        onChangeText={(value) => updateProfile(key, value)}
        placeholder={placeholder}
        placeholderTextColor="#A3A7B8"
        {...props}
      />
    </View>
  );

  const renderSelect = (label, key) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.selectInput}
        onPress={() => Alert.alert(label, `${label} options are coming soon.`)}
      >
        <Text numberOfLines={1} style={styles.selectText}>
          {profile[key]}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: topInset + 12, paddingBottom: 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { width: cardWidth }]}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Company Profile</Text>
              <View style={styles.headerSpacer} />
            </View>

            <Text style={styles.logoLabel}>Company Logo</Text>
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.logoBlock}
              onPress={showComingSoon}
            >
              <LinearGradient
                colors={["#654DFF", "#F226A8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBox}
              >
                <Text style={styles.logoInitials}>{initials}</Text>
              </LinearGradient>
              <View style={styles.editBadge}>
                <Edit3 size={11} color="#FFFFFF" strokeWidth={2.6} />
              </View>
            </TouchableOpacity>
            <Text style={styles.uploadHint}>Upload JPG or PNG (Max. 2MB)</Text>

            {renderInput("Company Name", "companyName", "Company name")}
            {renderSelect("Industry", "industry")}
            {renderSelect("Company Size", "companySize")}
            {renderInput("Website", "website", "https://company.com", {
              autoCapitalize: "none",
              keyboardType: "url",
            })}
            {renderInput("Location", "location", "City, State, Country")}

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>About Company</Text>
              <View style={styles.textAreaWrap}>
                <TextInput
                  style={styles.textArea}
                  value={profile.aboutCompany}
                  onChangeText={(value) => updateProfile("aboutCompany", value)}
                  placeholder="Write about your company"
                  placeholderTextColor="#A3A7B8"
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                  {profile.aboutCompany.length}/500
                </Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.9} onPress={saveProfile}>
              <LinearGradient
                colors={["#633BFF", "#F226A8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
  },
  keyboardView: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 30,
  },
  logoLabel: {
    color: "#4E5369",
    fontSize: 11.5,
    fontWeight: "900",
    marginBottom: 11,
  },
  logoBlock: {
    alignSelf: "center",
    position: "relative",
  },
  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoInitials: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  editBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "#F226A8",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadHint: {
    color: "#7A7F98",
    fontSize: 10.5,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 11,
    marginBottom: 18,
  },
  fieldBlock: {
    marginBottom: 13,
  },
  label: {
    color: "#20243A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    height: 41,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E4EE",
    backgroundColor: "#FFFFFF",
    color: "#30364F",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 12,
  },
  selectInput: {
    height: 41,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E4EE",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingRight: 10,
  },
  selectText: {
    flex: 1,
    color: "#30364F",
    fontSize: 12,
    fontWeight: "700",
  },
  chevron: {
    color: "#8C91A5",
    fontSize: 17,
    fontWeight: "900",
    marginLeft: 8,
    marginTop: -4,
  },
  textAreaWrap: {
    minHeight: 116,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E4EE",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 22,
  },
  textArea: {
    flex: 1,
    minHeight: 76,
    color: "#30364F",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    padding: 0,
  },
  characterCount: {
    position: "absolute",
    right: 10,
    bottom: 7,
    color: "#8D92A6",
    fontSize: 10,
    fontWeight: "800",
  },
  saveButton: {
    height: 50,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});

export default EmployerCompanyProfileScreen;
