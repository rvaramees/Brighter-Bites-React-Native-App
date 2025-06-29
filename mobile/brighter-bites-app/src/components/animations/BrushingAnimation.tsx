import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

interface BrushingAnimationProps {
  isAnimating: boolean;
  radius?: number;
  duration?: number;
}

const BrushingAnimation = ({
  isAnimating,
  radius = 80,
  duration = 3000,
}: BrushingAnimationProps) => {
  
  const rotation = useSharedValue(0);

  // --- useEffect to control the animation remains EXACTLY THE SAME ---
  useEffect(() => {
    if (isAnimating) {
      rotation.value = withRepeat(
        withTiming(360, { duration, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      // Reset rotation when stopping for a clean start next time
      rotation.value = withTiming(0, { duration: 200 });
      cancelAnimation(rotation);
    }
    return () => cancelAnimation(rotation);
  }, [isAnimating, duration, rotation]);

  // ====================================================================
  // ===           THE FIX IS HERE: TWO SEPARATE ANIMATED STYLES        ===
  // ====================================================================

  // 1. Animated Style for the ROTATING ARM
  // This style only applies rotation.
  const animatedArmStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // 2. Animated Style for the TOOTHBRUSH IMAGE
  // This style applies a COUNTER-ROTATION to keep the image upright.
  const animatedBrushStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${-rotation.value}deg` }],
    };
  });
  // ====================================================================


  return (
    <View style={[styles.container, { width: radius * 2 + 80, height: radius * 2 + 80 }]}>
      {/* Stationary teeth image in the center */}
      <Image
        source={require('../../../assets/images/teeth.png')}
        style={styles.teethImage}
      />

      {/* The invisible rotating "arm". This view will spin. */}
      <Animated.View style={[styles.arm, animatedArmStyle]}>
        
        {/* The toothbrush is positioned at the end of the arm */}
        <View style={[styles.brushHolder, { top: -radius }]}>

          {/* This inner animated view counter-rotates the brush image */}
          <Animated.View style={animatedBrushStyle}>
            <Image
              source={require('../../../assets/images/brush.png')}
              style={styles.toothbrushImage}
            />
          </Animated.View>
          
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teethImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  arm: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center', // This centers the brushHolder at the top of the arm
  },
  // A static holder to position the brush at the end of the arm
  brushHolder: {
    position: 'absolute',
  },
  toothbrushImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default BrushingAnimation;