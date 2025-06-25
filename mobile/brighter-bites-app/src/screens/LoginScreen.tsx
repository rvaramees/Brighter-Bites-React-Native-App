import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { loginParent } from '../api/auth'; // Import your API function
import { useAuth } from '../hooks/useAuth'; // Custom hook to access auth context
import { router } from 'expo-router';
import { Input } from '../components/ui/Input';

const LoginScreen = () => {
  const { login } = useAuth(); // Get the login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async () => {
    if (isLoading) return; // Prevent multiple submissions
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginParent({ email, password });
      await login(response.user, response.token); // Call the login function from context
      // ---- SUCCESS! ----
      console.log('Login Successful!', response);
      // Alert.alert('Success', `Welcome! Your token is: ${response.token.substring(0, 20)}...`);

    } catch (error) {
      // --- FAILURE! ---
      console.log('Login failed on the screen.');
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      // This runs whether the login succeeds or fails
      setIsLoading(false);
    }
  };

  const back = () => {
    router.replace('/(auth)/auth');
  }

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="text-3xl font-bold mb-6">Parent Login</Text>
      
      <Input

        label='Email'
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label='Password'
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity
        className={`p-4 rounded-lg items-center ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text className="text-white font-bold text-lg">
          {isLoading ? 'Logging In...' : 'Login'}
        </Text>
      </TouchableOpacity>

    <TouchableOpacity
        className={`p-4 rounded-lg items-center  bg-blue-500 mt-4`}
        onPress={back}
      >
        <Text className="text-white font-bold text-lg">
          Go back
        </Text>
      </TouchableOpacity>
      

    </View>
  );
};

export default LoginScreen;