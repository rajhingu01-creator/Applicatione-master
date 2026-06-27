import React from "react";
import { StyleSheet } from "react-native";
import { FileText, Info, Shield } from "lucide-react-native";
import {
  SectionCard,
  SettingRow,
  SettingsShell,
} from "../components/SettingsKit";

const AboutScreen = ({ navigation }) => {
  return (
    <SettingsShell navigation={navigation} title="About">
      <SectionCard title="App Info">
        <SettingRow
          icon={Info}
          title="About This Account"
          detail="Joined, reach and profile context"
          onPress={() => navigation.navigate("EmployerAboutAccount")}
        />
        <SettingRow
          icon={Shield}
          title="Privacy Policy"
          detail="How your data is handled"
          onPress={() => navigation.navigate("EmployerPrivacyPolicy")}
        />
        <SettingRow
          icon={FileText}
          title="Terms of Use"
          detail="Rules and platform expectations"
          onPress={() => navigation.navigate("EmployerTermsOfUse")}
          isLast
        />
      </SectionCard>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({});

export default AboutScreen;
