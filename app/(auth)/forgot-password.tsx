import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const ForwardedButton = React.forwardRef((props: any, ref) => (
  <Button {...props} />
));

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { resetPassword, isLoading } = useAuth();

  const validateEmail = () => {
    setErrorMessage('');
    
    if (!email) {
      setErrorMessage('Email is required');
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

  const handleResetPassword = async () => {
    if (!validateEmail()) return;
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <Text h4 style={styles.title}>Check Your Email</Text>
        
        <Text style={styles.message}>
          We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Back to Sign In"
            onPress={() => router.replace('/(auth)/signin')}
            buttonStyle={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>Reset Password</Text>
      
      <Text style={styles.subtitle}>
        Enter your email address below and we'll send you a link to reset your password.
      </Text>
      
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      
      <View style={styles.inputContainer}>
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
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Sending..." : "Send Reset Link"}
          disabled={isLoading || !email}
          onPress={handleResetPassword}
          buttonStyle={styles.resetButton}
        />
      </View>
      
      <View style={styles.linkContainer}>
        <Link href="/(auth)/signin" asChild>
          <ForwardedButton
            title="Back to Sign In"
            type="clear"
            titleStyle={styles.linkText}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginTop: 50,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    height: 50,
  },
  backButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    height: 50,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#0891b2',
  },
});