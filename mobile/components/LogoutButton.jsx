import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import styles from '../assets/styles/profile.styles'
import {Ionicons} from '@expo/vector-icons'
import COLORS from '../constants/colors'

export default function LogoutButton() {
  const { logout } = useAuthStore()

  const confirmLogout = () => {
    Alert.alert(
      '退出',
      '确定退出?',
      [
        { text: '取消', style: 'cancel' },
        { text: '退出', onPress: () => logout(), styles: 'destructive' },
      ],
    )
  }

  return (
    <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
      <Text style={styles.logoutText}>退出</Text>
    </TouchableOpacity>
  )
}