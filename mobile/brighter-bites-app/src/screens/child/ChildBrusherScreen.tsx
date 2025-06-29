import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Video, ResizeMode } from 'expo-av';  
import LottieView from 'lottie-react-native';
import Animated from 'react-native-reanimated'
import BrushingAnimation from '@/src/components/animations/BrushingAnimation';

const ChildBrusherScreen = () => {
  return (
    <View className='items-center justify-center flex-1 bg-cyan-200 h-full w-full'>
        <BrushingAnimation isAnimating={true} radius={2} duration={2000} />


      <Text className='mt-4 text-lg font-semibold'>ChildBrusherScreen</Text>
    </View>
  )
}

export default ChildBrusherScreen
