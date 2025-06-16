import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Using a popular icon library

// Import the screens that will be part of the tabs
import ChildrenListScreen from '../screens/parent/ChildrenListScreen';
import AddChildScreen from '../screens/parent/AddChildScreen';
import ParentSettingsScreen from '../screens/parent/ParentSettingsScreen';

// It's a best practice to type-check the parameters for your navigator.
// This tells TypeScript which routes are available in this specific navigator.
export type ParentTabParamList = {
  ChildrenList: undefined; // 'undefined' means the route takes no parameters
  AddChild: undefined;
  Settings: undefined;
};

// Create the tab navigator instance
const Tab = createBottomTabNavigator<ParentTabParamList>();

const ParentTabNavigator = () => {
  return (
    <Tab.Navigator
      // `screenOptions` allows you to configure all screens in the navigator at once.
      // It can be a function that receives the `route` prop for customization.
      screenOptions={({ route }) => ({
        headerShown: true, // Show a header at the top of each tab screen
        headerStyle: {
          backgroundColor: '#4F46E5', // A nice indigo color
        },
        headerTintColor: '#fff', // White color for header text and icons
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#4F46E5', // Color for the active tab icon and label
        tabBarInactiveTintColor: 'gray',   // Color for inactive tabs
        tabBarIcon: ({ focused, color, size }) => {
          // This function determines which icon to show for each tab.
          // The `focused` boolean is true if the tab is currently active.
          let iconName: React.ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'ChildrenList') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'AddChild') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else {
            iconName = 'ellipse-outline'; // A fallback icon
          }

          // Return the icon component from the vector icons library
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Define each tab as a Tab.Screen component */}
      <Tab.Screen
        name="ChildrenList"
        component={ChildrenListScreen}
        options={{
          title: 'My Children', // This sets the header title
        }}
      />
      <Tab.Screen
        name="AddChild"
        component={AddChildScreen}
        options={{
          title: 'Add a Child',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ParentSettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default ParentTabNavigator;