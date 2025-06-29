import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { loginChild } from '../../api/auth'; // Assuming this API function exists
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ChildLoginScreen = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to automatically focus the PIN input after username
  const pinInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!username || pin.length !== 4) {
      setError('Please enter your username and 4-digit PIN!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await loginChild({ childname: username.trim().toLowerCase(), password:pin });
      await login(response.user, response.token);
      // The redirect will be handled automatically by the (auth)/_layout.tsx file.
    } catch (err: any) {
      setError('Hmm, that username or PIN is not right. Please try again!');
      console.error('Child login failed:', err.response?.data || err);
      setPin(''); // Clear the PIN on a failed attempt
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cyan-50">
      <View className="flex-1 justify-start py-16 px-6">
        
        {/* Playful Header */}
        <View className="items-center mb-10">
          {/* <Image 
            source={require('../../assets/images/sparkle-tooth.png')} // Add a fun image to your assets
            className="w-24 h-24 mb-4"
            resizeMode="contain"
          /> */}
          <Text className="text-4xl font-bold text-cyan-600">Time to Brush!</Text>
          <Text className="text-lg text-gray-500 mt-2">Enter your secret code</Text>
        </View>

        {/* Username Input */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-600 ml-2 mb-2">Your Username</Text>
          <TextInput
            className="bg-white border-2 border-cyan-200 rounded-2xl p-5 text-xl"
            placeholder="e.g., alex_the_gator"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
            returnKeyType="next"
            onSubmitEditing={() => pinInputRef.current?.focus()} // Move to next field on enter
          />
        </View>

        {/* PIN Input */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-600 ml-2 mb-2">4-Digit Secret PIN</Text>
          <TextInput
            ref={pinInputRef}
            className="bg-white border-2 border-cyan-200 rounded-2xl p-5 text-2xl text-center tracking-[16px]" // Wide tracking for PIN effect
            placeholder="● ● ● ●"
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry // Hides the numbers
            editable={!loading}
          />
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-6 flex-row items-center">
            <Ionicons name="warning-outline" size={24} color="red" />
            <Text className="text-red-700 ml-2 flex-1">{error}</Text>
          </View>
        )}

        {/* Login Button */}
        <TouchableOpacity
          className={`py-5 rounded-full items-center shadow-lg ${loading ? 'bg-cyan-300' : 'bg-cyan-500'}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text className="text-white text-2xl font-bold">Let's Go!</Text>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          className="mt-8 py-2"
          onPress={() => router.replace('/(auth)/auth')}
          disabled={loading}
        >
          <Text className="text-center text-gray-500 font-semibold">Not you? Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChildLoginScreen;