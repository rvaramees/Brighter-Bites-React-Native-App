import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import AddOrUpdateHabitModalUI from '../../src/components/parent/AddOrUpdateHabitModalUI';
import { Habit } from '../../src/api/habit';
import { TouchableOpacity, Text } from 'react-native';

/**
 * This file defines the ROUTE for updating an existing habit.
 * It receives the habit data as a stringified JSON parameter.
 */
export default function UpdateHabitModalRoute() {
  const router = useRouter();
  
  // Get the parameters passed from the HabitCard
  const params = useLocalSearchParams<{ childId: string; habit: string }>();
  
  // Safely parse the habit data. If it fails, default to null.
  let existingHabit: Habit | null = null;
  if (params.habit) {
    try {
      existingHabit = JSON.parse(params.habit);
    } catch (e) {
      console.error("Failed to parse habit data for update modal:", e);
      // Handle the error, maybe show an alert or navigate back
      router.back();
    }
  }

  // If for some reason we couldn't get the habit data, don't render the modal.
  if (!existingHabit) {
    return null; 
  }

  const handleHabitSaved = () => {
    router.back(); // Just go back. The HabitListScreen will refetch data via useFocusEffect.
  };

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          title: 'Update Habit',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <AddOrUpdateHabitModalUI
        onClose={() => router.back()}
        childId={params.childId} // We still need this for the API call
        onHabitSaved={handleHabitSaved}
        existingHabit={existingHabit} // Pass the parsed habit object to the UI component
      />
    </>
  );
}