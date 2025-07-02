import { Camera, CameraView } from "expo-camera";
import { useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";

interface CameraToggleProps {
  /** The parent tells us if the camera should be active or not. */
  isActive: boolean;
  /** A function for this component to call when it needs to be closed (e.g., user presses 'X'). */
  onDeactivate: () => void;
};

const Mirror = ({ isActive, onDeactivate }: CameraToggleProps) => {
   
  // Use Expo's built-in hook for handling camera permissions.
  const [cameraPermission, requestPermission] = useCameraPermissions();

  // This `useEffect` hook handles the logic of requesting permission
  // only when the parent component tries to activate the camera.
  useEffect(() => {
    // If the parent wants to activate the camera (`isActive` is true) but we don't have permission yet...
    if (isActive && !cameraPermission?.granted) {
      (async () => {
        // ...then we request it.
        const { granted } = await requestPermission();
        if (!granted) {
          // If the user denies the request, show an alert and call the `onDeactivate`
          // function to tell the parent component to switch back to the placeholder view.
          Alert.alert("Permission Denied", "To use this feature, please enable camera access in your device's settings.");
          onDeactivate();
        }
      })();
    }
  }, [isActive, cameraPermission, requestPermission, onDeactivate]); // Dependencies for the effect

  // --- RENDER LOGIC ---

  // While we wait for the initial permission status check, show a loading indicator.
  if (!cameraPermission) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" />
      </View>
    );
  }


  if(isActive && cameraPermission.granted){
    return (
      <CameraView
      facing="front" // Use the front camera
      style={{ width: '100%', height: '100%', borderRadius: 10 }}/>
    )
  }else{
    return(
      <LinearGradient 
//   // These are the "CSS" properties for the gradient, passed as props
        colors={['white', 'lightblue']}
        style={styles.gradient} // Use the styles defined below
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      /> 
    )
  }
}
const styles = StyleSheet.create({
gradient: {
  borderRadius: 10, // Match the border radius of the card
    height: '100%',
    width: '100%', // Make it fill the container's width
  },
});

export default Mirror;