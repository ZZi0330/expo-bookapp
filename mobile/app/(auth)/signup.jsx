import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native'
import styles from '../../assets/styles/signup.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore'

const Signup = () => {

   // 返回路由
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Zustand 状态管理
  const {user, isLoading, register} = useAuthStore()

  const handleSignUp = async () => {
    const result = await register(username, email, password)
    if (!result.success) Alert.alert("Error", result.error)
  }


  return (
  <KeyboardAvoidingView
    style={{ flex:1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.container}>
      <View style={styles.card}>

        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>BookWorm📚🐛</Text>
          <Text style={styles.subtitle}>分享你最喜欢的书</Text>
        </View>

        {/* 用户名注册 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>用户名</Text>
          <View style={styles.inputContainer}>
            <Ionicons 
            name='person-outline'
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
            />
            <TextInput 
            style={styles.input}
            placeholder='请输入用户名'
            placeholderTextColor={COLORS.placeholderText}
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
            />
          </View>
        </View>

         {/* 邮箱注册 */}
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
                //  keyboardType='email-address'
                 autoCapitalize='none'
               />
            </View>
          </View>

         {/* 密码注册 */}
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

          {/* 注册按钮 */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <Text style={styles.buttonText}>注册</Text>
            )}
          </TouchableOpacity>

          {/* 注册页脚 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>已注册账号？</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>登录</Text>
              </TouchableOpacity> 
          </View>

      </View>
    </View>
   </ScrollView>
  </KeyboardAvoidingView>
  )
}

export default Signup