import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Child } from '../../api/children'; // Import your Child type

interface ChildCardProps {
  item: Child;
}

const ChildCard = ({ item }: ChildCardProps) => {
  const router = useRouter();
  const isExpanded = useSharedValue(false);
  const cardHeight = useSharedValue(88); // Initial height of the card (p-5 = 20+20, text size etc)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(cardHeight.value, { duration: 300 }),
    };
  });

  const toggleCard = () => {
    if (isExpanded.value) {
      cardHeight.value = 88;
    } else {
      // Expanded height to fit the buttons
      cardHeight.value = 160; 
    }
    isExpanded.value = !isExpanded.value;
  };

  const navigateToHabits = () => {
    // Pass childId and childName as params to the habits screen
    router.push({
      pathname: '/(parent)/(tabs)/habit',
      params: { childId: item._id, childName: item.name },
    });
  };

  return (
    <Pressable onPress={toggleCard}>
      <Animated.View style={animatedStyle} className="bg-white mx-4 my-2 rounded-2xl shadow-md overflow-hidden">
        {/* Main Info Section (Always Visible) */}
        <View className="flex-row items-center p-5 h-[88px]">
          <View className="w-12 h-12 rounded-full bg-indigo-200 mr-4 justify-center items-center">
             <Text className="text-xl font-bold text-indigo-600">{item.name.charAt(0)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">{item.name}</Text>
            <Text className="text-md text-gray-500 mt-1">Score: {item.points}</Text>
          </View>
          <Ionicons 
            name={isExpanded.value ? 'chevron-up' : 'chevron-down'}
            size={24} color="gray" 
          />
        </View>

        {/* Expanded Options Section (Conditionally Visible) */}
        <View className="px-5 pt-2 flex-row justify-around items-center">
            <TouchableOpacity onPress={() => {/* Navigate to profile */}} className="items-center p-2">
                <Ionicons name="person-circle-outline" size={32} color="#4f46e5"/>
                <Text className="text-indigo-600">Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToHabits} className="items-center p-2">
                <Ionicons name="list-outline" size={32} color="#4f46e5"/>
                <Text className="text-indigo-600">Habits</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {/* Navigate to stats */}} className="items-center p-2">
                <Ionicons name="stats-chart-outline" size={32} color="#4f46e5"/>
                <Text className="text-indigo-600">Stats</Text>
            </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ChildCard;