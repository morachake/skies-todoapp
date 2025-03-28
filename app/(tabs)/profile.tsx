import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useAuth } from '@/context/AuthContext';


export default function ProfileScreen() {
  const { 
    session, 
    loading, 
    username, 
    website, 
    avatarUrl, 
    setUsername, 
    setWebsite, 
    setAvatarUrl,
    getProfile, 
    updateProfile, 
    signOut 
  } = useAuth();

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  const handleUpdateProfile = () => {
    updateProfile({
      username,
      website,
      avatar_url: avatarUrl,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input 
            label="Email" 
            value={session?.user?.email || ''} 
            disabled 
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input 
            label="Username" 
            value={username || ''} 
            onChangeText={setUsername} 
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input 
            label="Website" 
            value={website || ''} 
            onChangeText={setWebsite} 
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            title={loading ? 'Loading ...' : 'Update Profile'}
            onPress={handleUpdateProfile}
            disabled={loading}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Button 
            title="Sign Out" 
            onPress={signOut}
            buttonStyle={{ backgroundColor: '#F94144' }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});