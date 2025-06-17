import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { addChildApi } from '../../api/children';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const AddChildScreen = () => {
  const { authState } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Prefer not to say'>('Male');
  const [password, setPassword] = useState('');

  // Time picker state
  const [morningTime, setMorningTime] = useState(new Date(new Date().setHours(8, 0, 0))); 
  const [nightTime, setNightTime] = useState(new Date(new Date().setHours(20, 0, 0))); 
  const [showTimePicker, setShowTimePicker] = useState<'morning' | 'night' | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  
  // Time formatting helper
  const formatTime = (date: Date) => {
    return date.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Hide the picker on Android after selection
    if (Platform.OS === 'android') {
      setShowTimePicker(null);
    }
    
    if (event.type === 'set' && selectedDate) {
      if (showTimePicker === 'morning') {
        setMorningTime(selectedDate);
      } else if (showTimePicker === 'night') {
        setNightTime(selectedDate);
      }
    }
  };

  const handleAddChild = async () => {
    // Validation
    if (!name || !age || !password) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }
    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      Alert.alert('Invalid PIN', 'The PIN must be exactly 4 numbers.');
      return;
    }

    setLoading(true);

    const childData = {
      name,
      age: parseInt(age, 10),
      gender,
      password,
      preferences: {
        morningBrushTime: formatTime(morningTime),
        nightBrushTime: formatTime(nightTime),
      },
    };

    try {
      if (!authState.token) {
        throw new Error('No authentication token found.');
      }
      
      await addChildApi(childData, authState.token);
      
      Alert.alert('Success!', `${name} has been added to your family.`);
      // Clear the form for the next entry
      setName('');
      setAge('');
      setGender('Male');
      setPassword('');

    } catch (error: any) {
      console.error('Failed to add child:', error.response?.data || error);
      Alert.alert('Error', error.response?.data?.message || 'Could not add child. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold mb-6 text-gray-800">Create a Profile for Your Child</Text>

        {/* --- Personal Details --- */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-600">Name</Text>
          <TextInput
            placeholder="e.g., Alex"
            value={name}
            onChangeText={setName}
            className="bg-white p-4 rounded-lg border border-gray-300 text-base"
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-600">Age</Text>
          <TextInput
            placeholder="e.g., 7"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            className="bg-white p-4 rounded-lg border border-gray-300 text-base"
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-600">Gender</Text>
          <View className="bg-white rounded-lg border border-gray-300">
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Prefer not to say" value="Prefer not to say" />
            </Picker>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-600">4-Digit Login PIN</Text>
          <TextInput
            placeholder="e.g., 1234"
            value={password}
            onChangeText={setPassword}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            className="bg-white p-4 rounded-lg border border-gray-300 text-base text-center tracking-widest"
          />
        </View>

        {/* --- Brushing Preferences --- */}
        <Text className="text-xl font-bold mb-4 text-gray-800">Brushing Times</Text>
        <View className="flex-row justify-around mb-6">
            <TouchableOpacity onPress={() => setShowTimePicker('morning')} className="items-center">
                <Text className="text-lg font-semibold text-gray-600">Morning</Text>
                <Text className="text-2xl font-bold text-indigo-600">{formatTime(morningTime)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker('night')} className="items-center">
                <Text className="text-lg font-semibold text-gray-600">Night</Text>
                <Text className="text-2xl font-bold text-indigo-600">{formatTime(nightTime)}</Text>
            </TouchableOpacity>
        </View>

        {/* The Actual Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={showTimePicker === 'morning' ? morningTime : nightTime}
            mode="time"
            is24Hour={true}
            display="spinner" // Or 'default'
            onChange={onTimeChange}
          />
        )}
        
        {/* --- Submit Button --- */}
        <TouchableOpacity
          onPress={handleAddChild}
          disabled={loading}
          className={`p-4 rounded-lg items-center shadow-lg ${loading ? 'bg-indigo-300' : 'bg-indigo-600'}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-xl font-bold">Add Child to Family</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddChildScreen;