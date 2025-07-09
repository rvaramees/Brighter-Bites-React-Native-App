import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { getCalendarDataApi, DailyRecordForCalendar } from '../../api/tasks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { router } from 'expo-router';

// A reusable progress bar component for the player's level
const ProgressBar = ({ progress = 0 }: { progress: number }) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  return (
    <View className="w-full bg-gray-200 rounded-full h-4 mt-1 border border-gray-300">
      <Animated.View 
        className="bg-yellow-400 rounded-full h-full" 
        style={{ width: `${clampedProgress * 100}%` }} 
      />
    </View>
  );
};

const PlayerInfo = () => {
  const { authState } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [calendarData, setCalendarData] = useState<DailyRecordForCalendar[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  // --- Animation Setup ---
  const collapsedHeight = 100;
  const expandedHeight = 480; // A fixed, generous height for the expanded view
  const animatedHeight = useSharedValue(collapsedHeight);
  const animatedRotation = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animatedHeight.value, { duration: 300 }),
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${animatedRotation.value}deg` }],
    };
  });

  // --- Data Fetching ---
  const fetchCalendarData = useCallback(async () => {
    if (!authState.token) return;
    setIsLoadingCalendar(true);
    try {
      const data = await getCalendarDataApi(authState.token);
      setCalendarData(data);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    } finally {
      setIsLoadingCalendar(false);
    }
  }, [authState.token]);

  // --- Handlers ---
  const toggleExpansion = () => {
    if (isExpanded) {
      animatedHeight.value = collapsedHeight;
      animatedRotation.value = withTiming(0);
    } else {
      animatedHeight.value = expandedHeight;
      animatedRotation.value = withTiming(180);
      // Fetch data only when expanding for the first time or on demand
      if (calendarData.length === 0) {
        fetchCalendarData();
      }
    }
    setIsExpanded(!isExpanded);
  };

  // --- Calendar and Level Calculation ---
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayOfWeek = getDay(monthStart); // 0=Sun, 1=Mon,...
//   const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const score = authState.user?.points || 0;
  const level = Math.floor(score / 100) + 1;
  const pointsForNextLevel = 100;
  const pointsInCurrentLevel = score % 100;
  const progress = pointsInCurrentLevel / pointsForNextLevel;

  return (
    <Animated.View style={animatedContainerStyle} className="bg-white w-full rounded-b-3xl shadow-lg overflow-hidden absolute top-0 z-10 border-b border-gray-200">
      <View className="flex-1">
        {/* === Collapsed View Content (Always Rendered) === */}
        <View className="p-5 flex-row items-center h-[100px]">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800" numberOfLines={1}>{authState.user?.name}</Text>
            <Text className="text-gray-500">Level {level}</Text>
            <Text className="text-gray-500">Points {score}</Text>
            <ProgressBar progress={progress} />
          </View>
          <TouchableOpacity onPress={() => {router.replace('/(child)/settings')}} className="p-2 ml-4">
            <Animated.View style={animatedIconStyle}>
              <Ionicons name="settings-outline" size={30} color="#374151" />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleExpansion} className="p-2 ml-4">
            <Animated.View style={animatedIconStyle}>
              <Ionicons name="chevron-down" size={30} color="#374151" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* === Expanded View Content (Calendar) === */}
        {/* The ScrollView allows the content to overflow and be scrollable */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="px-5 pb-5">
            <Text className="text-lg font-bold text-center mb-2 text-gray-700">{format(today, 'MMMM yyyy')}</Text>
            
            {/* Weekday Headers
            <View className="flex-row justify-around mb-2">
              {weekDays.map((day, index) => <Text key={index} className="w-12 text-center font-bold text-gray-400">{day}</Text>)}
            </View>
             */}
            {isLoadingCalendar ? (
              <ActivityIndicator className="mt-8" />
            ) : (
              <View className="flex-row flex-wrap justify-center">
                {/* Pad the beginning of the month with empty views */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => <View key={`empty-${index}`} className="w-12 h-12 m-3"/>)}
                
                {/* Render each day of the month */}
                {daysInMonth.map((day) => {
                  const record = calendarData.find(r => isSameDay(new Date(r.date), day));
                  const stars = 2;
                  
                  return (
                    <View key={day.toISOString()} className="w-16 h-16 m-1 p-2 bg-cyan-50 rounded-lg justify-start items-center border border-cyan-100">
                      <Text className="font-bold text-cyan-800 text-xl">{format(day, 'd')}</Text>
                      {record && (
                        <View className="flex-row absolute bottom-1.5">
                          {Array.from({ length: stars }).map((_, i) => 
                             <Ionicons key={i} name="star" size={14} color={record.challengeCompleted ? "#F59E0B" : "#FBBF24"} />
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default PlayerInfo;