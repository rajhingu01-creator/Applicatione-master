import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Bell,
  Check,
  Circle,
  CircleDot,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react-native';
import { SectionCard, SettingRow, SettingsShell } from '../components/SettingsKit';

const NotificationDetailScreen = ({ navigation, route }) => {
  const { category, title, icon: Icon } = route.params;
  const [selection, setSelection] = useState('everyone');

  const options = [
    { id: 'off', label: 'Off', icon: XCircle },
    { id: 'everyone', label: 'From Everyone', icon: Users },
    { id: 'followed', label: 'From People I Follow', icon: UserCheck },
  ];

  return (
    <SettingsShell navigation={navigation} title={title}>
      <SectionCard title="Options">
        {options.map((opt, index) => {
          const active = selection === opt.id;
          return (
            <SettingRow
              key={opt.id}
              icon={opt.icon}
              title={opt.label}
              onPress={() => setSelection(opt.id)}
              isLast={index === options.length - 1}
              right={
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              }
            />
          );
        })}
      </SectionCard>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Selecting an option will immediately apply to your account.
        </Text>
      </View>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#008000',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#008000',
  },
  infoBox: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#626970',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default NotificationDetailScreen;
