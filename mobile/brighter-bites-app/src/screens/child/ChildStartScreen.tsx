import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth'; // Custom hook to access auth context
import Animated, { BounceIn, FadeIn, FadeOut,  } from 'react-native-reanimated';

const ChildStartScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();

  const handleStart = () => {
    // Navigate to the main dashboard (the index of the (child) tabs/stack)
    // `replace` is used to prevent the user from going "back" to this start screen.
    router.replace('/(child)/(tabs)'); 
  };

  return (
    <SafeAreaView className="flex-1 bg-cyan-200 justify-center items-center p-8">
      {/* Welcome Message Section */}

      {/* Main Branding Section */}
      <Animated.View entering={BounceIn.delay(500).duration(800)} className="items-center mb-32">
        <Image
          source={require('../../../assets/images/mainlogo.png')} // Your app's logo/mascot
          className="w-96 h-96"
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View entering={BounceIn.delay(500).duration(800)} className="items-center mb-11 ">
        <Text className="text-2xl text-cyan-700">Welcome back,</Text>
        <Text className="text-5xl font-extrabold text-cyan-800 ">
          {authState.user?.name}!
        </Text>
      </Animated.View>

      {/* Start Button Section */}
      <Animated.View entering={BounceIn.delay(500).duration(800)} className="w-full pb-24">
        <TouchableOpacity
          onPress={handleStart}
          className="bg-white/0 rounded-full items-center shadow-lg shadow-black w-1/4 mx-auto"
          activeOpacity={0.8}
        >
          <Image 
          source={require('../../../assets/images/play_button.png')} 
          className="w-32 h-24" 
          resizeMode="contain" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChildStartScreen;