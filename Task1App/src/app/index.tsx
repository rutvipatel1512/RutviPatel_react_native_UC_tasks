
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const cleanEmail = email.trim().toLowerCase();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
  const passwordValid = password.length >= 6;
  const canLogin = emailValid && passwordValid && !loading;

  const handleLogin = async () => {
    if (!canLogin) {
      setMessage('Enter a valid email and a password of at least 6 characters.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', cleanEmail)
      );

      const result = await getDocs(usersQuery);

      if (result.empty) {
        setMessage('Account not found. Please sign up first.');
        return;
      }

      const userData = result.docs[0].data();

      if (userData.password !== password) {
        setMessage('Incorrect password. Please try again.');
        return;
      }

      router.replace('/home');
    } catch (error: any) {
      console.error('Login error:', error);

      if (
        error?.code === 'permission-denied' ||
        error?.code === 'firestore/permission-denied'
      ) {
        setMessage(
          'Firestore permission denied. Check that the published rules belong to the correct Firebase project.'
        );
      } else {
        setMessage(
          'Login failed: ' + (error?.message || 'Please try again.')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setMessage('');
        }}
      />

      {email.length > 0 && !emailValid && (
        <Text style={styles.error}>
          Please enter a valid email address.
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setMessage('');
        }}
      />

      <Pressable onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.showPassword}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </Text>
      </Pressable>

      {password.length > 0 && !passwordValid && (
        <Text style={styles.error}>
          Password must be at least 6 characters.
        </Text>
      )}

      {message !== '' && (
        <Text style={styles.error}>{message}</Text>
      )}

      <Pressable
        style={[styles.button, !canLogin && styles.disabledButton]}
        disabled={!canLogin}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/signup')}>
        <Text style={styles.link}>
          Don't have an account? Sign Up
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#555555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaaaaa',
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    color: '#222222',
  },
  error: {
    color: '#d32f2f',
    marginTop: 8,
  },
  showPassword: {
    textAlign: 'right',
    marginTop: 8,
    color: '#555555',
  },
  button: {
    backgroundColor: '#222222',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: '#aaaaaa',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});