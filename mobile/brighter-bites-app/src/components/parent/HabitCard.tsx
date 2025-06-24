import React, { useState } from 'react';
import { View, Text, Switch, Pressable, TouchableOpacity, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { updateHabitApi, Habit } from '../../api/habit';
import { router } from 'expo-router';

interface HabitCardProps {
  habit: Habit;
  onDelete: (habitId: string, deleteForToday: boolean) => void;
  // We'll add a placeholder onUpdate prop for future use
  // onUpdate: (habit: Habit) => void; 
}

const HabitCard = ({ habit, onDelete }: HabitCardProps) => {
  const { authState } = useAuth();
  const [isActive, setIsActive] = useState(habit.isActive);
  // --- Animation Setup ---
  const isExpanded = useSharedValue(false);
  // Define the heights for collapsed and expanded states
  const collapsedHeight = 90; // The height of the top section
  const expandedHeight = 150; // Height to accommodate the action buttons
  
  // Create a shared value for the height animation
  const cardHeight = useSharedValue(collapsedHeight);

  // Define the animated style that will be applied to the card's View
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(cardHeight.value, { duration: 250 }), // Smooth 250ms animation
    };
  });

  // --- Handlers ---

  const toggleExpansion = () => {
    // If the card is currently expanded, collapse it. Otherwise, expand it.
    cardHeight.value = isExpanded.value ? collapsedHeight : expandedHeight;
    // Flip the boolean state
    isExpanded.value = !isExpanded.value;
  };

  const handleToggleSwitch = async (newValue: boolean) => {
    if (!authState.token) return;
    setIsActive(newValue); // Optimistic UI update
    try {
      await updateHabitApi(habit._id, { isActive: newValue }, authState.token);
    } catch (error) {
      setIsActive(!newValue); // Revert on failure
      Alert.alert("Error", "Could not update the habit's status.");
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to permanently delete "${habit.name}"?`,
      [
          { text: "Cancel", style: "cancel" },
          { text: "Delete For Today", style: "default", 
            onPress: ()=> {
                onDelete(habit._id, true);
            }},
        { text: "Delete", style: "destructive", onPress: () => onDelete(habit._id, false) },
      ]
    );
  };

 const handleUpdatePress = () => {
    // Navigate to the update modal route.
    router.push({
      pathname: '/(parent)/updateHabitModal',
      // Pass the necessary data as parameters.
      // We stringify the habit object to pass it through navigation.
      params: { 
        childId: habit.child,
        habit: JSON.stringify(habit),
      },
    });
  };

  return (
    <Pressable onPress={toggleExpansion}>
      <Animated.View style={animatedContainerStyle} className="bg-white mx-4 my-2 rounded-2xl shadow-md overflow-hidden">
        
        {/* --- Top Section (Always Visible) --- */}
        <View className="p-4 flex-row justify-between items-center h-[90px]">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{habit.name}</Text>
            {habit.description && <Text className="text-gray-500 mt-1" numberOfLines={1}>{habit.description}</Text>}
          </View>
          <Switch
            trackColor={{ false: "#D1D5DB", true: "#818CF8" }}
            thumbColor={isActive ? "#4F46E5" : "#F9FAFB"}
            onValueChange={handleToggleSwitch}
            value={isActive}
            // Stop the switch press from triggering the card expansion
            onStartShouldSetResponder={() => true}
          />
        </View>
        
        {/* --- Bottom Section (Expanded Options) --- */}
        <View className="px-5 pt-2 flex-row justify-center items-center border-t border-gray-100">
          <TouchableOpacity onPress={handleUpdatePress} className="flex-1 items-center p-2 flex-row justify-center">
            <Ionicons name="create-outline" size={24} color="#6366F1"/>
            <Text className="text-indigo-600 font-semibold ml-2">Update</Text>
          </TouchableOpacity>
          <View className="w-px h-8 bg-gray-200" />
          <TouchableOpacity onPress={handleDeletePress} className="flex-1 items-center p-2 flex-row justify-center">
            <Ionicons name="trash-outline" size={24} color="#EF4444"/>
            <Text className="text-red-600 font-semibold ml-2">Delete</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Pressable>
  );
};

export default HabitCard;