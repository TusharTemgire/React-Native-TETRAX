import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import {useAuth} from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ProjectsScreen from '../screens/main/ProjectsScreen';
import TasksScreen from '../screens/main/TasksScreen';
import IssuesScreen from '../screens/main/IssuesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Text className="text-lg font-semibold text-blue-600">Loading...</Text>
  </View>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Simple text-based tab icons for better Expo compatibility
const TabIcon = ({label, focused}: {label: string; focused: boolean}) => (
  <Text className={`text-xs ${focused ? 'text-blue-600' : 'text-gray-500'}`}>
    {label}
  </Text>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#64748b',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
      },
    }}>
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({focused}) => <TabIcon label="🏠" focused={focused} />,
      }}
    />
    <Tab.Screen 
      name="Projects" 
      component={ProjectsScreen}
      options={{
        tabBarLabel: 'Projects',
        tabBarIcon: ({focused}) => <TabIcon label="📁" focused={focused} />,
      }}
    />
    <Tab.Screen 
      name="Tasks" 
      component={TasksScreen}
      options={{
        tabBarLabel: 'Tasks',
        tabBarIcon: ({focused}) => <TabIcon label="📋" focused={focused} />,
      }}
    />
    <Tab.Screen 
      name="Issues" 
      component={IssuesScreen}
      options={{
        tabBarLabel: 'Issues',
        tabBarIcon: ({focused}) => <TabIcon label="🚨" focused={focused} />,
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({focused}) => <TabIcon label="👤" focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs} 
      options={{headerShown: false}}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{
        title: 'Notifications',
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          color: '#111827',
        },
      }}
    />
  </Stack.Navigator>
);

export const AppNavigator: React.FC = () => {
  const {user, token, isLoading} = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return user && token ? <MainStack /> : <AuthStack />;
};