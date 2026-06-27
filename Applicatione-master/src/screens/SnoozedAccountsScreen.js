import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Moon } from 'lucide-react-native';
import { SettingsShell, SectionCard, PageHero } from '../components/SettingsKit';

const SnoozedAccountsScreen = ({ navigation }) => {
  const snoozedUsers = [
    { id: '1', name: 'Neha Gupta', username: '@neha_travels', avatar: 'https://i.pravatar.cc/150?u=10', timeRemaining: '2 days left' },
    { id: '2', name: 'Karan Malhotra', username: '@karan_m', avatar: 'https://i.pravatar.cc/150?u=11', timeRemaining: '5 days left' },
    { id: '3', name: 'Sneha Patel', username: '@sneha_p', avatar: 'https://i.pravatar.cc/150?u=12', timeRemaining: '1 week left' },
  ];

  const renderUser = ({ item, index }) => (
    <View style={[styles.userItem, index === snoozedUsers.length - 1 && styles.userItemLast]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>{item.username} • {item.timeRemaining}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.unsnoozeButton}>
        <Text style={styles.unsnoozeText}>Unsnooze</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SettingsShell navigation={navigation} title="Snoozed Accounts">
      <PageHero 
        icon={Moon}
        eyebrow="Activity Control"
        title="Paused interactions"
        text="Accounts you snooze won't appear in your feed for 30 days, but you'll remain followers."
        metric={`${snoozedUsers.length} Accounts`}
      />

      <SectionCard title="Snoozed List">
        <FlatList
          data={snoozedUsers}
          renderItem={renderUser}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Moon size={40} color="#CCC" />
              <Text style={styles.emptyText}>No snoozed accounts</Text>
            </View>
          }
        />
      </SectionCard>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1EF',
  },
  userItemLast: {
    borderBottomWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#F1F3F5',
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '900',
    color: '#17191B',
  },
  username: {
    fontSize: 13,
    color: '#858A90',
    marginTop: 1,
    fontWeight: '700',
  },
  unsnoozeButton: {
    backgroundColor: '#F2FBF3',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1F5E5',
  },
  unsnoozeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#008000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#858A90',
    marginTop: 12,
    fontWeight: '700',
  },
});

export default SnoozedAccountsScreen;

