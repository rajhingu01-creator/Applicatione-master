import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Eye,
  Flame,
  MessageSquare,
  Music,
  Play,
  Plus,
  Search,
  Send,
  Sparkles,
  Settings,
  X,
} from "lucide-react-native";
import CustomBottomNav from "../components/CustomBottomNav";
import { bottomNavSpace, clamp } from "../utils/responsive";

const tabs = ["For You", "Fresh", "Trending"];

const reelsData = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    user: "@creative_vibes",
    name: "Alex Rivera",
    title: "Sunset vibes 🌅 #nature #photography",
    audio: "Original Audio - Summer Hits",
    tag: "Trending",
    rank: "#1",
    views: "2.3M",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    user: "@urban_explorer",
    name: "Mia Chen",
    title: "City lights at night ✨ #city #night",
    audio: "Electronic Beat - Midnight Mix",
    tag: "Fresh",
    rank: "#2",
    views: "1.8M",
  },
];

const ReelsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("For You");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatReel, setActiveChatReel] = useState(null);
  const [chatDraft, setChatDraft] = useState("");
  const [miniChatMessages, setMiniChatMessages] = useState({});

  // Adjusted height to ensure it fills the available space correctly
  const pageHeight = height;
  const horizontalPad = clamp(width * 0.045, 14, 20);
  const compact = width < 360;
  const chatPanelHeight = clamp(height * 0.42, 230, 340);

  const reelLayout = useMemo(
    () => ({
      width,
      height: pageHeight,
    }),
    [width, pageHeight],
  );

  const openMiniChat = (reel) => {
    setActiveChatReel(reel);
    setIsChatOpen(true);
    setMiniChatMessages((prev) => {
      if (prev[reel.id]) return prev;

      return {
        ...prev,
        [reel.id]: [
          {
            id: `${reel.id}-welcome`,
            text: `Hey! I'm ${reel.name}. Message me about this reel.`,
            time: "Now",
            sender: "other",
          },
        ],
      };
    });
  };

  const handleMiniMessageSend = () => {
    const trimmedMessage = chatDraft.trim();
    if (!trimmedMessage || !activeChatReel) return;

    const newMessage = {
      id: `${activeChatReel.id}-${Date.now()}`,
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me",
    };

    setMiniChatMessages((prev) => ({
      ...prev,
      [activeChatReel.id]: [...(prev[activeChatReel.id] || []), newMessage],
    }));
    setChatDraft("");
  };

  const openFullChat = () => {
    if (!activeChatReel) return;

    setIsChatOpen(false);
    navigation.navigate("IndividualChat", {
      userName: activeChatReel.name,
      userImage: activeChatReel.avatar,
      initialMessages: activeMiniMessages,
    });
  };

  const activeMiniMessages = activeChatReel
    ? miniChatMessages[activeChatReel.id] || []
    : [];

  const renderReel = ({ item, index }) => (
    <View style={[styles.reelPage, reelLayout]}>
      <Image source={{ uri: item.image }} style={styles.reelImage} />
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.8)"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.reelTopMeta,
          { left: horizontalPad, right: horizontalPad },
        ]}
      >
        <View style={styles.rankPill}>
          <Flame size={13} color="#F5A400" fill="#F5A400" />
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        <View style={styles.viewsPill}>
          <Eye size={14} color="#fff" />
          <Text style={styles.rankText}>{item.views}</Text>
        </View>
      </View>

      <View style={styles.sideButtonsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sideButton}
          onPress={() => openMiniChat(item)}
        >
          <MessageSquare size={22} color="white" />
          <Text style={styles.sideButtonText}>DM</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.sideButton}>
          <Settings size={20} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.playButton}>
        <LinearGradient
          colors={["rgba(245,164,0,0.96)", "rgba(0,128,0,0.86)"]}
          style={styles.playGradient}
        >
          <Play size={32} color="#fff" fill="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <View
        style={[
          styles.creatorPanel,
          { left: horizontalPad, right: horizontalPad },
        ]}
      >
        <View style={styles.creatorRow}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.creatorTextBlock}>
            <Text numberOfLines={1} style={styles.username}>
              {item.user}
            </Text>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.85} style={styles.followButton}>
            <Plus size={13} color="#111" strokeWidth={3} />
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.messageButton}
            onPress={() => openMiniChat(item)}
          >
            <MessageSquare size={13} color="#fff" />
            <Text style={styles.messageButtonText}>
              {compact ? "Msg" : "Message"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          numberOfLines={2}
          style={[styles.title, compact && styles.titleCompact]}
        >
          {item.title}
        </Text>
        <View style={styles.audioRow}>
          <Music size={15} color="#fff" />
          <Text numberOfLines={1} style={styles.audioText}>
            {item.audio}
          </Text>
        </View>
        <View style={styles.chipRow}>
          <View style={styles.tagChip}>
            <Sparkles size={12} color="#17B43A" />
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <View style={styles.tagChip}>
            <Text style={styles.tagText}>
              {index + 1}/{reelsData.length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.mainContent}>
        <View
          style={[styles.topBar, { left: horizontalPad, right: horizontalPad }]}
        >
          <View>
            <Text style={styles.kicker}>VIDEO LAB</Text>
            <Text style={styles.headerTitle}>Reels</Text>
          </View>
          <TouchableOpacity activeOpacity={0.82} style={styles.searchButton}>
            <Search size={21} color="#111" />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.tabsRow,
            { left: horizontalPad, top: Platform.OS === "android" ? 75 : 65 },
          ]}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.86}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, active && styles.tabButtonActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={reelsData}
          renderItem={renderReel}
          keyExtractor={(item) => item.id}
          pagingEnabled={true}
          snapToInterval={pageHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={1}
          windowSize={2}
          initialNumToRender={1}
          getItemLayout={(_, index) => ({
            length: pageHeight,
            offset: pageHeight * index,
            index,
          })}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Play size={32} color="#fff" fill="#fff" />
              </View>
              <Text style={styles.emptyTitle}>No reels found</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to upload a reel and share your moments!
              </Text>
              <TouchableOpacity style={styles.createReelBtn}>
                <LinearGradient
                  colors={["#FF8C00", "#008000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createReelGradient}
                >
                  <Text style={styles.createReelBtnText}>Upload Reel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <CustomBottomNav navigation={navigation} activeRoute="Reels" isDark />

      {/* Floating Mini Direct Message Panel */}
      {isChatOpen && activeChatReel && (
        <View
          style={[
            styles.floatingChatPanel,
            {
              left: horizontalPad,
              right: horizontalPad,
              bottom: bottomNavSpace - 10,
              height: chatPanelHeight,
            },
          ]}
        >
          <View style={styles.chatHeader}>
            <View style={styles.miniChatUser}>
              <Image
                source={{ uri: activeChatReel.avatar }}
                style={styles.miniChatAvatar}
              />
              <View style={styles.miniChatTitleBlock}>
                <Text numberOfLines={1} style={styles.miniChatName}>
                  {activeChatReel.name}
                </Text>
                <Text style={styles.miniChatStatus}>Direct message</Text>
              </View>
            </View>
            <View style={styles.miniChatHeaderActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.openChatButton}
                onPress={openFullChat}
              >
                <Text style={styles.openChatText}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.closeChatButton}
                onPress={() => setIsChatOpen(false)}
              >
                <X size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={activeMiniMessages}
            keyExtractor={(message) => message.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.miniChatList}
            renderItem={({ item: message }) => {
              const isMine = message.sender === "me";
              return (
                <View
                  style={[
                    styles.miniMessageRow,
                    isMine && styles.miniMessageRowMine,
                  ]}
                >
                  {isMine ? (
                    <LinearGradient
                      colors={["#FF8C00", "#008000"]}
                      style={styles.miniMessageBubbleMine}
                    >
                      <Text style={styles.miniMessageTextMine}>
                        {message.text}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.miniMessageBubble}>
                      <Text style={styles.miniMessageText}>{message.text}</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.miniMessageTime,
                      isMine && styles.miniMessageTimeMine,
                    ]}
                  >
                    {message.time}
                  </Text>
                </View>
              );
            }}
          />

          <View style={styles.chatInputContainerSmall}>
            <TextInput
              style={styles.chatInputSmall}
              placeholder={`Message ${activeChatReel.name}`}
              placeholderTextColor="#999"
              value={chatDraft}
              onChangeText={setChatDraft}
              returnKeyType="send"
              onSubmitEditing={handleMiniMessageSend}
            />
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.sendButtonSmall,
                !chatDraft.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleMiniMessageSend}
              disabled={!chatDraft.trim()}
            >
              <LinearGradient
                colors={["#FF8C00", "#008000"]}
                style={styles.sendGradientSmall}
              >
                <Send size={14} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? 15 : 5, // Even higher
    zIndex: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kicker: {
    color: "#18C342",
    fontSize: 8, // Smaller
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22, // Smaller header
    fontWeight: "900",
    lineHeight: 26,
  },
  searchButton: {
    width: 34, // Smaller button
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  tabsRow: {
    position: "absolute",
    zIndex: 5,
    flexDirection: "row",
    gap: 6,
  },
  tabButton: {
    minWidth: 50, // Narrower
    height: 26, // Shorter
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontSize: 10, // Smaller text
    fontWeight: "800",
  },
  tabTextActive: {
    color: "#111",
  },
  reelPage: {
    backgroundColor: "#000",
    overflow: "hidden",
  },
  reelImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  reelTopMeta: {
    position: "absolute",
    top: Platform.OS === "android" ? 115 : 105, // Much higher up
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  viewsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  rankText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  sideButtonsContainer: {
    position: "absolute",
    right: 15,
    top: "40%",
    gap: 12,
    zIndex: 5,
  },
  sideButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  sideButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },
  playButton: {
    position: "absolute",
    top: "45%",
    left: "50%",
    marginLeft: -25,
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  playGradient: {
    flex: 1,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 3,
  },
  creatorPanel: {
    position: "absolute",
    bottom: 110, // Moved lower from 155 to be closer to bottom nav
    zIndex: 3,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // Reduced
  },
  avatar: {
    width: 34, // Smaller
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#fff",
    marginRight: 8,
  },
  creatorTextBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  username: {
    color: "#fff",
    fontSize: 13, // Smaller
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  name: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 10, // Smaller
    fontWeight: "700",
    marginTop: -2,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  followButton: {
    height: 28, // Smaller
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  followText: {
    color: "#111",
    fontSize: 10, // Smaller
    fontWeight: "900",
  },
  messageButton: {
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.52)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 6,
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  title: {
    color: "#fff",
    fontSize: 15, // Smaller height
    lineHeight: 18,
    fontWeight: "800",
    maxWidth: "100%",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  titleCompact: {
    fontSize: 13,
    lineHeight: 16,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4, // Reduced
  },
  audioText: {
    flex: 1,
    color: "#fff",
    fontSize: 11, // Smaller
    fontWeight: "700",
  },
  chipRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6, // Reduced
  },
  tagChip: {
    height: 20, // Smaller height
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 9, // Smaller
    fontWeight: "800",
  },
  emptyContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  createReelBtn: {
    borderRadius: 16,
    overflow: "hidden",
    minWidth: 160,
  },
  createReelGradient: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  createReelBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  chatModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  closeText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "700",
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },
  chatMessages: {
    flex: 1,
    gap: 12,
    marginBottom: 12,
  },
  chatBubble: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  chatContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chatUser: {
    fontSize: 12,
    fontWeight: "900",
    color: "#111",
    marginBottom: 2,
  },
  chatText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
  },
  chatInputContainer: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 16,
  },
  chatInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#f8f9fa",
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#111",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  sendGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingChatPanel: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 18,
    padding: 12,
    zIndex: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  miniChatUser: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  miniChatAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 8,
  },
  miniChatTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  miniChatName: {
    color: "#111",
    fontSize: 14,
    fontWeight: "900",
  },
  miniChatStatus: {
    color: "#17B43A",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 1,
  },
  miniChatHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  openChatButton: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  openChatText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },
  closeChatButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F3F5",
    justifyContent: "center",
    alignItems: "center",
  },
  miniChatList: {
    paddingVertical: 4,
    paddingBottom: 8,
  },
  miniMessageRow: {
    alignSelf: "flex-start",
    maxWidth: "82%",
    marginBottom: 8,
  },
  miniMessageRowMine: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  miniMessageBubble: {
    backgroundColor: "#F1F3F5",
    borderRadius: 14,
    borderTopLeftRadius: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  miniMessageBubbleMine: {
    borderRadius: 14,
    borderTopRightRadius: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  miniMessageText: {
    color: "#222",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  miniMessageTextMine: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  miniMessageTime: {
    color: "#999",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    marginLeft: 4,
  },
  miniMessageTimeMine: {
    marginLeft: 0,
    marginRight: 4,
  },
  chatInputContainerSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F3F5",
  },
  chatInputSmall: {
    flex: 1,
    height: 36,
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    paddingHorizontal: 12,
    fontSize: 12,
    color: "#111",
  },
  sendButtonSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendGradientSmall: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReelsScreen;
