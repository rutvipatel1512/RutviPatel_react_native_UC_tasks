
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
  addDoc,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
  const phoneValid = /^\d{10}$/.test(cleanPhone);
  const passwordValid = password.length >= 6;

  const canSignup =
    emailValid && phoneValid && passwordValid && !loading;

  const handleSignup = async () => {
    if (!canSignup) {
      setMessage('Please enter valid details in all fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const usersRef = collection(db, 'users');

      const emailQuery = query(
        usersRef,
        where('email', '==', cleanEmail)
      );

      const emailResult = await getDocs(emailQuery);

      if (!emailResult.empty) {
        setMessage('This email is already registered. Please log in.');
        return;
      }

      const phoneQuery = query(
        usersRef,
        where('phone', '==', cleanPhone)
      );

      const phoneResult = await getDocs(phoneQuery);

      if (!phoneResult.empty) {
        setMessage('This phone number is already registered.');
        return;
      }

      await addDoc(usersRef, {
        email: cleanEmail,
        phone: cleanPhone,
        password: password,
      });

      router.replace('/home');
    } catch (error: any) {
      console.error('Signup error:', error);
      setMessage(
        'Signup failed: ' +
          (error?.message || 'Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

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
        <Text style={styles.error}>Enter a valid email address.</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="10-digit Phone Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={(value) => {
          setPhone(value.replace(/\D/g, ''));
          setMessage('');
        }}
      />

      {phone.length > 0 && !phoneValid && (
        <Text style={styles.error}>
          Enter a valid 10-digit phone number.
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
        style={[styles.button, !canSignup && styles.disabledButton]}
        disabled={!canSignup}
        onPress={handleSignup}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.replace('/')}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
    color: '#555555',
    marginBottom: 20,
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