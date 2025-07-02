import {
  Canvas,
  Circle,
  Image,
  Group, // <-- Import the Group component
  useImage,
  makeImageFromView,
} from "@shopify/react-native-skia";
import React, { useEffect } from 'react';
import { useSharedValue } from "react-native-reanimated";
import { View, Text } from 'react-native'

export default function Demo() {
    // The useImage hook correctly loads the image data for Skia to use.
    // Ensure the path to your image is correct.
    const image = useImage(require('../../../assets/images/teeth.png'));

    // --- IMPORTANT CHECK ---
    // The useImage hook returns `null` while the image is loading.
    // The <Image /> component will crash if you pass `null` to its `image` prop.
    // We must wait for the image to be loaded before rendering the Canvas.
    if (!image) {
        // You can return a loading indicator or null
        return (
            <View style={{ height: 200, width: 200, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading Image...</Text>
            </View>
        );
    }

    return (
        <Canvas style={{ height: 200, width: 200 }}>
            {/* 
                Wrap all your drawing elements inside a <Group>.
                This creates a stable drawing hierarchy and is the recommended practice.
            */}
            <Group>
                <Image 
                    image={image} 
                    x={0} 
                    y={0} 
                    width={200} 
                    height={200} 
                />
                <Circle 
                    cx={100} // Use cx and cy for circle center coordinates
                    cy={100} 
                    r={25} 
                    color="lightblue" 
                />
            </Group>
        </Canvas>
    );
}