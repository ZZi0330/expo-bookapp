import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import styles from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useAuthStore } from '../../store/authStore'
import { API_URL } from '../../constants/api'

export default function Create() {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [rating, setRating] = useState(3)

  //to display the selected image
  const [image, setImage] = useState(null)

  const [imageBase64, setImageBase64] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const {token} = useAuthStore()

  const pickImage = async() => {
    try {
      // 是否允许上传图片
      if (Platform.OS === 'ios') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('需要获得访问摄像机的许可用于上传图片')
          return
        }
      }

      // 选择图片
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // lower quality for smaller base64 image
        base64: true,
      })

      if(!result.canceled) {
        setImage(result.assets[0].uri)
        // is base64 is provider, use it
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64)
        } else {
          // otherwise convert uri to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          })
          setImageBase64(base64)
        }
      }
    } catch (error) {
      console.log('Error picking image', error)
      Alert.alert('错误选择图片')
    }
  }


  const handleSubmit = async() => {
    if (!title || !caption  || !imageBase64 || !rating) {
      Alert.alert('请填写完整信息')
      return
    }
    try {
      setLoading(true)
      const uriParts = image.split('.')
      const fileType = uriParts[uriParts.length - 1]
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : `image/jpeg`

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`

      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,
          rating,
          image: imageDataUrl,
        }),
      })

    const data = await response.json()
    Alert.alert('创建成功');
    setTitle('');
    setCaption('');
    setRating(3);
    setImage(null);
    setImageBase64(null);
    router.push('/');
 
  } catch (error) {
    console.error('Error creating book', error)
    Alert.alert('创建失败', error.message)
  } finally {
    setLoading(false)
  }
}

    // 星星选择
  const renderRatingPicker = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
       <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
        <Ionicons 
        name={i <= rating ? 'star' : 'star-outline'}
        size={32}
        color={i <= rating ? '#f4b400' : COLORS.textSecondary}
        />
       </TouchableOpacity>
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>
  }

  return (
    <KeyboardAvoidingView
    style={{ flex:1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
            {/* 提示语 */}
          <View style={styles.header}>
            <Text style={styles.title}>书籍推荐📚</Text>
            <Text style={styles.subtitle}>分享你最爱的书籍给大家</Text>
          </View>
          {/* 标题 */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>书籍标题</Text>
              <View style={styles.inputContainer}>
                <Ionicons 
                name='book-outline'
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
                />
                <TextInput 
                style={styles.input}
                placeholder='请输入书籍标题'
                value={title}
                placeholderTextColor={COLORS.placeholderText}
                onChangeText={setTitle}
                />
              </View>

            </View>

            {/* 星级 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>星级</Text>
              {renderRatingPicker()}
            </View>

            {/* 照片 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>书籍照片</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                 <View style={styles.placeholderContainer}>
                  <Ionicons name='image-outline' size={40} color={COLORS.textSecondary}/>
                  <Text style={styles.placeholderText}>选择照片</Text>
                 </View>
                )}
              </TouchableOpacity>
            </View>

            {/* 推荐 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>推荐</Text>
              <TextInput
              style={styles.textArea}
              placeholder='请输入你的推荐理由'
              value={caption}
              placeholderTextColor={COLORS.placeholderText}
              multiline
              onChangeText={setCaption}
              />
            </View>

            {/* 提交按钮 */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                 <Ionicons 
                 name='cloud-upload-outline'
                 size={20}
                 color={COLORS.white}
                 style={styles.buttonIcon}
                 />
                <Text style={styles.buttonText}>分享</Text>
                </>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}