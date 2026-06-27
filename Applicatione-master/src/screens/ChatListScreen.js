import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  MessageSquare,
  Camera,
  Edit3,
  ArrowLeft,
  X,
  RefreshCw,
  ShieldCheck,
  MessageCircle,
  Users,
  Phone,
  Shield,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { spacingForWidth } from "../utils/responsive";
import { API_URL } from "../utils/api";

const ChatListScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facing, setFacing] = useState("back");
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const mockActiveNow = [
    { id: 1, name: "You", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200", isYou: true },
    { id: 2, name: "Meet", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
    { id: 3, name: "Sara", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
    { id: 4, name: "John", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
  ];

  const tabs = [
    { id: "All", icon: null, label: "All" },
    { id: "Unread", icon: null, label: "Unread" },
    { id: "Groups", icon: Users, label: "Groups" },
    { id: "Calls", icon: Phone, label: "Calls" },
  ];

  const mapConversation = useCallback((conversation) => {
    const otherParticipant = (conversation.participants || []).find(
      (participant) => participant.name === conversation.title,
    );

    return {
      id: conversation.id,
      name: conversation.title,
      image:
        conversation.avatar ||
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      role:
        conversation.type === "direct" && otherParticipant?.username
          ? `@${otherParticipant.username}`
          : "",
      message: conversation.lastMessage?.text || "Start a conversation",
      time: conversation.updatedAt
        ? new Date(conversation.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      unread: conversation.unreadCount || 0,
      conversationType: conversation.type,
      participants: conversation.participants || [],
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadConversations = async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          const response = await fetch(`${API_URL}/messages/conversations`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (!isActive) {
            return;
          }

          if (!data.success) {
            setChats([
              {
                id: "1",
                name: "Raj",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                message: "vcxvxvxcvfdtdffdtdtdffdfhfhdhdfhd...",
                time: "10:44",
                unread: 2,
              },
              {
                id: "2",
                name: "Raj hingu",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                message: "Hey",
                time: "10:12",
                unread: 0,
              },
            ]);
            return;
          }

          const conversations = [
            ...(data.data?.priorityChats || []),
            ...(data.data?.conversations || []),
          ].map(mapConversation);

          setChats(conversations);
        } catch {
          if (isActive) {
            setChats([
              {
                id: "1",
                name: "Raj",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                message: "vcxvxvxcvfdtdffdtdtdffdfhfhdhdfhd...",
                time: "10:44",
                unread: 2,
              },
              {
                id: "2",
                name: "Raj hingu",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                message: "Hey",
                time: "10:12",
                unread: 0,
              },
            ]);
          }
        }
      };

      loadConversations();
    }, []),
  );

  if (isCameraOpen) {
    if (!permission) {
      return <View style={styles.container} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeCameraButton}
            onPress={() => setIsCameraOpen(false)}
          >
            <X size={30} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={() => setIsCameraOpen(false)}
            >
              <X size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={() =>
                setFacing((current) => (current === "back" ? "front" : "back"))
              }
            >
              <RefreshCw size={28} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => console.log("Capture!")}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  const openChat = (item) => {
    const routeName = item.id?.startsWith("candidate-")
      ? "EmployerCandidateChat"
      : "IndividualChat";

    navigation.navigate(routeName, {
      chatId: item.id,
      userName: item.name,
      userImage: item.image,
      userRole: item.role,
      conversationType: item.conversationType,
      participants: item.participants,
    });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.chatItem, item.unread > 0 && styles.chatItemUnread]}
      onPress={() => openChat(item)}
    >
      {item.unread > 0 && (
        <>
          <View style={styles.greenBlob1} />
          <View style={styles.greenBlob2} />
        </>
      )}
      <View style={styles.chatAvatarWrap}>
        <Image source={{ uri: item.image }} style={styles.chatAvatar} />
        {item.unread > 0 && <View style={styles.priorityDot} />}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={[styles.chatTime, item.unread > 0 && styles.unreadTime]}>
            {item.time}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.message}
          </Text>
          {item.unread > 0 && (
            <LinearGradient
              colors={["#FF8C00", "#008000"]}
              style={styles.unreadBadge}
            >
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topPanel}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <ArrowLeft size={26} color="#111" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Messages</Text>
              </View>
            </View>
            <View
              style={[styles.headerIcons, compact && styles.headerIconsCompact]}
            >
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => setIsCameraOpen(true)}
              >
                <Camera size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Edit3 size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={19} color="#777" />
              <Text style={styles.searchText}>Search messages...</Text>
              <ShieldCheck size={18} color="#008000" />
            </View>
          </View>
        </View>

        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.activeNowSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Active Now</Text>
                <Text style={styles.sectionSubtitle}>People online nearby</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeList}>
              {mockActiveNow.map((user) => (
                <View key={user.id} style={styles.activeUserContainer}>
                  <View style={styles.activeUserCard}>
                    <LinearGradient
                      colors={["#FF8C00", "#008000"]}
                      style={styles.activeAvatarGradient}
                    >
                      <Image source={{ uri: user.image }} style={styles.activeAvatar} />
                    </LinearGradient>
                    <View style={styles.onlineBadge} />
                  </View>
                  <Text style={styles.activeUserName}>{user.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.tabContainer}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabButton, isActive && styles.activeTabButton]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={["#FF8C00", "#008000"]}
                      style={styles.tabGradient}
                    >
                      {tab.icon && <tab.icon size={14} color="#fff" />}
                      <Text style={[styles.tabText, styles.activeTabText]}>{tab.label}</Text>
                    </LinearGradient>
                  ) : (
                    <>
                      {tab.icon && <tab.icon size={14} color="#777" />}
                      <Text style={styles.tabText}>{tab.label}</Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>



          {chats.map((chat) => (
            <View key={chat.id}>
              {renderChatItem({ item: chat })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <TouchableOpacity style={styles.fab}>
        <LinearGradient colors={["#FF8C00", "#008000"]} style={styles.fabGradient}>
          <MessageCircle size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
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
  topPanel: {
    paddingTop: Platform.OS === "android" ? 45 : 10,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111",
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  headerIconsCompact: {
    gap: 8,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    color: "#777",
    fontSize: 15,
  },
  contentScroll: {
    flex: 1,
  },
  activeNowSection: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  seeAllText: {
    color: "#008000",
    fontWeight: "700",
    fontSize: 14,
  },
  activeList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  activeUserContainer: {
    alignItems: "center",
    marginRight: 18,
    width: 65,
  },
  activeUserCard: {
    position: "relative",
    marginBottom: 8,
  },
  activeAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  activeAvatarGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#4CAF50",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
  },
  activeUserName: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    gap: 6,
  },
  activeTabButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    overflow: "hidden",
  },
  tabGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    color: "#777",
    fontWeight: "700",
  },
  activeTabText: {
    color: "#fff",
  },
  prioritySection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  secureText: {
    fontSize: 12,
    color: "#008000",
    fontWeight: "700",
  },
  chatItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginBottom: 1,
    position: "relative",
    overflow: "hidden",
  },
  chatItemUnread: {
    backgroundColor: "#f0f9f1",
  },
  greenBlob1: {
    position: "absolute",
    right: -20,
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    opacity: 0.2,
  },
  greenBlob2: {
    position: "absolute",
    right: 30,
    top: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CAF50",
    opacity: 0.3,
  },
  chatAvatarWrap: {
    position: "relative",
    marginRight: 15,
  },
  chatAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  priorityDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF8C00",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
  },
  unreadTime: {
    color: "#008000",
    fontWeight: "700",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  unreadCount: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  permissionContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#008000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeCameraButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
  },
  cameraIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  captureInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F9F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  startChatBtn: {
    borderRadius: 16,
    overflow: "hidden",
    minWidth: 160,
  },
  startChatGradient: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  startChatBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ChatListScreen;
