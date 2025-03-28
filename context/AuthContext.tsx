import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { router } from 'expo-router';
import { Alert, AppState } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utilis/supabase';

// Import types
import { AuthState, AuthContextType } from '@/types/types';

// Set up Supabase auto refresh
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Create default context values
const defaultContext: AuthContextType = {
  user: null,
  session: null,
  isLoading: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  resetPassword: async () => ({}),
};

// Create the auth context
const AuthContext = createContext<AuthContextType>(defaultContext);

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State that matches our AuthState interface
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });
  
  // Profile state
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const updateLoadingState = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  // Log state changes for debugging
  useEffect(() => {
    signIn(username, website);

    console.log('Auth state updated:', state);
  }, [state,username]);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      try {
        console.log('Initializing auth state...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        console.log('Session data:', data.session ? 'Session exists' : 'No session');
        
        setState({
          user: data.session?.user || null,
          session: data.session,
          isLoading: false,
        });
        
        if (data.session) {
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      setState({
        user: session?.user || null,
        session,
        isLoading: false,
      });
      
      if (session) {
        console.log('User is authenticated, navigating to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('User is not authenticated, navigating to sign in');
        router.replace('/(auth)/signin');
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in function matching our type definition
  async function signIn(email: string, password: string): Promise<{ error?: Error }> {
    try {
      console.log('Signing in user:', email);
      updateLoadingState(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', error ? 'Error occurred' : 'Success');
      
      if (error) {
        console.error('Sign in error:', error.message);
        Alert.alert('Sign In Failed', error.message);
        return { error };
      }
      
      console.log('User signed in successfully');
      return {};
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
      return { error: error as Error };
    } finally {
      updateLoadingState(false);
    }
  }

  // Sign up function matching our type definition
  async function signUp(email: string, password: string): Promise<{ error?: Error; success?: boolean }> {
    try {
      console.log('Signing up user:', email);
      updateLoadingState(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('Sign up response:', error ? 'Error occurred' : 'Success');
      
      if (error) {
        console.error('Sign up error:', error.message);
        Alert.alert('Sign Up Failed', error.message);
        return { error };
      }
      
      // Create initial profile record
      if (data.user) {
        try {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            updated_at: new Date(),
          });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        } catch (profileErr) {
          console.error('Unexpected error creating profile:', profileErr);
        }
      }
      
      if (!data.session) {
        Alert.alert('Verification Required', 'Please check your email for a verification link.');
      } else {
        console.log('User signed up and logged in successfully');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
      return { error: error as Error };
    } finally {
      updateLoadingState(false);
    }
  }

  // Sign out function
  async function signOut(): Promise<void> {
    try {
      console.log('Signing out user');
      updateLoadingState(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        Alert.alert('Sign Out Failed', error.message);
        throw error;
      }
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      Alert.alert('Sign Out Failed', 'An unexpected error occurred.');
    } finally {
      updateLoadingState(false);
    }
  }

  // Reset password function
  async function resetPassword(email: string): Promise<{ error?: Error }> {
    try {
      console.log('Sending password reset for:', email);
      updateLoadingState(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });
      
      if (error) {
        console.error('Password reset error:', error);
        Alert.alert('Password Reset Failed', error.message);
        return { error };
      }
      
      console.log('Password reset email sent successfully');
      Alert.alert('Password Reset Email Sent', 'Check your email for password reset instructions.');
      return {};
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      Alert.alert('Password Reset Failed', 'An unexpected error occurred.');
      return { error: error as Error };
    } finally {
      updateLoadingState(false);
    }
  }

  // Return all values from the context
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        session: state.session,
        isLoading: state.isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


