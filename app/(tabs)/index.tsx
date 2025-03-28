import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Text, Divider } from '@rneui/themed';
import { useAuth } from '@/context/AuthContext';


export default function SettingsScreen() {
  const { signOut } = useAuth();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          title: 'Edit Profile',
          icon: 'person-outline',
          onPress: () => console.log('Navigate to profile edit'),
          chevron: true,
        },
        {
          title: 'Notifications',
          icon: 'notifications-outline',
          onPress: () => console.log('Navigate to notifications settings'),
          chevron: true,
        },
        {
          title: 'Privacy',
          icon: 'lock-closed-outline',
          onPress: () => console.log('Navigate to privacy settings'),
          chevron: true,
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          title: 'Appearance',
          icon: 'color-palette-outline',
          onPress: () => console.log('Navigate to appearance settings'),
          chevron: true,
        },
        {
          title: 'Language',
          icon: 'language-outline',
          onPress: () => console.log('Navigate to language settings'),
          chevron: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Help Center',
          icon: 'help-circle-outline',
          onPress: () => console.log('Navigate to help center'),
          chevron: true,
        },
        {
          title: 'Contact Us',
          icon: 'mail-outline',
          onPress: () => console.log('Navigate to contact form'),
          chevron: true,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {settingsSections.map((section, sectionIndex) => (
        <View key={`section-${sectionIndex}`} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <ListItem key={`item-${sectionIndex}-${itemIndex}`} onPress={item.onPress} bottomDivider>
              <Icon name={item.icon} type="ionicon" />
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
              {item.chevron && <ListItem.Chevron />}
            </ListItem>
          ))}
        </View>
      ))}

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 5,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    padding: 15,
    paddingBottom: 5,
  },
  logoutSection: {
    margin: 20,
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: '#F94144',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});