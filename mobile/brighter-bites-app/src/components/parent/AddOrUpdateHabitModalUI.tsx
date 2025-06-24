import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { createHabitApi, updateHabitApi, Habit } from '../../api/habit';
import { addHabitToTodayApi } from '../../api/tasks';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

// --- PROPS INTERFACE ---
interface ModalUIProps {
  onClose: () => void;
  childId: string;
  onHabitSaved: () => void;
  existingHabit: Habit | null;
}

const AddOrUpdateHabitModalUI = ({ onClose, childId, onHabitSaved, existingHabit }: ModalUIProps) => {
  const { authState } = useAuth();
  const isUpdateMode = !!existingHabit;

  // --- FORM STATE ---
  const [name, setName] = useState(existingHabit?.name || '');
  const [description, setDescription] = useState(existingHabit?.description || '');
  const [addToToday, setAddToToday] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // --- ANIMATION STATE ---
  // We will animate the content box itself.
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Trigger the "enter" animation when the component mounts.
  useEffect(() => {
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 200 });
  }, []);

  // --- HANDLERS ---
  const handleSave = async () => {
    // ... same exact handleSave logic as before ...
  };
  
  const handleClose = () => {
    // Trigger the "exit" animation, then call the onClose prop after a delay
    scale.value = withTiming(0.9, { duration: 200, easing: Easing.in(Easing.exp) });
    opacity.value = withTiming(0, { duration: 150 });
    
    setTimeout(() => {
      onClose(); // This will call router.back()
    }, 200);
  };

  return (
    // This top-level View acts as the semi-transparent backdrop
    <View className="flex-1 justify-center items-center bg-black/50 px-6">
      <Pressable onPress={handleClose} className="absolute inset-0" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="w-full"
      >
        {/* This is the animated white content box */}
        <Animated.View style={animatedContainerStyle} className="bg-white p-6 rounded-2xl shadow-xl w-full">
          <Text className="text-2xl font-bold mb-4 text-gray-800">
            {isUpdateMode ? 'Update Habit' : 'New Custom Habit'}
          </Text>
          
          <TextInput
            placeholder="Habit Name (e.g., Make Bed)"
            value={name}
            onChangeText={setName}
            className="bg-gray-100 p-4 rounded-lg mb-4 text-base"
          />
          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            className="bg-gray-100 p-4 rounded-lg mb-6 text-base"
          />
            
          {!isUpdateMode && (
            <View className="flex-row items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
              <Text className="text-base text-gray-700">Add to today's mission?</Text>
              <Switch
                trackColor={{ false: "#D1D5DB", true: "#818CF8" }}
                thumbColor={addToToday ? "#4F46E5" : "#F9FAFB"}
                onValueChange={setAddToToday}
                value={addToToday}
              />
            </View>
          )}

          <View className="flex-row justify-end items-center">
            <TouchableOpacity onPress={handleClose} className="py-3 px-5" disabled={isLoading}>
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              className="bg-indigo-600 py-3 px-5 rounded-lg ml-4 min-w-[120px] items-center"
            >
              {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">{isUpdateMode ? 'Save Changes' : 'Add Habit'}</Text>}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddOrUpdateHabitModalUI;