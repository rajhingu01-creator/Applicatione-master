import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Camera, Image as ImageIcon, Phone, Send, Video } from "lucide-react-native";
import {
  appendMessageToConversation,
  getConversationById,
  upsertConversation,
} from "../utils/chatStorage";

const fallbackAvatar =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop";

const getTime = (dateValue = new Date()) =>
  new Date(dateValue).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const getChatSlug = (name = "candidate") =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "candidate";

const EmployerCandidateChatScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const params = route?.params || {};
  const userName = params.userName || "Meet Vaniya";
  const userImage = params.userImage || fallbackAvatar;
  const userRole = params.userRole || "Candidate";
  const chatId = params.chatId || `candidate-${getChatSlug(userName)}`;
  const initialMessages = Array.isArray(params.initialMessages)
    ? params.initialMessages
    : [];
  const chatWidth = Math.min(width, 430);
  const topInset = Platform.OS === "android" ? RNStatusBar.currentHeight ?? 0 : 0;
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const flatListRef = useRef(null);

  const conversationMeta = {
    id: chatId,
    name: userName,
    image: userImage,
    role: userRole,
  };

  useEffect(() => {
    let isActive = true;

    const loadConversation = async () => {
      try {
        const savedConversation = await getConversationById(chatId);

        if (!isActive) {
          return;
        }

        if (savedConversation?.messages?.length) {
          setMessages(savedConversation.messages);
          return;
        }

        setMessages(initialMessages);
        await upsertConversation({
          ...conversationMeta,
          messages: initialMessages,
          unread: 0,
        });
      } catch {
        if (isActive) {
          setMessages(initialMessages);
        }
      }
    };

    loadConversation();

    return () => {
      isActive = false;
    };
  }, [chatId, userImage, userName, userRole]);

  const persistMessage = (chatMessage) => {
    appendMessageToConversation(
      { ...conversationMeta, messages },
      chatMessage,
    ).catch(() => {});
  };

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const createdAt = new Date().toISOString();
    const nextMessage = {
      id: `${Date.now()}`,
      text: trimmedMessage,
      sender: "me",
      createdAt,
      time: getTime(createdAt),
    };

    setMessages((currentMessages) => [...currentMessages, nextMessage]);
    persistMessage(nextMessage);
    setMessage("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  const renderTextMessage = (item, isMine) => {
    if (isMine) {
      return (
        <LinearGradient
          colors={["#6A50F8", "#3F23D9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.myBubble}
        >
          <Text style={styles.myMessageText}>{item.text}</Text>
        </LinearGradient>
      );
    }

    return (
      <View style={styles.otherBubble}>
        <Text style={styles.otherMessageText}>{item.text}</Text>
      </View>
    );
  };

  const renderFileMessage = (item) => (
    <View style={styles.fileBubble}>
      <View style={styles.pdfIcon}>
        <Text style={styles.pdfText}>PDF</Text>
      </View>
      <View style={styles.fileDetails}>
        <Text numberOfLines={1} style={styles.fileName}>
          {item.fileName || item.text || "project-details.pdf"}
        </Text>
        <Text style={styles.fileSize}>{item.fileSize || "1.2 MB"}</Text>
      </View>
    </View>
  );

  const renderMessage = ({ item }) => {
    const isMine = item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        <View style={isMine ? styles.myMessageBlock : styles.otherMessageBlock}>
          {item.type === "file"
            ? renderFileMessage(item)
            : renderTextMessage(item, isMine)}
          <Text style={[styles.timeText, isMine && styles.myTimeText]}>
            {item.time || getTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
        style={styles.keyboardView}
      >
        <View style={[styles.chatShell, { width: chatWidth }]}>
          <View style={[styles.header, { paddingTop: topInset + 8 }]}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <ArrowLeft size={21} color="#514D67" strokeWidth={2.4} />
              </TouchableOpacity>

              <Image source={{ uri: userImage }} style={styles.avatar} />
              <View style={styles.userTextBlock}>
                <Text numberOfLines={1} style={styles.userName}>
                  {userName}
                </Text>
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity activeOpacity={0.75} style={styles.headerIconButton}>
                <Phone size={19} color="#4C32F0" strokeWidth={2.6} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.75} style={styles.headerIconButton}>
                <Video size={20} color="#4C32F0" strokeWidth={2.6} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />

          <View style={styles.inputArea}>
            <View style={styles.inputBox}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor="#A2A0B7"
                style={styles.input}
                multiline
              />
              <TouchableOpacity activeOpacity={0.72} style={styles.inlineIconButton}>
                <Camera size={19} color="#8F8CA5" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.72} style={styles.attachButton}>
              <ImageIcon size={19} color="#8F8CA5" strokeWidth={2.4} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={sendMessage}>
              <LinearGradient
                colors={["#6A50F8", "#3F23D9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButton}
              >
                <Send size={20} color="#FFFFFF" strokeWidth={2.7} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F7F8FF",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  chatShell: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 13,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F8",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 28,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: "#17162A",
    fontSize: 15,
    fontWeight: "800",
  },
  onlineText: {
    color: "#2CB875",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 8,
  },
  headerIconButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messageListContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },
  messageRow: {
    width: "100%",
    marginBottom: 17,
  },
  myMessageRow: {
    alignItems: "flex-end",
  },
  otherMessageRow: {
    alignItems: "flex-start",
  },
  myMessageBlock: {
    maxWidth: "74%",
    alignItems: "flex-end",
  },
  otherMessageBlock: {
    maxWidth: "72%",
    alignItems: "flex-start",
  },
  myBubble: {
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 11,
    minWidth: 206,
  },
  otherBubble: {
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#F3F3FA",
  },
  myMessageText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  otherMessageText: {
    color: "#29273B",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  fileBubble: {
    minWidth: 196,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 7,
    backgroundColor: "#F3F3FA",
  },
  pdfIcon: {
    width: 31,
    height: 37,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#E53935",
  },
  pdfText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },
  fileDetails: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    color: "#242238",
    fontSize: 12,
    fontWeight: "800",
  },
  fileSize: {
    color: "#656276",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },
  timeText: {
    color: "#77758A",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  myTimeText: {
    color: "#FFFFFF",
    marginTop: -20,
    marginRight: 12,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F8",
    backgroundColor: "#FFFFFF",
  },
  inputBox: {
    flex: 1,
    minHeight: 42,
    maxHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 13,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: "#ECECF5",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    color: "#1E1D2E",
    fontSize: 13,
    paddingVertical: 9,
    paddingRight: 7,
    maxHeight: 84,
  },
  inlineIconButton: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  attachButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ECECF5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EmployerCandidateChatScreen;
