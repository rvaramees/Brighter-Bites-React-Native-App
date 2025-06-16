// app/_layout.tsx
import '@/global.css';
import { AuthProvider } from '@/src/context/AuthContext';
import RootNavigator from '@/src/navigation/RootNavigator';
import { Slot, Stack } from 'expo-router';
import React from 'react';


// This is the main navigator for the app.
export default function RootLayout() {
  return (
    <AuthProvider>
    <Slot />
    </AuthProvider>
  );
}