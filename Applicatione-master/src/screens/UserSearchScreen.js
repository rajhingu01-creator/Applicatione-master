import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { API_URL } from "../utils/api";

const UserSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Search by username to find accounts");

  const handleSearch = async (value = query) => {
    const trimmed = value.trim();
    setQuery(value);

    if (!trimmed) {
      setResults([]);
      setMessage("Search by username to find accounts");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${API_URL}/profile/search?username=${encodeURIComponent(trimmed)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        const users = data.data?.users || [];
        setResults(users);
        setMessage(users.length ? "" : "No accounts found");
      } else {
        setResults([]);
        setMessage(data.message || "Search failed");
      }
    } catch (error) {
      console.error("User search error:", error);
      setResults([]);
      setMessage("Network error while searching users");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Users</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.searchRow}>
        <Search size={18} color="#777" />
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search username..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#008000" style={styles.loader} />
      ) : null}

      {!isLoading && message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}

      <View style={styles.resultsList}>
        {results.map((user) => (
          <TouchableOpacity
            key={user.id || user._id || user.username}
            style={styles.userCard}
            activeOpacity={0.82}
            onPress={() =>
              navigation.navigate("UserProfile", {
                userId: user.id || user._id,
                user,
              })
            }
          >
            <Image
              source={{
                uri:
                  user.profilePicture ||
                  user.image ||
                  "https://i.pravatar.cc/150?u=default-user",
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.nameText}>{user.name || "User"}</Text>
              <Text style={styles.usernameText}>@{user.username}</Text>
              {user.bio ? (
                <Text style={styles.bioText} numberOfLines={1}>
                  {user.bio}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#111",
    fontSize: 20,
    fontWeight: "900",
  },
  searchRow: {
    marginHorizontal: 16,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F4F5F7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#111",
    fontSize: 15,
    fontWeight: "700",
  },
  loader: {
    marginTop: 24,
  },
  message: {
    marginTop: 28,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    fontWeight: "700",
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EDEDED",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "900",
  },
  usernameText: {
    color: "#008000",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },
  bioText: {
    color: "#666",
    fontSize: 12.5,
    fontWeight: "700",
    marginTop: 3,
  },
});

export default UserSearchScreen;
