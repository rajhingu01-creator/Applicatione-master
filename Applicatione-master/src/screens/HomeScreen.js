import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
  Animated,
  useWindowDimensions,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, BASE_URL } from "../utils/api";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  Heart,
  MessageCircle,
  Plus,
  MoreHorizontal,
  MapPin,
  CheckCircle,
  Send,
  Bookmark,
  Zap,
  TrendingUp,
  Filter,
  PlayCircle,
  Users,
  X,
  RefreshCw,
  UserPlus,
  Smile,
  Type,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import CustomBottomNav from "../components/CustomBottomNav";
import { bottomNavSpace } from "../utils/responsive";

const STORY_EMOJIS = [
  "😀", "😂", "🥹", "❤️", "🔥", "✨", "💯", "🎯", "🌟", "🌈",
  "�", "💜", "💙", "💚", "💛", "🧡", "💕", "💞", "💓", "💗",
  "🎉", "🎊", "🎁", "🎈", "🎂", "🍰", "🍕", "🍔", "🍟", "🌭",
  "🍿", "🍩", "🍪", "🍫", "🍬", "🍭", "🍮", "🍯", "☕", "🍵",
  "🍶", "🍷", "🍸", "🍹", "🍺", "🍻", "�", "🥃", "🍾", "🧊",
  "🏖️", "🏝️", "⛱️", "🏜️", "🌋", "🏔️", "�", "🏕️", "⛺", "🏡",
  "🌳", "🌲", "🌴", "🌵", "🌷", "🌸", "🌹", "🌺", "🌻", "🌼",
  "🌽", "🍎", "🍏", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐",
  "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦",
  "🌶️", "🫑", "🥒", "🥬", "🥔", "🥕", "🌽", "🥜", "🫘", "🌰",
  "�", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
  "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔",
  "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦚", "🦜",
  "�", "⚽", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
  "🏓", "🏸", "🥊", "🥋", "🥅", "🎿", "�", "🥌", "⛸️", "🎯",
  "🎮", "🕹️", "🎲", "♟️", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼",
  "🎹", "🎸", "🎷", "🎺", "�", "🎻", "🪗", "🎤", "🎰", "🚀",
  "✈️", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒",
  "🚐", "🚚", "🚛", "🚜", "🛵", "🏍️", "🛺", "🚲", "🛴", "🛹",
  "🎢", "🎡", "🎠", "🏗️", "🏘️", "🏚️", "🏛️", "🏜️", "🏝️", "🏞️",
  "🌄", "🌅", "🌆", "🌇", "🌉", "🌊", "🌋", "🏔️", "⛰️", "🌲",
  "🌳", "🌴", "🌵", "🌾", "🌿", "🍀", "🍁", "🍂", "🍃", "🌾",
  "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌪️",
  "🌫️", "🌬️", "🌀", "🌈", "🌂", "☂️", "☔", "🌊", "💧", "💦",
  "☃️", "⛄", "🌨️", "🌩️", "🌪️", "🌫️", "🌬️", "🌀", "🌈", "🌂",
  "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️",
  "💽", "💾", "💿", "📀", "🧮", "🎥", "📷", "📸", "📹", "📼",
  "🔋", "🔌", "💡", "🔦", "�", "📔", "📕", "📖", "📗", "📘",
  "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "�",
  "🔖", "🏷️", "💰", "�", "💴", "💵", "💶", "💷", "💸", "💳",
  "🧾", "💹", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "�",
  "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️", "�️",
  "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️",
  "📍", "📌", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️",
  "🔒", "🔓", "🔏", "🔐", "🔑", "🔗", "📎", "🖇️", "📏", "📐",
];

const storyFilters = [
  { name: "PrismGlow", color: "rgba(125, 88, 255, 0.14)" },
  { name: "Velvet Skin", color: "rgba(255, 187, 166, 0.16)" },
  { name: "Neon Shadow", color: "rgba(73, 31, 255, 0.18)" },
  { name: "Golden Dust", color: "rgba(255, 188, 55, 0.18)" },
  { name: "Crystal Air", color: "rgba(134, 218, 255, 0.12)" },
  { name: "Dream Bloom", color: "rgba(255, 213, 244, 0.17)" },
  { name: "Aura Tone", color: "rgba(88, 255, 175, 0.12)" },
  { name: "Pearl Matte", color: "rgba(242, 235, 224, 0.18)" },
  { name: "Midnight Glow", color: "rgba(16, 28, 82, 0.2)" },
  { name: "Color Echo", color: "rgba(255, 78, 112, 0.13)" },
  { name: "Dog Face", color: "rgba(255, 190, 122, 0.08)", faceOverlay: "dog" },
  { name: "Geo Snap", color: "rgba(0, 0, 0, 0.04)", geoOverlay: true },
  { name: "Geo Snap", color: "rgba(0, 0, 0, 0.04)", geoOverlay: true },
  { name: "Geo Snap", color: "rgba(0, 0, 0, 0.04)", geoOverlay: true },
  { name: "Real Time", color: "rgba(0, 0, 0, 0.03)", timeOverlay: true },
];

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 30, 430);
  const mediaHeight = Math.min(cardWidth * 1.08, 470);
  const [activeTab, setActiveTab] = useState("For you");
  const [userAvatar, setUserAvatar] = useState(
    "https://i.pravatar.cc/150?u=sam",
  );
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isStoryCameraOpen, setIsStoryCameraOpen] = useState(false);
  const [isStoryOptionsOpen, setIsStoryOptionsOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("back");
  const [storyMode, setStoryMode] = useState("image");
  const [selectedStoryFilter, setSelectedStoryFilter] = useState(
    storyFilters[0],
  );
  const [storyDraftAsset, setStoryDraftAsset] = useState(null);
  const [isStoryComposerOpen, setIsStoryComposerOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [storyEmoji, setStoryEmoji] = useState("");
  const [isStoryEmojiPickerOpen, setIsStoryEmojiPickerOpen] = useState(false);
  const [geoSnapLocation, setGeoSnapLocation] = useState("Finding location...");
  const [realTimeNow, setRealTimeNow] = useState(new Date());
  const cameraRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const storyProgress = useRef(new Animated.Value(0)).current;
  const storyTimerRef = useRef(null);
  const [isViewersModalOpen, setIsViewersModalOpen] = useState(false);
  const [storyViewers, setStoryViewers] = useState([]);
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [activePostForComments, setActivePostForComments] = useState(null);
  const [isStoryScheduled, setIsStoryScheduled] = useState(false);
  const [storyScheduledTime, setStoryScheduledTime] = useState(new Date());
  const [selectedStoryAssets, setSelectedStoryAssets] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    fetchUserData();
    fetchPosts();
    fetchStories();
    fetchSuggestedUsers();

    // Refresh avatar and posts when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUserData();
      fetchPosts();
      fetchStories();
      fetchSuggestedUsers();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!isStoryCameraOpen || !selectedStoryFilter.timeOverlay) {
      return undefined;
    }

    setRealTimeNow(new Date());
    const timer = setInterval(() => setRealTimeNow(new Date()), 1000);

    return () => clearInterval(timer);
  }, [isStoryCameraOpen, selectedStoryFilter]);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data.user.profilePicture) {
        let avatarUrl = data.data.user.profilePicture;
        if (!avatarUrl.includes("cloudinary")) {
          avatarUrl = avatarUrl.replace("localhost", "192.168.1.3");
          if (!avatarUrl.startsWith("http")) {
            avatarUrl = `${BASE_URL}${avatarUrl}`;
          }
        }
        setUserAvatar(avatarUrl);
      }
    } catch (error) {
      console.error("Error fetching user data for home:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/profile/posts/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("HomeScreen posts data:", data);
      if (data.success && data.data && data.data.posts) {
        setPosts(data.data.posts);
        console.log("HomeScreen posts set:", data.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const resolveMediaUrl = (url) => {
    if (!url) {
      return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const fetchStories = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/profile/stories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setStories(
          (data.data?.stories || []).map((story) => ({
            ...story,
            storyMediaUrl: resolveMediaUrl(story.storyMediaUrl),
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/profile/suggested`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setSuggestedUsers(data.data?.users || []);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  };

  const handleFollowSuggestedUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/profile/follow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        await fetchSuggestedUsers();
      }
    } catch (error) {
      console.error("Error following suggested user:", error);
    }
  };

  const handleMessageSuggestedUser = async (user) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/messages/start-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();

      if (data.success) {
        const conversation = data.data?.conversation;
        navigation.navigate("IndividualChat", {
          chatId: conversation?.id,
          userName: conversation?.title || user.name,
          userImage: conversation?.avatar || user.image,
          userRole: `@${user.username}`,
        });
      }
    } catch (error) {
      console.error("Error opening suggested user chat:", error);
    }
  };

  const loadGeoSnapLocation = async () => {
    try {
      setGeoSnapLocation("Finding location...");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setGeoSnapLocation("Location permission denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const places = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      const place = places[0];
      const exactPlaceName =
        place?.name ||
        [place?.streetNumber, place?.street].filter(Boolean).join(" ") ||
        place?.formattedAddress;
      const nearbyArea = [
        place?.district || place?.subregion || place?.city,
        place?.region,
      ]
        .filter(Boolean)
        .join(", ");

      setGeoSnapLocation(exactPlaceName || nearbyArea || "Current location");
    } catch (error) {
      console.error("Error fetching Geo Snap location:", error);
      setGeoSnapLocation("Current location unavailable");
    }
  };

  const selectStoryFilter = (filter) => {
    setSelectedStoryFilter(filter);

    if (filter.geoOverlay) {
      loadGeoSnapLocation();
    }
  };

  const openStoryOptions = () => {
    setIsStoryOptionsOpen(true);
  };

  const openStoryCamera = async (mode = "image") => {
    const cameraPermission = await requestPermission();
    if (!cameraPermission.granted) {
      Alert.alert("Permission Denied", "Camera permission allow karo.");
      return;
    }

    if (mode === "video") {
      const micPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!micPermission.granted) {
        Alert.alert("Permission Denied", "Camera permission allow karo.");
        return;
      }
    }

    setStoryMode(mode);
    setIsStoryOptionsOpen(false);
    setIsStoryCameraOpen(true);
  };

  const getStoryOverlayPayload = () => {
    if (selectedStoryFilter.geoOverlay) {
      return {
        overlayType: "geo",
        overlayText: geoSnapLocation,
      };
    }

    if (selectedStoryFilter.timeOverlay) {
      return {
        overlayType: "time",
        overlayText: realTimeNow.toLocaleString(),
      };
    }

    if (selectedStoryFilter.faceOverlay === "dog") {
      return {
        overlayType: "dog",
        overlayText: "Dog Face",
      };
    }

    return {
      overlayType: "",
      overlayText: "",
    };
  };

  const openStoryComposer = (asset) => {
    setStoryDraftAsset(asset);
    setStoryText("");
    setStoryEmoji("");
    setIsStoryEmojiPickerOpen(false);
    setIsStoryComposerOpen(true);
    setIsStoryCameraOpen(false);
    setIsStoryOptionsOpen(false);
  };

  const closeStoryComposer = () => {
    setIsStoryComposerOpen(false);
    setStoryDraftAsset(null);
    setStoryText("");
    setStoryEmoji("");
    setIsStoryEmojiPickerOpen(false);
    setIsUploadingStory(false);
    setIsStoryScheduled(false);
    setStoryScheduledTime(new Date());
    setSelectedStoryAssets([]);
    setCurrentStoryIndex(0);
  };

  const handleShareStory = async () => {
    if (selectedStoryAssets.length === 0 || isUploadingStory) {
      return;
    }

    // Save the current state before clearing
    const assetsToUpload = [...selectedStoryAssets];
    const textToUpload = storyText;
    const emojiToUpload = storyEmoji;
    const filterToUpload = selectedStoryFilter;
    const scheduleState = isStoryScheduled;
    const scheduleTime = storyScheduledTime;

    setIsUploadingStory(true);
    setIsStoryComposerOpen(false);
    setStoryDraftAsset(null);
    setStoryText("");
    setStoryEmoji("");
    setIsStoryEmojiPickerOpen(false);
    setIsStoryScheduled(false);
    setStoryScheduledTime(new Date());
    setSelectedStoryAssets([]);
    setCurrentStoryIndex(0);

    // Upload all selected stories
    for (const asset of assetsToUpload) {
      await uploadStoryAsset(
        asset,
        textToUpload,
        emojiToUpload,
        filterToUpload,
        scheduleState,
        scheduleTime,
        false // Flag to not set isUploadingStory to false until all are done
      );
    }
    // All done!
    setIsUploadingStory(false);
  };

  const uploadStoryAsset = async (
    asset,
    storyTextValue = storyText,
    storyEmojiValue = storyEmoji,
    storyFilterValue = selectedStoryFilter,
    isScheduled = false,
    scheduledAt = null,
    shouldUpdateLoading = true,
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token || !asset?.uri) {
        return;
      }

      const uri = asset.uri;
      const normalizedUri =
        Platform.OS === "android" && !uri.startsWith("file://")
          ? `file://${uri}`
          : uri;
      const filename =
        asset.fileName ||
        normalizedUri.split("/").pop() ||
        `story-${Date.now()}`;
      const match = /\.(\w+)$/.exec(filename);
      const fallbackType = asset.type === "video" ? "video/mp4" : "image/jpeg";
      const type =
        asset.mimeType ||
        (match ? `${asset.type || "image"}/${match[1]}` : fallbackType);
      const overlaySourceFilter = storyFilterValue || selectedStoryFilter;
      const overlayType = overlaySourceFilter?.geoOverlay
        ? "geo"
        : overlaySourceFilter?.timeOverlay
          ? "time"
          : overlaySourceFilter?.faceOverlay === "dog"
            ? "dog"
            : "";
      const overlayText = overlaySourceFilter?.geoOverlay
        ? geoSnapLocation
        : overlaySourceFilter?.timeOverlay
          ? realTimeNow.toLocaleString()
          : overlaySourceFilter?.faceOverlay === "dog"
            ? "Dog Face"
            : "";
      const finalOverlayText = [storyTextValue.trim(), storyEmojiValue]
        .filter(Boolean)
        .join(" ")
        .trim();

      const formData = new FormData();
      const filePayload =
        Platform.OS === "web" && asset.file
          ? asset.file
          : { uri: normalizedUri, name: filename, type };

      formData.append("storyMedia", filePayload);
      formData.append("filterName", storyFilterValue?.name || "");
      formData.append("overlayType", overlayType);
      formData.append("overlayText", finalOverlayText || overlayText);
      formData.append("isScheduled", isScheduled.toString());
      if (isScheduled && scheduledAt) {
        formData.append("scheduledAt", scheduledAt.toISOString());
      }

      setIsUploadingStory(true);
      console.log("[story-upload] POST", `${API_URL}/profile/stories`);
      const response = await fetch(`${API_URL}/profile/stories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();

      console.log("[story-upload] response", {
        ok: response.ok,
        status: response.status,
        data,
      });

      if (!response.ok) {
        Alert.alert("Error", data.message || "Story upload failed");
        return;
      }

      if (data.success) {
        const createdStory = data.data?.story;
        if (createdStory) {
          setStories((currentStories) => [
            {
              id: createdStory._id,
              userId: createdStory.user,
              name: "You",
              username: "you",
              image: userAvatar,
              storyMediaUrl: resolveMediaUrl(
                createdStory.mediaUrl || createdStory.image,
              ),
              storyMediaType: createdStory.mediaType || asset.type || "image",
              filterName:
                createdStory.filterName || storyFilterValue?.name || "",
              overlayType: createdStory.overlayType || overlayType,
              overlayText:
                createdStory.overlayText || finalOverlayText || overlayText,
              createdAt: createdStory.createdAt || new Date().toISOString(),
              isOwnStory: true,
              isViewed: true,
            },
            ...currentStories,
          ]);
        } else {
          await fetchStories();
        }

        Alert.alert(
          "Success",
          "Story upload thai gayi ane have top ma dekhashe.",
        );
      } else {
        Alert.alert("Error", data.message || "Story upload failed");
      }
    } catch (error) {
      console.error("Create story error:", error);
      Alert.alert(
        "Error",
        `Story upload ma problem avi: ${error?.message || "unknown error"}`,
      );
    } finally {
      if (shouldUpdateLoading) {
        setIsUploadingStory(false);
      }
    }
  };

  const handleCreateStory = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Gallery permission allow karo.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
        base64: false,
        exif: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      setSelectedStoryAssets(result.assets);
      setStoryDraftAsset(result.assets[0]);
      setStoryText("");
      setStoryEmoji("");
      setIsStoryEmojiPickerOpen(false);
      setIsStoryComposerOpen(true);
      setIsStoryCameraOpen(false);
      setIsStoryOptionsOpen(false);
    } catch (error) {
      console.error("Pick story media error:", error);
      Alert.alert("Error", "Gallery open karva ma problem avi.");
    }
  };

  const handleCaptureStoryPhoto = async () => {
    try {
      if (!cameraRef.current) {
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (!photo?.uri) {
        return;
      }

      openStoryComposer({
        uri: photo.uri,
        type: "image",
        mimeType: "image/jpeg",
        fileName: `story-photo-${Date.now()}.jpg`,
      });
    } catch (error) {
      console.error("Capture story photo error:", error);
      Alert.alert("Error", "Photo capture ma problem avi.");
    }
  };

  const handleLaunchStoryVideoPicker = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Gallery permission allow karo.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: false,
        base64: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      openStoryComposer({
        ...result.assets[0],
        type: "video",
      });
    } catch (error) {
      console.error("Pick story video error:", error);
      Alert.alert("Error", "Video select karva ma problem avi.");
    }
  };

  const handleOpenStory = async (story) => {
    setActiveStory(story);
    setIsStoryViewerOpen(true);
    startStoryTimer();

    setStories((currentStories) =>
      currentStories.map((currentStory) =>
        currentStory.id === story.id
          ? { ...currentStory, isViewed: true }
          : currentStory,
      ),
    );

    if (story?.isOwnStory) {
      fetchStoryViewers();
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token && story?.id && !story?.isOwnStory) {
        const response = await fetch(
          `${API_URL}/profile/stories/${story.id}/view`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          console.warn(
            "Story view sync failed:",
            data?.message || response.status,
          );
        }
      }
    } catch (error) {
      console.error("Mark story viewed error:", error);
    }
  };

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false);
    setActiveStory(null);
    if (storyTimerRef.current) {
      clearTimeout(storyTimerRef.current);
    }
    storyProgress.setValue(0);
  };

  const startStoryTimer = () => {
    storyProgress.setValue(0);
    Animated.timing(storyProgress, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: false,
    }).start();
    storyTimerRef.current = setTimeout(() => {
      closeStoryViewer();
    }, 30000);
  };

  const fetchStoryViewers = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token || !activeStory?.id) return;
      const response = await fetch(
        `${API_URL}/profile/stories/${activeStory.id}/viewers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setStoryViewers(data.data.viewers);
      }
    } catch (error) {
      console.error("Error fetching story viewers:", error);
    }
  };

  const deleteStory = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token || !activeStory?.id) return;
      const response = await fetch(
        `${API_URL}/profile/stories/${activeStory.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setStories((current) =>
          current.filter((s) => s.id !== activeStory.id),
        );
        closeStoryViewer();
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const moodTabs = [
    { name: "For you", icon: Zap },
    { name: "Following", icon: Users },
    { name: "Trending", icon: TrendingUp },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <View style={styles.headerTopRow}>
        <View>
          {/* <Text style={styles.welcomeText}>Good Morning,</Text> */}
          <Text style={styles.logoText}>Changis</Text>
        </View>
        <View style={styles.headerIcons}>
          {/* <TouchableOpacity style={styles.headerIconBtn}><Search size={22} color="#111" /></TouchableOpacity> */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate("ChatList")}
          >
            <MessageCircle size={22} color="#111" />
            <View style={[styles.notifBadge, { backgroundColor: "#FF3B30" }]}>
              <Text style={styles.notifText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={{ uri: userAvatar }}
              style={styles.headerProfileImg}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderStories = () => {
    const ownStories = stories.filter((story) => story.isOwnStory);
    const otherStories = stories.filter((story) => !story.isOwnStory);

    return (
      <View style={styles.storiesSection}>
        <View style={styles.storiesTitleRow}>
          <Text style={styles.storiesTitle}>Stories</Text>
          <Text style={styles.storiesHint}>New moments</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        >
          {/* Always show Add Story button */}
          <TouchableOpacity
            style={styles.addStoryItem}
            activeOpacity={0.8}
            onPress={openStoryOptions}
          >
            <View style={styles.addStoryCircle}>
              <Image
                source={{ uri: userAvatar }}
                style={styles.addStoryAvatar}
              />
              <View style={styles.plusBadge}>
                <Plus size={12} color="white" />
              </View>
            </View>
            <Text style={styles.storyNameText}>Add</Text>
          </TouchableOpacity>

          {/* Render all own stories */}
          {ownStories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyItem}
              onPress={() => handleOpenStory(story)}
            >
              <LinearGradient
                colors={
                  story.isViewed
                    ? ["#D9D9D9", "#BEBEBE"]
                    : ["#FF8C00", "#8A2BE2", "#008000"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.storyRing}
              >
                <View style={styles.storyAvatarInner}>
                  <Image
                    source={{ uri: story.image }}
                    style={styles.storyAvatar}
                  />
                </View>
              </LinearGradient>
              <Text style={styles.storyNameText}>You</Text>
            </TouchableOpacity>
          ))}

          {/* Render other people's stories */}
          {otherStories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyItem}
              onPress={() => handleOpenStory(story)}
            >
              <LinearGradient
                colors={
                  story.isViewed
                    ? ["#D9D9D9", "#BEBEBE"]
                    : ["#FF8C00", "#8A2BE2", "#008000"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.storyRing}
              >
                <View style={styles.storyAvatarInner}>
                  <Image
                    source={{ uri: story.image }}
                    style={styles.storyAvatar}
                  />
                </View>
              </LinearGradient>
              <Text style={styles.storyNameText}>{story.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMoodTabs = () => (
    <View style={styles.moodTabsWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodTabsContent}
      >
        {moodTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
              style={[styles.moodTab, isActive && styles.moodTabActive]}
            >
              {isActive ? (
                <LinearGradient
                  colors={["#FF8C00", "#008000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.moodTabGradient}
                >
                  <Icon size={14} color="white" />
                  <Text style={[styles.moodTabText, styles.moodTabTextActive]}>
                    {tab.name}
                  </Text>
                </LinearGradient>
              ) : (
                <>
                  <Icon size={14} color="#666" />
                  <Text style={styles.moodTabText}>{tab.name}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderSuggestedUsers = () => (
    <View style={styles.suggestedSection}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Suggested for you</Text>
          <Text style={styles.sectionSubtitle}>
            Discover new people and start conversations
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.seeAllBtn}
          onPress={() => navigation.navigate("UserSearch")}
        >
          <Text style={styles.seeAllText}>Find People</Text>
        </TouchableOpacity>
      </View>
      {suggestedUsers.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestedList}
        >
          {suggestedUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              activeOpacity={0.9}
              style={styles.suggestedCard}
              onPress={() =>
                navigation.navigate("UserProfile", { userId: user.id, user })
              }
            >
              <Image
                source={{ uri: user.image }}
                style={styles.suggestedAvatar}
              />
              <Text style={styles.suggestedName} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.suggestedUsername} numberOfLines={1}>
                @{user.username}
              </Text>
              <Text style={styles.suggestedBio} numberOfLines={2}>
                {user.isNew ? "New on Changis" : user.bio}
              </Text>
              <View style={styles.suggestedActions}>
                <TouchableOpacity
                  style={styles.suggestedFollowBtn}
                  onPress={() => handleFollowSuggestedUser(user.id)}
                >
                  <LinearGradient
                    colors={
                      user.isFollowing
                        ? ["#F1F3F5", "#F1F3F5"]
                        : ["#FF8C00", "#008000"]
                    }
                    style={styles.suggestedFollowGradient}
                  >
                    {user.isFollowing ? (
                      <Text style={styles.suggestedFollowingText}>
                        Following
                      </Text>
                    ) : (
                      <View style={styles.suggestedFollowContent}>
                        <UserPlus size={14} color="#fff" />
                        <Text style={styles.suggestedFollowText}>Follow</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.suggestedMessageBtn}
                  onPress={() => handleMessageSuggestedUser(user)}
                >
                  <Send size={15} color="#111" />
                  <Text style={styles.suggestedMessageText}>SMS</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.suggestedEmptyCard}>
          <Text style={styles.suggestedEmptyTitle}>No suggestions yet</Text>
          <Text style={styles.suggestedEmptySubtitle}>
            As soon as more people join, suggested accounts will appear here.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.suggestedDiscoverBtn}
            onPress={() => navigation.navigate("UserSearch")}
          >
            <LinearGradient
              colors={["#FF8C00", "#008000"]}
              style={styles.suggestedDiscoverGradient}
            >
              <Text style={styles.suggestedDiscoverText}>Find People</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleTogglePostLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/profile/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post._id === postId ? data.data.post : post,
          ),
        );
      }
    } catch (error) {
      console.error("Toggle post like error:", error);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentDrafts[postId]?.trim();
    if (!commentText) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${API_URL}/profile/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post._id === postId ? data.data.post : post,
          ),
        );
        setCommentDrafts((currentDrafts) => ({
          ...currentDrafts,
          [postId]: "",
        }));
      }
    } catch (error) {
      console.error("Add post comment error:", error);
    }
  };

  const handleSharePost = async (post) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await fetch(`${API_URL}/profile/posts/${post._id}/share`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert(
        "Send Post",
        `You can now send ${post.user.username}'s post in chat.`,
      );
    } catch (error) {
      console.error("Share post error:", error);
    }
  };

  const renderPost = (post) => {
    // Format user avatar URL same as profile image
    let userAvatarUrl =
      post.user.profilePicture ||
      "https://i.pravatar.cc/150?u=" + post.user._id;
    if (userAvatarUrl && !userAvatarUrl.includes("cloudinary")) {
      userAvatarUrl = userAvatarUrl.replace("localhost", "192.168.1.3");
      if (userAvatarUrl && !userAvatarUrl.startsWith("http")) {
        userAvatarUrl = `${BASE_URL}${userAvatarUrl}`;
      }
    }

    return (
      <View key={post._id} style={[styles.postCard, { width: cardWidth }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postAuthorGroup}>
            <LinearGradient
              colors={["#FF8C00", "#8A2BE2", "#008000"]}
              style={styles.headerAvatarRing}
            >
              <View style={styles.headerAvatarInner}>
                <Image
                  source={{ uri: userAvatarUrl }}
                  style={styles.postAuthorAvatar}
                />
              </View>
            </LinearGradient>
            <View style={styles.postAuthorTextGroup}>
              <View style={styles.authorNameRow}>
                <Text style={styles.postAuthorName}>{post.user.name}</Text>
                <CheckCircle size={12} color="#1D9BF0" fill="#1D9BF0" />
              </View>
              {post.location && (
                <View style={styles.locationRow}>
                  <MapPin size={11} color="#777" />
                  <Text style={styles.postLocationText}>{post.location}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionBtn}>
              <Bookmark size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreBtn}>
              <MoreHorizontal size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Media */}
        <View style={[styles.postImageWrapper, { height: mediaHeight }]}>
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.42)"]}
            style={styles.mediaShade}
          />
          <View style={styles.mediaTopPill}>
            <Text style={styles.mediaTopPillText}>Photo</Text>
          </View>
          <View style={styles.mediaBottomMeta}>
            <Text style={styles.mediaTime}>
              {new Date(post.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        {/* Post Actions */}
        <View style={styles.postFooter}>
          <View style={styles.postActionsMain}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleTogglePostLike(post._id)}
            >
              <LinearGradient
                colors={["rgba(255,140,0,0.16)", "rgba(0,128,0,0.12)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionShell}
              >
                <View style={styles.actionInner}>
                  <Heart
                    size={18}
                    color={post.isLiked ? "#FF3B30" : "#111"}
                    fill={post.isLiked ? "#FF3B30" : "transparent"}
                  />
                  <Text style={styles.actionText}>{post.likes.length}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85}>
              <LinearGradient
                colors={["rgba(0,128,0,0.12)", "rgba(255,140,0,0.12)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionShell}
              >
                <View style={styles.actionInner}>
                  <MessageCircle size={18} color="#111" />
                  <Text style={styles.actionText}>{post.comments.length}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSharePost(post)}
            >
              <LinearGradient
                colors={["#FF8C00", "#008000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendActionShell}
              >
                <Send size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.postContentSection}>
          {post.likes.length > 0 && (
            <View style={styles.likedByRow}>
              <View style={styles.miniAvatars}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?u=1" }}
                  style={styles.miniAvatar}
                />
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?u=2" }}
                  style={[styles.miniAvatar, { marginLeft: -8 }]}
                />
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?u=3" }}
                  style={[styles.miniAvatar, { marginLeft: -8 }]}
                />
              </View>
              <Text style={styles.likedByText}>
                Loved by{" "}
                <Text style={styles.boldText}>
                  {post.likes.length > 0 ? "someone" : "..."}
                </Text>{" "}
                and{" "}
                <Text style={styles.boldText}>{post.likes.length} others</Text>
              </Text>
            </View>
          )}

          {post.caption && (
            <Text style={styles.postCaptionText} numberOfLines={2}>
              <Text style={styles.postAuthorNameSmall}>
                {post.user.username}{" "}
              </Text>
              {post.caption}
            </Text>
          )}

          {post.hashtags && (
            <Text style={styles.hashtagsText}>{post.hashtags}</Text>
          )}

          {post.comments.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setActivePostForComments(post);
                setIsCommentsModalOpen(true);
              }}
            >
              <Text style={styles.viewCommentsText}>
                View all {post.comments.length} comments
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.commentComposer}>
            <TextInput
              value={commentDrafts[post._id] || ""}
              onChangeText={(value) =>
                setCommentDrafts((currentDrafts) => ({
                  ...currentDrafts,
                  [post._id]: value,
                }))
              }
              placeholder="Add a comment..."
              placeholderTextColor="#999"
              style={styles.commentInput}
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleAddComment(post._id)}
            >
              <Text style={styles.commentPostText}>Post</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.postTimeTextSmall}>
            {new Date(post.createdAt).toLocaleDateString().toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  if (isStoryCameraOpen) {
    if (!permission) {
      return <View style={styles.container} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <StatusBar style="light" />
          <Text style={styles.permissionText}>Camera permission required</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeCameraButton}
            onPress={() => setIsStoryCameraOpen(false)}
          >
            <X size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <StatusBar style="light" />
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraFacing}
          mode="picture"
        >
          <View
            pointerEvents="none"
            style={[
              styles.storyFilterOverlay,
              { backgroundColor: selectedStoryFilter.color },
            ]}
          />
          <View style={styles.cameraTopControls}>
            <TouchableOpacity
              style={styles.cameraIconButton}
              onPress={() => setIsStoryCameraOpen(false)}
            >
              <X size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraIconButton}
              onPress={() =>
                setCameraFacing((current) =>
                  current === "back" ? "front" : "back",
                )
              }
            >
              <RefreshCw size={27} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {selectedStoryFilter.timeOverlay ? (
            <View pointerEvents="none" style={styles.realTimeOverlay}>
              <Text style={styles.realTimeClock}>
                {realTimeNow.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Text>
              <Text style={styles.realTimeDate}>
                {realTimeNow.toLocaleDateString([], {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          ) : null}
          {selectedStoryFilter.geoOverlay ? (
            <View pointerEvents="none" style={styles.geoSnapOverlay}>
              <View style={styles.geoSnapPill}>
                <MapPin size={18} color="#FFFFFF" />
                <View>
                  <Text style={styles.geoSnapTitle}>{geoSnapLocation}</Text>
                  <Text style={styles.geoSnapSubtitle}>Captured here</Text>
                </View>
              </View>
            </View>
          ) : null}
          {selectedStoryFilter.faceOverlay === "dog" ? (
            <View pointerEvents="none" style={styles.dogFaceOverlay}>
              <View style={styles.dogEarsRow}>
                <View style={[styles.dogEar, styles.dogEarLeft]} />
                <View style={[styles.dogEar, styles.dogEarRight]} />
              </View>
              <View style={styles.dogNoseWrap}>
                <View style={styles.dogNose} />
                <View style={styles.dogMouthLine} />
                <View style={styles.dogMouthRow}>
                  <View style={styles.dogMouthCurve} />
                  <View style={styles.dogMouthCurve} />
                </View>
              </View>
            </View>
          ) : null}
          <View style={styles.storyFilterBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storyFilterContent}
            >
              {storyFilters.map((filter) => {
                const active = filter.name === selectedStoryFilter.name;

                return (
                  <TouchableOpacity
                    key={filter.name}
                    activeOpacity={0.8}
                    style={[
                      styles.storyFilterChip,
                      active && styles.storyFilterChipActive,
                    ]}
                    onPress={() => selectStoryFilter(filter)}
                  >
                    <View
                      style={[
                        styles.storyFilterDot,
                        {
                          backgroundColor:
                            filter.color === "transparent"
                              ? "#FFFFFF"
                              : filter.color,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.storyFilterText,
                        active && styles.storyFilterTextActive,
                      ]}
                    >
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.storyCameraBottom}>
            <View style={styles.storyQuickActionsRow}>
              <TouchableOpacity
                style={styles.storySecondaryAction}
                onPress={handleCreateStory}
                disabled={isUploadingStory}
              >
                <Text style={styles.storySecondaryActionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.storyCaptureButton}
                onPress={handleCaptureStoryPhoto}
                disabled={isUploadingStory}
              >
                <View style={styles.storyCaptureInner} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.storySecondaryAction}
                onPress={handleLaunchStoryVideoPicker}
                disabled={isUploadingStory}
              >
                <Text style={styles.storySecondaryActionText}>Video</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.storyCameraHint}>
              {isUploadingStory
                ? "Uploading..."
                : "Center button thi photo, side thi gallery/video"}
            </Text>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Modal
        visible={isStoryViewerOpen}
        animationType="fade"
        onRequestClose={closeStoryViewer}
      >
        <View style={styles.storyViewerScreen}>
          <StatusBar style="light" />
          {activeStory?.storyMediaType === "video" ? (
            <View style={styles.storyViewerVideoPlaceholder}>
              <PlayCircle size={74} color="#FFFFFF" />
              <Text style={styles.storyViewerVideoTitle}>Story video</Text>
              <Text style={styles.storyViewerVideoSubtitle}>
                Video viewer next ma autoplay sathe add kari sakiye
              </Text>
            </View>
          ) : activeStory?.storyMediaUrl ? (
            <Image
              source={{ uri: activeStory.storyMediaUrl }}
              style={styles.storyViewerMedia}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.storyViewerFallback} />
          )}

          <LinearGradient
            colors={["rgba(0,0,0,0.38)", "rgba(0,0,0,0.05)", "rgba(0,0,0,0.5)"]}
            locations={[0, 0.45, 1]}
            style={styles.storyViewerShade}
          />

          <View style={styles.storyViewerTopBar}>
            <View style={styles.storyViewerUserRow}>
              <Image
                source={{ uri: activeStory?.image || userAvatar }}
                style={styles.storyViewerAvatar}
              />
              <View>
                <Text style={styles.storyViewerName}>
                  {activeStory?.isOwnStory ? "Your story" : activeStory?.name}
                </Text>
                <Text style={styles.storyViewerTime}>
                  {activeStory?.createdAt
                    ? new Date(activeStory.createdAt).toLocaleString()
                    : "Just now"}
                </Text>
              </View>
            </View>
            <View style={styles.storyViewerTopRight}>
              {activeStory?.isOwnStory ? (
                <TouchableOpacity
                  style={styles.storyViewerIconButton}
                  onPress={() => setIsDeleteMenuOpen(true)}
                >
                  <MoreHorizontal size={22} color="#FFFFFF" />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.storyViewerCloseButton}
                onPress={closeStoryViewer}
              >
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.storyViewerProgressTrack}>
            <Animated.View
              style={[
                styles.storyViewerProgressFill,
                {
                  width: storyProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          {activeStory?.overlayText ? (
            <View style={styles.storyViewerTextBubble}>
              <Text style={styles.storyViewerText}>
                {activeStory.overlayText}
              </Text>
            </View>
          ) : null}

          {activeStory?.isOwnStory ? (
            <View style={styles.storyViewerBottomBar}>
              <TouchableOpacity
                style={styles.storyViewersButton}
                onPress={() => setIsViewersModalOpen(true)}
              >
                <Users size={20} color="#FFFFFF" />
                <Text style={styles.storyViewersButtonText}>
                  {storyViewers.length} views
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Viewers Modal */}
        <Modal
          visible={isViewersModalOpen}
          animationType="slide"
          onRequestClose={() => setIsViewersModalOpen(false)}
        >
          <View style={styles.viewersModalScreen}>
            <StatusBar style="dark" />
            <View style={styles.viewersModalHeader}>
              <TouchableOpacity
                style={styles.viewersModalCloseBtn}
                onPress={() => setIsViewersModalOpen(false)}
              >
                <X size={24} color="#111111" />
              </TouchableOpacity>
              <Text style={styles.viewersModalTitle}>Views</Text>
              <View style={{ width: 40 }} />
            </View>
            <FlatList
              data={storyViewers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.viewersListContainer}
              renderItem={({ item }) => (
                <View style={styles.viewerItem}>
                  <Image
                    source={{
                      uri: item.image || "https://i.pravatar.cc/100",
                    }}
                    style={styles.viewerAvatar}
                  />
                  <View>
                    <Text style={styles.viewerName}>{item.name}</Text>
                    <Text style={styles.viewerUsername}>@{item.username}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.viewersEmptyState}>
                  <Text style={styles.viewersEmptyText}>
                    No viewers yet
                  </Text>
                </View>
              )}
            />
          </View>
        </Modal>

        {/* Delete Menu Modal */}
        <Modal
          visible={isDeleteMenuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDeleteMenuOpen(false)}
        >
          <TouchableOpacity
            style={styles.deleteMenuBackdrop}
            activeOpacity={1}
            onPress={() => setIsDeleteMenuOpen(false)}
          >
            <View style={styles.deleteMenuSheet}>
              <TouchableOpacity
                style={styles.deleteMenuButton}
                onPress={() => {
                  setIsDeleteMenuOpen(false);
                  deleteStory();
                }}
              >
                <Text style={styles.deleteMenuText}>Delete story</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteMenuCancel}
                onPress={() => setIsDeleteMenuOpen(false)}
              >
                <Text style={styles.deleteMenuCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Comments Modal */}
        <Modal
          visible={isCommentsModalOpen}
          animationType="slide"
          onRequestClose={() => setIsCommentsModalOpen(false)}
        >
          <View style={styles.commentsModalScreen}>
            <StatusBar style="dark" />
            <View style={styles.commentsModalHeader}>
              <TouchableOpacity
                style={styles.commentsModalCloseBtn}
                onPress={() => setIsCommentsModalOpen(false)}
              >
                <X size={24} color="#111111" />
              </TouchableOpacity>
              <Text style={styles.commentsModalTitle}>Comments</Text>
              <View style={{ width: 40 }} />
            </View>
            <FlatList
              data={activePostForComments?.comments || []}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.commentsListContainer}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Image
                    source={{
                      uri: item.user?.profilePicture || "https://i.pravatar.cc/100",
                    }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>
                      {item.user?.username || "user"}
                    </Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.commentTime}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "Just now"}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.commentsEmptyState}>
                  <Text style={styles.commentsEmptyText}>No comments yet</Text>
                </View>
              )}
            />
          </View>
        </Modal>
      </Modal>

      <Modal
        visible={isStoryComposerOpen}
        animationType="slide"
        onRequestClose={closeStoryComposer}
      >
        <View style={styles.storyComposerScreen}>
          <StatusBar style="light" />
          <View style={styles.storyComposerTopBar}>
            <TouchableOpacity
              style={styles.storyComposerIconBtn}
              onPress={closeStoryComposer}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.storyComposerActionGroup}>
              <TouchableOpacity
                style={styles.storyComposerIconBtn}
                onPress={() => setIsStoryEmojiPickerOpen((value) => !value)}
              >
                <Smile size={21} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.storyComposerCanvas}>
            {storyDraftAsset?.type === "video" ? (
              <View style={styles.storyComposerVideoPlaceholder}>
                <PlayCircle size={60} color="#FFFFFF" />
                <Text style={styles.storyComposerVideoText}>
                  Video selected
                </Text>
                <Text style={styles.storyComposerVideoSubtext}>
                  Text ane emoji sathe aa video story upload thase
                </Text>
              </View>
            ) : storyDraftAsset?.uri ? (
              <Image
                source={{ uri: storyDraftAsset.uri }}
                style={styles.storyComposerImage}
                resizeMode="cover"
              />
            ) : null}

            <LinearGradient
              colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.45)"]}
              style={styles.storyComposerShade}
            />

            {storyText || storyEmoji ? (
              <View style={styles.storyTextPreviewBubble}>
                <Text style={styles.storyTextPreviewText}>
                  {[storyText.trim(), storyEmoji].filter(Boolean).join(" ")}
                </Text>
              </View>
            ) : null}
          </View>

          {selectedStoryAssets.length > 1 && (
            <View style={styles.storyThumbnailsRow}>
              {selectedStoryAssets.map((asset, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.storyThumbnail,
                    currentStoryIndex === index && styles.storyThumbnailActive,
                  ]}
                  onPress={() => {
                    setCurrentStoryIndex(index);
                    setStoryDraftAsset(asset);
                  }}
                >
                  <Image
                    source={{ uri: asset.uri }}
                    style={styles.storyThumbnailImage}
                    resizeMode="cover"
                  />
                  {currentStoryIndex === index && (
                    <View style={styles.storyThumbnailActiveIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.storyComposerBottomSheet}>
            <View style={styles.storyComposerLabelRow}>
              <Type size={16} color="#111111" />
              <Text style={styles.storyComposerLabel}>Add text</Text>
            </View>
            <TextInput
              value={storyText}
              onChangeText={setStoryText}
              placeholder="Write something for your story..."
              placeholderTextColor="#8C8C8C"
              style={styles.storyComposerInput}
              multiline
              maxLength={120}
            />

            <View style={styles.storyComposerLabelRow}>
              <Smile size={16} color="#111111" />
              <Text style={styles.storyComposerLabel}>Emoji</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storyEmojiRow}
            >
              {STORY_EMOJIS.map((emoji) => {
                const active = storyEmoji === emoji;
                return (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.storyEmojiChip,
                      active && styles.storyEmojiChipActive,
                    ]}
                    onPress={() => setStoryEmoji(active ? "" : emoji)}
                  >
                    <Text style={styles.storyEmojiChipText}>{emoji}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {isStoryEmojiPickerOpen ? (
              <View style={styles.storyEmojiPickerPanel}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.storyEmojiRow}
                >
                  {STORY_EMOJIS.map((emoji) => (
                    <TouchableOpacity
                      key={`panel-${emoji}`}
                      style={styles.storyEmojiPickerItem}
                      onPress={() =>
                        setStoryText((current) => `${current}${emoji}`)
                      }
                    >
                      <Text style={styles.storyEmojiPickerItemText}>
                        {emoji}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.storyScheduleRow}>
              <Text style={styles.storyComposerLabel}>Post Type</Text>
              <View style={styles.storyTypeRow}>
                <TouchableOpacity
                  style={[styles.storyTypeBtn, !isStoryScheduled && styles.storyTypeBtnActive]}
                  onPress={() => setIsStoryScheduled(false)}
                >
                  <Text style={[styles.storyTypeText, !isStoryScheduled && styles.storyTypeTextActive]}>
                    Instant Story
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.storyTypeBtn, isStoryScheduled && styles.storyTypeBtnActive]}
                  onPress={() => setIsStoryScheduled(true)}
                >
                  <Text style={[styles.storyTypeText, isStoryScheduled && styles.storyTypeTextActive]}>
                    Schedule Story
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {isStoryScheduled && (
              <View style={styles.storyScheduleSection}>
                <View style={styles.storyScheduleItemRow}>
                  <Text style={styles.storyScheduleItemLabel}>Date</Text>
                  <TouchableOpacity style={styles.storyScheduleInputBox}>
                    <Text style={styles.storyScheduleInputText}>
                      {storyScheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.storyScheduleItemRow}>
                  <Text style={styles.storyScheduleItemLabel}>Time</Text>
                  <View style={styles.storyScheduleTimeBox}>
                    {/* Hour Controls */}
                    <View style={styles.storyTimeControlContainer}>
                      <TouchableOpacity
                        style={styles.storyTimeControlBtn}
                        onPress={() => {
                          const newDate = new Date(storyScheduledTime);
                          newDate.setHours((newDate.getHours() - 1 + 24) % 24);
                          setStoryScheduledTime(newDate);
                        }}
                      >
                        <Text style={styles.storyTimeControlBtnText}>▲</Text>
                      </TouchableOpacity>
                      <Text style={styles.storyTimeControlValue}>
                        {String(storyScheduledTime.getHours()).padStart(2, '0')}
                      </Text>
                      <TouchableOpacity
                        style={styles.storyTimeControlBtn}
                        onPress={() => {
                          const newDate = new Date(storyScheduledTime);
                          newDate.setHours((newDate.getHours() + 1) % 24);
                          setStoryScheduledTime(newDate);
                        }}
                      >
                        <Text style={styles.storyTimeControlBtnText}>▼</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.storyTimeSeparator}>:</Text>

                    {/* Minute Controls */}
                    <View style={styles.storyTimeControlContainer}>
                      <TouchableOpacity
                        style={styles.storyTimeControlBtn}
                        onPress={() => {
                          const newDate = new Date(storyScheduledTime);
                          newDate.setMinutes((newDate.getMinutes() - 1 + 60) % 60);
                          setStoryScheduledTime(newDate);
                        }}
                      >
                        <Text style={styles.storyTimeControlBtnText}>▲</Text>
                      </TouchableOpacity>
                      <Text style={styles.storyTimeControlValue}>
                        {String(storyScheduledTime.getMinutes()).padStart(2, '0')}
                      </Text>
                      <TouchableOpacity
                        style={styles.storyTimeControlBtn}
                        onPress={() => {
                          const newDate = new Date(storyScheduledTime);
                          newDate.setMinutes((newDate.getMinutes() + 1) % 60);
                          setStoryScheduledTime(newDate);
                        }}
                      >
                        <Text style={styles.storyTimeControlBtnText}>▼</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.storyShareButton}
              onPress={handleShareStory}
              disabled={isUploadingStory || !storyDraftAsset}
            >
              <LinearGradient
                colors={["#FF8C00", "#008000"]}
                style={styles.storyShareButtonGradient}
              >
                <Text style={styles.storyShareButtonText}>
                  {isUploadingStory ? "Uploading..." : (isStoryScheduled ? "Schedule Story" : "Share Story")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isStoryOptionsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsStoryOptionsOpen(false)}
      >
        <View style={styles.storyOptionBackdrop}>
          <View style={styles.storyOptionSheet}>
            <Text style={styles.storyOptionTitle}>Add to your story</Text>
            <TouchableOpacity
              style={styles.storyOptionButton}
              onPress={() => openStoryCamera("image")}
            >
              <Text style={styles.storyOptionButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyOptionButton}
              onPress={handleCreateStory}
            >
              <Text style={styles.storyOptionButtonText}>
                Choose Photo / Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storyOptionCancelButton}
              onPress={() => setIsStoryOptionsOpen(false)}
            >
              <Text style={styles.storyOptionCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => renderPost(item)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Plus size={32} color="#008000" />
              </View>
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptySubtitle}>
                Follow people or create your first post to see updates here.
              </Text>
              <TouchableOpacity
                style={styles.createPostBtn}
                onPress={() =>
                  navigation.navigate("Profile", { openCreatePost: true })
                }
              >
                <LinearGradient
                  colors={["#FF8C00", "#008000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createPostGradient}
                >
                  <Text style={styles.createPostBtnText}>Create Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              {renderStories()}
              {renderSuggestedUsers()}
              {renderMoodTabs()}
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Fresh Feed</Text>
                  <Text style={styles.sectionSubtitle}>
                    Curated posts from creators
                  </Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                  <Filter size={18} color="#0095f6" />
                  <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          ListFooterComponent={<View style={{ height: bottomNavSpace }} />}
          removeClippedSubviews={Platform.OS === "android"}
          maxToRenderPerBatch={5}
          windowSize={10}
          initialNumToRender={3}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
        />
      </SafeAreaView>
      <CustomBottomNav navigation={navigation} activeRoute="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  storyViewerScreen: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  storyViewerMedia: {
    width: "100%",
    height: "100%",
  },
  storyViewerFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1B1B1B",
  },
  storyViewerVideoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1B1B1B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  storyViewerVideoTitle: {
    marginTop: 18,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  storyViewerVideoSubtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    textAlign: "center",
  },
  storyViewerShade: {
    ...StyleSheet.absoluteFillObject,
  },
  storyViewerTopBar: {
    position: "absolute",
    top: Platform.OS === "android" ? 22 : 54,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storyViewerUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  storyViewerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
  },
  storyViewerName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  storyViewerTime: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    marginTop: 2,
  },
  storyViewerCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  storyViewerProgressTrack: {
    position: "absolute",
    top: Platform.OS === "android" ? 12 : 44,
    left: 16,
    right: 16,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  storyViewerProgressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  storyViewerTextBubble: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 110,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  storyViewerText: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  storyComposerScreen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  storyComposerTopBar: {
    position: "absolute",
    top: Platform.OS === "android" ? 18 : 52,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storyComposerActionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  storyComposerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  storyComposerCanvas: {
    flex: 1,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },
  storyComposerImage: {
    width: "100%",
    height: "100%",
  },
  storyComposerVideoPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 24,
  },
  storyComposerVideoText: {
    marginTop: 18,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  storyComposerVideoSubtext: {
    marginTop: 8,
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
  },
  storyComposerShade: {
    ...StyleSheet.absoluteFillObject,
  },
  storyTextPreviewBubble: {
    position: "absolute",
    top: "28%",
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  storyTextPreviewText: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "800",
    textAlign: "center",
  },
  storyComposerBottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    gap: 12,
  },
  storyComposerLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  storyComposerLabel: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  storyComposerInput: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#111111",
    fontSize: 15,
    textAlignVertical: "top",
  },
  storyEmojiRow: {
    gap: 10,
    paddingVertical: 2,
  },
  storyEmojiChip: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  storyEmojiChipActive: {
    backgroundColor: "#FFE4C7",
    borderWidth: 1,
    borderColor: "#FF8C00",
  },
  storyEmojiChipText: {
    fontSize: 22,
  },
  storyEmojiPickerPanel: {
    borderRadius: 18,
    backgroundColor: "#F8F8F8",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  storyEmojiPickerItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
  },
  storyEmojiPickerItemText: {
    fontSize: 22,
  },
  storyScheduleRow: {
    marginBottom: 12,
  },
  storyTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  storyTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  storyTypeBtnActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#008000',
  },
  storyTypeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  storyTypeTextActive: {
    color: '#008000',
  },
  storyScheduleSection: {
    marginBottom: 12,
    gap: 12,
  },
  storyScheduleItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyScheduleItemLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  storyScheduleInputBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  storyScheduleTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  storyTimeControlContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  storyTimeControlBtn: {
    backgroundColor: '#008000',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
  },
  storyTimeControlBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  storyTimeControlValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },
  storyTimeSeparator: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
  },
  storyThumbnailsRow: {
    position: "absolute",
    bottom: 340,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  storyThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  storyThumbnailActive: {
    borderColor: "#008000",
  },
  storyThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  storyThumbnailActiveIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,128,0,0.15)",
  },
  storyShareButton: {
    marginTop: 4,
  },
  storyComposerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  storyShareButtonGradient: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  storyShareButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraTopControls: {
    paddingTop: Platform.OS === "android" ? 48 : 18,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  cameraIconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  storyFilterOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  geoSnapOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 205,
  },
  geoSnapPill: {
    minWidth: 220,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.26)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  geoSnapTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
    textAlign: "center",
  },
  geoSnapSubtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  dogFaceOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  dogEarsRow: {
    width: 210,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 58,
  },
  dogEar: {
    width: 62,
    height: 92,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    backgroundColor: "rgba(108, 63, 32, 0.82)",
    borderWidth: 4,
    borderColor: "rgba(255, 222, 188, 0.9)",
  },
  dogEarLeft: {
    transform: [{ rotate: "-24deg" }],
  },
  dogEarRight: {
    transform: [{ rotate: "24deg" }],
  },
  dogNoseWrap: {
    position: "absolute",
    top: "49%",
    alignItems: "center",
  },
  dogNose: {
    width: 42,
    height: 30,
    borderRadius: 22,
    backgroundColor: "rgba(22, 17, 15, 0.9)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
  },
  dogMouthLine: {
    width: 3,
    height: 22,
    backgroundColor: "rgba(22, 17, 15, 0.9)",
  },
  dogMouthRow: {
    flexDirection: "row",
    marginTop: -2,
  },
  dogMouthCurve: {
    width: 25,
    height: 16,
    borderBottomWidth: 3,
    borderColor: "rgba(22, 17, 15, 0.9)",
    borderRadius: 18,
  },
  storyFilterBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 128,
    zIndex: 3,
  },
  storyFilterContent: {
    paddingHorizontal: 18,
    gap: 10,
  },
  storyFilterChip: {
    minWidth: 105,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 7,
  },
  storyFilterChipActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  storyFilterDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  storyFilterText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "900",
  },
  storyFilterTextActive: {
    color: "#111111",
  },
  storyCameraBottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 42,
    zIndex: 2,
  },
  storyQuickActionsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  storySecondaryAction: {
    minWidth: 84,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  storySecondaryActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  storyCameraHint: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  storyCaptureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  storyCaptureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
  },
  storyOptionBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 20,
  },
  storyOptionSheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  storyOptionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 4,
  },
  storyOptionButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
  },
  storyOptionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },
  storyOptionCancelButton: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#111111",
    alignItems: "center",
    marginTop: 4,
  },
  storyOptionCancelText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 18,
  },
  permissionButton: {
    borderRadius: 12,
    backgroundColor: "#008000",
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  closeCameraButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 48 : 18,
    left: 22,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  storyViewerTopRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  storyViewerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  storyViewerBottomBar: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 40 : 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  storyViewersButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  storyViewersButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  viewersModalScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  viewersModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 20 : 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  viewersModalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  viewersModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
  },
  viewersListContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  viewerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  viewerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  viewerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },
  viewerUsername: {
    fontSize: 13,
    color: "#6B7280",
  },
  viewersEmptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  viewersEmptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  deleteMenuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 20,
  },
  deleteMenuSheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  deleteMenuButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
  },
  deleteMenuText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
  },
  deleteMenuCancel: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
  },
  deleteMenuCancelText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  commentsModalScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  commentsModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 20 : 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  commentsModalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  commentsModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
  },
  commentsListContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  commentItem: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 12,
  },
  commentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    marginTop: 2,
  },
  commentTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  commentsEmptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  commentsEmptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F8F5",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    zIndex: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
    paddingTop: Platform.OS === "android" ? 45 : 10,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  welcomeText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logoText: {
    fontSize: 29,
    fontWeight: "900",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.86)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
    backgroundColor: "#fff",
  },
  headerProfileImg: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#008000",
  },
  notifBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  notifText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingTop: 0,
  },
  storiesSection: {
    paddingTop: 16,
    paddingBottom: 10,
  },
  storiesTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  storiesTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },
  storiesHint: {
    fontSize: 12,
    fontWeight: "700",
    color: "#008000",
  },
  storiesContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  addStoryItem: {
    alignItems: "center",
    marginRight: 14,
  },
  addStoryCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    padding: 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addStoryAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 19,
  },
  plusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0095f6",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  storyItem: {
    alignItems: "center",
    marginRight: 14,
  },
  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 22,
    padding: 2,
    marginBottom: 7,
  },
  storyAvatarInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 2,
  },
  storyAvatar: {
    flex: 1,
    borderRadius: 18,
  },
  liveBadge: {
    position: "absolute",
    top: 56,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  liveBadgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "900",
  },
  storyNameText: {
    fontSize: 12,
    color: "#262626",
    fontWeight: "700",
  },
  moodTabsWrapper: {
    paddingVertical: 8,
  },
  suggestedSection: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  seeAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F3FBFF",
  },
  seeAllText: {
    color: "#0095f6",
    fontSize: 13,
    fontWeight: "800",
  },
  suggestedList: {
    paddingHorizontal: 15,
    gap: 12,
  },
  suggestedCard: {
    width: 190,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 16,
    alignItems: "center",
  },
  suggestedAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    backgroundColor: "#EDEDED",
  },
  suggestedName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },
  suggestedUsername: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "#008000",
  },
  suggestedBio: {
    marginTop: 8,
    minHeight: 34,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
  },
  suggestedActions: {
    width: "100%",
    marginTop: 14,
    gap: 8,
  },
  suggestedFollowBtn: {
    width: "100%",
  },
  suggestedFollowGradient: {
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestedFollowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  suggestedFollowText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
  suggestedFollowingText: {
    color: "#111",
    fontSize: 14,
    fontWeight: "900",
  },
  suggestedMessageBtn: {
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  suggestedMessageText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "800",
  },
  suggestedEmptyCard: {
    marginHorizontal: 15,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 20,
    alignItems: "center",
  },
  suggestedEmptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },
  suggestedEmptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    fontWeight: "700",
  },
  suggestedDiscoverBtn: {
    marginTop: 16,
    width: 160,
  },
  suggestedDiscoverGradient: {
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestedDiscoverText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
  moodTabsContent: {
    paddingHorizontal: 15,
    gap: 8,
  },
  moodTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  moodTabActive: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  moodTabGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 6,
  },
  moodTabText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#262626",
  },
  moodTabTextActive: {
    color: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
    fontWeight: "600",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF7F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0095f6",
  },
  postCard: {
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: 24,
    borderRadius: 35,
    paddingTop: 6,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.03)",
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  postAuthorGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  postImageWrapper: {
    marginHorizontal: 14,
    borderRadius: 28,
    backgroundColor: "#fafafa",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  headerAvatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    padding: 1.5,
  },
  headerAvatarInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 1,
  },
  postAuthorAvatar: {
    flex: 1,
    borderRadius: 19,
  },
  postAuthorTextGroup: {
    minWidth: 0,
    flexShrink: 1,
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#262626",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  postLocationText: {
    fontSize: 11,
    color: "#777",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerActionBtn: {
    padding: 4,
  },
  moreBtn: {
    padding: 4,
  },
  postImageWrapper: {
    marginHorizontal: 12,
    borderRadius: 22,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  mediaShade: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaTopPill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  mediaTopPillText: {
    fontSize: 11,
    color: "#111",
    fontWeight: "900",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  postImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mediaBottomMeta: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  mediaCaptionPreview: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  mediaTime: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    opacity: 0.9,
  },
  hashtagsText: {
    fontSize: 13,
    color: "#00376b",
    fontWeight: "600",
    marginBottom: 6,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  postActionsMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  actionShell: {
    minHeight: 36,
    borderRadius: 20,
    padding: 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionInner: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 19,
    paddingHorizontal: 12,
    gap: 5,
  },
  sendActionShell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#008000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    color: "#111",
    fontWeight: "900",
  },
  postContentSection: {
    paddingHorizontal: 14,
  },
  likedByRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  miniAvatars: {
    flexDirection: "row",
    marginRight: 8,
  },
  miniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#fff",
  },
  likedByText: {
    flex: 1,
    fontSize: 13,
    color: "#262626",
  },
  boldText: {
    fontWeight: "700",
  },
  postCaptionText: {
    fontSize: 14,
    color: "#262626",
    lineHeight: 20,
    marginBottom: 7,
  },
  postAuthorNameSmall: {
    fontWeight: "700",
  },
  viewCommentsText: {
    fontSize: 13,
    color: "#8e8e8e",
    marginBottom: 6,
    fontWeight: "600",
  },
  postTimeTextSmall: {
    fontSize: 10,
    color: "#8e8e8e",
    marginBottom: 10,
  },
  commentComposer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    color: "#111",
    fontSize: 13,
    fontWeight: "600",
  },
  commentPostText: {
    color: "#0095f6",
    fontSize: 13,
    fontWeight: "800",
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
  createPostBtn: {
    borderRadius: 16,
    overflow: "hidden",
    minWidth: 160,
  },
  createPostGradient: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  createPostBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default HomeScreen;
