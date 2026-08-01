import React, { useEffect, useState, useCallback } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { theme } from '../../theme';
import { getUnreadMessageCount } from '../../services/api';

export default function TabLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) return;
      const userId = parseInt(userIdStr, 10);
      const count = await getUnreadMessageCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 15000); // refresh every 15s
      return () => clearInterval(interval);
    }, [loadUnreadCount])
  );

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
          tabBarIcon: ({ color, size }) => <Ionicons name="earth" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="saved" 
        options={{ 
          title: 'Saved',
          tabBarLabel: 'Saved',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="inbox" 
        options={{ 
          title: 'Inbox',
          tabBarLabel: 'Inbox',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }} 
      />
      <Tabs.Screen 
        name="bookings" 
        options={{ 
          title: 'Bookings',
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />
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