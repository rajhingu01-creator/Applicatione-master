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

const menuItems = [
  {
    label: "Edit Profile",
    icon: "person-outline",
    route: "JobPortalEditProfile",
  },
  {
    label: "Change Password",
    icon: "lock-closed-outline",
    route: "JobPortalChangePassword",
  },
  {
    label: "Privacy Settings",
    icon: "shield-outline",
    route: "JobPortalPrivacySettings",
  },
  {
    label: "Notification Settings",
    icon: "notifications-outline",
    route: "JobPortalNotificationSettings",
  },
  {
    label: "Job Preferences",
    icon: "briefcase-outline",
    route: "JobPortalJobPreferences",
  },
  {
    label: "Blocked Companies",
    icon: "ban-outline",
    route: "JobPortalBlockedCompanies",
  },
  {
    label: "Help & Support",
    icon: "help-circle-outline",
    route: "JobPortalHelpSupport",
  },
  {
    label: "Subscription Plan",
    icon: "card-outline",
    route: "JobPortalSubscription",
  },
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

const JobPortalSettingsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 28, 410);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          { width: contentWidth, paddingTop: topContentPadding },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.76}
                style={styles.menuRow}
                onPress={() => item.route && navigation.navigate(item.route)}
              >
                <Ionicons name={item.icon} size={21} color="#8F90A0" />
                <Text style={styles.menuText}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#B7B8C6" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              activeOpacity={0.76}
              style={styles.logoutRow}
              onPress={() => navigation.navigate("JobPortalLogin")}
            >
              <Ionicons name="log-out-outline" size={21} color="#EF4B57" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    overflow: "hidden",
  },
  menuList: { paddingTop: 4 },
  menuRow: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF5",
    paddingHorizontal: 20,
    gap: 14,
  },
  menuText: { flex: 1, color: "#303244", fontSize: 14, fontWeight: "900" },
  logoutRow: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 14,
  },
  logoutText: { color: "#EF4B57", fontSize: 14, fontWeight: "900" },
  bottomNav: {
    height: 67,
    borderTopWidth: 1,
    borderTopColor: "#EFEFF5",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  navText: { color: "#8F90A0", fontSize: 10.5, fontWeight: "800" },
  navTextActive: { color: "#5B35ED", fontWeight: "900" },
});

export default JobPortalSettingsScreen;
