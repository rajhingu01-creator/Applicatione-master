import React from "react";
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
import { ArrowLeft, MoreVertical, Plus } from "lucide-react-native";

const teamMembers = [
  {
    id: "meet",
    name: "Meet Vasoya",
    email: "meet@meetinfotech.com",
    role: "Owner",
    avatar: "https://i.pravatar.cc/120?img=12",
    badgeColor: "#F0E9FF",
    textColor: "#6B4DFF",
  },
  {
    id: "rahul",
    name: "Rahul Patel",
    email: "rahul@meetinfotech.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/120?img=11",
    badgeColor: "#E4F9EF",
    textColor: "#18A765",
  },
  {
    id: "amit",
    name: "Amit Shah",
    email: "amit@meetinfotech.com",
    role: "Recruiter",
    avatar: "https://i.pravatar.cc/120?img=15",
    badgeColor: "#FCE8FF",
    textColor: "#C044D8",
  },
  {
    id: "priya",
    name: "Priya Shah",
    email: "priya@meetinfotech.com",
    role: "HR",
    avatar: "https://i.pravatar.cc/120?img=32",
    badgeColor: "#E5FBF3",
    textColor: "#16A879",
  },
  {
    id: "jignesh",
    name: "Jignesh Parmar",
    email: "jignesh@meetinfotech.com",
    role: "Recruiter",
    avatar: "https://i.pravatar.cc/120?img=13",
    badgeColor: "#FFEDE8",
    textColor: "#F36E4F",
  },
  {
    id: "hardik",
    name: "Hardik Dave",
    email: "hardik@meetinfotech.com",
    role: "HR",
    avatar: "https://i.pravatar.cc/120?img=14",
    badgeColor: "#E5FBF3",
    textColor: "#16A879",
  },
];

const EmployerTeamMembersScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);

  const inviteMember = () => {
    Alert.alert("Invite New Member", "Invite member form is coming soon.");
  };

  const openMemberMenu = (member) => {
    Alert.alert(member.name, "Member actions are coming soon.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 12, paddingBottom: 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Team Members</Text>
            <View style={styles.headerSpacer} />
          </View>

          <LinearGradient
            colors={["#FAF7FF", "#F2ECFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inviteCard}
          >
            <View style={styles.inviteCopy}>
              <Text style={styles.inviteTitle}>Invite New Member</Text>
              <Text style={styles.inviteText}>
                Invite your team member to collaborate and manage hiring.
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.inviteButton}
              onPress={inviteMember}
            >
              <Plus size={22} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </LinearGradient>

          <Text style={styles.memberCount}>Team Members ({teamMembers.length})</Text>

          <View style={styles.membersList}>
            {teamMembers.map((member, index) => (
              <View key={member.id}>
                <View style={styles.memberRow}>
                  <View style={styles.avatarWrap}>
                    <Image source={{ uri: member.avatar }} style={styles.avatar} />
                    <View style={styles.memberDot} />
                  </View>

                  <View style={styles.memberInfo}>
                    <Text numberOfLines={1} style={styles.memberName}>
                      {member.name}
                    </Text>
                    <Text numberOfLines={1} style={styles.memberEmail}>
                      {member.email}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.roleBadge,
                      { backgroundColor: member.badgeColor },
                    ]}
                  >
                    <Text style={[styles.roleText, { color: member.textColor }]}>
                      {member.role}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.moreButton}
                    onPress={() => openMemberMenu(member)}
                  >
                    <MoreVertical size={18} color="#9298AC" strokeWidth={2.4} />
                  </TouchableOpacity>
                </View>
                {index < teamMembers.length - 1 ? (
                  <View style={styles.memberDivider} />
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    shadowColor: "#8E86A8",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  headerRow: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F1FA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#20243A",
    fontSize: 17,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 30,
  },
  inviteCard: {
    minHeight: 94,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  inviteCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 14,
  },
  inviteTitle: {
    color: "#34374F",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  inviteText: {
    color: "#7E8499",
    fontSize: 11.5,
    fontWeight: "800",
    lineHeight: 17,
  },
  inviteButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#5B35F5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B35F5",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  memberCount: {
    color: "#6B7189",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 16,
  },
  membersList: {
    gap: 0,
  },
  memberRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF0F6",
  },
  memberDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#725DFF",
  },
  memberInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  memberName: {
    color: "#22263E",
    fontSize: 13.2,
    fontWeight: "900",
    marginBottom: 4,
  },
  memberEmail: {
    color: "#73798F",
    fontSize: 11.2,
    fontWeight: "800",
  },
  roleBadge: {
    minWidth: 68,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "900",
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  memberDivider: {
    height: 1,
    backgroundColor: "#EFF1F7",
    marginLeft: 50,
  },
});

export default EmployerTeamMembersScreen;
