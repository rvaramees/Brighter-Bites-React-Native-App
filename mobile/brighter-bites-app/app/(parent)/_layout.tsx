import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth'; // Adjust path
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const { authState } = useAuth();

  // Show a loading indicator while the context is loading the token from storage.
  // The `user === null` check is key here for the initial load.
  if (authState.user === null && authState.token !== undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If the user is not authenticated, redirect them to the auth flow.
  // The router will automatically navigate to the start of the (auth) group.
  if (!authState.authenticated) {
    return <Redirect href="/(auth)/login" />; // Or '/(auth)/' to go to your intro
  }

  // If the user is a child, you could redirect to a different layout.
  // if (authState.user?.type === 'child') {
  //   return <Redirect href="/(childApp)/" />;
  // }
  
  // If we reach here, the user is an authenticated parent.
  // Render the rest of the screens inside the (app) group.
  // In this case, it will render the (tabs) layout next.
  return <Stack screenOptions={{ headerShown: false }} />;
}