import React, { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Camera,
  Mic,
  Image as ImageIcon,
  X,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { spacingForWidth } from "../utils/responsive";
import TypingIndicator from "../components/TypingIndicator";
import { API_URL } from "../utils/api";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop";

const EMOJI_GROUPS = [
  {
    key: "recent",
    title: "Recent",
    icon: "🕘",
    items: ["😊", "😁", "😔", "😅", "🙂", "👥", "🙄"],
  },
  {
    key: "smileys",
    title: "Smileys & People",
    icon: "😀",
    items: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "🥹",
      "😅",
      "😂",
      "🤣",
      "🥲",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🥸",
      "🤩",
      "🥳",
      "🙂‍↕️",
      "😏",
      "😒",
      "🙂‍↔️",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "🫣",
      "🤗",
      "🫡",
      "🤔",
      "🫢",
      "🤭",
      "🤫",
      "🤥",
      "😶",
      "🫠",
    ],
  },
  {
    key: "gestures",
    title: "Gestures",
    icon: "👍",
    items: [
      "👍",
      "👎",
      "👏",
      "🙌",
      "🙏",
      "👌",
      "🤝",
      "✌️",
      "🤟",
      "💪",
      "👀",
      "🔥",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🫱",
      "🫲",
      "🫶",
      "🤲",
      "👐",
      "🙌",
      "🤜",
      "🤛",
    ],
  },
  {
    key: "hearts",
    title: "Hearts & Love",
    icon: "❤️",
    items: [
      "❤️",
      "🩷",
      "🧡",
      "💛",
      "💚",
      "💙",
      "🩵",
      "💜",
      "🤎",
      "🖤",
      "🩶",
      "🤍",
      "💖",
      "💘",
      "💝",
      "💗",
      "💓",
      "💕",
      "💞",
      "💟",
      "❣️",
      "💯",
      "✨",
      "🌟",
    ],
  },
  {
    key: "animals",
    title: "Animals & Nature",
    icon: "🐶",
    items: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
      "🦋",
      "🌸",
      "🌹",
      "🌻",
      "🍀",
      "🌈",
    ],
  },
  {
    key: "food",
    title: "Food & Drink",
    icon: "🍔",
    items: [
      "🍏",
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍒",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🥑",
      "🍔",
      "🍕",
      "🌭",
      "🍟",
      "🍿",
      "🧋",
      "☕",
      "🍰",
    ],
  },
];

const formatMessageTime = (dateValue) =>
  new Date(dateValue).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const normalizeApiMessage = (message = {}) => ({
  id: message.id || String(Date.now()),
  type: message.type || "text",
  text: message.text || "",
  imageUrl: message.imageUrl || "",
  isMine: Boolean(message.isMine),
  sender: message.isMine ? "me" : "other",
  time: formatMessageTime(message.createdAt || new Date().toISOString()),
  createdAt: message.createdAt || new Date().toISOString(),
});

const IndividualChatScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const params = route.params || {};
  const userName = params.userName || "User";
  const userImage = params.userImage || DEFAULT_AVATAR;
  const userRole = params.userRole || "";
  const chatId = params.chatId;
  const accentColors = params.accentColors || ["#FF8C00", "#008000"];
  const isWideScreen = width >= 900;

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [activeEmojiGroup, setActiveEmojiGroup] = useState("recent");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const typingStopTimeoutRef = useRef(null);
  const typingHeartbeatRef = useRef(null);
  const lastTypingStateRef = useRef(false);

  const loadMessages = useCallback(async () => {
    if (!chatId) {
      setIsLoading(false);
      return;
    }

    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${API_URL}/messages/conversations/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Could not load messages");
      }

      const nextMessages = (data.data?.messages || []).map(normalizeApiMessage);
      const otherUserTyping = Boolean(
        data.data?.conversation?.isOtherUserTyping,
      );
      setIsTyping(otherUserTyping);
      setMessages((currentMessages) => {
        const localMessageMap = new Map(
          currentMessages.map((item) => [item.id, item]),
        );

        const mergedMessages = nextMessages.map((item) => {
          const localMessage = localMessageMap.get(item.id);
          if (!localMessage) {
            return item;
          }

          return {
            ...item,
            isMine: localMessage.isMine ?? item.isMine,
            sender: (localMessage.isMine ?? item.isMine) ? "me" : "other",
          };
        });

        const currentSignature = currentMessages
          .map((item) => `${item.id}-${item.sender}`)
          .join(",");
        const nextSignature = mergedMessages
          .map((item) => `${item.id}-${item.sender}`)
          .join(",");

        return currentSignature === nextSignature
          ? currentMessages
          : mergedMessages;
      });
      hasLoadedRef.current = true;
    } catch (error) {
      console.error("Load messages error:", error);
      Alert.alert("Error", error.message || "Could not load messages");
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      loadMessages();
      const intervalId = setInterval(() => {
        if (isActive) {
          loadMessages();
        }
      }, 1200);

      return () => {
        isActive = false;
        clearInterval(intervalId);
      };
    }, [chatId, loadMessages]),
  );

  useEffect(() => {
    if (!shouldAutoScrollRef.current) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: hasLoadedRef.current });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  const sendPayload = async (payload) => {
    if (!chatId || isSending) {
      return;
    }

    setIsSending(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${API_URL}/messages/conversations/${chatId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Could not send message");
      }

      const newMessage = normalizeApiMessage({
        ...(data.data?.message || {}),
        isMine: true,
      });
      setMessages((currentMessages) => {
        const exists = currentMessages.some(
          (item) => item.id === newMessage.id,
        );
        return exists ? currentMessages : [...currentMessages, newMessage];
      });
      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);
      Alert.alert("Error", error.message || "Could not send message");
    } finally {
      setIsSending(false);
    }
  };

  const updateTypingStatus = useCallback(
    async (typing, force = false) => {
      if (!chatId) {
        return;
      }

      if (!force && lastTypingStateRef.current === typing) {
        return;
      }

      lastTypingStateRef.current = typing;

      try {
        const token = await AsyncStorage.getItem("userToken");
        await fetch(`${API_URL}/messages/conversations/${chatId}/typing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isTyping: typing }),
        });
      } catch (error) {
        console.error("Update typing status error:", error);
      }
    },
    [chatId],
  );

  useEffect(() => {
    return () => {
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
      }
      if (typingHeartbeatRef.current) {
        clearInterval(typingHeartbeatRef.current);
      }
      if (lastTypingStateRef.current) {
        updateTypingStatus(false);
      }
    };
  }, [updateTypingStatus]);

  const handleTypingChange = (value) => {
    setMessage(value);

    const hasText = value.trim().length > 0;

    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
    }

    if (hasText) {
      updateTypingStatus(true, !lastTypingStateRef.current);

      if (!typingHeartbeatRef.current) {
        typingHeartbeatRef.current = setInterval(() => {
          if (lastTypingStateRef.current) {
            updateTypingStatus(true, true);
          }
        }, 1800);
      }

      typingStopTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false, true);
        if (typingHeartbeatRef.current) {
          clearInterval(typingHeartbeatRef.current);
          typingHeartbeatRef.current = null;
        }
      }, 1800);
    } else {
      updateTypingStatus(false, true);
      if (typingHeartbeatRef.current) {
        clearInterval(typingHeartbeatRef.current);
        typingHeartbeatRef.current = null;
      }
    }
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
    }
    if (typingHeartbeatRef.current) {
      clearInterval(typingHeartbeatRef.current);
      typingHeartbeatRef.current = null;
    }

    await updateTypingStatus(false, true);
    await sendPayload({ text: trimmedMessage });
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((currentMessage) => `${currentMessage}${emoji}`);
  };

  const filteredEmojiGroups = EMOJI_GROUPS.map((group) => ({
    ...group,
    items: emojiSearch.trim()
      ? group.items.filter((emoji) => emoji.includes(emojiSearch.trim()))
      : group.items,
  })).filter((group) => group.items.length > 0);

  const visibleEmojiGroups = emojiSearch.trim()
    ? filteredEmojiGroups
    : filteredEmojiGroups.filter(
        (group) => group.key === activeEmojiGroup || group.key === "recent",
      );

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Gallery permission is required to send photos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedImage = result.assets[0];
      if (!selectedImage?.uri) {
        return;
      }

      await sendPayload({ imageUrl: selectedImage.uri, text: "" });
    } catch (error) {
      console.error("Pick image error:", error);
      Alert.alert("Error", "Could not select image");
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.isMine ?? item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        {!isMe && (
          <Image source={{ uri: userImage }} style={styles.messageAvatar} />
        )}
        <View
          style={[
            styles.bubbleContainer,
            isMe ? styles.myBubbleContainer : styles.otherBubbleContainer,
          ]}
        >
          {item.type === "image" && item.imageUrl ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowFullImage(true)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.messageImage}
              />
            </TouchableOpacity>
          ) : isMe ? (
            <LinearGradient
              colors={accentColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.myBubble}
            >
              <Text style={styles.myMessageText}>{item.text}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.otherBubble}>
              <Text style={styles.otherMessageText}>{item.text}</Text>
            </View>
          )}
          <Text
            style={[
              styles.timeText,
              isMe ? styles.myTimeText : styles.otherTimeText,
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => setShowFullImage(true)}
              activeOpacity={0.8}
            >
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: userImage }}
                  style={styles.headerAvatar}
                />
                <View style={styles.onlineStatus} />
              </View>
              <View>
                <Text style={styles.headerName}>{userName}</Text>
                <Text
                  style={[
                    styles.headerStatus,
                    isTyping && styles.headerStatusTyping,
                  ]}
                >
                  {isTyping ? "typing..." : "Online"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={[styles.headerRight, compact && styles.headerRightCompact]}
          >
            <TouchableOpacity style={styles.headerIconButton}>
              <Phone size={compact ? 18 : 20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <Video size={compact ? 18 : 20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <MoreVertical size={compact ? 18 : 20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={showFullImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFullImage(false)}
        >
          <Pressable
            style={styles.fullImageOverlay}
            onPress={() => setShowFullImage(false)}
          >
            <View style={styles.fullImageHeader}>
              <TouchableOpacity
                onPress={() => setShowFullImage(false)}
                style={styles.closeBtn}
              >
                <X size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.fullImageTitle}>{userName}</Text>
            </View>
            <Image
              source={{ uri: userImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#008000" />
          </View>
        ) : (
          <View
            style={[
              styles.messagesShell,
              isWideScreen && styles.messagesShellWide,
            ]}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesArea}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => {
                if (shouldAutoScrollRef.current) {
                  flatListRef.current?.scrollToEnd({
                    animated: hasLoadedRef.current,
                  });
                }
              }}
              onScroll={(event) => {
                const { contentOffset, contentSize, layoutMeasurement } =
                  event.nativeEvent;
                const distanceFromBottom =
                  contentSize.height -
                  (contentOffset.y + layoutMeasurement.height);
                shouldAutoScrollRef.current = distanceFromBottom < 80;
              }}
              scrollEventThrottle={16}
            />
          </View>
        )}

        {showEmojiPicker ? (
          <View
            style={[
              styles.emojiPickerSheet,
              isWideScreen && styles.emojiPickerSheetWide,
            ]}
          >
            <View style={styles.emojiTopTabs}>
              {EMOJI_GROUPS.map((group) => (
                <TouchableOpacity
                  key={group.key}
                  style={[
                    styles.emojiTopTab,
                    activeEmojiGroup === group.key && styles.emojiTopTabActive,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setActiveEmojiGroup(group.key)}
                >
                  <Text style={styles.emojiTopTabText}>{group.icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.emojiSearchBox}>
              <Text style={styles.emojiSearchIcon}>🔍</Text>
              <TextInput
                value={emojiSearch}
                onChangeText={setEmojiSearch}
                placeholder="Search emoji"
                placeholderTextColor="#999"
                style={styles.emojiSearchInput}
              />
            </View>

            <ScrollView
              style={styles.emojiScrollArea}
              contentContainerStyle={styles.emojiScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {visibleEmojiGroups.map((group) => (
                <View key={group.key} style={styles.emojiSection}>
                  <Text style={styles.emojiSectionTitle}>{group.title}</Text>
                  <View style={styles.emojiGrid}>
                    {group.items.map((emoji) => (
                      <TouchableOpacity
                        key={`${group.key}-${emoji}`}
                        style={styles.emojiButton}
                        activeOpacity={0.75}
                        onPress={() => handleEmojiSelect(emoji)}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.emojiBottomTabs}>
              <TouchableOpacity
                style={styles.emojiBottomTab}
                activeOpacity={0.8}
              >
                <Text style={styles.emojiBottomTabActiveText}>😊</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emojiBottomTab}
                activeOpacity={0.8}
              >
                <Text style={styles.emojiBottomTabText}>GIF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emojiBottomTab}
                activeOpacity={0.8}
              >
                <Text style={styles.emojiBottomTabText}>🙂</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {isTyping ? (
          <View style={styles.typingStatusBar}>
            <TypingIndicator />
            <Text style={styles.typingStatusText}>{userName} is typing...</Text>
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <View
            style={[styles.inputInner, isWideScreen && styles.inputInnerWide]}
          >
            <View
              style={[
                styles.inputWrapper,
                compact && styles.inputWrapperCompact,
              ]}
            >
              <TouchableOpacity
                style={styles.inputIcon}
                onPress={() => setShowEmojiPicker((current) => !current)}
              >
                <Smile size={24} color={showEmojiPicker ? "#008000" : "#999"} />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={handleTypingChange}
                multiline
              />
              <TouchableOpacity style={styles.inputIcon}>
                <Camera size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inputIcon}
                onPress={handlePickImage}
              >
                <ImageIcon size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSend} disabled={isSending}>
              <LinearGradient colors={accentColors} style={styles.sendButton}>
                {message.trim().length > 0 ? (
                  <Send size={22} color="white" />
                ) : (
                  <Mic size={22} color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineStatus: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "white",
  },
  headerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    maxWidth: 135,
  },
  headerStatus: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  headerStatusTyping: {
    color: "#8E8E93",
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
  },
  headerRightCompact: {
    gap: 4,
  },
  headerIconButton: {
    padding: 5,
  },
  messagesShell: {
    flex: 1,
  },
  messagesShellWide: {
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
  },
  messagesArea: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: Platform.OS === "android" ? 16 : 8,
  },
  typingStatusBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 2,
    backgroundColor: "#F8F9FA",
  },
  typingStatusText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 6,
    maxWidth: "72%",
  },
  myMessageRow: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  otherMessageRow: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  bubbleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  myBubbleContainer: {
    alignItems: "flex-end",
  },
  otherBubbleContainer: {
    alignItems: "flex-start",
  },
  myBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  messageImage: {
    width: 190,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#E9ECEF",
  },
  myMessageText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },
  otherMessageText: {
    color: "#333",
    fontSize: 15,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 10,
    color: "#ADB5BD",
    marginTop: 4,
  },
  myTimeText: {
    marginRight: 4,
  },
  otherTimeText: {
    marginLeft: 4,
  },
  emojiPickerSheet: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F3F5",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    maxHeight: 340,
  },
  emojiPickerSheetWide: {
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
  },
  emojiTopTabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  emojiTopTab: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiTopTabActive: {
    backgroundColor: "#E9F7EC",
  },
  emojiTopTabText: {
    fontSize: 18,
  },
  emojiSearchBox: {
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#18A34A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  emojiSearchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  emojiSearchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  emojiScrollArea: {
    flex: 1,
  },
  emojiScrollContent: {
    paddingBottom: 8,
  },
  emojiSection: {
    marginBottom: 12,
  },
  emojiSectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#666",
    marginBottom: 8,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emojiButton: {
    width: "16.66%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  emojiText: {
    fontSize: 26,
  },
  emojiBottomTabs: {
    marginTop: 8,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#F5F6F7",
    borderRadius: 18,
    overflow: "hidden",
  },
  emojiBottomTab: {
    minWidth: 78,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiBottomTabActiveText: {
    fontSize: 22,
  },
  emojiBottomTabText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#555",
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 20 : 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F3F5",
  },
  inputInner: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  inputInnerWide: {
    maxWidth: 980,
    alignSelf: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3F5",
    borderRadius: 25,
    paddingHorizontal: 12,
    marginRight: 10,
    minHeight: 44,
  },
  inputWrapperCompact: {
    paddingHorizontal: 8,
  },
  inputIcon: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImageHeader: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
  },
  fullImageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  fullImage: {
    width: "100%",
    height: "75%",
  },
});

export default IndividualChatScreen;
