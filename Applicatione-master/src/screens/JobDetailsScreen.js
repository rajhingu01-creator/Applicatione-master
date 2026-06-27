import React, { useMemo, useState } from "react";
import {
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
import { StatusBar } from "expo-status-bar";

const fallbackRequirements = [
  "3+ years of experience in React Native",
  "Strong JavaScript / TypeScript skills",
  "Experience with REST APIs",
  "Good understanding of Redux and state management",
  "Experience in UI development and API integration",
  "Ability to build clean and reusable components",
];

const fallbackResponsibilities = [
  "Build and maintain Android and iOS applications",
  "Integrate REST APIs and third-party services",
  "Work with design and backend teams to deliver features",
  "Optimize app performance and fix production issues",
];

const fallbackJob = {
  title: "React Native Developer",
  location: "Ahmedabad, Gujarat",
  salary: "₹ 4 - 6 LPA",
  experience: "3+ Yrs Exp",
  type: "Full Time",
  status: "Active",
  applicants: 26,
  recommended: 95,
  description:
    "We are looking for a skilled React Native Developer to build modern and performant mobile applications for Android and iOS platforms.",
  requirements: fallbackRequirements,
};

const getJobMeta = (job) =>
  [job.salary, job.experience, job.type].filter(Boolean).join(" • ");

const JobDetailsScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const [showMore, setShowMore] = useState(false);
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const bottomInset = Platform.OS === "android" ? 12 : 16;
  const cardWidth = Math.min(width - 28, 390);
  const job = route?.params?.job ?? fallbackJob;
  const requirements = job.requirements?.length
    ? job.requirements
    : fallbackRequirements;
  const visibleRequirements = showMore
    ? requirements
    : requirements.slice(0, 3);
  const responsibilities = useMemo(
    () =>
      job.responsibilities?.length
        ? job.responsibilities
        : fallbackResponsibilities,
    [job.responsibilities],
  );
  const skills = useMemo(
    () =>
      job.skills?.length
        ? job.skills
        : [
            "React Native",
            "Redux",
            "REST APIs",
            "JavaScript",
            "UI Development",
          ],
    [job.skills],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 8, paddingBottom: bottomInset },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <Text numberOfLines={1} style={styles.jobTitle}>
                {job.title || fallbackJob.title}
              </Text>
              <Text numberOfLines={1} style={styles.locationText}>
                {job.location || fallbackJob.location}
              </Text>
              <Text numberOfLines={1} style={styles.metaText}>
                {getJobMeta(job) || getJobMeta(fallbackJob)}
              </Text>
            </View>

            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>{job.status || "Active"}</Text>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.descriptionText}>
              {job.description || fallbackJob.description}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlockCompact}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.requirementsList}>
              {visibleRequirements.map((requirement) => (
                <View key={requirement} style={styles.requirementRow}>
                  <Text style={styles.requirementArrow}>›</Text>
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>

            {showMore ? (
              <View style={styles.moreDetailsBlock}>
                <Text style={styles.moreSectionTitle}>Responsibilities</Text>
                <View style={styles.requirementsList}>
                  {responsibilities.map((item) => (
                    <View key={item} style={styles.requirementRow}>
                      <Text style={styles.requirementArrow}>›</Text>
                      <Text style={styles.requirementText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.moreSectionTitle}>Skills</Text>
                <View style={styles.skillsWrap}>
                  {skills.map((skill) => (
                    <View key={skill} style={styles.skillChip}>
                      <Text numberOfLines={1} style={styles.skillText}>
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.moreSectionTitle}>Job Details</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>
                      {job.location || fallbackJob.location}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Salary</Text>
                    <Text style={styles.detailValue}>
                      {job.salary || fallbackJob.salary}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Experience</Text>
                    <Text style={styles.detailValue}>
                      {job.experience || fallbackJob.experience}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Job Type</Text>
                    <Text style={styles.detailValue}>
                      {job.type || fallbackJob.type}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => setShowMore((current) => !current)}
            >
              <Text style={styles.viewMore}>
                {showMore ? "View Less" : "View More"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.goToDashboardButton}
          onPress={() => navigation.navigate("EmployerDashboard")}
        >
          <Text style={styles.goToDashboardText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FF",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EBEEF8",
    paddingHorizontal: 20,
    paddingTop: 19,
    paddingBottom: 18,
    shadowColor: "#6D728A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 7,
  },
  goToDashboardButton: {
    width: "100%",
    maxWidth: 390,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#5A46F6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#5A46F6",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  goToDashboardText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  jobTitle: {
    color: "#11162E",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 9,
  },
  locationText: {
    color: "#697085",
    fontSize: 12.5,
    fontWeight: "800",
    marginBottom: 9,
  },
  metaText: {
    color: "#151B36",
    fontSize: 12.2,
    fontWeight: "900",
  },
  activeBadge: {
    minWidth: 50,
    height: 25,
    borderRadius: 8,
    backgroundColor: "#DFF8EA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 9,
  },
  activeText: {
    color: "#22A35B",
    fontSize: 11.5,
    fontWeight: "900",
  },

  sectionBlock: {
    marginBottom: 22,
  },
  sectionBlockCompact: {
    marginTop: 2,
  },
  sectionTitle: {
    color: "#151B36",
    fontSize: 13.5,
    fontWeight: "900",
    marginBottom: 16,
  },
  descriptionText: {
    color: "#4E566D",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 23,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEDF5",
    marginBottom: 20,
  },
  requirementsList: {
    gap: 13,
    marginBottom: 14,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  requirementArrow: {
    color: "#151B36",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 18,
    marginRight: 12,
  },
  requirementText: {
    flex: 1,
    color: "#4E566D",
    fontSize: 12.7,
    fontWeight: "800",
    lineHeight: 19,
  },
  moreDetailsBlock: {
    marginTop: 4,
    marginBottom: 16,
  },
  moreSectionTitle: {
    color: "#151B36",
    fontSize: 12.8,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 10,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  skillChip: {
    minHeight: 28,
    borderRadius: 9,
    backgroundColor: "#F4F1FF",
    borderWidth: 1,
    borderColor: "#E3DCFF",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  skillText: {
    color: "#5B45FF",
    fontSize: 11,
    fontWeight: "900",
  },
  detailsGrid: {
    gap: 10,
  },
  detailItem: {
    borderRadius: 12,
    backgroundColor: "#F7F8FF",
    borderWidth: 1,
    borderColor: "#EAEDF8",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  detailLabel: {
    color: "#7A8195",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 5,
  },
  detailValue: {
    color: "#151B36",
    fontSize: 12.5,
    fontWeight: "900",
  },
  viewMore: {
    color: "#5B45FF",
    fontSize: 13,
    fontWeight: "900",
  },
});

export default JobDetailsScreen;
