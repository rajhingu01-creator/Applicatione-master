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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const stats = [
  { value: "2+", label: "Years Exp" },
  { value: "12+", label: "Projects" },
  { value: "8", label: "Skills" },
];

const bottomTabs = [
  { label: "Home", icon: "home-outline", route: "JobPortalHome" },
  { label: "Jobs", icon: "briefcase-outline", route: "JobPortalJobs" },
  {
    label: "Applications",
    icon: "document-text-outline",
    route: "JobPortalApplications",
  },
  { label: "Messages", icon: "chatbox-outline", route: "JobPortalMessages" },
  { label: "Profile", icon: "person", route: "JobPortalProfile" },
];

const JobPortalProfileScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 28, 410);
  const compact = height < 720 || width < 370;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 2 : 7),
          },
        ]}
      >
        <View
          style={[styles.profileCard, compact && styles.profileCardCompact]}
        >
          <TouchableOpacity
            activeOpacity={0.76}
            style={styles.settingsButton}
            onPress={() => navigation.navigate("JobPortalSettings")}
          >
            <Ionicons name="settings-outline" size={22} color="#5B35ED" />
          </TouchableOpacity>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={42} color="#172033" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.nameText}>Meet Vasoya</Text>
              <Text style={styles.roleText}>React Native Developer</Text>
              <Text style={styles.locationText}>Ahmedabad, Gujarat</Text>
              <TouchableOpacity activeOpacity={0.78} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.strengthHeader}>
            <Text style={styles.sectionTitle}>Profile Strength</Text>
            <Text style={styles.percentText}>80%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.aboutBlock}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.aboutText}>
              Passionate React Native Developer with experience in building
              cross-platform mobile applications.
            </Text>
          </View>
        </View>

        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.label === "Profile";

            return (
              <TouchableOpacity
                key={tab.label}
                activeOpacity={0.76}
                style={styles.navItem}
                onPress={() => navigation.navigate(tab.route)}
              >
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={active ? "#5B35ED" : "#9A9BA9"}
                />
                <Text style={[styles.navText, active && styles.navTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFE", alignItems: "center" },
  content: { flex: 1, justifyContent: "space-between" },
  profileCard: {
    flex: 1,
    position: "relative",
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 17,
    paddingTop: 18,
    paddingBottom: 18,
    shadowColor: "#B7B8C8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 4,
  },
  profileCardCompact: { paddingTop: 14 },
  settingsButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0ECFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  profileHeader: { flexDirection: "row", alignItems: "flex-start" },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#DDE4EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  profileInfo: { flex: 1, paddingTop: 2 },
  nameText: {
    color: "#1A1B2D",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  roleText: {
    color: "#4F5061",
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  locationText: {
    color: "#4F5061",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
    marginTop: 1,
  },
  editButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderRadius: 6,
    backgroundColor: "#F0ECFF",
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  editButtonText: { color: "#5B35ED", fontSize: 12.5, fontWeight: "900" },
  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 31,
  },
  sectionTitle: {
    color: "#2B2C3E",
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: "900",
  },
  percentText: { color: "#2B2C3E", fontSize: 13, fontWeight: "900" },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EEEAFD",
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    width: "80%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#5B35ED",
  },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  statCard: {
    flex: 1,
    height: 70,
    borderRadius: 9,
    backgroundColor: "#F7F4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: "#5B35ED",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  statLabel: {
    color: "#6C6D7D",
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "800",
    marginTop: 3,
  },
  aboutBlock: { marginTop: 27, gap: 10 },
  aboutText: {
    color: "#303244",
    fontSize: 13.5,
    lineHeight: 22,
    fontWeight: "800",
  },
  bottomNav: {
    height: 67,
    borderTopWidth: 1,
    borderTopColor: "#EFEFF5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    backgroundColor: "#FFFFFF",
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  navText: { color: "#8F90A0", fontSize: 10.5, fontWeight: "800" },
  navTextActive: { color: "#5B35ED", fontWeight: "900" },
});

export default JobPortalProfileScreen;
