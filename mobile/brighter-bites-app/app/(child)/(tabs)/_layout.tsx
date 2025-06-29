import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChildTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Let the tabs control their own headers
        headerStyle: { backgroundColor: '#10B981' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: 'blue', // A darker green for the active tab
        tabBarInactiveTintColor: 'blue',
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          position: 'absolute', // Lift the tab bar out of the normal document flow
          bottom: 20,           // Distance from the bottom of the screen
          left: 20,             // Distance from the left
          right: 20,            // Distance from the right
          paddingTop: 10, // Horizontal padding for the tab bar
          // --- Styling for the floating look ---
          elevation: 0,         // Remove shadow on Android
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
          borderRadius: 25,       // Highly rounded corners
          height: 80,             // A bit taller for a modern feel
            justifyContent: 'center', // Center the items vertically
          alignItems: 'center',      // Adjust padding for icon/label placement

          // --- Shadow for iOS ---
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index" // This corresponds to index.tsx
        options={{
          title: 'My Garden',
          headerShown: false, // Hide the header for this screen
          tabBarIcon: ({ color, focused }) => 
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
       name='brusher'
       options={{
          title: 'Brusher',
          tabBarIcon: ({ color, focused }) => 
            <Ionicons name={focused ? 'brush' : 'brush-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits" // corresponds to habits.tsx
        options={{
          title: 'My Habits',
          tabBarIcon: ({ color, focused }) => 
            <Ionicons name={focused ? 'list-circle' : 'list-circle-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="challenges" // corresponds to challenges.tsx
        options={{
          title: 'Challenges',
          tabBarIcon: ({ color, focused }) => 
            <Ionicons name={focused ? 'game-controller' : 'game-controller-outline'} size={28} color={color} />,
        }}
      />
       <Tabs.Screen
        name="tutorials" // corresponds to tutorials.tsx
        options={{
          title: 'How to Play',
          tabBarIcon: ({ color, focused }) => 
            <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}