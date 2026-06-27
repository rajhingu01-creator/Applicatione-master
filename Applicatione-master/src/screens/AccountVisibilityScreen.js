import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View, Switch } from "react-native";
import { Eye, Lock, Globe } from "lucide-react-native";
import {
  SettingsShell,
  SectionCard,
  SettingRow,
  PageHero,
} from "../components/SettingsKit";
import { API_URL } from "../utils/api";

const AccountVisibilityScreen = ({ navigation }) => {
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const loadPrivacy = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setIsPrivate(Boolean(data.data.user.isPrivate));
        }
      } catch (error) {
        console.error("Load privacy error:", error);
      }
    };

    loadPrivacy();
  }, []);

  const togglePrivacy = async (value) => {
    setIsPrivate(value);
    try {
      const token = await AsyncStorage.getItem("userToken");
      await fetch(`${API_URL}/profile/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPrivate: value }),
      });
    } catch (error) {
      console.error("Update privacy error:", error);
    }
  };

  return (
    <SettingsShell navigation={navigation} title="Account Visibility">
      <PageHero
        icon={Eye}
        eyebrow="Privacy"
        title="Who can see your content"
        text="Manage your account visibility and control how people interact with your profile."
      />

      <SectionCard title="Visibility Status">
        <SettingRow
          icon={isPrivate ? Lock : Globe}
          title="Private Account"
          detail={
            isPrivate
              ? "Only approved people can see your posts"
              : "Anyone can see your posts and reels"
          }
          right={
            <Switch
              value={isPrivate}
              onValueChange={togglePrivacy}
              trackColor={{ false: "#E8EAED", true: "#BFEAC8" }}
              thumbColor={isPrivate ? "#008000" : "#fff"}
            />
          }
          isLast
        />
      </SectionCard>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          When your account is private, only people you approve can see your
          photos and videos. Your existing followers won't be affected.
        </Text>
      </View>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#626970",
    lineHeight: 18,
    fontWeight: "500",
  },
});

export default AccountVisibilityScreen;
