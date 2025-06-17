import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
// --- THIS IS THE FIX ---
// Change the import from '@react-navigation/native' to 'expo-router'
import { Link } from 'expo-router'; 

const AuthScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <View className="items-center mb-24">
        <Text className="text-white text-6xl font-bold">Brighter Bites</Text>
        <Text className="text-blue-200 text-lg">Your journey to a healthier smile!</Text>
      </View>

      <View className="w-4/5">
        {/* TODO: Create and link to a login screen */}
        <Link href="/childLogin" asChild>
          <TouchableOpacity className="bg-white p-4 rounded-xl items-center mb-4">
            <Text className="text-blue-500 text-lg font-bold">Child Login</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/login" asChild>
          <TouchableOpacity className="bg-white p-4 rounded-xl items-center mb-4">
            <Text className="text-blue-500 text-lg font-bold">Parent Login</Text>
          </TouchableOpacity>
        </Link>
        
        {/* Now this href will be correctly typed and the error will disappear */}
        <Link href="/register" asChild>
          <TouchableOpacity className="bg-white/20 p-4 rounded-xl items-center border border-white/50 mb-4">
            <Text className="text-white text-lg font-bold">Register New Parent</Text>
          </TouchableOpacity>
        </Link>

        
      </View>
    </View>
  );
};

export default AuthScreen;