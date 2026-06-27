import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Briefcase,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react-native";

const activeAliases = {
  Dashboard: "Dashboard",
  Home: "Dashboard",
  EmployerDashboard: "Dashboard",
  Jobs: "Jobs",
  EmployerJobs: "Jobs",
  Candidates: "Candidates",
  EmployerCandidates: "Candidates",
  Talent: "Candidates",
  Messages: "Messages",
  ChatList: "Messages",
  EmployerCandidateChat: "Messages",
  Settings: "More",
  EmployerSettings: "More",
  More: "More",
};

const tabs = [
  {
    key: "Dashboard",
    label: "Dashboard",
    Icon: Home,
    route: "EmployerDashboard",
  },
  { key: "Jobs", label: "Jobs", Icon: Briefcase, route: "EmployerJobs" },
  {
    key: "Candidates",
    label: "Candidates",
    Icon: Users,
    route: "EmployerCandidates",
  },
  {
    key: "Messages",
    label: "Messages",
    Icon: MessageSquare,
    route: "ChatList",
  },
  { key: "More", label: "More", Icon: Settings, route: "EmployerSettings" },
];

const EmployerBottomNav = ({
  navigation,
  activeRoute = "Home",
  inline = false,
}) => {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const activeKey = activeAliases[activeRoute] || activeRoute;
  const iconSize = isCompact ? 24 : 28;

  const navigateTo = ({ key, route }) => {
    if (!route || activeKey === key) {
      return;
    }

    navigation.navigate(route);
  };

  const renderTab = (tab) => {
    const { key, label, Icon } = tab;
    const active = activeKey === key;

    return (
      <TouchableOpacity
        key={key}
        activeOpacity={0.78}
        style={styles.tabItem}
        onPress={() => navigateTo(tab)}
      >
        <Icon
          size={iconSize}
          color={active ? "#5732E7" : "#686C7C"}
          strokeWidth={active ? 2.85 : 2.5}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            isCompact && styles.tabLabelCompact,
            active && styles.tabLabelActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={inline ? styles.inlineWrapper : styles.wrapper}
    >
      <View style={inline ? styles.inlineBar : styles.bar}>
        {tabs.map(renderTab)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 92,
    zIndex: 50,
    elevation: 50,
  },
  inlineWrapper: {
    width: "100%",
    height: 92,
    marginTop: 18,
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 92,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 17,
    paddingBottom: 16,
    shadowColor: "#5B6078",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -5 },
    elevation: 14,
  },
  inlineBar: {
    height: 92,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 17,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  tabLabel: {
    color: "#686C7C",
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: "900",
    letterSpacing: -0.15,
  },
  tabLabelCompact: {
    fontSize: 9.4,
  },
  tabLabelActive: {
    color: "#5732E7",
  },
});

export default EmployerBottomNav;
