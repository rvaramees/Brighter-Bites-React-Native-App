import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function ChildAppLayout() {
  const { authState } = useAuth();

  // Show loading spinner on initial load
  if (authState.user === undefined) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // If user is not authenticated OR they are not a 'child', redirect them.
  if (!authState.authenticated || authState.user?.type !== 'child') {
    // Send them back to the public login screen
    return <Redirect href="/(auth)/login" />;
  }
  
  // If we reach here, the user is an authenticated child.
  // Render the screens inside the (child) group.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Start', headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{
        headerShown: false, 
      }}/> {/* This refers to the entire tab navigator */}
      <Stack.Screen name="settings" options={{ title: 'My Settings' }} />
      <Stack.Screen name="brushTimer" options={{ title: 'Brush Timer', headerShown: false }} />
    </Stack>
  );
}