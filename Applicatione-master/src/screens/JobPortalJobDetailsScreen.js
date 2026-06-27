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
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const tabs = ["Overview", "About", "Requirements", "Benefits"];
const skills = [
  "React Native",
  "JavaScript",
  "TypeScript",
  "Redux",
  "REST API",
  "Git",
  "MongoDB",
];

const parseMeta = (meta) => {
  if (!meta) {
    return { salary: "₹ 4 - 6 LPA", experience: "2-4 Years Exp" };
  }

  const [salary, experience] = meta.split("•").map((item) => item.trim());

  return {
    salary: salary || "₹ 4 - 6 LPA",
    experience: (experience || "2-4 Yrs Exp").replace("Yrs", "Years"),
  };
};

const JobPortalJobDetailsScreen = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 30, 410);
  const compact = height < 720 || width < 370;
  const job = route?.params?.job ?? {};
  const { salary, experience } = parseMeta(job.meta);
  const title = job.title ?? "React Native Developer";
  const company =
    job.id === "react-native-developer"
      ? "TechNova Solutions Pvt. Ltd."
      : (job.company ?? "TechNova Solutions Pvt. Ltd.");
  const location = job.location ?? "Ahmedabad, Gujarat";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 3 : 9),
            paddingBottom: compact ? 16 : 24,
          },
        ]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.72}
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#5A5B68" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.72} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={21} color="#6C6D7D" />
          </TouchableOpacity>
        </View>

        <View style={styles.screenBody}>
          <View>
            <View style={styles.titleRow}>
              <Text style={[styles.title, compact && styles.titleCompact]}>
                {title}
              </Text>
              <View style={styles.matchBadgeTop}>
                <Text style={styles.matchBadgeTopText}>90% Match</Text>
              </View>
            </View>
            <Text style={styles.companyText}>{company}</Text>

            <View style={styles.quickInfoGrid}>
              <View style={styles.quickInfoItem}>
                <Ionicons name="location-outline" size={17} color="#737584" />
                <Text style={styles.quickInfoText}>{location}</Text>
              </View>
              <View style={styles.quickInfoItemRight}>
                <Ionicons name="briefcase-outline" size={16} color="#737584" />
                <Text style={styles.quickInfoText}>Full Time</Text>
              </View>
              <View style={styles.quickInfoItem}>
                <Ionicons name="cash-outline" size={17} color="#737584" />
                <Text style={styles.quickInfoText}>{salary}</Text>
              </View>
              <View style={styles.quickInfoItemRight}>
                <Ionicons name="time-outline" size={16} color="#737584" />
                <Text style={styles.quickInfoText}>{experience}</Text>
              </View>
            </View>

            <View style={styles.tabsRow}>
              {tabs.map((tab, index) => {
                const active = index === 0;

                return (
                  <TouchableOpacity
                    key={tab}
                    activeOpacity={0.78}
                    style={styles.tabButton}
                  >
                    <Text
                      style={[styles.tabText, active && styles.tabTextActive]}
                    >
                      {tab}
                    </Text>
                    {active ? <View style={styles.tabUnderline} /> : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.descriptionBlock}>
              <Text style={styles.blockTitle}>Job Description</Text>
              <Text style={styles.descriptionText}>
                We are looking for a skilled React Native Developer to build
                modern and performant mobile applications for Android and iOS
                platforms.
              </Text>
              <TouchableOpacity
                activeOpacity={0.72}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>Read More ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.skillsBlock}>
              <Text style={styles.blockTitle}>Skills</Text>
              <View style={styles.skillsWrap}>
                {skills.map((skill) => (
                  <View key={skill} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity activeOpacity={0.82} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.applyTouchable}
              onPress={() => navigation.navigate("JobPortalApply", { job })}
            >
              <LinearGradient
                colors={["#673BF2", "#4B2BE7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  topBar: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  screenBody: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    flex: 1,
    color: "#1A1B2D",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  matchBadgeTop: {
    borderRadius: 7,
    backgroundColor: "#E5FAEC",
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  matchBadgeTopText: {
    color: "#138E43",
    fontSize: 12,
    fontWeight: "900",
  },
  companyText: {
    color: "#4F5061",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    marginTop: 10,
  },
  quickInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 23,
    marginTop: 21,
  },
  quickInfoItem: {
    width: "57%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickInfoItemRight: {
    width: "43%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickInfoText: {
    color: "#4F5061",
    fontSize: 13.5,
    fontWeight: "900",
  },
  tabsRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1.2,
    borderBottomColor: "#EFEFF5",
    marginTop: 24,
  },
  tabButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  tabText: {
    color: "#4F5061",
    fontSize: 12.5,
    fontWeight: "900",
  },
  tabTextActive: {
    color: "#5B35ED",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 3,
    borderRadius: 2,
    backgroundColor: "#5B35ED",
  },
  descriptionBlock: {
    marginTop: 24,
  },
  blockTitle: {
    color: "#303244",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  descriptionText: {
    color: "#3F4052",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    marginTop: 18,
    paddingRight: 24,
  },
  readMoreButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  readMoreText: {
    color: "#5B35ED",
    fontSize: 13,
    fontWeight: "900",
  },
  skillsBlock: {
    marginTop: 13,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
    marginTop: 15,
    paddingRight: 10,
  },
  skillChip: {
    height: 32,
    borderRadius: 6,
    backgroundColor: "#F5F1FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  skillText: {
    color: "#5B35ED",
    fontSize: 12.5,
    fontWeight: "900",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  saveButton: {
    width: 119,
    height: 55,
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#5B35ED",
    fontSize: 16,
    fontWeight: "900",
  },
  applyTouchable: {
    flex: 1,
  },
  applyButton: {
    height: 55,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5634EC",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});

export default JobPortalJobDetailsScreen;
