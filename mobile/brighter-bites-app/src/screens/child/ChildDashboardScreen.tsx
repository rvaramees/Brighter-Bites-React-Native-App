import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { getTodaysTasksApi } from '../../api/tasks'; // Assuming you create this API function
import MissionModal from '../../components/ui/MissionModal'; // Import our new modal
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Interface to match the DailyRecord schema from the backend
interface DailyRecord {
  morningBrush: { status: 'Pending' | 'Completed' };
  nightBrush: { status: 'Pending' | 'Completed' };
  customHabits: { name: string; status: 'Pending' | 'Completed' }[];
  dailyChallenge: { status: 'Pending' | 'Completed' };
}

// A simple component to render each task item in the modal
const TaskItem = ({ name, status }: { name: string; status: string }) => (
  <View className="flex-row items-center bg-white/70 p-3 rounded-xl mb-2">
    {status === 'Completed' ? (
      <Ionicons name="checkmark-circle" size={28} color="#10B981" />
    ) : (
      <Ionicons name="ellipse-outline" size={28} color="#64748B" />
    )}
    <Text className={`text-lg ml-3 ${status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
      {name}
    </Text>
  </View>
);

const ChildDashboardScreen = () => {
  const { authState } = useAuth();
  const [todaysRecord, setTodaysRecord] = useState<DailyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!authState.token) return;
      try {
        setLoading(true);
        const data = await getTodaysTasksApi(authState.token);
        setTodaysRecord(data);
        // Show the mission modal once data is fetched
        setModalVisible(true); 
      } catch (error) {
        console.error("Failed to fetch today's tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [authState.token]);

  if (loading || !todaysRecord) {
    return (
      <View className="flex-1 justify-center items-center bg-emerald-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-4 text-gray-500">Loading your mission...</Text>
      </View>
    );
  }

  // Combine all tasks into a single list for the modal
  const allTasks = [
    { name: 'Brush in the Morning', status: todaysRecord.morningBrush.status },
    { name: 'Brush at Night', status: todaysRecord.nightBrush.status },
    ...todaysRecord.customHabits.map(habit => ({ name: habit.name, status: habit.status })),
    { name: 'Daily Challenge!', status: todaysRecord.dailyChallenge.status },
  ];

  console.log(allTasks);

  return (
    <View className="flex-1 items-center justify-center bg-emerald-50 p-5">
       <TouchableOpacity
              onPress={() => router.push('/(child)/settings')}
              className="absolute top-16 right-5 z-10" // Adjust top-16 as needed for safe area
            >
              <View className="bg-white/80 p-3 rounded-full shadow-md backdrop-blur-sm">
                <Ionicons name="settings-outline" size={28} color="#059669" />
              </View>
            </TouchableOpacity>
      <Text className="text-3xl font-bold text-emerald-700 mb-2">
        Hi, {authState.user?.name}!
      </Text>
      <Text className="text-xl text-gray-600 mb-10">
        Ready to make your teeth sparkle?
      </Text>

      {/* Main game area placeholder */}
      <View className="w-full h-1/2 bg-white rounded-2xl shadow-lg justify-center items-center p-4">
        <Text className="text-lg text-gray-500">Your brushing game will be here!</Text>
      </View>

      {/* The Mission Modal */}
      <MissionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Today's Mission"
      >
        <FlatList
          data={allTasks}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => <TaskItem name={item.name} status={item.status} />}
        />
      </MissionModal>
    </View>
  );
};

export default ChildDashboardScreen;