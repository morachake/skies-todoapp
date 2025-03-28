import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Card } from '@rneui/themed';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { session, username } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>
            Welcome {username ? username : session?.user?.email?.split('@')[0]}!
          </Card.Title>
          <Card.Divider />
          <Text style={styles.subtitle}>
            You're logged in with: {session?.user?.email || 'No email found'}
          </Text>
          <Text style={styles.description}>
            This is your home screen. You can customize this screen to display your app's main content.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 24,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#0891b2',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});