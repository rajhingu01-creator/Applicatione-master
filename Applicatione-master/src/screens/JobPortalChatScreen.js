import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const fallbackMessage = {
  company: "TechNova Solutions",
};

const JobPortalChatScreen = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 18, 430);
  const compact = height < 720 || width < 370;
  const message = route?.params?.message ?? fallbackMessage;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.card,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 2 : 6),
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.74}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#5B5C6D" />
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#172033" />
            </View>
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.companyText}>{message.company}</Text>
            <Text style={styles.activeText}>Active</Text>
          </View>

          <TouchableOpacity activeOpacity={0.74} style={styles.headerIcon}>
            <Ionicons name="call-outline" size={23} color="#5B35ED" />
          </TouchableOpacity>
          <View style={styles.headerDivider} />
          <TouchableOpacity activeOpacity={0.74} style={styles.headerIcon}>
            <Ionicons name="videocam-outline" size={24} color="#5B35ED" />
          </TouchableOpacity>
        </View>

        <View style={styles.chatBody}>
          <View style={styles.incomingBubbleLarge}>
            <Text style={styles.incomingText}>
              Hi Meet, we have reviewed{`\n`}your profile and would like{`\n`}to move forward.
            </Text>
            <Text style={styles.incomingTime}>10:30 AM</Text>
          </View>

          <View style={styles.outgoingBubbleLarge}>
            <Text style={styles.outgoingText}>
              Thank you! I am very{`\n`}interested in this opportunity.
            </Text>
            <Text style={styles.outgoingTime}>10:32 AM ✓</Text>
          </View>

          <View style={styles.incomingBubbleSmall}>
            <Text style={styles.incomingText}>Can we schedule a call{`\n`}tomorrow?</Text>
            <Text style={styles.incomingTime}>10:33 AM</Text>
          </View>

          <View style={styles.outgoingBubbleSmall}>
            <Text style={styles.outgoingText}>Sure, 11 AM works for me.</Text>
            <Text style={styles.outgoingTime}>10:34 AM ✓</Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <TextInput
              editable={false}
              pointerEvents="none"
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#9B9CA8"
            />
            <Ionicons name="attach-outline" size={22} color="#6F7080" />
          </View>
          <TouchableOpacity activeOpacity={0.78} style={styles.linkButton}>
            <Ionicons name="link-outline" size={22} color="#6F7080" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.82} style={styles.sendButton}>
            <Ionicons name="send" size={21} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFE",
    alignItems: "center",
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 17,
    paddingBottom: 18,
    shadowColor: "#B7B8C8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  headerRow: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 30,
    height: 36,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  avatarWrap: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0D3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#23BF5C",
  },
  headerInfo: {
    flex: 1,
  },
  companyText: {
    color: "#1A1B2D",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  activeText: {
    color: "#4EA766",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    marginTop: 1,
  },
  headerIcon: {
    width: 33,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerDivider: {
    width: 1,
    height: 27,
    backgroundColor: "#EFEFF5",
    marginHorizontal: 4,
  },
  chatBody: {
    flex: 1,
    paddingTop: 22,
  },
  incomingBubbleLarge: {
    width: "50%",
    borderRadius: 3,
    backgroundColor: "#F3F2FA",
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 9,
  },
  incomingBubbleSmall: {
    width: "43%",
    borderRadius: 3,
    backgroundColor: "#F3F2FA",
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 9,
    marginTop: 18,
  },
  outgoingBubbleLarge: {
    alignSelf: "flex-end",
    width: "54%",
    borderRadius: 7,
    backgroundColor: "#5B35ED",
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 9,
    marginTop: 15,
  },
  outgoingBubbleSmall: {
    alignSelf: "flex-end",
    width: "54%",
    borderRadius: 7,
    backgroundColor: "#5B35ED",
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 9,
    marginTop: 14,
  },
  incomingText: {
    color: "#303244",
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "800",
  },
  incomingTime: {
    alignSelf: "flex-end",
    color: "#777987",
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "800",
    marginTop: 5,
  },
  outgoingText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "800",
  },
  outgoingTime: {
    alignSelf: "flex-end",
    color: "#D8D2FF",
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "800",
    marginTop: 5,
  },
  inputRow: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputBox: {
    flex: 1,
    height: 43,
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#303244",
    fontSize: 13.5,
    fontWeight: "800",
    padding: 0,
  },
  linkButton: {
    width: 28,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#5B35ED",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default JobPortalChatScreen;
