import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect, Stack, useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { getHabitsApi, deleteHabitApi, Habit, updateHabitApi } from '../../api/habit';
import HabitCard from '../../components/parent/HabitCard';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { updateTodayRecordApi } from '@/src/api/tasks';

const HabitListScreen = () => {
  // --- HOOKS ---
  const router = useRouter(); // Expo Router's hook for navigation
  const { authState } = useAuth();
  const { childId, childName } = useLocalSearchParams<{ childId: string; childName: string }>();
  
  // --- STATE ---
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING ---
  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!authState.token || !childId) {
      setError("Authentication or Child ID is missing. Please go back and try again.");
      setIsLoading(false);
      return;
    }
    try {
      const fetchedHabits = await getHabitsApi(authState.token, childId);
      setHabits(fetchedHabits);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) && err.response 
        ? err.response.data.message 
        : "An error occurred while fetching habits.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [authState.token, childId]);

  // `useFocusEffect` is essential for this pattern. When the user navigates back
  // from the create/update modal, this screen will come into focus, and the
  // data will be automatically refreshed.
  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [fetchHabits])
  );

  // --- ACTION HANDLERS ---

  const handleOpenCreateModal = () => {
    // Navigate to the modal route for creating a new habit.
    // Pass the childId so the new habit can be associated correctly.
    router.push({
      pathname: '/(parent)/addHabitModal',
      params: { childId },
    });
  };
  
  const handleDeleteHabit = async (habitId: string, deleteForToday: boolean) => {
    if (!authState.token) {
      Alert.alert("Error", "Authentication session has expired. Please log in again.");
      return;
    }
    
    // The confirmation alert is now inside the HabitCard, but the delete logic is here.
    try {   
        console.log(deleteForToday);
        await deleteHabitApi(habitId, authState.token);
      
      if(deleteForToday){
        await updateTodayRecordApi(childId, authState.token)
      }
      // Optimistically update the UI for a snappy user experience.
      setHabits(prevHabits => prevHabits.filter(h => h._id !== habitId));
    } catch (error) {
      console.error("Failed to delete habit:", error);
      Alert.alert("Error", "Could not delete the habit. Please try again.");
    }
  };

  // --- RENDER LOGIC ---

  if (isLoading && habits.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Set the header title for this screen dynamically */}
      <Stack.Screen options={{ title: `${childName}'s Habits` }} />

      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          // The HabitCard now handles its own update navigation logic internally.
          // We just need to provide the delete handler.
          <HabitCard 
            habit={item}
            onDelete={handleDeleteHabit}
          />
        )}
        ListHeaderComponent={
          <View className="p-4 pt-6">
            <Text className="text-center text-gray-600">
              Manage daily habits for {childName}. Tap a card to see options.
            </Text>
            {error && <Text className="text-center text-red-500 mt-2">{error}</Text>}
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 justify-center items-center mt-16">
              <Text className="text-lg text-gray-500">No custom habits yet.</Text>
              <Text className="text-md text-gray-400 mt-1">Tap the '+' button to add one!</Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchHabits} />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // Add padding to avoid FAB overlap
      />
      
      {/* Floating Action Button (FAB) to navigate to the create modal route */}
      <TouchableOpacity 
        onPress={handleOpenCreateModal}
        className="absolute bottom-8 right-8 bg-indigo-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HabitListScreen;