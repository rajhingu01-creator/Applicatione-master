import React, { useState } from "react";
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

const tabs = [
  { label: "Applied (4)", filter: "all" },
  { label: "Shortlisted (1)", filter: "Shortlisted" },
  { label: "Rejected (1)", filter: "Rejected" },
];

const applications = [
  {
    id: "react-native-developer",
    title: "React Native Developer",
    company: "TechNova Solutions",
    appliedOn: "20 May 2024",
    status: "Under Review",
    statusColor: "#6D4DF2",
    statusBg: "#EEEAFE",
    logoType: "photo",
  },
  {
    id: "node-js-developer",
    title: "Node.js Developer",
    company: "Sofial Pvt. Ltd.",
    appliedOn: "19 May 2024",
    status: "Shortlisted",
    statusColor: "#21A052",
    statusBg: "#E9F8EF",
    logoText: "N",
    logoColor: "#31A84E",
  },
  {
    id: "flutter-developer",
    title: "Flutter Developer",
    company: "CodeCraft Technologies",
    appliedOn: "16 May 2024",
    status: "Interview Scheduled",
    statusColor: "#5B35ED",
    statusBg: "#EEEAFE",
    logoText: "f",
    logoColor: "#4D92F8",
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    company: "Pixel Perfect Studio",
    appliedOn: "14 May 2024",
    status: "Rejected",
    statusColor: "#E34251",
    statusBg: "#FDECEE",
    logoText: "UI",
    logoColor: "#EF3F4A",
  },
];

const bottomTabs = [
  { label: "Home", icon: "home-outline", route: "JobPortalHome" },
  { label: "Jobs", icon: "briefcase-outline", route: "JobPortalJobs" },
  {
    label: "Applications",
    icon: "document-text",
    route: "JobPortalApplications",
  },
  { label: "Messages", icon: "chatbox-outline", route: "JobPortalMessages" },
  { label: "Profile", icon: "person-outline", route: "JobPortalProfile" },
];

const JobPortalApplicationsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 28, 410);
  const compact = height < 720 || width < 370;
  const [activeFilter, setActiveFilter] = useState("all");
  const visibleApplications =
    activeFilter === "all"
      ? applications
      : applications.filter(
          (application) => application.status === activeFilter,
        );

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
        <View style={styles.card}>
          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const active = tab.filter === activeFilter;

              return (
                <TouchableOpacity
                  key={tab.label}
                  activeOpacity={0.78}
                  style={styles.tabItem}
                  onPress={() => setActiveFilter(tab.filter)}
                >
                  <Text
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {tab.label}
                  </Text>
                  {active ? <View style={styles.tabUnderline} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.listWrap}>
            {visibleApplications.map((application) => (
              <TouchableOpacity
                key={application.id}
                activeOpacity={0.84}
                style={styles.applicationRow}
                onPress={() =>
                  navigation.navigate("JobPortalApplicationDetails", {
                    application,
                  })
                }
              >
                {application.logoType === "photo" ? (
                  <View style={styles.photoLogo}>
                    <Ionicons name="person" size={20} color="#1D1E2F" />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.textLogo,
                      { backgroundColor: application.logoColor },
                    ]}
                  >
                    <Text style={styles.logoText}>{application.logoText}</Text>
                  </View>
                )}

                <View style={styles.applicationInfo}>
                  <Text style={styles.jobTitle}>{application.title}</Text>
                  <Text style={styles.companyText}>{application.company}</Text>
                  <Text style={styles.appliedText}>
                    Applied on {application.appliedOn}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: application.statusBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: application.statusColor },
                    ]}
                    numberOfLines={1}
                  >
                    {application.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.label === "Applications";

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
  container: {
    flex: 1,
    backgroundColor: "#FAFAFE",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingTop: 12,
    shadowColor: "#B7B8C8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 4,
  },
  tabsRow: {
    height: 40,
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF5",
  },
  tabItem: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    color: "#747687",
    fontSize: 12.5,
    fontWeight: "900",
  },
  tabTextActive: {
    color: "#5B35ED",
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    width: "100%",
    height: 3,
    borderRadius: 2,
    backgroundColor: "#5B35ED",
  },
  listWrap: {
    paddingTop: 14,
    gap: 14,
  },
  applicationRow: {
    minHeight: 76,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EFEFF5",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  photoLogo: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#F0D3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textLogo: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  applicationInfo: {
    flex: 1,
  },
  jobTitle: {
    color: "#1A1B2D",
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: "900",
  },
  companyText: {
    color: "#383A4B",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "700",
  },
  appliedText: {
    color: "#5D5F70",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    maxWidth: 104,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: "900",
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
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navText: {
    color: "#8F90A0",
    fontSize: 10.5,
    fontWeight: "800",
  },
  navTextActive: {
    color: "#5B35ED",
    fontWeight: "900",
  },
});

export default JobPortalApplicationsScreen;
