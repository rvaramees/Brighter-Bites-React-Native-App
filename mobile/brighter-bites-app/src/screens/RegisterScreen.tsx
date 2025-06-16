import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { registerParent } from '../api/auth';

const RegisterScreen = () => {
  const router = useRouter();
  const [parentname, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Optional phone field
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!parentname || !email || !password ) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerParent({ parentname, email, password });
      
      Alert.alert(
        'Registration Successful!',
        `Welcome, ${parentname}! You can now log in.`,
        [{ text: 'OK', onPress: () => router.back() }] // Go back to Auth screen on OK
      );

    } catch (error: any) {
      // Use the server's error message if it exists
      const message = error.response?.data?.message || 'An unknown error occurred.';
      Alert.alert('Registration Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center pt-8">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-3xl font-bold mb-2 text-center">Create Account</Text>
        <Text className="text-md text-gray-600 mb-8 text-center">Join Brighter Bites as a Parent</Text>

        <TextInput
          className="bg-white p-4 rounded-lg mb-4 text-lg border border-gray-200"
          placeholder="Full Name"
          value={parentname}
          onChangeText={setParentName}
        />
        <TextInput
          className="bg-white p-4 rounded-lg mb-4 text-lg border border-gray-200"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white p-4 rounded-lg mb-6 text-lg border border-gray-200"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className={`p-4 rounded-lg items-center ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-lg">
            {isLoading ? 'Creating Account...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 p-2"
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text className="text-center text-blue-500">Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;