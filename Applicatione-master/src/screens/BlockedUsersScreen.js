import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { UserX } from "lucide-react-native";
import {
  SettingsShell,
  SectionCard,
  PageHero,
} from "../components/SettingsKit";

const BlockedUsersScreen = ({ navigation }) => {
  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: "1",
      name: "Rahul Sharma",
      username: "@rahul_99",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: "2",
      name: "Priya Patel",
      username: "@priya_vlogs",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: "3",
      name: "Amit Verma",
      username: "@amit_tech",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: "4",
      name: "Sonal Jain",
      username: "@sonal_art",
      avatar: "https://i.pravatar.cc/150?u=4",
    },
    {
      id: "5",
      name: "Vikram Singh",
      username: "@vikram_fit",
      avatar: "https://i.pravatar.cc/150?u=5",
    },
  ]);

  const handleUnblock = (user) => {
    Alert.alert("Unblock user", `Unblock ${user.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unblock",
        onPress: () =>
          setBlockedUsers((current) =>
            current.filter((item) => item.id !== user.id),
          ),
      },
    ]);
  };

  const renderUser = ({ item, index }) => (
    <View
      style={[
        styles.userItem,
        index === blockedUsers.length - 1 && styles.userItemLast,
      ]}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.unblockButton}
        onPress={() => handleUnblock(item)}
      >
        <Text style={styles.unblockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SettingsShell navigation={navigation} title="Blocked Users">
      <PageHero
        icon={UserX}
        eyebrow="Privacy Support"
        title="Manage blocked people"
        text="People you block won't be able to find your profile, posts or reels on Abecedex."
        metric={`${blockedUsers.length} Users`}
      />

      <SectionCard title="Blocked List">
        <FlatList
          data={blockedUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <UserX size={40} color="#CCC" />
              <Text style={styles.emptyText}>No blocked users yet</Text>
            </View>
          }
        />
      </SectionCard>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1EF",
  },
  userItemLast: {
    borderBottomWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: "#F1F3F5",
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: "900",
    color: "#17191B",
  },
  username: {
    fontSize: 13,
    color: "#858A90",
    marginTop: 1,
    fontWeight: "700",
  },
  unblockButton: {
    backgroundColor: "#F2FBF3",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E1F5E5",
  },
  unblockText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#008000",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: "#858A90",
    marginTop: 12,
    fontWeight: "700",
  },
});

export default BlockedUsersScreen;
