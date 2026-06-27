import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Briefcase, Clock, Shield, Star, Users } from "lucide-react-native";

const planDetails = [
  { label: "Active Jobs", value: "12 / 25", Icon: Briefcase },
  { label: "AI Matches", value: "245 / month", Icon: Shield },
  { label: "Team Members", value: "8 / 10", Icon: Users },
  { label: "Storage", value: "12 GB / 50 GB", Icon: Briefcase },
  { label: "Support", value: "Priority Support", Icon: Clock },
];

const EmployerSubscriptionBillingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const [autoRenewal, setAutoRenewal] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 12, paddingBottom: 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Subscription & Billing</Text>
            <View style={styles.headerSpacer} />
          </View>

          <LinearGradient
            colors={["#5135F7", "#8E27E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planCard}
          >
            <View style={styles.planTopRow}>
              <View>
                <Text style={styles.currentPlanLabel}>Current Plan</Text>
                <Text style={styles.planName}>Pro Plan</Text>
                <Text style={styles.planDate}>Valid till 28 May 2026</Text>
              </View>
              <View style={styles.starCircle}>
                <Star size={27} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2.4} />
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.86} style={styles.upgradeButton}>
              <Text style={styles.upgradeText}>Upgrade Plan</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Plan Details</Text>
            <Text style={styles.linkText}>See all</Text>
          </View>

          <View style={styles.detailList}>
            {planDetails.map(({ label, value, Icon }) => (
              <View key={label} style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Icon size={17} color="#8A90A6" strokeWidth={2.2} />
                  <Text style={styles.detailLabel}>{label}</Text>
                </View>
                <Text numberOfLines={1} style={styles.detailValue}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.separator} />

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentRow}>
            <View style={styles.visaBox}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
              <Text style={styles.expiryText}>Expiry 12/26</Text>
            </View>
            <TouchableOpacity activeOpacity={0.75}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Billing History</Text>
            <Text style={styles.linkText}>View All</Text>
          </View>

          <View style={styles.billingRow}>
            <View style={styles.billingInfo}>
              <Text style={styles.billingTitle}>Pro Plan - Annual</Text>
              <Text style={styles.billingDate}>28 Apr 2025</Text>
            </View>
            <View style={styles.billingRight}>
              <Text style={styles.billingAmount}>$ 299.00</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
          </View>

          <View style={styles.autoRenewRow}>
            <View style={styles.autoRenewCopy}>
              <Text style={styles.autoRenewTitle}>Auto Renewal</Text>
              <Text style={styles.autoRenewText}>
                Your subscription will auto-renew
              </Text>
            </View>
            <Switch
              value={autoRenewal}
              onValueChange={setAutoRenewal}
              trackColor={{ false: "#E5E7F1", true: "#B6A7FF" }}
              thumbColor={autoRenewal ? "#5B35F5" : "#FFFFFF"}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 22,
    shadowColor: "#8E86A8",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  headerRow: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F1FA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#20243A",
    fontSize: 17,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 30,
  },
  planCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 26,
    shadowColor: "#5B35F5",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  planTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  currentPlanLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11.5,
    fontWeight: "800",
    marginBottom: 7,
  },
  planName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 7,
  },
  planDate: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 11.5,
    fontWeight: "800",
  },
  starCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFC44D",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeButton: {
    height: 45,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeText: {
    color: "#4F4D63",
    fontSize: 13.5,
    fontWeight: "900",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#20243A",
    fontSize: 13.2,
    fontWeight: "900",
  },
  linkText: {
    color: "#8A47FF",
    fontSize: 10.8,
    fontWeight: "900",
  },
  detailList: {
    gap: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    paddingRight: 12,
  },
  detailLabel: {
    color: "#5F657D",
    fontSize: 12.5,
    fontWeight: "900",
    marginLeft: 13,
  },
  detailValue: {
    color: "#3C4058",
    fontSize: 12.2,
    fontWeight: "900",
  },
  separator: {
    height: 1,
    backgroundColor: "#ECEEF6",
    marginVertical: 18,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  visaBox: {
    width: 50,
    height: 34,
    borderRadius: 7,
    backgroundColor: "#FFF8EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  visaText: {
    color: "#1B63D9",
    fontSize: 13,
    fontWeight: "900",
    fontStyle: "italic",
  },
  paymentInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardNumber: {
    color: "#252A3F",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 3,
  },
  expiryText: {
    color: "#7C8297",
    fontSize: 10.8,
    fontWeight: "800",
  },
  changeText: {
    color: "#5B35F5",
    fontSize: 12,
    fontWeight: "900",
  },
  billingRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  billingInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  billingTitle: {
    color: "#252A3F",
    fontSize: 12.6,
    fontWeight: "900",
    marginBottom: 8,
  },
  billingDate: {
    color: "#7C8297",
    fontSize: 11,
    fontWeight: "800",
  },
  billingRight: {
    alignItems: "flex-end",
  },
  billingAmount: {
    color: "#252A3F",
    fontSize: 12.4,
    fontWeight: "900",
    marginBottom: 8,
  },
  paidBadge: {
    minWidth: 42,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E6FAEF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  paidText: {
    color: "#20AA66",
    fontSize: 10.5,
    fontWeight: "900",
  },
  autoRenewRow: {
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEEF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 12,
    shadowColor: "#7E789A",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  autoRenewCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  autoRenewTitle: {
    color: "#252A3F",
    fontSize: 12.8,
    fontWeight: "900",
    marginBottom: 5,
  },
  autoRenewText: {
    color: "#7C8297",
    fontSize: 10.7,
    fontWeight: "800",
  },
});

export default EmployerSubscriptionBillingScreen;
