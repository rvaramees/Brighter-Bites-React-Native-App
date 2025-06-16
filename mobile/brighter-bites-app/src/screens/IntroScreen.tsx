import { useRouter } from 'expo-router'; // <--- Import useRouter
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const TIME_LOGO_IS_VISIBLE = 2000;
const FADE_DURATION = 1000;

const IntroScreen = () => {
  const router = useRouter(); // <--- Get the router instance

  useEffect(() => {
    const timer = setTimeout(() => {
      // Use router.replace to navigate. It will navigate to the file named 'auth.tsx'.
      router.replace('/auth'); 
    }, TIME_LOGO_IS_VISIBLE + FADE_DURATION);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Animated.View
        entering={FadeIn.duration(FADE_DURATION)}
        exiting={FadeOut.duration(FADE_DURATION)}
      >
        <Text className="text-white text-3xl font-bold tracking-wider">
          Nomad Interactive
        </Text>
      </Animated.View>
    </View>
  );
};

export default IntroScreen;