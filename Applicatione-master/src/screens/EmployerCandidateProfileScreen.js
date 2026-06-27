import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
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
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { upsertConversation } from "../utils/chatStorage";

const tabs = ["Profile", "Resume", "Experience", "Skills", "Projects"];

const fallbackCandidate = {
  name: "Meet Vaniya",
  role: "React Native Developer",
  jobTitle: "React Native Developer",
  experience: "3+ Years",
  location: "Ahmedabad, Gujarat, India",
  match: "90% Match",
  initials: "MV",
  colors: ["#E1B28E", "#A8653E"],
  skills: ["React Native", "Redux", "API Integration"],
  about:
    "Passionate React Native Developer with 3+ years of experience in building cross-platform mobile applications.",
  currentSalary: "₹ 4 LPA",
  expectedSalary: "₹ 6 LPA",
};

const getCandidateRole = (candidate) =>
  candidate.role || candidate.jobTitle || fallbackCandidate.role;

const getCandidateDetails = (candidate = {}) => ({
  ...fallbackCandidate,
  ...candidate,
  role: getCandidateRole(candidate),
  about:
    candidate.about ||
    `Passionate ${getCandidateRole(candidate)} with ${
      candidate.experience || fallbackCandidate.experience
    } of experience in building cross-platform mobile applications.`,
  currentSalary: candidate.currentSalary || fallbackCandidate.currentSalary,
  expectedSalary: candidate.expectedSalary || fallbackCandidate.expectedSalary,
  location: candidate.location || fallbackCandidate.location,
  skills: candidate.skills?.length
    ? candidate.skills
    : fallbackCandidate.skills,
});

const getCandidateSlug = (candidate = {}) => {
  const slug = String(candidate.id || candidate.name || "candidate")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "candidate";
};

const getCandidateAvatar = (candidate) =>
  candidate.avatar ||
  `https://i.pravatar.cc/150?u=${getCandidateSlug(candidate)}`;

const createCandidateInitialMessages = (candidate) => {
  const now = Date.now();
  const firstName = candidate.name?.split(" ")[0] || "there";

  return [
    {
      id: `${getCandidateSlug(candidate)}-intro-message`,
      text: `Hi ${firstName}, we liked your profile.\nCan you tell me about your recent projects?`,
      time: "10:30 AM",
      sender: "me",
      createdAt: new Date(now - 1000 * 60 * 3).toISOString(),
    },
    {
      id: `${getCandidateSlug(candidate)}-project-reply`,
      text: "Sure! I have built an e-commerce app using React Native. I will share details with you.",
      time: "10:32 AM",
      sender: "other",
      createdAt: new Date(now - 1000 * 60 * 2).toISOString(),
    },
    {
      id: `${getCandidateSlug(candidate)}-project-file`,
      text: "project-details.pdf",
      type: "file",
      fileName: "project-details.pdf",
      fileSize: "1.2 MB",
      time: "10:33 AM",
      sender: "other",
      createdAt: new Date(now - 1000 * 60).toISOString(),
    },
  ];
};

const InfoBlock = ({ label, value }) => (
  <View style={styles.infoBlock}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const EmployerCandidateProfileScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const bottomInset = Platform.OS === "android" ? 12 : 16;
  const cardWidth = Math.min(width - 28, 390);
  const [activeTab, setActiveTab] = useState("Profile");
  const candidate = useMemo(
    () => getCandidateDetails(route?.params?.candidate),
    [route?.params?.candidate],
  );

  const openMessage = async () => {
    const chatId = `candidate-${getCandidateSlug(candidate)}`;
    const userImage = getCandidateAvatar(candidate);
    const initialMessages = createCandidateInitialMessages(candidate);

    try {
      await upsertConversation({
        id: chatId,
        name: candidate.name,
        image: userImage,
        role: candidate.role,
        messages: initialMessages,
        unread: 0,
      });
    } catch {}

    navigation.navigate("EmployerCandidateChat", {
      chatId,
      userName: candidate.name,
      userImage,
      userRole: candidate.role,
      accentColors: ["#6B4DFF", "#3F22E8"],
      initialMessages,
    });
  };

  const showActionMessage = (action) => {
    Alert.alert(
      action,
      `${candidate.name} has been marked for ${action.toLowerCase()}.`,
    );
  };

  const renderAvatar = () => {
    if (candidate.avatar) {
      return (
        <Image source={{ uri: candidate.avatar }} style={styles.avatarImage} />
      );
    }

    return (
      <LinearGradient
        colors={candidate.colors || fallbackCandidate.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarImage}
      >
        <Text style={styles.avatarText}>{candidate.initials || "CA"}</Text>
      </LinearGradient>
    );
  };

  const renderProfileContent = () => (
    <View style={styles.tabContent}>
      <InfoBlock label="About" value={candidate.about} />
      <InfoBlock label="Location" value={candidate.location} />
      <InfoBlock label="Experience" value={candidate.experience} />
      <InfoBlock label="Current Salary" value={candidate.currentSalary} />
      <InfoBlock label="Expected Salary" value={candidate.expectedSalary} />
    </View>
  );

  const renderResumeContent = () => (
    <View style={styles.tabContent}>
      <InfoBlock
        label="Resume"
        value={`${candidate.name}'s resume preview will appear here.`}
      />
      <InfoBlock
        label="Applied For"
        value={candidate.jobTitle || candidate.role}
      />
    </View>
  );

  const renderExperienceContent = () => (
    <View style={styles.tabContent}>
      <InfoBlock label="Total Experience" value={candidate.experience} />
      <InfoBlock label="Preferred Role" value={candidate.role} />
      <InfoBlock label="Availability" value="Immediate to 30 days" />
    </View>
  );

  const renderSkillsContent = () => (
    <View style={styles.tabContent}>
      <Text style={styles.infoLabel}>Skills</Text>
      <View style={styles.skillsWrap}>
        {candidate.skills.map((skill) => (
          <View key={skill} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProjectsContent = () => (
    <View style={styles.tabContent}>
      <InfoBlock
        label="Projects"
        value="E-commerce app, delivery tracking app and employee management dashboard."
      />
    </View>
  );

  const renderActiveTabContent = () => {
    if (activeTab === "Resume") {
      return renderResumeContent();
    }

    if (activeTab === "Experience") {
      return renderExperienceContent();
    }

    if (activeTab === "Skills") {
      return renderSkillsContent();
    }

    if (activeTab === "Projects") {
      return renderProjectsContent();
    }

    return renderProfileContent();
  };

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
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.backButton, { width: cardWidth }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Candidates</Text>
        </TouchableOpacity>

        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.headerRow}>
            {renderAvatar()}

            <View style={styles.headerTextBlock}>
              <Text numberOfLines={1} style={styles.nameText}>
                {candidate.name}
              </Text>
              <Text numberOfLines={1} style={styles.roleText}>
                {candidate.role}
              </Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>
                  {candidate.match || "90% Match"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.82}
              style={[styles.actionButton, styles.messageButton]}
              onPress={openMessage}
            >
              <Text style={[styles.actionText, styles.messageText]}>
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.86}
              style={[styles.actionButton, styles.shortlistButton]}
              onPress={() => showActionMessage("Shortlist")}
            >
              <Text style={[styles.actionText, styles.shortlistText]}>
                Shortlist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => showActionMessage("Reject")}
            >
              <Text style={[styles.actionText, styles.rejectText]}>Reject</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const active = tab === activeTab;

              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.78}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.tabText, active && styles.activeTabText]}
                  >
                    {tab}
                  </Text>
                  {active ? <View style={styles.activeTabLine} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {renderActiveTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FF",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 14,
  },
  backButton: {
    alignSelf: "center",
    marginBottom: 8,
    paddingVertical: 5,
  },
  backText: {
    color: "#5A46F6",
    fontSize: 13,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E6E8F2",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    shadowColor: "#6C7288",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#E9ECF5",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  headerTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  nameText: {
    color: "#151B2C",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  roleText: {
    color: "#626A80",
    fontSize: 12.5,
    fontWeight: "800",
    marginBottom: 8,
  },
  matchBadge: {
    alignSelf: "flex-start",
    minHeight: 24,
    borderRadius: 7,
    backgroundColor: "#DDF8E9",
    justifyContent: "center",
    paddingHorizontal: 9,
  },
  matchText: {
    color: "#24A762",
    fontSize: 11,
    fontWeight: "900",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 17,
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "900",
  },
  messageButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#7B61FF",
  },
  shortlistButton: {
    backgroundColor: "#5038F6",
    shadowColor: "#5038F6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FF9797",
  },
  messageText: {
    color: "#5B45FF",
  },
  shortlistText: {
    color: "#FFFFFF",
  },
  rejectText: {
    color: "#FF5454",
  },
  tabsRow: {
    height: 41,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEDF6",
    flexDirection: "row",
    marginBottom: 18,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minWidth: 0,
  },
  tabText: {
    color: "#626A80",
    fontSize: 10.3,
    fontWeight: "900",
  },
  activeTabText: {
    color: "#5944FF",
  },
  activeTabLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#5944FF",
  },
  tabContent: {
    paddingBottom: 8,
  },
  infoBlock: {
    marginBottom: 18,
  },
  infoLabel: {
    color: "#151B2C",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 7,
  },
  infoValue: {
    color: "#4F566C",
    fontSize: 12.6,
    fontWeight: "700",
    lineHeight: 20,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    minHeight: 28,
    borderRadius: 8,
    backgroundColor: "#F3EEFF",
    borderWidth: 1,
    borderColor: "#ECE5FF",
    justifyContent: "center",
    paddingHorizontal: 11,
  },
  skillText: {
    color: "#674AFF",
    fontSize: 11,
    fontWeight: "900",
  },
});

export default EmployerCandidateProfileScreen;
