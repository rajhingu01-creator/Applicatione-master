import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  ArrowLeft,
  MessageSquare,
  UserCheck,
  UserPlus,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { API_URL } from "../utils/api";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400";

const UserProfileScreen = ({ navigation, route }) => {
  const userId = route.params?.userId;
  const initialUser = route.params?.user || null;

  const [profile, setProfile] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${API_URL}/profile/search?username=${encodeURIComponent(initialUser?.username || "")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        const users = data.data?.users || [];
        const matchedUser = users.find(
          (item) => (item.id || item._id) === userId,
        );
        if (matchedUser) {
          setProfile(matchedUser);
        } else if (initialUser) {
          setProfile(initialUser);
        }
      } else if (initialUser) {
        setProfile(initialUser);
      }
    } catch (error) {
      console.error("Load user profile error:", error);
      if (initialUser) {
        setProfile(initialUser);
      }
    } finally {
      setLoading(false);
    }
  }, [initialUser, userId]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const toggleFollow = async () => {
    if (!profile?.id) {
      return;
    }

    setActionLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const endpoint = profile.isFollowing ? "unfollow" : "follow";
      const response = await fetch(
        `${API_URL}/profile/${endpoint}/${profile.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Request failed");
      }

      await loadProfile();
    } catch (error) {
      console.error("Follow toggle error:", error);
      Alert.alert("Error", error.message || "Could not update follow status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!profile?.id) {
      return;
    }

    setActionLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/messages/start-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: profile.id }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Could not start chat");
      }

      const conversation = data.data?.conversation;

      navigation.navigate("IndividualChat", {
        chatId: conversation?.id,
        userName: conversation?.title || profile.name,
        userImage:
          conversation?.avatar ||
          profile.profilePicture ||
          profile.image ||
          DEFAULT_AVATAR,
        userRole: `@${profile.username}`,
        conversationType: conversation?.type,
        participants: conversation?.participants || [],
      });
    } catch (error) {
      console.error("Start chat error:", error);
      Alert.alert("Error", error.message || "Could not open chat");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <View style={styles.centeredContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#008000" />
      </View>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <ArrowLeft size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.centeredContent}>
          <Text style={styles.emptyText}>User profile not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const avatarSource =
    profile.profilePicture || profile.image || DEFAULT_AVATAR;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {profile.username ? `@${profile.username}` : "Profile"}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: avatarSource }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name || "User"}</Text>
        {profile.username ? (
          <Text style={styles.username}>@{profile.username}</Text>
        ) : null}
        {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.postsCount || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.followersCount || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.followingCount || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.followButton,
              profile.isFollowing && styles.followingButton,
            ]}
            activeOpacity={0.85}
            onPress={toggleFollow}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator
                size="small"
                color={profile.isFollowing ? "#111" : "#fff"}
              />
            ) : (
              <>
                {profile.isFollowing ? (
                  <UserCheck size={18} color="#111" />
                ) : (
                  <UserPlus size={18} color="#fff" />
                )}
                <Text
                  style={[
                    styles.followButtonText,
                    profile.isFollowing && styles.followingButtonText,
                  ]}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            activeOpacity={0.85}
            onPress={handleMessage}
            disabled={actionLoading}
          >
            <MessageSquare size={18} color="#fff" />
            <Text style={styles.messageButtonText}>SMS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#ECECEC",
  },
  name: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: "900",
    color: "#111",
  },
  username: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: "#008000",
  },
  bio: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#555",
    fontWeight: "600",
  },
  statsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  statCard: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#F7F7F8",
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#777",
  },
  actionRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  followButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#008000",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  followingButton: {
    backgroundColor: "#F1F3F5",
    borderWidth: 1,
    borderColor: "#E2E5E9",
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
  followingButtonText: {
    color: "#111",
  },
  messageButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});

export default UserProfileScreen;
