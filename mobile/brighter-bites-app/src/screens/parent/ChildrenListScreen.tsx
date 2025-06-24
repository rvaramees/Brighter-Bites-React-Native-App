import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, Stack } from 'expo-router';
import axios from 'axios';

// Import the context hook to get the auth token
import { useAuth } from '../../hooks/useAuth';
// Import the API function and the Child type definition
import { getMyChildrenApi, Child } from '../../api/children';
// Import our new animated card component
import ChildCard from '../../components/parent/ChildCard';

const ChildrenListScreen = () => {
  const { authState } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the data-fetching logic so it's not recreated on every render.
  const fetchChildren = useCallback(async () => {
    if (!authState.token) {
      setError("Authentication failed. Please log in again.");
      setIsLoading(false);
      return;
    }

    // Reset state for a fresh fetch (important for pull-to-refresh)
    setError(null);
    setIsLoading(true);

    try {
      const fetchedChildren = await getMyChildrenApi(authState.token);
      setChildren(fetchedChildren);
    } catch (err) {
      let errorMessage = 'Failed to load children. Please try again.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error("Error fetching children:", err);
    } finally {
      // Ensure loading is turned off after the fetch completes.
      setIsLoading(false);
    }
  }, [authState.token]); // Dependency: The function only changes if the token does.

  // `useFocusEffect` is perfect for refetching data every time the screen is viewed.
  useFocusEffect(
    useCallback(() => {
      fetchChildren();
    }, [fetchChildren])
  );

  // --- RENDER LOGIC ---

  // Initial loading state before any data or errors are present.
  if (isLoading && children.length === 0 && !error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="mt-2 text-gray-500">Fetching your family...</Text>
      </View>
    );
  }

  // Full-screen error state if the initial fetch fails.
  if (error && children.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-50">
        <Text className="text-red-500 text-center mb-4 text-lg">{error}</Text>
        <TouchableOpacity 
            onPress={fetchChildren} 
            className="bg-indigo-500 px-6 py-3 rounded-lg shadow"
        >
            <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* 
        This is good practice for Expo Router. It allows the screen to control
        its own header title within the navigator's context.
        This comes from the (parent)/(tabs)/_layout.tsx file.
      */}
      <Stack.Screen options={{ title: "My Children" }} />

      <FlatList
        data={children}
        keyExtractor={(item) => item._id}
        // =========================================================
        // ===         THE MAIN CHANGE IS HERE                   ===
        // =========================================================
        // We are now rendering our new, interactive, and animated
        // ChildCard component for each item in the list.
        renderItem={({ item }) => <ChildCard item={item} />}
        // =========================================================
        
        // Display a small error message at the top if a refresh fails.
        ListHeaderComponent={
          error ? <Text className="text-red-500 text-center py-2 bg-red-100">{error}</Text> : null
        }
        
        // Show a helpful message if the list is empty.
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 justify-center items-center mt-24 p-4">
              <Text className="text-lg text-gray-500 text-center">No children have been added yet!</Text>
              <Text className="text-md text-gray-400 text-center mt-2">
                Tap the "Add Child" tab at the bottom to get started.
              </Text>
            </View>
          ) : null // Don't show the "empty" message while a refresh is happening.
        }
        
        // Enable "pull-to-refresh" functionality.
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchChildren}
            colors={["#6366F1", "#818CF8"]} // Customize spinner colors
            tintColor={"#6366F1"}
          />
        }
        
        // These props help the FlatList fill the screen when empty
        // and provide some nice padding.
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8, flexGrow: 1 }}
      />
    </SafeAreaView>
  );
};

export default ChildrenListScreen;