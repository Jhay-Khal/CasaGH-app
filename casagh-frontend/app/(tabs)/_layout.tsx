import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.green700,
      tabBarInactiveTintColor: theme.colors.inkSoft,
      tabBarStyle: {
        backgroundColor: theme.colors.white,
        borderTopColor: theme.colors.line,
        height: 60,
        paddingBottom: 8,
      },
      headerStyle: {
        backgroundColor: theme.colors.white,
      },
      headerTitleStyle: {
        fontFamily: theme.fontFamily.headSemiBold,
        color: theme.colors.green900,
      },
      headerShadowVisible: false,
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Explore',
          tabBarLabel: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="saved" 
        options={{ 
          title: 'Saved',
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="inbox" 
        options={{ 
          title: 'Inbox',
          tabBarLabel: 'Inbox',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="bookings" 
        options={{ 
          title: 'Bookings',
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="upload" 
        options={{ 
          title: 'List a Property',
          headerShown: false,
          href: null,
        }} 
      />
    </Tabs>
  );
}