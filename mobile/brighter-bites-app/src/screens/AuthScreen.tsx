import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import React from 'react';
// --- THIS IS THE FIX ---
// Change the import from '@react-navigation/native' to 'expo-router'
import { Link } from 'expo-router'; 
import { BlurView } from 'expo-blur'; // Import BlurView if you want to use it for background blur

const AuthScreen = () => {
  return (
    <ImageBackground 
      source={require('../../assets/images/start.png')} // Update path if needed
      imageStyle={{opacity: 0.6}}
      className="flex-1"
    >
      
    <View className="flex-1 items-center py-56">
      <View 
        className='flex-1 shadow-black items-center justify-center h-auto w-96 rounded-xl'
      >
      <BlurView 
        intensity={0}
        tint='light'
        style={{ 
          position: 'absolute',
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          borderRadius: 20, 
          borderWidth: 5, 
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}
      />
        <View className="items-center mb-10 rounded-xl">
          <Image source={require('../../assets/images/maintitle.png')} style={{ width: 250, height: 150 }} />
          <Text className="text-black text-lg font-bold">Your journey to a healthier smile!</Text>
        </View>

        <View className="w-4/5">
        {/* TODO: Create and link to a login screen */}
          <Link href="/childLogin" asChild>
            <TouchableOpacity className="bg-white/90 p-4 rounded-xl items-center mb-4">
              <Text className="text-blue-500 text-lg font-bold">Child Login</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/login" asChild>
            <TouchableOpacity className="bg-white/90 p-4 rounded-xl items-center mb-4">
              <Text className="text-blue-500 text-lg font-bold">Parent Login</Text>
            </TouchableOpacity>
          </Link>
        
        {/* Now this href will be correctly typed and the error will disappear */}
          <Link href="/register" asChild>
            <TouchableOpacity className="bg-blue-500/70 p-4 rounded-xl items-center border border-white/50 mb-4">
              <Text className="text-white text-lg font-bold">Register New Parent</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
    </ImageBackground>
  );
};

export default AuthScreen;