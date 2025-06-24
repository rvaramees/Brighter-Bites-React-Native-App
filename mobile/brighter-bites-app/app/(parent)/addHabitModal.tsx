import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import AddOrUpdateHabitModalUI from '../../src/components/parent/AddOrUpdateHabitModalUI';
import { TouchableOpacity, Text } from 'react-native';

/**
 * This file defines the ROUTE for adding a new habit.
 * Expo Router will present this route as a modal because of the Stack.Screen options.
 */
export default function AddHabitModalRoute() {
  const router = useRouter();
  const { childId } = useLocalSearchParams<{ childId: string }>();

  // This callback function is passed to the UI component.
  // After a habit is successfully saved, we simply navigate back to the previous screen.
  const handleHabitSaved = () => {
    router.back();
  };

  return (
    <>
      {/* This configures the screen to be presented modally from the bottom. */}
      <Stack.Screen
        options={{
          presentation: 'modal',
          title: 'New Custom Habit',
          headerLeft: () => (
            // Provides an explicit close button for iOS modals
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* 
        Render the actual UI component.
        We pass router.back() for the onClose prop and our new handler for onHabitSaved.
        Since this route is only for creating, existingHabit is always null.
      */}
      <AddOrUpdateHabitModalUI
        onClose={() => router.back()}
        childId={childId}
        onHabitSaved={handleHabitSaved}
        existingHabit={null}
      />
    </>
  );
}