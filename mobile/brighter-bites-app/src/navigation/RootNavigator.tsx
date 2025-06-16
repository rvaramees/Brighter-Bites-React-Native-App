import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StatusBar, View } from 'react-native';

// Import your context and custom hook
import { AuthProvider} from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth'; // Custom hook to access auth state

// Import ALL your screens and navigators
import IntroScreen from '../screens/IntroScreen';   // Your existing screen
import AuthScreen from '../screens/AuthScreen';     // Your existing screen with Login/Register buttons
import LoginScreen from '../screens/LoginScreen';   // The screen with the login form
import RegisterScreen from '../screens/RegisterScreen'; // The screen with the register form
import ParentTabNavigator from './ParentTabNavigator';
import ChildDashboardScreen from '../screens/child/ChildDashboardScreen';

/**
 * This is the stack for when a user is NOT authenticated.
 * It now includes your Intro and Auth selection screens.
 */
const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

/**
 * This is the main navigator component.
 * It uses the authentication state to decide which main stack to show.
 */
const AppNavigator = () => {
  const { authState } =  useAuth(); // Access the auth state from context
  
  // A brief loading indicator while checking for a stored token.
  if (authState.token !== null && authState.user === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authState.authenticated ? (
        // User is LOGGED IN, show the correct app based on type
        authState.user?.type === 'parent' ? (
          <Stack.Screen name="ParentApp" component={ParentTabNavigator} />
        ) : (
          <Stack.Screen name="ChildApp" component={ChildDashboardScreen} />
        )
      ) : (
        // User is NOT LOGGED IN, show the entire authentication flow stack
        <Stack.Screen name="AuthFlow" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

/**
 * This is the absolute root component for navigation.
 */
const RootNavigator = () => {
  return (
    // The AuthProvider makes the authState and login/logout functions
    // available to all components within the NavigationContainer.
      <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      </AuthProvider>
  );
};

export default RootNavigator;