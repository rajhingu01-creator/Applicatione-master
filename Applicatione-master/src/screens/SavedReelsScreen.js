import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bookmark,
  Clapperboard,
  Eye,
  Folder,
  Grid,
  Heart,
  Layers,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react-native";
import { SettingsShell } from "../components/SettingsKit";
import { clamp, spacingForWidth } from "../utils/responsive";

const savedReels = [
  {
    id: "1",
    title: "Golden hour edit ideas",
    creator: "@creator.sam",
    views: "12.4k",
    likes: "3.8k",
    collection: "All",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Travel transitions",
    creator: "@wander.lens",
    views: "8.2k",
    likes: "2.1k",
    collection: "All",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
  },
];

const initialCollections = [
  { id: "all", name: "All", count: savedReels.length, icon: Grid },
];

const SavedReelsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { screen, compact } = spacingForWidth(width);
  const [activeCollection, setActiveCollection] = useState("All");
  const [collections, setCollections] = useState(initialCollections);
  const [modalVisible, setModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const gap = compact ? 8 : 10;
  const cardWidth = Math.floor((width - screen * 2 - gap * 2) / 3);
  const cardHeight = clamp(cardWidth * 1.45, 140, 190);

  const filteredReels =
    activeCollection === "All"
      ? savedReels
      : savedReels.filter((item) => item.collection === activeCollection);

  const addCollection = () => {
    const trimmed = collectionName.trim();
    if (!trimmed) return;

    setCollections((current) => [
      ...current,
      {
        id: trimmed.toLowerCase().replace(/\s+/g, "-"),
        name: trimmed,
        count: 0,
        icon: Folder,
      },
    ]);
    setActiveCollection(trimmed);
    setCollectionName("");
    setModalVisible(false);
  };

  return (
    <SettingsShell navigation={navigation} title="Saved Reels">
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color="#81878D" />
          <Text style={styles.searchText}>Search saved reels</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => setModalVisible(true)}
          style={styles.addMiniButton}
        >
          <Plus size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.collectionHeader}>
        <Text style={styles.sectionTitle}>Collections</Text>
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={() => setModalVisible(true)}
          style={styles.createLink}
        >
          <Folder size={18} color="#008000" />
          <Text style={styles.createText}>New Folder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.collectionsWrap}>
        {collections.map((collection) => {
          const Icon = collection.icon;
          const active = activeCollection === collection.name;
          return (
            <TouchableOpacity
              key={collection.id}
              activeOpacity={0.82}
              onPress={() => setActiveCollection(collection.name)}
              style={[
                styles.collectionChip,
                active && styles.collectionChipActive,
              ]}
            >
              <Icon size={16} color={active ? "#fff" : "#008000"} />
              <Text
                style={[
                  styles.collectionName,
                  active && styles.collectionNameActive,
                ]}
              >
                {collection.name}
              </Text>
              <Text
                style={[
                  styles.collectionCount,
                  active && styles.collectionCountActive,
                ]}
              >
                {collection.count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.gridHeader}>
        <Text style={styles.sectionTitle}>Saved Grid</Text>
        <Text style={styles.gridCount}>{filteredReels.length} reels</Text>
      </View>

      <View style={[styles.grid, { gap }]}>
        {filteredReels.length > 0 ? (
          filteredReels.map((reel) => (
            <TouchableOpacity
              key={reel.id}
              activeOpacity={0.86}
              style={[
                styles.reelCard,
                { width: cardWidth, height: cardHeight },
              ]}
            >
              <Image source={{ uri: reel.image }} style={styles.reelImage} />
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.74)"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.savedBadge}>
                <Bookmark size={12} color="#fff" fill="#fff" />
              </View>
              <View style={styles.reelBottom}>
                <Text numberOfLines={1} style={styles.reelTitle}>
                  {reel.title}
                </Text>
                <Text numberOfLines={1} style={styles.reelCreator}>
                  {reel.creator}
                </Text>
                <View style={styles.statsRow}>
                  <Eye size={11} color="#fff" />
                  <Text style={styles.statText}>{reel.views}</Text>
                  <Heart size={11} color="#fff" />
                  <Text style={styles.statText}>{reel.likes}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Bookmark size={32} color="#008000" />
            </View>
            <Text style={styles.emptyTitle}>No saved reels</Text>
            <Text style={styles.emptySubtitle}>
              Reels you save will appear here. Start exploring and save your
              favorites!
            </Text>
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={() => navigation.navigate("Reels")}
            >
              <LinearGradient
                colors={["#F5A400", "#008000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createButton}
              >
                <Text style={styles.createButtonText}>Explore Reels</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Folder size={22} color="#fff" />
              </View>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={20} color="#111" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>Create collection</Text>
            <Text style={styles.modalText}>
              Name a folder so saved reels stay organized by mood, topic or
              campaign.
            </Text>
            <TextInput
              value={collectionName}
              onChangeText={setCollectionName}
              placeholder="Collection name"
              placeholderTextColor="#9AA0A6"
              style={styles.collectionInput}
            />
            <TouchableOpacity activeOpacity={0.84} onPress={addCollection}>
              <LinearGradient
                colors={["#F5A400", "#008000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createButton}
              >
                <Plus size={18} color="#fff" />
                <Text style={styles.createButtonText}>Create Collection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  searchBox: {
    flex: 1,
    height: 52,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF0EA",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  searchText: {
    color: "#81878D",
    fontSize: 13,
    fontWeight: "800",
  },
  addMiniButton: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: "#008000",
    alignItems: "center",
    justifyContent: "center",
  },
  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 9,
  },
  sectionTitle: {
    color: "#777D82",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  createLink: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 11,
    backgroundColor: "#F2FBF3",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  createText: {
    color: "#008000",
    fontSize: 12,
    fontWeight: "900",
  },
  collectionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  collectionChip: {
    minHeight: 38,
    borderRadius: 19,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF0EA",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  collectionChipActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  collectionName: {
    color: "#111",
    fontSize: 13,
    fontWeight: "900",
  },
  collectionNameActive: {
    color: "#fff",
  },
  collectionCount: {
    color: "#008000",
    fontSize: 12,
    fontWeight: "900",
  },
  collectionCountActive: {
    color: "#F5A400",
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 10,
  },
  gridCount: {
    color: "#008000",
    fontSize: 12,
    fontWeight: "900",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  reelCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  reelImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  savedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.48)",
    alignItems: "center",
    justifyContent: "center",
  },
  reelBottom: {
    position: "absolute",
    left: 9,
    right: 9,
    bottom: 9,
  },
  reelTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },
  reelCreator: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  statText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
    marginRight: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    borderRadius: 28,
    backgroundColor: "#fff",
    padding: 18,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#008000",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F7F8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    color: "#111",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 18,
  },
  modalText: {
    color: "#747A80",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
    marginTop: 6,
  },
  collectionInput: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#F7F8F5",
    borderWidth: 1,
    borderColor: "#E7EAE4",
    paddingHorizontal: 14,
    color: "#111",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 18,
  },
  createButton: {
    height: 54,
    borderRadius: 20,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    width: "100%",
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F2FBF3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#747A80",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
    marginBottom: 24,
  },
});

export default SavedReelsScreen;
