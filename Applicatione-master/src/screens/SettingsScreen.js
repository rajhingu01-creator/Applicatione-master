import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Activity,
  Archive,
  ArrowLeft,
  Bell,
  ChevronRight,
  HelpCircle,
  Clock,
  Eye,
  Heart,
  ImageUp,
  Info,
  Lock,
  LogOut,
  MessageSquare,
  Moon,
  Palette,
  Bookmark,
  Shield,
  Sliders,
  Sparkles,
  Star,
  User,
  Zap,
} from "lucide-react-native";
import { clamp, spacingForWidth } from "../utils/responsive";

const quickControls = [
  {
    id: "privacy",
    title: "Privacy",
    value: "Tight",
    icon: Lock,
    tone: ["#008000", "#19C35A"],
  },
  {
    id: "alerts",
    title: "Alerts",
    value: "Smart",
    icon: Bell,
    tone: ["#F5A400", "#FFCB4D"],
  },
  {
    id: "media",
    title: "Media",
    value: "HD",
    icon: ImageUp,
    tone: ["#111", "#444"],
  },
];

const settingGroups = [
  {
    id: "identity",
    title: "Identity",
    items: [
      {
        id: "account",
        title: "Account Center",
        detail: "Profile, bio and account details",
        icon: User,
        route: "AccountSettings",
      },
      {
        id: "security",
        title: "Security & Login",
        detail: "Password, devices and recovery",
        icon: Lock,
        route: "Security",
      },
      {
        id: "visibility",
        title: "Visibility",
        detail: "Private account and audience control",
        icon: Eye,
        route: "AccountVisibility",
      },
    ],
  },
  {
    title: "Interaction",
    items: [
      {
        id: "notifications",
        title: "Notifications",
        detail: "Follow, likes and comments activity",
        icon: Bell,
        route: "NotificationSettings",
      },
      {
        id: "messages",
        title: "Messages & Replies",
        detail: "Open chats and manage replies",
        icon: MessageSquare,
        route: "ChatList",
      },
      {
        id: "blocked",
        title: "Blocked Accounts",
        detail: "People you blocked on your account",
        icon: User,
        route: "BlockedUsers",
      },
    ],
  },
  {
    title: "Experience",
    items: [
      {
        id: "theme",
        title: "Theme & Palette",
        detail: "Coming soon",
        icon: Palette,
      },
      {
        id: "saved",
        title: "Saved Content",
        detail: "Posts and reels saved for later",
        icon: Bookmark,
        route: "SavedReels",
      },
      { id: "archive", title: "Archive", detail: "Coming soon", icon: Archive },
    ],
  },
  {
    title: "Help & Info",
    items: [
      {
        id: "support",
        title: "Help & Support",
        detail: "Support options coming soon",
        icon: HelpCircle,
      },
      {
        id: "safety",
        title: "Safety Center",
        detail: "Account protection and guidance",
        icon: Shield,
      },
      {
        id: "about",
        title: "About",
        detail: "About app and account information",
        icon: Info,
        route: "About",
      },
    ],
  },
];

const SettingsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { screen, compact } = spacingForWidth(width);
  const [smartAlerts, setSmartAlerts] = useState(true);
  const tileWidth = compact
    ? (width - screen * 2 - 12) / 2
    : (width - screen * 2 - 18) / 3;

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["userToken", "userData"]);
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const renderQuickControl = (item) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.84}
        style={[styles.quickTile, { width: tileWidth }]}
      >
        <LinearGradient colors={item.tone} style={styles.quickIcon}>
          <Icon size={18} color="#fff" strokeWidth={2.4} />
        </LinearGradient>
        <Text numberOfLines={1} style={styles.quickTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.quickValue}>
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSettingItem = (item, index, groupLength) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.78}
        style={[
          styles.settingItem,
          index === groupLength - 1 && styles.settingItemLast,
        ]}
        onPress={() => {
          if (item.route) {
            navigation.navigate(item.route);
          } else {
            Alert.alert(item.title, "Aa setting jaldi add karisu.");
          }
        }}
      >
        <View style={styles.itemLeft}>
          <View style={styles.itemIconShell}>
            <Icon size={20} color="#008000" strokeWidth={2.2} />
          </View>
          <View style={styles.itemCopy}>
            <Text numberOfLines={1} style={styles.itemTitle}>
              {item.title}
            </Text>
            {item.detail ? (
              <Text numberOfLines={1} style={styles.itemDetail}>
                {item.detail}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.itemRight}>
          {item.count !== undefined && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{item.count}</Text>
            </View>
          )}
          {item.hasSwitch ? (
            <Switch
              value={smartAlerts}
              onValueChange={setSmartAlerts}
              trackColor={{ false: "#E8EAED", true: "#BFEAC8" }}
              thumbColor={smartAlerts ? "#008000" : "#fff"}
            />
          ) : (
            <ChevronRight size={19} color="#B6BABF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingHorizontal: screen }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
            style={styles.backButton}
          >
            <ArrowLeft size={23} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.tuneButton}>
            <Sliders size={21} color="#111" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: screen },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#FFF7E7", "#F6FFF7"]}
            style={styles.heroPanel}
          >
            <View style={styles.heroTop}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
                }}
                style={styles.profileImage}
              />
              <View style={styles.heroCopy}>
                <Text numberOfLines={1} style={styles.profileName}>
                  Sam Brown
                </Text>
                <Text numberOfLines={1} style={styles.profileHandle}>
                  @sam_perry
                </Text>
              </View>
              <View style={styles.scoreBadge}>
                <Zap size={14} color="#008000" fill="#008000" />
                <Text style={styles.scoreText}>92%</Text>
              </View>
            </View>
            <View style={styles.heroBottom}>
              <View>
                <Text style={styles.heroLabel}>Account Control</Text>
                <Text
                  style={[styles.heroTitle, compact && styles.heroTitleCompact]}
                >
                  Your profile is tuned for reach
                </Text>
              </View>
              <View style={styles.safeBadge}>
                <Shield size={16} color="#008000" />
                <Text style={styles.safeText}>Safe</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={[styles.quickRow, compact && styles.quickRowCompact]}>
            {quickControls.map(renderQuickControl)}
          </View>

          <View style={styles.insightStrip}>
            <View style={styles.insightIcon}>
              <Sparkles size={18} color="#fff" />
            </View>
            <View style={styles.insightCopy}>
              <Text style={styles.insightTitle}>Smart setup active</Text>
              <Text numberOfLines={1} style={styles.insightText}>
                Privacy, media quality and alerts are balanced.
              </Text>
            </View>
          </View>

          {settingGroups.map((group) => (
            <View key={group.id} style={styles.groupBlock}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupCard}>
                {group.items.map((item, index) =>
                  renderSettingItem(item, index, group.items.length),
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <View style={styles.logoutIconWrap}>
              <LogOut size={18} color="#FF3B30" />
            </View>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F5",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 18 : 8,
    paddingBottom: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  tuneButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#111",
    fontSize: 20,
    fontWeight: "900",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 34,
    paddingTop: 4,
  },
  heroPanel: {
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,128,0,0.12)",
    overflow: "hidden",
    minHeight: 150,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: "#fff",
  },
  heroCopy: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  profileName: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900",
  },
  profileHandle: {
    color: "#6B7075",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  scoreBadge: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 11,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  scoreText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "900",
  },
  heroBottom: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },
  heroLabel: {
    color: "#008000",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#111",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    marginTop: 3,
    maxWidth: 230,
  },
  heroTitleCompact: {
    fontSize: 21,
    lineHeight: 25,
  },
  safeBadge: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    backgroundColor: "#E7F8EA",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  safeText: {
    color: "#008000",
    fontSize: 12,
    fontWeight: "900",
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 9,
    marginTop: 16,
  },
  quickRowCompact: {
    gap: 12,
  },
  quickTile: {
    minHeight: 96,
    borderRadius: 22,
    backgroundColor: "#fff",
    padding: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  quickTitle: {
    color: "#111",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  quickValue: {
    color: "#74787D",
    fontSize: 12,
    fontWeight: "800",
  },
  insightStrip: {
    minHeight: 64,
    borderRadius: 22,
    backgroundColor: "#111",
    marginTop: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#008000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  insightCopy: {
    flex: 1,
    minWidth: 0,
  },
  insightTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
  insightText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  groupBlock: {
    marginTop: 20,
  },
  groupTitle: {
    color: "#777D82",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 9,
    paddingHorizontal: 2,
  },
  groupCard: {
    borderRadius: 24,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF0EA",
  },
  settingItem: {
    minHeight: 72,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1EF",
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    paddingRight: 8,
  },
  itemIconShell: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F2FBF3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemCopy: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    color: "#17191B",
    fontSize: 15,
    fontWeight: "900",
  },
  itemDetail: {
    color: "#858A90",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  countBadge: {
    backgroundColor: "#F2FBF3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "#008000",
    fontSize: 12,
    fontWeight: "700",
  },
  logoutButton: {
    height: 56,
    borderRadius: 20,
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFD9D6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 26,
    marginBottom: 8,
  },
  logoutIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFE6E3",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "900",
  },
});

export default SettingsScreen;
