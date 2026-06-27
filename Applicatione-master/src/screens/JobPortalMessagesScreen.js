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
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const messages = [
  {
    id: "technova",
    company: "TechNova Solutions",
    preview: "Hi Meet, We liked your profile...",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: "brainybeam",
    company: "BrainyBeam Softwares",
    preview: "Can we schedule a call tomorrow?",
    time: "Yesterday",
  },
  {
    id: "codecraft",
    company: "CodeCraft Technologies",
    preview: "Your interview is confirmed...",
    time: "2 days ago",
  },
  {
    id: "pixel",
    company: "Pixel Perfect Studio",
    preview: "Thanks for applying...",
    time: "3 days ago",
  },
];

const bottomTabs = [
  { label: "Home", icon: "home-outline", route: "JobPortalHome" },
  { label: "Jobs", icon: "briefcase-outline", route: "JobPortalJobs" },
  {
    label: "Applications",
    icon: "document-text-outline",
    route: "JobPortalApplications",
  },
  { label: "Messages", icon: "chatbox", route: "JobPortalMessages" },
  { label: "Profile", icon: "person-outline", route: "JobPortalProfile" },
];

const JobPortalMessagesScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 28, 410);
  const compact = height < 720 || width < 370;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 2 : 7),
          },
        ]}
      >
        <View style={styles.messagesList}>
          {messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              activeOpacity={0.82}
              style={styles.messageRow}
              onPress={() => navigation.navigate("JobPortalChat", { message })}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={25} color="#172033" />
              </View>
              <View style={styles.messageBody}>
                <View style={styles.messageTopRow}>
                  <Text style={styles.companyText} numberOfLines={1}>
                    {message.company}
                  </Text>
                  <Text style={styles.timeText}>{message.time}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewText} numberOfLines={1}>
                    {message.preview}
                  </Text>
                  {message.unread ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{message.unread}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.label === "Messages";

            return (
              <TouchableOpacity
                key={tab.label}
                activeOpacity={0.76}
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  messagesList: {
    paddingHorizontal: 3,
  },
  messageRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF5",
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0D3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  messageBody: {
    flex: 1,
  },
  messageTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  companyText: {
    flex: 1,
    color: "#1A1B2D",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  timeText: {
    color: "#8B8C9A",
    fontSize: 11.5,
    fontWeight: "800",
  },
  previewRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  previewText: {
    flex: 1,
    color: "#3F4051",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "800",
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#5B35ED",
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  bottomNav: {
    height: 67,
    borderTopWidth: 1,
    borderTopColor: "#EFEFF5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    backgroundColor: "#FFFFFF",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navText: {
    color: "#8F90A0",
    fontSize: 10.5,
    fontWeight: "800",
  },
  navTextActive: {
    color: "#5B35ED",
    fontWeight: "900",
  },
});

export default JobPortalMessagesScreen;
