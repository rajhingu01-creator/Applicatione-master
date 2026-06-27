import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Bell,
  UserPlus,
  CheckCircle2,
  Heart,
  MessageSquare,
} from "lucide-react-native";
import { SettingsShell } from "../components/SettingsKit";
import { API_URL } from "../utils/api";

const NotificationSettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/profile/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data?.notifications || []);
      }
    } catch (error) {
      console.error("Load notifications error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const renderIcon = (type) => {
    if (type === "follow_request") {
      return <UserPlus size={18} color="#FF8C00" />;
    }
    if (type === "follow_request_accepted") {
      return <CheckCircle2 size={18} color="#008000" />;
    }
    if (type === "post_like") {
      return <Heart size={18} color="#FF3B30" fill="#FF3B30" />;
    }
    if (type === "post_comment") {
      return <MessageSquare size={18} color="#0095f6" />;
    }
    return <Bell size={18} color="#0095f6" />;
  };

  return (
    <SettingsShell navigation={navigation} title="Notifications">
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#008000" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {notifications.length ? (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                activeOpacity={0.86}
                style={styles.card}
              >
                <View style={styles.iconWrap}>
                  {renderIcon(notification.type)}
                </View>
                <Image
                  source={{
                    uri:
                      notification.actor?.image ||
                      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.textWrap}>
                  <Text style={styles.title}>{notification.message}</Text>
                  <Text style={styles.timeText}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Bell size={30} color="#008000" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                New followers and follow requests will show up here.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: "#EEE",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
  },
  timeText: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
});

export default NotificationSettingsScreen;
