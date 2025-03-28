import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';



const ForwardedButton = React.forwardRef((props: any, ref) => (
  <Button {...props} />
));

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signUp, isLoading } = useAuth();

  const validateForm = () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email || !password || !confirmPassword) {
      setErrorMessage('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSignUp = async () => {
    // if (!validateForm()) return;
    
    console.log('Attempting to sign up with:', email);
    const { error, success } = await signUp(email, password);
    
    if (error) {
      setErrorMessage(error.message || 'Failed to create account');
      return;
    }
    
    if (success) {
      setSuccessMessage('Account created! Please check your email for verification if required.');
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text h3 style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started with the app</Text>
        
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        
        {successMessage ? (
          <Text style={styles.successText}>{successMessage}</Text>
        ) : null}
        
        <View style={[styles.formField, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCorrect={false}
            disabled={isLoading}
            errorStyle={{ height: 0 }}
          />
        </View>
        
        <View style={styles.formField}>
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholder="At least 6 characters"
            autoCapitalize="none"
            textContentType="newPassword"
            disabled={isLoading}
            errorStyle={{ height: 0 }}
          />
        </View>
        
        <View style={styles.formField}>
          <Input
            label="Confirm Password"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
            placeholder="Confirm your password"
            autoCapitalize="none"
            textContentType="newPassword"
            disabled={isLoading}
            errorStyle={{ height: 0 }}
          />
        </View>
        
        <View style={[styles.formField, styles.mt20]}>
          <Button
            title={isLoading ? "" : "Create Account"}
            disabled={isLoading}
            onPress={handleSignUp}
            buttonStyle={styles.signUpButton}
            icon={isLoading ? <ActivityIndicator color="white" size="small" /> : null}
          />
        </View>
        
        <View style={styles.loginLinkContainer}>
          <Link href="/(auth)/signin" asChild>
            <ForwardedButton
              title="Already have an account? Sign In"
              type="clear"
              titleStyle={styles.linkText}
              disabled={isLoading}
            />
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  successText: {
    color: '#34c759',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  formField: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  signUpButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    height: 50,
  },
  loginLinkContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#0891b2',
  },
});