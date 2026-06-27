import React from "react";
import { Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet, Switch, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const topContentPadding = Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;
const pushItems = [["Enable Push Notifications", true], ["Job Alerts", true], ["Application Updates", true], ["Interview Alerts", true], ["Messages", true], ["Company Updates", false], ["Marketing & Offers", false]];
const emailItems = [["Email Me Updates", true], ["Weekly Job Recommendations", true]];
const bottomTabs = [{ label: "Home", icon: "home-outline", route: "JobPortalHome" }, { label: "Jobs", icon: "briefcase-outline", route: "JobPortalJobs" }, { label: "Applications", icon: "document-text-outline", route: "JobPortalApplications" }, { label: "Messages", icon: "chatbox-outline", route: "JobPortalMessages" }, { label: "Profile", icon: "person", route: "JobPortalProfile" }];
const Toggle = ({ value }) => <Switch value={value} disabled trackColor={{ false: "#D9D9E6", true: "#6A47F2" }} thumbColor="#FFFFFF" />;
const Row = ({ item }) => <View style={styles.row}><Text style={styles.rowText}>{item[0]}</Text><Toggle value={item[1]} /></View>;

const JobPortalNotificationSettingsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 28, 410);
  return <SafeAreaView style={styles.container}><StatusBar style="dark" /><View style={[styles.content, { width: contentWidth, paddingTop: topContentPadding }]}><View style={styles.card}>
    <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={23} color="#4F5061" /></TouchableOpacity><Text style={styles.headerTitle}>Notification Settings</Text><View style={{ width: 23 }} /></View>
    <Text style={styles.sectionTitle}>Push Notifications</Text><View style={styles.group}>{pushItems.map((item) => <Row key={item[0]} item={item} />)}</View>
    <Text style={styles.sectionTitle}>Email Notifications</Text><View style={styles.group}>{emailItems.map((item) => <Row key={item[0]} item={item} />)}</View>
    <TouchableOpacity activeOpacity={0.9} style={styles.buttonWrap}><LinearGradient colors={["#673BF2", "#4B2BE7"]} style={styles.button}><Text style={styles.buttonText}>Save Preferences</Text></LinearGradient></TouchableOpacity>
  </View><View style={styles.bottomNav}>{bottomTabs.map((tab) => { const active = tab.label === "Profile"; return <TouchableOpacity key={tab.label} style={styles.navItem} onPress={() => navigation.navigate(tab.route)}><Ionicons name={tab.icon} size={22} color={active ? "#5B35ED" : "#9A9BA9"} /><Text style={[styles.navText, active && styles.navTextActive]}>{tab.label}</Text></TouchableOpacity>; })}</View></View></SafeAreaView>;
};
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#FAFAFE", alignItems: "center" }, content: { flex: 1, justifyContent: "space-between" }, card: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 15, borderWidth: 1.2, borderColor: "#EFEFF5", paddingHorizontal: 18, paddingTop: 15 }, header: { height: 34, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { color: "#1A1B2D", fontSize: 16, fontWeight: "900" }, sectionTitle: { color: "#303244", fontSize: 13.5, fontWeight: "900", marginTop: 18, marginBottom: 9 }, group: { borderRadius: 9, borderWidth: 1.2, borderColor: "#EFEFF5", overflow: "hidden" }, row: { height: 42, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#EFEFF5" }, rowText: { flex: 1, color: "#303244", fontSize: 12.5, fontWeight: "900" }, buttonWrap: { marginTop: 18 }, button: { height: 43, borderRadius: 6, alignItems: "center", justifyContent: "center" }, buttonText: { color: "#FFFFFF", fontSize: 13.5, fontWeight: "900" }, bottomNav: { height: 67, borderTopWidth: 1, borderTopColor: "#EFEFF5", flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF" }, navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 }, navText: { color: "#8F90A0", fontSize: 10.5, fontWeight: "800" }, navTextActive: { color: "#5B35ED", fontWeight: "900" } });
export default JobPortalNotificationSettingsScreen;
