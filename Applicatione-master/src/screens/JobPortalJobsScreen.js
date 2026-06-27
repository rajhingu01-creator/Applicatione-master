import React from "react";
import {
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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const filterTabs = [
  "All (125)",
  "Full Time (96)",
  "Part Time (20)",
  "Internship",
];

const jobs = [
  {
    id: "react-native-developer",
    icon: "business",
    logoColor: "#6B3EF2",
    title: "React Native Developer",
    company: "TechNova Solutions",
    location: "Ahmedabad, Gujarat",
    meta: "₹ 4 - 6 LPA  •  2-4 Yrs Exp",
    time: "New",
    match: "95% Match",
  },
  {
    id: "node-js-developer",
    icon: "code-slash",
    logoColor: "#2ABDD2",
    title: "Node.js Developer",
    company: "Sofial Pvt. Ltd.",
    location: "Vadodara, Gujarat",
    meta: "₹ 4 - 7 LPA  •  2-4 Yrs Exp",
    time: "2 days ago",
    match: "90% Match",
  },
  {
    id: "flutter-developer",
    icon: "flash",
    logoColor: "#2EA8C2",
    title: "Flutter Developer",
    company: "CodeCraft Technologies",
    location: "Rajkot, Gujarat",
    meta: "₹ 3 - 5 LPA  •  1-3 Yrs Exp",
    time: "3 days ago",
    match: "90% Match",
  },
  {
    id: "ui-ux-designer",
    icon: "color-palette",
    logoColor: "#145D8C",
    title: "UI/UX Designer",
    company: "Pixel Perfect Studios",
    location: "Ahmedabad, Gujarat",
    meta: "₹ 3 - 5 LPA  •  1-3 Yrs Exp",
    time: "3 days ago",
    match: "88% Match",
  },
];

const bottomTabs = [
  { label: "Home", icon: "home", route: "JobPortalHome" },
  { label: "Jobs", icon: "briefcase-outline", route: "JobPortalJobs" },
  {
    label: "Applications",
    icon: "document-text-outline",
    route: "JobPortalApplications",
  },
  {
    label: "Messages",
    icon: "chatbox-ellipses-outline",
    route: "JobPortalMessages",
  },
  { label: "Profile", icon: "person-outline", route: "JobPortalProfile" },
];

const JobPortalJobsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 26, 410);
  const compact = height < 720 || width < 370;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 2 : 8),
          },
        ]}
      >
        <View style={styles.topSearchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color="#9A9BA9" />
            <TextInput
              editable={false}
              pointerEvents="none"
              style={styles.searchInput}
              placeholder="Search jobs..."
              placeholderTextColor="#9A9BA9"
            />
          </View>
          <TouchableOpacity activeOpacity={0.78} style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#4F5061" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabsClip}>
          <View style={styles.tabsRow}>
            {filterTabs.map((tab, index) => {
              const active = index === 0;

              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.78}
                  style={[styles.filterTab, active && styles.filterTabActive]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      active && styles.filterTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ScrollView
          style={styles.jobsScroll}
          contentContainerStyle={styles.jobsContent}
          showsVerticalScrollIndicator={false}
        >
          {jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              activeOpacity={0.84}
              style={styles.jobCard}
              onPress={() =>
                navigation.navigate("JobPortalJobDetails", { job })
              }
            >
              <View style={styles.jobTopRow}>
                <View
                  style={[styles.logoBox, { backgroundColor: job.logoColor }]}
                >
                  <Ionicons name={job.icon} size={17} color="#FFFFFF" />
                </View>
                <View style={styles.jobInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {job.title}
                    </Text>
                    <Text style={styles.timeText}>{job.time}</Text>
                  </View>
                  <Text style={styles.companyName}>{job.company}</Text>
                  <Text style={styles.locationText}>{job.location}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{job.meta}</Text>
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchText}>{job.match}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bottomNav}>
          {bottomTabs.map((tab, index) => {
            const active = index === 1;

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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  topSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 3,
  },
  searchBox: {
    flex: 1,
    height: 46,
    borderRadius: 9,
    backgroundColor: "#F7F7FB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 9,
    color: "#2B2C3E",
    fontSize: 14,
    fontWeight: "700",
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsClip: {
    overflow: "hidden",
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF5",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  filterTab: {
    height: 35,
    minWidth: 86,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  filterTabActive: {
    backgroundColor: "#F4F0FF",
    borderBottomColor: "#5B35ED",
  },
  filterText: {
    color: "#4F5061",
    fontSize: 12,
    fontWeight: "900",
  },
  filterTextActive: {
    color: "#5B35ED",
  },
  jobsScroll: {
    flex: 1,
  },
  jobsContent: {
    paddingTop: 17,
    paddingBottom: 13,
    gap: 14,
  },
  jobCard: {
    minHeight: 116,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    backgroundColor: "#FFFFFF",
    padding: 13,
  },
  jobTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  jobInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  jobTitle: {
    flex: 1,
    color: "#232435",
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900",
  },
  timeText: {
    color: "#6F4EF1",
    fontSize: 11.5,
    fontWeight: "900",
  },
  companyName: {
    color: "#4F5061",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  locationText: {
    color: "#6B6C7C",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  metaText: {
    flex: 1,
    color: "#303244",
    fontSize: 13,
    fontWeight: "900",
  },
  matchBadge: {
    borderRadius: 6,
    backgroundColor: "#E5FAEC",
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  matchText: {
    color: "#138E43",
    fontSize: 11.5,
    fontWeight: "900",
  },
  bottomNav: {
    height: 66,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navText: {
    color: "#8B8C9B",
    fontSize: 10.5,
    fontWeight: "800",
  },
  navTextActive: {
    color: "#5B35ED",
  },
});

export default JobPortalJobsScreen;
