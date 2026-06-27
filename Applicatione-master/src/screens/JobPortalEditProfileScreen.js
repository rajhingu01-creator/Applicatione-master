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
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;
const fields = [
  ["Full Name", "Meet Vasoya"],
  ["Email", "meetvasoya@gmail.com"],
  ["Mobile Number", "+91 98765 43210"],
  ["Job Title", "React Native Developer"],
  ["Location", "Ahmedabad, Gujarat"],
];
const bottomTabs = [
  { label: "Home", icon: "home-outline", route: "JobPortalHome" },
  { label: "Jobs", icon: "briefcase-outline", route: "JobPortalJobs" },
  {
    label: "Applications",
    icon: "document-text-outline",
    route: "JobPortalApplications",
  },
  { label: "Messages", icon: "chatbox-outline", route: "JobPortalMessages" },
  { label: "Profile", icon: "person", route: "JobPortalProfile" },
];

const JobPortalEditProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 28, 410);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          { width: contentWidth, paddingTop: topContentPadding },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={23} color="#4F5061" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 23 }} />
          </View>
          <View style={styles.photoWrap}>
            <View style={styles.photoCircle}>
              <Ionicons name="camera" size={28} color="#5B35ED" />
            </View>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </View>
          <View style={styles.form}>
            {fields.map(([label, value]) => (
              <View key={label} style={styles.field}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  editable={false}
                  value={value}
                  style={styles.input}
                />
              </View>
            ))}
            <View style={styles.field}>
              <Text style={styles.label}>Resume</Text>
              <TouchableOpacity activeOpacity={0.78} style={styles.resumeBox}>
                <View style={styles.resumeIcon}>
                  <Ionicons name="document-text" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.resumeInfo}>
                  <Text style={styles.resumeName}>Meet_Vasoya_Resume.pdf</Text>
                  <Text style={styles.resumeSize}>2.4 MB</Text>
                </View>
                <Text style={styles.uploadText}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                editable={false}
                multiline
                value="Passionate React Native Developer with 3+ years of experience in building cross-platform mobile applications."
                style={[styles.input, styles.bioInput]}
              />
            </View>
          </View>
        </View>
        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.label === "Profile";
            return (
              <TouchableOpacity
                key={tab.label}
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
  container: { flex: 1, backgroundColor: "#FAFAFE", alignItems: "center" },
  content: { flex: 1, justifyContent: "space-between" },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    paddingHorizontal: 18,
    paddingTop: 15,
  },
  header: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#1A1B2D", fontSize: 16, fontWeight: "900" },
  photoWrap: { alignItems: "center", marginTop: 18, marginBottom: 12 },
  photoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#F0ECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  changePhoto: {
    color: "#5B35ED",
    fontSize: 12.5,
    fontWeight: "900",
    marginTop: 10,
  },
  form: { gap: 9 },
  field: { gap: 5 },
  label: { color: "#303244", fontSize: 12.5, fontWeight: "900" },
  input: {
    height: 38,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    paddingHorizontal: 12,
    color: "#303244",
    fontSize: 12.5,
    fontWeight: "800",
    backgroundColor: "#FFFFFF",
  },
  resumeBox: {
    height: 46,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  resumeIcon: {
    width: 28,
    height: 28,
    borderRadius: 5,
    backgroundColor: "#5B35ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  resumeInfo: { flex: 1 },
  resumeName: { color: "#303244", fontSize: 12.2, fontWeight: "900" },
  resumeSize: {
    color: "#777987",
    fontSize: 11.5,
    fontWeight: "800",
    marginTop: 1,
  },
  uploadText: { color: "#5B35ED", fontSize: 12.2, fontWeight: "900" },
  bioInput: { height: 60, paddingTop: 9, textAlignVertical: "top" },
  bottomNav: {
    height: 67,
    borderTopWidth: 1,
    borderTopColor: "#EFEFF5",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  navText: { color: "#8F90A0", fontSize: 10.5, fontWeight: "800" },
  navTextActive: { color: "#5B35ED", fontWeight: "900" },
});
export default JobPortalEditProfileScreen;
