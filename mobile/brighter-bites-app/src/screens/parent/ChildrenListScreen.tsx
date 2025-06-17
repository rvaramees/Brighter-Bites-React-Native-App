import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import axios from 'axios'; // Import axios for type checking the error

// Import the context hook and the API function
import { useAuth } from '../../hooks/useAuth';
import { getMyChildrenApi, Child } from '../../api/children';

const ChildrenListScreen = () => {
  const { authState } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrap data-fetching logic in useCallback to prevent re-creating the function on every render.
  const fetchChildren = useCallback(async () => {
    // Ensure we have a token before making the call.
    if (!authState.token) {
      setError("Authentication token is missing.");
      setIsLoading(false);
      return;
    }

    // Reset state before fetching
    setError(null);

    try {
      const fetchedChildren = await getMyChildrenApi(authState.token);
      setChildren(fetchedChildren);
    } catch (err) {
      // --- THIS IS THE CORRECTED CATCH BLOCK ---
      let errorMessage = 'Failed to load children. Please try again.';
      if (axios.isAxiosError(err) && err.response) {
        // Use the specific error message from the backend if it exists
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error("Error fetching children:", err);
      // --- END OF CORRECTION ---
    } finally {
      // This will run after the try or catch block is finished.
      setIsLoading(false);
    }
  }, [authState.token]); // Dependency array: this function will only be recreated if the token changes.

  // useFocusEffect runs the effect every time the screen comes into focus.
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true); // Show loader every time the screen is focused
      fetchChildren();
    }, [fetchChildren]) // The dependency is the memoized fetchChildren function
  );

  // Render a loading indicator while fetching.
  if (isLoading && children.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // Render a full-screen error message if something went wrong.
  if (error && children.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity onPress={fetchChildren} className="bg-indigo-500 px-4 py-2 rounded-lg">
            <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={children}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white p-5 mx-4 my-2 rounded-xl shadow-md active:bg-gray-100"
            // You can add navigation to a child detail screen here
            // onPress={() => router.push(`/(parent)/child/${item._id}`)}
          >
            <View className="flex-row items-center">
              {/* Placeholder for an avatar */}
              <View className="w-12 h-12 rounded-full bg-orange-700-200 mr-4"></View>
              <View>
                <Text className="text-xl font-bold text-gray-800">{item.name}</Text>
                <Text className="text-md text-gray-500 mt-1">@{item.points}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          error ? <Text className="text-red-500 text-center py-2">{error}</Text> : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 justify-center items-center mt-24 p-4">
              <Text className="text-lg text-gray-500 text-center">No children yet!</Text>
              <Text className="text-md text-gray-400 text-center mt-2">
                Tap the "Add Child" tab to get started.
              </Text>
            </View>
          ) : null // Don't show "empty" message while loading
        }
        // Allows for "pull-to-refresh" functionality
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchChildren}
            colors={["#6366F1"]}
          />
        }
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8, flexGrow: 1 }}
      />
    </SafeAreaView>
  );
};

export default ChildrenListScreen;