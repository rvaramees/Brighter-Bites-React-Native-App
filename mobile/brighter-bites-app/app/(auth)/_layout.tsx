import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth'; // Adjust path

export default function AuthLayout() {
  const { authState } = useAuth();

  // If the user is already authenticated, don't show them the auth screens.
  // Redirect them away to the main app.
  if (authState.authenticated) {
    // Check type to redirect to the correct dashboard
    if (authState.user?.type === 'parent') {
        console.log("Authenticated");
      return <Redirect href="/(parent)/(tabs)/childrenList" />;
    }
    // else if (authState.user?.type === 'child') {
    //   return <Redirect href="/(childApp)/dashboard" />;
    // }
  }

  // If the user is not authenticated, render the screens in this group.
  return <Stack screenOptions={{ headerShown: false }} />;
}