// app/_layout.tsx
import '@/global.css';
import { AuthProvider } from '@/src/context/AuthContext';
import RootNavigator from '@/src/navigation/RootNavigator';
import { Stack } from 'expo-router';
import React from 'react';


// This is the main navigator for the app.
export default function RootLayout() {
  return (
    <AuthProvider>
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header globally for a clean look
      }}
    >
      <RootNavigator />
    </Stack>
    </AuthProvider>
  );
}