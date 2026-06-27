import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const recommendedJobs = [
  {
    id: "react-native-developer",
    logo: "in",
    logoColor: "#FF4D4D",
    title: "React Native Developer",
    company: "TechNova Solutions",
    location: "Ahmedabad, Gujarat",
    meta: "₹ 4 - 6 LPA  •  2-4 Yrs Exp",
    time: "1hr ago",
    match: "95% Match",
  },
  {
    id: "mobile-app-developer",
    logo: "Ni",
    logoColor: "#145D8C",
    title: "Mobile App Developer",
    company: "BrainyBeam Softwares",
    location: "Surat, Gujarat",
    meta: "₹ 3 - 5 LPA  •  1-3 Yrs Exp",
    time: "3 days ago",
    match: "90% Match",
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

const JobPortalHomeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 34, 410);
  const compact = height < 720 || width < 370;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 4 : 10),
          },
        ]}
      >
        <View style={styles.mainContent}>
          <View style={styles.headerRow}>
            <View>
              <Text
                style={[styles.greeting, compact && styles.greetingCompact]}
              >
                Hello, Meet! 👋
              </Text>
              <Text style={styles.headerSubtitle}>Good to see you again</Text>
            </View>
            <TouchableOpacity activeOpacity={0.75} style={styles.bellButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#5B35ED"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color="#9A9BA9" />
            <TextInput
              editable={false}
              pointerEvents="none"
              style={styles.searchInput}
              placeholder="Search jobs, companies..."
              placeholderTextColor="#9A9BA9"
            />
          </View>

          <LinearGradient
            colors={["#673BF2", "#4B2BE7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.profileCopy}>
              <Text style={styles.profileTitle}>Complete your profile</Text>
              <Text style={styles.profileSubtitle}>
                Increase your chances of getting hired
              </Text>
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.updateButton}
              >
                <Text style={styles.updateButtonText}>Update Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressRing}>
              <Text style={styles.progressText}>80%</Text>
            </View>
          </LinearGradient>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recommended Jobs</Text>
              <Text style={styles.sectionSubtitle}>For you</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => navigation.navigate("JobPortalJobs")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jobsList}>
            {recommendedJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                activeOpacity={0.84}
                style={[styles.jobCard, compact && styles.jobCardCompact]}
                onPress={() =>
                  navigation.navigate("JobPortalJobDetails", { job })
                }
              >
                <View style={styles.jobTopRow}>
                  <View
                    style={[styles.logoBox, { backgroundColor: job.logoColor }]}
                  >
                    <Text style={styles.logoText}>{job.logo}</Text>
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.companyName}>{job.company}</Text>
                    <Text style={styles.locationText}>{job.location}</Text>
                  </View>
                  <Text style={styles.timeText}>{job.time}</Text>
                </View>

                <View style={styles.jobBottomRow}>
                  <View style={styles.metaSpacer} />
                  <Text style={styles.metaText}>{job.meta}</Text>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{job.match}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomNav}>
          {bottomTabs.map((tab, index) => {
            const active = index === 0;

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
  mainContent: {
    flex: 1,
    paddingHorizontal: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#1A1B2D",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  greetingCompact: {
    fontSize: 20,
    lineHeight: 26,
  },
  headerSubtitle: {
    color: "#4F5061",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 1,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    height: 48,
    borderRadius: 9,
    backgroundColor: "#F7F7FB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginTop: 21,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    color: "#2B2C3E",
    fontSize: 14,
    fontWeight: "700",
  },
  profileCard: {
    minHeight: 100,
    borderRadius: 10,
    marginTop: 19,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#5634EC",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.19,
    shadowRadius: 14,
    elevation: 5,
  },
  profileCopy: {
    flex: 1,
    paddingRight: 14,
  },
  profileTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  profileSubtitle: {
    color: "#E8E3FF",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  updateButton: {
    width: 103,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "900",
  },
  progressRing: {
    width: 57,
    height: 57,
    borderRadius: 29,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 27,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#1A1B2D",
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    color: "#4F5061",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 1,
  },
  viewAllText: {
    color: "#5B35ED",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },
  jobsList: {
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
  jobCardCompact: {
    minHeight: 107,
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
  logoText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  jobInfo: {
    flex: 1,
    paddingRight: 8,
  },
  jobTitle: {
    color: "#232435",
    fontSize: 15,
    lineHeight: 19,
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
  timeText: {
    color: "#6F4EF1",
    fontSize: 11.5,
    fontWeight: "900",
    marginTop: 2,
  },
  jobBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  metaSpacer: {
    width: 49,
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

export default JobPortalHomeScreen;
