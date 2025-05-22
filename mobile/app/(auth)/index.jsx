import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import styles from '../../assets/styles/login.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { Link } from 'expo-router'
import { useAuthStore } from '../../store/authStore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { isLoading, login, isCheckingAuth } = useAuthStore()

  const handleLogin = async() => {
    const result = await login(email, password)
    if (!result.success) Alert.alert("Error", result.error)
   }

   if (isCheckingAuth) return null

  return (
    <KeyboardAvoidingView
      style={{ flex:1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
     <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image 
         source={require('../../assets/images/i.png')}
         style={styles.illustrationImage}
         resizeMode='contain'
        />
      </View>

      <View style={styles.card}>
        <View style={styles.formContainer}>

           {/* 邮箱 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>邮箱</Text>
            <View style={styles.inputContainer}>
               <Ionicons 
                name='mail-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
               />
               <TextInput 
                 style={styles.input}
                 placeholder='请输入邮箱'
                 placeholderTextColor={COLORS.placeholderText}
                 value={email}
                 onChangeText={setEmail}
                 keyboardType='email-address'
                 autoCapitalize='none'
               />
            </View>
          </View>

          {/* 密码 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>密码</Text>
            <View style={styles.inputContainer}>
               <Ionicons 
                name='lock-closed-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
               />
               <TextInput 
                 style={styles.input}
                 placeholder='请输入密码'
                 placeholderTextColor={COLORS.placeholderText}
                 value={password}
                 onChangeText={setPassword}
                 secureTextEntry={!showPassword}
               />
               <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
               >
                <Ionicons 
                 name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                 size={20}
                 color={COLORS.primary}
                />
               </TouchableOpacity>
            </View>
          </View>

          {/* 登录按钮 */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <Text style={styles.buttonText}>登录</Text>
            )}
          </TouchableOpacity>

          {/* 登录页脚 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>未注册账号？</Text>
            <Link href='/signup' asChild>
              <TouchableOpacity>
                <Text style={styles.link}>注册</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </View>
     </View>
    </KeyboardAvoidingView>
  )
}

export default Login