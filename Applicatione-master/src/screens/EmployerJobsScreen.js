import React, { useCallback, useState } from "react";
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
import { Briefcase } from "lucide-react-native";
import EmployerBottomNav from "../components/EmployerBottomNav";
import { getPostedJobs } from "../utils/postedJobs";

const formatPostedDate = (dateValue) => {
  if (!dateValue) {
    return "Recently posted";
  }

  const postedDate = new Date(dateValue);

  if (Number.isNaN(postedDate.getTime())) {
    return "Recently posted";
  }

  return `Posted ${postedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

const getJobMeta = (job) =>
  [job.salary, job.experience, job.type].filter(Boolean).join(" • ");

const EmployerJobsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const bottomInset = Platform.OS === "android" ? 6 : 8;
  const cardWidth = Math.min(width - 22, 390);
  const cardMinHeight = Math.max(560, height - topInset - bottomInset - 18);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeJobsLabel = `${postedJobs.length} active job${
    postedJobs.length === 1 ? "" : "s"
  }`;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPostedJobs = async () => {
        try {
          setLoading(true);
          const jobs = await getPostedJobs();

          if (isActive) {
            setPostedJobs(jobs);
          }
        } catch {
          if (isActive) {
            Alert.alert("Unable to Load Jobs", "Please try again.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      loadPostedJobs();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const renderJobCard = (job) => (
    <TouchableOpacity
      key={job.id}
      activeOpacity={0.86}
      style={styles.jobCard}
      onPress={() => navigation.navigate("JobDetails", { job })}
    >
      <View style={styles.jobTopRow}>
        <LinearGradient
          colors={["#654DFF", "#3F22E8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.jobIconBox}
        >
          <Briefcase size={20} color="#FFFFFF" strokeWidth={2.6} />
        </LinearGradient>

        <View style={styles.jobTitleBlock}>
          <Text numberOfLines={1} style={styles.jobTitle}>
            {job.title || "Untitled Job"}
          </Text>
          <View style={styles.locationRow}>
            <Text numberOfLines={1} style={styles.locationText}>
              {job.location || "Location not added"}
            </Text>
          </View>
        </View>

        <View style={styles.statusBadge}>
          <Text numberOfLines={1} style={styles.statusText}>
            {job.status || "Active"}
          </Text>
        </View>
      </View>

      <Text numberOfLines={1} style={styles.jobMeta}>
        {getJobMeta(job)}
      </Text>

      <Text numberOfLines={2} style={styles.jobDescription}>
        {job.description || "No description added yet."}
      </Text>

      <View style={styles.jobFooterRow}>
        <View style={styles.postedDateRow}>
          <Text numberOfLines={1} style={styles.postedDateText}>
            {formatPostedDate(job.createdAt)}
          </Text>
        </View>

        <View style={styles.applicantsChip}>
          <Text numberOfLines={1} style={styles.applicantsText}>
            {job.applicants ?? 0} Applicants
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderJobsContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#5A46F6" />
          <Text style={styles.loadingText}>Loading posted jobs...</Text>
        </View>
      );
    }

    if (!postedJobs.length) {
      return (
        <View style={styles.emptyBox}>
          <LinearGradient
            colors={["#F4F0FF", "#FFFFFF"]}
            style={styles.emptyIconBox}
          >
            <Briefcase size={30} color="#5A46F6" strokeWidth={2.6} />
          </LinearGradient>
          <Text style={styles.emptyTitle}>No posted jobs yet</Text>
          <Text style={styles.emptyText}>
            Post your first job and it will appear here when you tap Jobs.
          </Text>
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.emptyButton}
            onPress={() => navigation.navigate("PostJob")}
          >
            <Text style={styles.emptyButtonText}>Post Job</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return <View style={styles.jobsList}>{postedJobs.map(renderJobCard)}</View>;
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
                My Posted Jobs
              </Text>
              <Text numberOfLines={1} style={styles.headerSubtitle}>
                {activeJobsLabel}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.headerPostButton}
              onPress={() => navigation.navigate("PostJob")}
            >
              <Text style={styles.headerPostText}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIconWrap}>
              <Briefcase size={24} color="#5A46F6" strokeWidth={2.5} />
            </View>
            <View style={styles.summaryTextBlock}>
              <Text style={styles.summaryValue}>{postedJobs.length}</Text>
              <Text numberOfLines={1} style={styles.summaryLabel}>
                Jobs you have posted
              </Text>
            </View>
          </View>

          <View style={styles.jobsContent}>{renderJobsContent()}</View>
        </View>
      </ScrollView>

      <EmployerBottomNav
        navigation={navigation}
        activeRoute="Jobs"
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
    paddingRight: 12,
  },
  headerTitle: {
    color: "#111728",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.25,
  },
  headerSubtitle: {
    color: "#858B9D",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  headerPostButton: {
    height: 34,
    minWidth: 76,
    borderRadius: 9,
    backgroundColor: "#5A46F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 11,
    shadowColor: "#5A46F6",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  headerPostText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  summaryCard: {
    minHeight: 76,
    borderRadius: 14,
    backgroundColor: "#F3F0FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  summaryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  summaryTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  summaryValue: {
    color: "#5A46F6",
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 24,
  },
  summaryLabel: {
    color: "#151B2C",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },
  jobsContent: {
    flex: 1,
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
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
  jobTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 11,
  },
  jobIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  jobTitleBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  jobTitle: {
    color: "#151B2C",
    fontSize: 14.5,
    fontWeight: "900",
    marginBottom: 7,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    flex: 1,
    color: "#767D92",
    fontSize: 11.7,
    fontWeight: "800",
  },
  statusBadge: {
    minWidth: 50,
    height: 25,
    borderRadius: 8,
    backgroundColor: "#DFF8EA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  statusText: {
    color: "#22A35B",
    fontSize: 11.2,
    fontWeight: "900",
  },
  jobMeta: {
    color: "#151B36",
    fontSize: 12.2,
    fontWeight: "900",
    marginBottom: 9,
  },
  jobDescription: {
    color: "#596176",
    fontSize: 12.2,
    fontWeight: "700",
    lineHeight: 19,
    marginBottom: 13,
  },
  jobFooterRow: {
    borderTopWidth: 1,
    borderTopColor: "#EEF0F6",
    paddingTop: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  postedDateRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  postedDateText: {
    flex: 1,
    color: "#858CA0",
    fontSize: 11.3,
    fontWeight: "800",
  },
  applicantsChip: {
    minWidth: 82,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#EEF9F3",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  applicantsText: {
    color: "#2BAE67",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "900",
  },
});

export default EmployerJobsScreen;
