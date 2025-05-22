import { View, Text } from 'react-native'
import React from 'react'
import {Tabs} from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function TabLayout() {
    const insets = useSafeAreaInsets();
  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        headerTitleStyle: { 
            color: COLORS.textPrimary,
            fontWeight: '600',
        },
        headerShadowVisible: false,
        tabBarStyle: {
            backgroundColor: COLORS.cardBackground,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 5,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom
        }
    }}
    >
        <Tabs.Screen 
        name="index" 
        options={{
            title: '主页',
            tabBarIcon: ({ color, size }) => <Ionicons 
            name="home-outline" size={size} color={color} />
        }}
        />
        <Tabs.Screen 
        name="create" 
        options={{
            title: '创建',
            tabBarIcon: ({ color, size }) => <Ionicons 
            name="add-circle-outline" size={size} color={color} />
        }}
        />
        <Tabs.Screen 
        options={{
            title: '设置',
            tabBarIcon: ({ color, size }) => <Ionicons 
            name="person-outline" size={size} color={color} />
        }}
        name="profile" 
        />

    </Tabs>
  )
}