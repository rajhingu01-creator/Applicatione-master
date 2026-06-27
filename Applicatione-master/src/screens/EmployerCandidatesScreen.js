import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Briefcase, UserCheck, Users } from "lucide-react-native";
import EmployerBottomNav from "../components/EmployerBottomNav";
import { getPostedJobs } from "../utils/postedJobs";

const formatAppliedDate = (dateValue) => {
  if (!dateValue) {
    return "Applied recently";
  }

  const appliedDate = new Date(dateValue);

  if (Number.isNaN(appliedDate.getTime())) {
    return "Applied recently";
  }

  return `Applied ${appliedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })}`;
};

const getCandidateApplications = (jobs) =>
  jobs.flatMap((job) =>
    (job.appliedCandidates || []).map((candidate) => ({
      ...candidate,
      jobId: job.id,
      jobTitle: job.title,
      jobLocation: job.location,
      jobStatus: job.status,
    })),
  );

const demoCandidates = [
  {
    id: "demo-meet-vaniya",
    jobId: "demo-job",
    name: "Meet Vaniya",
    jobTitle: "React Native Developer",
    experience: "3 Years",
    location: "Ahmedabad, Gujarat",
    match: "95% Match",
    status: "New",
    initials: "MV",
    colors: ["#E1B28E", "#A8653E"],
    skills: ["React Native", "Redux", "API Integration"],
    avatar: "https://i.pravatar.cc/150?u=meet-vaniya",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "demo-priya-desai",
    jobId: "demo-job",
    name: "Priya Desai",
    jobTitle: "Frontend Developer",
    experience: "5 Years",
    location: "Gandhinagar, Gujarat",
    match: "90% Match",
    status: "Reviewed",
    initials: "PD",
    colors: ["#C6B8FF", "#6347FF"],
    skills: ["React Native", "Expo", "Firebase"],
    avatar: "https://i.pravatar.cc/150?u=priya-desai",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "demo-rahul-patel",
    jobId: "demo-job",
    name: "Rahul Patel",
    jobTitle: "Mobile App Developer",
    experience: "4 Years",
    location: "Surat, Gujarat",
    match: "92% Match",
    status: "Shortlisted",
    initials: "RP",
    colors: ["#D5BFA8", "#7C6650"],
    skills: ["JavaScript", "REST API", "Git"],
    avatar: "https://i.pravatar.cc/150?u=rahul-patel",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "demo-neha-joshi",
    jobId: "demo-job",
    name: "Neha Joshi",
    jobTitle: "UI Developer",
    experience: "2.5 Years",
    location: "Rajkot, Gujarat",
    match: "86% Match",
    status: "Interview",
    initials: "NJ",
    colors: ["#FFC2D8", "#F13391"],
    skills: ["JavaScript", "Redux", "UI/UX"],
    avatar: "https://i.pravatar.cc/150?u=neha-joshi",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "demo-karan-mehta",
    jobId: "demo-job",
    name: "Karan Mehta",
    jobTitle: "Senior React Native Developer",
    experience: "6 Years",
    location: "Mumbai, Maharashtra",
    match: "84% Match",
    status: "New",
    initials: "KM",
    colors: ["#9FE7DF", "#20B9B0"],
    skills: ["TypeScript", "REST API", "Team Lead"],
    avatar: "https://i.pravatar.cc/150?u=karan-mehta",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
];

const EmployerCandidatesScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const bottomInset = Platform.OS === "android" ? 6 : 8;
  const cardWidth = Math.min(width - 22, 390);
  const cardMinHeight = Math.max(560, height - topInset - bottomInset - 18);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const candidates = useMemo(
    () => getCandidateApplications(postedJobs),
    [postedJobs],
  );
  const visibleCandidates = candidates.length ? candidates : demoCandidates;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadCandidates = async () => {
        try {
          setLoading(true);
          const jobs = await getPostedJobs();

          if (isActive) {
            setPostedJobs(jobs);
          }
        } catch {
          if (isActive) {
            Alert.alert("Unable to Load Candidates", "Please try again.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      loadCandidates();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const openCandidate = (candidate) => {
    navigation.navigate("EmployerCandidateProfile", { candidate });
  };

  const renderCandidateCard = (candidate) => (
    <View
      key={`${candidate.jobId}-${candidate.id}`}
      style={styles.candidateCard}
    >
      <View style={styles.candidateTopRow}>
        <LinearGradient
          colors={candidate.colors || ["#6B4DFF", "#3F22E8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{candidate.initials || "CA"}</Text>
        </LinearGradient>

        <View style={styles.candidateTitleBlock}>
          <Text numberOfLines={1} style={styles.candidateName}>
            {candidate.name || "Candidate"}
          </Text>
          <Text numberOfLines={1} style={styles.candidateMeta}>
            {candidate.experience || "Experience not added"} •{" "}
            {candidate.location || "Location not added"}
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <Text numberOfLines={1} style={styles.statusText}>
            {candidate.status || "New"}
          </Text>
        </View>
      </View>

      <View style={styles.appliedJobBox}>
        <Briefcase size={14} color="#5A46F6" strokeWidth={2.6} />
        <Text numberOfLines={1} style={styles.appliedJobText}>
          Applied for {candidate.jobTitle || "your job"}
        </Text>
      </View>

      <View style={styles.skillsWrap}>
        {(candidate.skills || []).slice(0, 3).map((skill) => (
          <View key={`${candidate.id}-${skill}`} style={styles.skillChip}>
            <Text numberOfLines={1} style={styles.skillText}>
              {skill}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.candidateFooterRow}>
        <Text numberOfLines={1} style={styles.appliedDateText}>
          {formatAppliedDate(candidate.appliedAt)}
        </Text>
        <View style={styles.matchBadge}>
          <Text numberOfLines={1} style={styles.matchText}>
            {candidate.match || "Good Match"}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.viewButton}
          onPress={() => openCandidate(candidate)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCandidatesContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#5A46F6" />
          <Text style={styles.loadingText}>Loading candidates...</Text>
        </View>
      );
    }

    return (
      <View style={styles.candidatesList}>
        {visibleCandidates.map(renderCandidateCard)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 8, paddingBottom: bottomInset + 132 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.card, { width: cardWidth, minHeight: cardMinHeight }]}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTitleBlock}>
              <Text numberOfLines={1} style={styles.headerTitle}>
                Candidates
              </Text>
              <Text numberOfLines={1} style={styles.headerSubtitle}>
                {visibleCandidates.length} candidate
                {visibleCandidates.length === 1 ? "" : "s"} from{" "}
                {postedJobs.length} job{postedJobs.length === 1 ? "" : "s"}
              </Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, styles.summaryPurple]}>
              <View style={styles.summaryIconWrap}>
                <Users size={23} color="#5A46F6" strokeWidth={2.5} />
              </View>
              <View style={styles.summaryTextBlock}>
                <Text style={styles.summaryValue}>
                  {visibleCandidates.length}
                </Text>
                <Text numberOfLines={1} style={styles.summaryLabel}>
                  Applications
                </Text>
              </View>
            </View>

            <View style={[styles.summaryCard, styles.summaryGreen]}>
              <View style={styles.summaryIconWrap}>
                <UserCheck size={23} color="#2BAE67" strokeWidth={2.5} />
              </View>
              <View style={styles.summaryTextBlock}>
                <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
                  {postedJobs.length}
                </Text>
                <Text numberOfLines={1} style={styles.summaryLabel}>
                  Posted Jobs
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.candidatesContent}>
            {renderCandidatesContent()}
          </View>
        </View>
      </ScrollView>

      <EmployerBottomNav
        navigation={navigation}
        activeRoute="Talent"
        bottomOffset={bottomInset}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FF",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 11,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E7F3",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    shadowColor: "#6C7288",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: "#111728",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.25,
  },
  headerSubtitle: {
    color: "#858B9D",
    fontSize: 12.5,
    fontWeight: "700",
    marginTop: 6,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    minHeight: 76,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  summaryPurple: {
    backgroundColor: "#F3F0FF",
  },
  summaryGreen: {
    backgroundColor: "#EEF9F3",
  },
  summaryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  summaryTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  summaryValue: {
    color: "#5A46F6",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 23,
  },
  summaryValueGreen: {
    color: "#2BAE67",
  },
  summaryLabel: {
    color: "#151B2C",
    fontSize: 10.5,
    fontWeight: "900",
    marginTop: 4,
  },
  candidatesContent: {
    flex: 1,
  },
  candidatesList: {
    gap: 12,
  },
  candidateCard: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#EAEDF5",
    backgroundColor: "#FFFFFF",
    padding: 13,
    shadowColor: "#4F5671",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  candidateTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 11,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  candidateTitleBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  candidateName: {
    color: "#151B2C",
    fontSize: 14.5,
    fontWeight: "900",
    marginBottom: 7,
  },
  candidateMeta: {
    color: "#767D92",
    fontSize: 11.5,
    fontWeight: "800",
  },
  statusBadge: {
    minWidth: 58,
    height: 25,
    borderRadius: 8,
    backgroundColor: "#EEF9F3",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  statusText: {
    color: "#2BAE67",
    fontSize: 10.8,
    fontWeight: "900",
  },
  appliedJobBox: {
    minHeight: 36,
    borderRadius: 10,
    backgroundColor: "#F6F4FF",
    borderWidth: 1,
    borderColor: "#ECE7FF",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  appliedJobText: {
    flex: 1,
    color: "#3C335F",
    fontSize: 12,
    fontWeight: "900",
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 12,
  },
  skillChip: {
    minHeight: 25,
    borderRadius: 8,
    backgroundColor: "#F8F5FF",
    borderWidth: 1,
    borderColor: "#E5DAFF",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  skillText: {
    color: "#674AFF",
    fontSize: 10.6,
    fontWeight: "900",
  },
  candidateFooterRow: {
    borderTopWidth: 1,
    borderTopColor: "#EEF0F6",
    paddingTop: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  appliedDateText: {
    flex: 1,
    color: "#858CA0",
    fontSize: 11.3,
    fontWeight: "800",
  },
  matchBadge: {
    minWidth: 78,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#DCF7E8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  matchText: {
    color: "#2BAE67",
    fontSize: 11,
    fontWeight: "900",
  },
  viewButton: {
    minWidth: 54,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#5A46F6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  loadingBox: {
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#858B9D",
    fontSize: 13,
    fontWeight: "800",
  },
  emptyBox: {
    minHeight: 300,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#DDE2F0",
    backgroundColor: "#FCFCFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#111728",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    color: "#7A8195",
    fontSize: 12.5,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 18,
  },
  emptyButton: {
    height: 38,
    minWidth: 112,
    borderRadius: 9,
    backgroundColor: "#5A46F6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "900",
  },
});

export default EmployerCandidatesScreen;
