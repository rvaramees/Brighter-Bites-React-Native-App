import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/hooks/useAuth'; // Adjust path
import { TouchableOpacity } from 'react-native';

export default function ParentTabsLayout() {
  const { logout } = useAuth(); // Example of using logout in the header

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        headerStyle: { backgroundColor: '#6366F1' },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="childrenList"
        options={{
          title: 'My Children',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="addChild"
        options={{
          title: 'Add Child',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="cog-outline" size={size} color={color} />,
          // You can even add a logout button to the header like this
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}