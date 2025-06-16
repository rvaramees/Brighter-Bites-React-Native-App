// App.tsx

import '@/global.css';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler'; // Recommended to have at the very top
import 'react-native-reanimated'; // Ensure this is imported for animations to work properly
import RootNavigator from './src/navigation/RootNavigator';

// You might also wrap your app in other "Providers" here, for example:
// - A Redux/Zustand Provider for state management
// - A Theme Provider for theming
// - An Auth Provider to manage user session

export default function App() {
  return <RootNavigator/>
}