import React, { useCallback, useState } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  Briefcase,
  CheckCircle,
  UserCheck,
  Users,
} from "lucide-react-native";
import EmployerBottomNav from "../components/EmployerBottomNav";
import { getPostedJobs } from "../utils/postedJobs";

const getStats = (activeJobsCount, totalApplicationsCount) => [
  {
    value: String(activeJobsCount),
    label: "Active Jobs",
    Icon: Briefcase,
    iconColor: "#5A46F6",
    bgColor: "#F3F0FF",
  },
  {
    value: String(totalApplicationsCount),
    label: "Total Applications",
    Icon: Users,
    iconColor: "#F2643C",
    bgColor: "#FFF2ED",
  },
  {
    value: "32",
    label: "Shortlisted",
    Icon: CheckCircle,
    iconColor: "#20B9B0",
    bgColor: "#EFFBFA",
  },
  {
    value: "18",
    label: "Hired",
    Icon: UserCheck,
    iconColor: "#2BAE67",
    bgColor: "#EEF9F3",
  },
];

const candidates = [
  {
    name: "Meet Vaniya",
    role: "React Native Developer",
    match: "95% Match",
    initials: "MV",
    colors: ["#E1B28E", "#A8653E"],
  },
  {
    name: "Rahul Patel",
    role: "React Native Developer",
    match: "92% Match",
    initials: "RP",
    colors: ["#D5BFA8", "#7C6650"],
  },
  {
    name: "Amit Shah",
    role: "React Native Developer",
    match: "88% Match",
    initials: "AS",
    colors: ["#BDAF9E", "#4B4642"],
  },
];

const EmployerDashboardScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const bottomInset = Platform.OS === "android" ? 6 : 8;
  const cardWidth = Math.min(width - 22, 390);
  const cardMinHeight = Math.max(640, height - topInset - bottomInset - 112);

  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadActiveJobsCount = async () => {
        try {
          const jobs = await getPostedJobs();

          if (isActive) {
            setActiveJobsCount(jobs.length);
            setTotalApplicationsCount(
              jobs.reduce(
                (total, job) => total + (job.appliedCandidates?.length ?? 0),
                0,
              ),
            );
          }
        } catch {
          if (isActive) {
            setActiveJobsCount(0);
            setTotalApplicationsCount(0);
          }
        }
      };

      loadActiveJobsCount();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 8, paddingBottom: bottomInset + 114 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.card, { width: cardWidth, minHeight: cardMinHeight }]}
        >
          <View style={styles.topRow}>
            <View style={styles.greetingBlock}>
              <Text numberOfLines={1} style={styles.greeting}>
                👋 Hello, Meet Infotech
              </Text>
              <Text numberOfLines={1} style={styles.greetingSub}>
                Here's what's happening today
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.75} style={styles.bellButton}>
              <Bell size={23} color="#53596B" strokeWidth={2.35} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            {getStats(activeJobsCount, totalApplicationsCount).map(
              ({ value, label, Icon, iconColor, bgColor }) => (
                <View
                  key={label}
                  style={[styles.statCard, { backgroundColor: bgColor }]}
                >
                  <View style={styles.statIconWrap}>
                    <Icon size={24} color={iconColor} strokeWidth={2.45} />
                  </View>
                  <View style={styles.statTextBlock}>
                    <Text style={[styles.statValue, { color: iconColor }]}>
                      {value}
                    </Text>
                    <Text numberOfLines={1} style={styles.statLabel}>
                      {label}
                    </Text>
                  </View>
                </View>
              ),
            )}
          </View>

          <View style={styles.recommendHeader}>
            <View style={styles.recommendTitleBlock}>
              <Text numberOfLines={1} style={styles.sectionTitle}>
                Recommended For You
              </Text>
              <Text numberOfLines={1} style={styles.sectionSub}>
                Top matching candidates by AI
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.75}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.candidateList}>
            {candidates.map((candidate, index) => (
              <View key={candidate.name} style={styles.candidateItem}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  style={styles.candidateRow}
                >
                  <LinearGradient
                    colors={candidate.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>{candidate.initials}</Text>
                  </LinearGradient>

                  <View style={styles.candidateTextBlock}>
                    <Text numberOfLines={1} style={styles.candidateName}>
                      {candidate.name}
                    </Text>
                    <Text numberOfLines={1} style={styles.candidateRole}>
                      {candidate.role}
                    </Text>
                  </View>

                  <View style={styles.matchBadge}>
                    <Text numberOfLines={1} style={styles.matchText}>
                      {candidate.match}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < candidates.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <EmployerBottomNav
        navigation={navigation}
        activeRoute="Home"
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
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  greetingBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  greeting: {
    color: "#111728",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  greetingSub: {
    color: "#858B9D",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 7,
  },
  bellButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginBottom: 12,
  },
  statCard: {
    width: "48%",
    minHeight: 76,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 23,
  },
  statLabel: {
    color: "#151B2C",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },

  recommendHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  recommendTitleBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  sectionTitle: {
    color: "#111728",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.1,
  },
  sectionSub: {
    color: "#858B9D",
    fontSize: 12.5,
    fontWeight: "700",
    marginTop: 6,
  },
  viewAll: {
    color: "#5A46F6",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 1,
  },
  candidateList: {
    flex: 1,
    minHeight: 210,
    borderTopWidth: 1,
    borderTopColor: "#EEF0F6",
  },
  candidateItem: {
    flex: 1,
  },
  candidateRow: {
    flex: 1,
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  candidateTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  candidateName: {
    color: "#151B2C",
    fontSize: 13.5,
    fontWeight: "900",
  },
  candidateRole: {
    color: "#858B9D",
    fontSize: 11.5,
    fontWeight: "700",
    marginTop: 5,
  },
  matchBadge: {
    minWidth: 78,
    backgroundColor: "#DCF7E8",
    borderRadius: 9,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  matchText: {
    color: "#2BAE67",
    fontSize: 11.5,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEF0F6",
    marginLeft: 56,
  },
});

export default EmployerDashboardScreen;
