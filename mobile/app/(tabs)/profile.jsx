import { View, Text, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { API_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'
import styles from '../../assets/styles/profile.styles'
import LogoutButton from '../../components/LogoutButton'
import ProfileHeader from '../../components/ProfileHeader'
import { Ionicons } from '@expo/vector-icons'
import {Image} from 'expo-image'
import COLORS from '../../constants/colors'
import { RefreshControl } from 'react-native'
import { sleep } from '.'
import Loader from '../../components/Loader'

export default function profile() {

  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletBookId, setDeleteBookId] = useState(null)

  const router = useRouter()

  const { token } = useAuthStore()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || '获取失败')
      setBooks(data)
    } catch (error) {
      console.log('无法获取书籍',error)
      Alert.alert('获取失败', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteBook = async(bookId) => {
     try {
      setDeleteBookId(bookId)
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()  
      if (!response.ok) throw new Error(data.message || '删除失败')

      setBooks(books.filter((book) => book._id !== bookId))
      Alert.alert('删除成功')
     } catch (error) {
      Alert.alert('删除失败', error.message)
     } finally {
       setDeleteBookId(null)
     }
  }

  const confirmDelete = (bookId) => {
    Alert.alert(
      '删除',
      '确定删除?',
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', onPress: () => handleDeleteBook(bookId), styles: 'destructive' },
      ],
    )
  }

  const renderBookItem = ({item}) => {
      return ( 
        <View style={styles.bookItem}>
          <Image source={item.image} style={styles.bookImage}/>
          <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
              <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
              <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>

          <TouchableOpacity onPress={() => confirmDelete(item._id)}
          style={styles.deleteButton} >
            {deletBookId === item._id ? (
              <ActivityIndicator size='small' color={COLORS.primary}/>
            ) : (
               <Ionicons name='trash-outline' size={20} color={COLORS.primary}/>
            )}   
          </TouchableOpacity>
        </View>
      ); 
  }

  const renderRatingStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push
      (<Ionicons 
        key={i} 
        name={ i <= rating ? 'star' : 'star-outline'}
        size={14} 
        color={ i <= rating ? '#f4b400' : COLORS.textSecondary}
        style={{marginRight: 2}}
        />
      )
    }
    return stars
  }

  const handleRefresh = async () => {
     setRefreshing(true)
     await sleep(500)
     await fetchData()
     setRefreshing(false)
  }
  
  if (isLoading && !refreshing) return (
    <Loader />
  )
  
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>你的推荐 📚</Text>
        <Text style={styles.booksCount}>{books.length} 本</Text>
      </View>

      <FlatList 
       data={books}
       renderItem={renderBookItem}
       keyExtractor={(item) => item._id}
       showsVerticalScrollIndicator={false}
       contentContainerStyle={styles.booksList}

       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
       }

       ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={50} color={COLORS.textSecondary}/>
          <Text style={styles.emptyText}>你还没有推荐</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
            <Text style={styles.addButtonText}>添加你的第一个推荐</Text>
          </TouchableOpacity>
        </View>
       }
      />
  
    </View>
  )
}