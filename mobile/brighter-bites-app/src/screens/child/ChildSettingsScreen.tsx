import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

const ChildSettingsScreen = () => {
    const { authState, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async() => {
        await logout();
        router.replace('/(auth)/childLogin')
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-between bg-gray-100 p-8">
            <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">Settings</Text>
                <Text className="text-lg text-gray-600 mt-4">
                    Logged in as: {authState.user?.name}
                </Text>
            </View>
            
            {/* A large, clear logout button */}
            <TouchableOpacity
                onPress={handleLogout}
                className="w-full bg-red-500 py-4 rounded-xl items-center shadow-md"
            >
                <Text className="text-white font-bold text-xl">Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChildSettingsScreen;