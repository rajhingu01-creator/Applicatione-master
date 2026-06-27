import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  BadgeCheck,
  Mail,
  Shield,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react-native";
import {
  InfoStrip,
  PageHero,
  SectionCard,
  SettingRow,
  SettingsShell,
} from "../components/SettingsKit";
import { API_URL, BASE_URL } from "../utils/api";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop";

const AccountSettingsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({
    name: "",
    username: "",
    email: "",
    contactNumber: "",
    gender: "",
    location: "",
    profilePicture: DEFAULT_AVATAR,
  });

  const loadAccount = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data?.user) {
        const user = data.data.user;
        let avatarUrl = user.profilePicture || DEFAULT_AVATAR;
        if (avatarUrl && !avatarUrl.startsWith("http")) {
          avatarUrl = `${BASE_URL}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;
        }

        setAccount({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          contactNumber: user.contactNumber || "",
          gender: user.gender || "",
          location: user.location || "",
          profilePicture: avatarUrl,
        });
      }
    } catch (error) {
      console.error("Load account settings error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccount();
    }, [loadAccount]),
  );

  return (
    <SettingsShell navigation={navigation} title="Account">
      <PageHero
        icon={User}
        eyebrow="Identity Center"
        title="Keep your profile sharp and trusted"
        text="Manage personal info, contact details and security routes from one cleaner hub."
        metric={account.username ? "Verified" : "Profile"}
      />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#008000" />
        </View>
      ) : (
        <>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: account.profilePicture || DEFAULT_AVATAR }}
              style={styles.avatar}
            />
            <View style={styles.profileCopy}>
              <Text numberOfLines={1} style={styles.name}>
                {account.name || "User"}
              </Text>
              <Text numberOfLines={1} style={styles.handle}>
                @{account.username || "username"}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={() => navigation.navigate("Profile")}
            >
              <LinearGradient
                colors={["#F5A400", "#008000"]}
                style={styles.editButton}
              >
                <Text style={styles.editText}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <InfoStrip
            icon={Sparkles}
            title="Profile health is strong"
            text="Your account has a good setup for discovery and secure recovery."
          />

          <SectionCard title="Profile Details">
            <SettingRow
              icon={User}
              title="Personal Information"
              detail={`${account.name || "Not set"}${account.gender ? ` • ${account.gender}` : ""}`}
            />
            <SettingRow
              icon={Mail}
              title="Email Address"
              detail={account.email || "Not added"}
            />
            <SettingRow
              icon={Smartphone}
              title="Phone Number"
              detail={account.contactNumber || "Not added"}
              isLast
            />
          </SectionCard>

          <SectionCard title="Trust & Access">
            <SettingRow
              icon={Shield}
              title="Password and Security"
              detail="Password, sessions, two-factor"
              onPress={() => navigation.navigate("Security")}
            />
            <SettingRow
              icon={BadgeCheck}
              title="Verification Status"
              detail={
                account.email
                  ? "Account information verified"
                  : "Complete profile details"
              }
              isLast
            />
          </SectionCard>
        </>
      )}
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  loaderWrap: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    minHeight: 88,
    borderRadius: 24,
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF0EA",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 12,
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900",
  },
  handle: {
    color: "#777D82",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },
  editButton: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },
});

export default AccountSettingsScreen;
