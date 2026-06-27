import React from "react";
import { Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const topContentPadding = Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;
const bottomTabs = [
  { label: "Home", icon: "home-outline", route: "JobPortalHome" }, { label: "Jobs", icon: "briefcase-outline", route: "JobPortalJobs" }, { label: "Applications", icon: "document-text-outline", route: "JobPortalApplications" }, { label: "Messages", icon: "chatbox-outline", route: "JobPortalMessages" }, { label: "Profile", icon: "person", route: "JobPortalProfile" },
];
const checks = ["At least 8 characters", "1 uppercase letter", "1 number or special character"];

const JobPortalChangePasswordScreen = ({ navigation }) => {
  const { width } = useWindowDimensions(); const contentWidth = Math.min(width - 28, 410);
  return <SafeAreaView style={styles.container}><StatusBar style="dark" /><View style={[styles.content, { width: contentWidth, paddingTop: topContentPadding }]}><View style={styles.card}>
    <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={23} color="#4F5061" /></TouchableOpacity><Text style={styles.headerTitle}>Change Password</Text><View style={{ width: 23 }} /></View>
    <View style={styles.infoBox}><Ionicons name="information-circle-outline" size={20} color="#5B35ED" /><Text style={styles.infoText}>Use a strong password to keep your{`\n`}account secure.</Text></View>
    {["Current Password", "New Password", "Confirm New Password"].map((label) => <View key={label} style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.inputRow}><TextInput editable={false} secureTextEntry value="••••••••••••" style={styles.input} /><Ionicons name="eye-off-outline" size={20} color="#8F90A0" /></View></View>)}
    <View style={styles.checks}>{checks.map((item) => <View key={item} style={styles.checkRow}><Ionicons name="checkmark-circle" size={19} color="#61C98D" /><Text style={styles.checkText}>{item}</Text></View>)}</View>
    <TouchableOpacity activeOpacity={0.9} style={styles.buttonWrap}><LinearGradient colors={["#673BF2", "#4B2BE7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}><Text style={styles.buttonText}>Update Password</Text></LinearGradient></TouchableOpacity>
  </View><View style={styles.bottomNav}>{bottomTabs.map((tab) => { const active = tab.label === "Profile"; return <TouchableOpacity key={tab.label} style={styles.navItem} onPress={() => navigation.navigate(tab.route)}><Ionicons name={tab.icon} size={22} color={active ? "#5B35ED" : "#9A9BA9"} /><Text style={[styles.navText, active && styles.navTextActive]}>{tab.label}</Text></TouchableOpacity>; })}</View></View></SafeAreaView>;
};
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#FAFAFE", alignItems: "center" }, content: { flex: 1, justifyContent: "space-between" }, card: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 15, borderWidth: 1.2, borderColor: "#EFEFF5", paddingHorizontal: 18, paddingTop: 15 }, header: { height: 34, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { color: "#1A1B2D", fontSize: 16, fontWeight: "900" }, infoBox: { marginTop: 18, height: 70, borderRadius: 8, backgroundColor: "#F0ECFF", flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 10 }, infoText: { color: "#5B35ED", fontSize: 12.5, lineHeight: 19, fontWeight: "900" }, field: { marginTop: 17, gap: 7 }, label: { color: "#303244", fontSize: 12.5, fontWeight: "900" }, inputRow: { height: 42, borderRadius: 6, borderWidth: 1.2, borderColor: "#E7E7F0", flexDirection: "row", alignItems: "center", paddingHorizontal: 12 }, input: { flex: 1, color: "#303244", fontSize: 14, fontWeight: "900" }, checks: { marginTop: 20, gap: 11 }, checkRow: { flexDirection: "row", alignItems: "center", gap: 9 }, checkText: { color: "#303244", fontSize: 12.5, fontWeight: "900" }, buttonWrap: { marginTop: 28 }, button: { height: 48, borderRadius: 6, alignItems: "center", justifyContent: "center" }, buttonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" }, bottomNav: { height: 67, borderTopWidth: 1, borderTopColor: "#EFEFF5", flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF" }, navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 }, navText: { color: "#8F90A0", fontSize: 10.5, fontWeight: "800" }, navTextActive: { color: "#5B35ED", fontWeight: "900" } });
export default JobPortalChangePasswordScreen;
