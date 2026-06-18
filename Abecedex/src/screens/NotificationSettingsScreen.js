import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Bell,
  FileText,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Phone,
  UserPlus,
  AtSign,
} from 'lucide-react-native';
import { SectionCard, SettingRow, SettingsShell } from '../components/SettingsKit';

const NotificationSettingsScreen = ({ navigation }) => {
  const categories = [
    { id: 'posts', title: 'Posts', icon: ImageIcon, detail: 'New posts from creators' },
    { id: 'stories', title: 'Stories', icon: FileText, detail: 'Daily story updates' },
    { id: 'likes', title: 'Likes', icon: Heart, detail: 'Activity on your content' },
    { id: 'comments', title: 'Comments', icon: MessageSquare, detail: 'Replies and feedback' },
    { id: 'calls', title: 'Calls', icon: Phone, detail: 'Audio and video calls' },
    { id: 'following', title: 'Following & Followers', icon: UserPlus, detail: 'New followers and requests' },
    { id: 'mentions', title: 'Mentions', icon: AtSign, detail: 'When people tag you' },
  ];

  return (
    <SettingsShell navigation={navigation} title="Notifications">
      <SectionCard title="Content & Activity">
        {categories.map((cat, index) => (
          <SettingRow
            key={cat.id}
            icon={cat.icon}
            title={cat.title}
            detail={cat.detail}
            isLast={index === categories.length - 1}
            onPress={() => navigation.navigate('NotificationDetail', {
              category: cat.id,
              title: cat.title,
              icon: cat.icon,
            })}
          />
        ))}
      </SectionCard>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          You can also manage system-level notifications from your phone settings.
        </Text>
      </View>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    marginTop: 16,
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#626970',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default NotificationSettingsScreen;
