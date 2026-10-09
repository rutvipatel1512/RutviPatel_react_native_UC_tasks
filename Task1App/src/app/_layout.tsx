

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="home"
        options={{
          title: 'Home',
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}