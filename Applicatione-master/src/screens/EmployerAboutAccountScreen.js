import React, { useEffect, useMemo, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Globe,
  Mail,
  Shield,
  Trash2,
  Users,
} from "lucide-react-native";

const COMPANY_PROFILE_KEY = "@employer_company_profile";

const defaultProfile = {
  companyName: "Meet Infotech",
  industry: "IT Services & Consulting",
  companySize: "51–200 Employees",
  email: "meet@meetinfotech.com",
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

const EmployerAboutAccountScreen = ({ navigation }) => {
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
          setProfile({
            ...defaultProfile,
            ...JSON.parse(savedProfile),
          });
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

  const accountRows = [
    {
      label: "Account Type",
      value: "Company",
      Icon: Briefcase,
    },
    {
      label: "Account Owner",
      value: "Meet Vasoya",
      Icon: Users,
    },
    {
      label: "Company Name",
      value: profile.companyName,
      Icon: Briefcase,
    },
    {
      label: "Industry",
      value: profile.industry,
      Icon: Briefcase,
    },
    {
      label: "Company Size",
      value: profile.companySize,
      Icon: Users,
    },
    {
      label: "Member Since",
      value: "12 Mar 2024",
      Icon: Clock,
    },
    {
      label: "Account Status",
      value: "Active",
      Icon: Shield,
      badge: true,
    },
  ];

  const appRows = [
    {
      label: "App Version",
      value: "1.2.0 (120)",
      Icon: Shield,
    },
    {
      label: "Support Email",
      value: "support@connectly.com",
      Icon: Mail,
    },
    {
      label: "Website",
      value: "www.connectly.com",
      Icon: Globe,
    },
  ];

  const deactivateAccount = () => {
    Alert.alert(
      "Deactivate Account",
      "This will temporarily disable your account and hide your profile.",
    );
  };

  const renderInfoRow = ({ label, value, Icon, badge }, index, rows) => (
    <View
      key={label}
      style={[styles.infoRow, index === rows.length - 1 && styles.infoRowLast]}
    >
      <View style={styles.infoLeft}>
        <View style={styles.infoIconWrap}>
          <Icon size={15} color="#744CFF" strokeWidth={2.25} />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      {badge ? (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>{value}</Text>
        </View>
      ) : (
        <Text numberOfLines={1} style={styles.infoValue}>
          {value}
        </Text>
      )}
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
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>About This Account</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.profileCard}>
            <LinearGradient
              colors={["#5B35F5", "#F226A8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBox}
            >
              <Text style={styles.logoText}>{initials}</Text>
            </LinearGradient>
            <View style={styles.profileCopy}>
              <View style={styles.nameRow}>
                <Text numberOfLines={1} style={styles.companyName}>
                  {profile.companyName}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text numberOfLines={1} style={styles.emailText}>
                {profile.email || "meet@meetinfotech.com"}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            {accountRows.map((row, index) =>
              renderInfoRow(row, index, accountRows),
            )}
          </View>

          <View style={styles.infoCard}>
            {appRows.map((row, index) => renderInfoRow(row, index, appRows))}
          </View>

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.deactivateCard}
            onPress={deactivateAccount}
          >
            <View style={styles.deactivateTitleRow}>
              <Trash2 size={18} color="#FF3B45" strokeWidth={2.4} />
              <Text style={styles.deactivateTitle}>Deactivate Account</Text>
            </View>
            <Text style={styles.deactivateText}>
              Temporarily disable your account and hide your profile.
            </Text>
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
  profileCard: {
    minHeight: 86,
    borderRadius: 14,
    backgroundColor: "#F6F1FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  logoBox: {
    width: 55,
    height: 55,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  companyName: {
    flexShrink: 1,
    color: "#20243A",
    fontSize: 16,
    fontWeight: "900",
    marginRight: 9,
  },
  verifiedBadge: {
    minHeight: 22,
    borderRadius: 11,
    backgroundColor: "#DDFBE8",
    paddingHorizontal: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: {
    color: "#19A855",
    fontSize: 10,
    fontWeight: "900",
  },
  emailText: {
    color: "#727894",
    fontSize: 12.5,
    fontWeight: "800",
  },
  infoCard: {
    borderWidth: 1,
    borderColor: "#E8E9F1",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#9197AD",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  infoRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F6",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  infoIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F6F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoLabel: {
    color: "#69708C",
    fontSize: 12.5,
    fontWeight: "900",
  },
  infoValue: {
    maxWidth: "48%",
    color: "#69708C",
    fontSize: 12.5,
    fontWeight: "900",
    textAlign: "right",
  },
  activeBadge: {
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: "#DDFBE8",
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBadgeText: {
    color: "#19A855",
    fontSize: 12,
    fontWeight: "900",
  },
  deactivateCard: {
    minHeight: 78,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#FFDDE0",
    backgroundColor: "#FFF3F5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  deactivateTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deactivateTitle: {
    color: "#FF3B45",
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 9,
  },
  deactivateText: {
    color: "#69708C",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    textAlign: "center",
  },
});

export default EmployerAboutAccountScreen;
