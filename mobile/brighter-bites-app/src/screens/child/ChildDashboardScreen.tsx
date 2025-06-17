import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

const ChildDashboardScreen = () => {
    const { authState } = useAuth();
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-emerald-50 p-5">
            <Text className="text-3xl font-bold text-emerald-700 mb-2">
                Hi, {authState.user?.name}!
            </Text>
            <Text className="text-xl text-gray-600 mb-10">
                Ready to make your teeth sparkle?
            </Text>

            {/* Placeholder for the main game/task component */}
            <View className="w-full h-1/2 bg-white rounded-2xl shadow-lg justify-center items-center p-4">
                <Text className="text-lg text-gray-500">Your brushing game will be here!</Text>
            </View>

            {/* Button to navigate to a separate settings page */}
            <TouchableOpacity 
              onPress={() => router.push('/(child)/settings')}
              className="mt-10 bg-white border border-emerald-300 py-3 px-6 rounded-full"
            >
              <Text className="font-bold text-emerald-600">Go to Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChildDashboardScreen;