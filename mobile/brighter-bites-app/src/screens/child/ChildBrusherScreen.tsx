import { StyleSheet, Text, View, Image, Touchable, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Video, ResizeMode } from 'expo-av';  
import LottieView from 'lottie-react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Demo from '@/src/components/ui/SkiaSpriteAnimator';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import { transform } from '@babel/core';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import Mirror from '@/src/components/ui/Mirror';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 220;





const ChildBrusherScreen = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  // The handler for the main control button lives in the parent.
  const handleToggleCamera = () => {
    // This function simply flips the boolean state.
    setIsCameraActive(prevState => !prevState);
  };

  const scale = useSharedValue(1);
  
  // --- THE UPDATED ANIMATED STYLE ---
  const animatedStyle = useAnimatedStyle(() => {
    // 1. Calculate the necessary translation to counteract the scaling
    // We use the `interpolate` function for this. It maps an input range to an output range.
    // When scale.value is 1, translateX should be 0.
    // When scale.value is 2, translateX should be half the width of the card (to keep it centered).
    const translateX = interpolate(
      scale.value,
      [1, 2.25], // Input range (from scale 1 to 2)
      [0, (CARD_WIDTH * 0.5) * 1.25] // Output range (from 0 translation to the calculated offset)
    );

    const translateY = interpolate(
      scale.value,
      [1, 2.25], // Input range
      [0, (CARD_HEIGHT * 0.5) * 1.25] // Output range
    );

    // 2. Return a style object with MULTIPLE transforms.
    // The order is important: first translate, then scale.
    return {
      transform: [
        { translateX: translateX },
        { translateY: translateY },
        { scale: scale.value },
      ],
    };
  });

  

  const handlePress = () => {
    // This handler logic remains the same
    scale.value = withTiming(scale.value === 1 ? 2.25 : 1, { duration: 300 });
    // If you want to navigate to the brush timer screen, uncomment the line below
    
  };
  return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      {/* 
        This outer container now defines the "anchor box" for our animation.
        The card starts in the top-left of this box.
      */}
      <View style={{ width: CARD_WIDTH * 2.25, height: CARD_HEIGHT * 2.25 }}>
        <Animated.View
          style={[
            { width: CARD_WIDTH, height: CARD_HEIGHT, position: 'absolute', top: 0, left: 0},
            animatedStyle
          ]}
          className="bg-orange-400 rounded-2xl shadow-lg p-2 items-center justify-center"
        >
      {/* Replace GradientView with a View or your gradient component */}
       {/* {isCamera ?
      <CameraView
        facing="front"
        style={{ width: '100%', height: '100%' }}
      />
      :  */}
      <Mirror 
        isActive={isCameraActive}
          // Pass a function that allows the child to change the parent's state.
          onDeactivate={() => setIsCameraActive(false)}></Mirror>
      
      {/* } */}

       
      </Animated.View>
      </View>

      <TouchableOpacity
        onPress={async () => {
          await handlePress();
          await handleToggleCamera();
        }}
        className="bg-indigo-600 py-4 px-8 rounded-full shadow-lg mt-16"
      >
        <Text className="text-white text-xl font-bold">Start Brushing</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}



export default ChildBrusherScreen
