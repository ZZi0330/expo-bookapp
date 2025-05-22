import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import {Image} from 'expo-image'
import { useAuthStore } from '../../store/authStore'
import { useState } from 'react'
import styles from '../../assets/styles/home.styles'
import { API_URL } from '../../constants/api'
import Ionicons from '@expo/vector-icons/Ionicons'
import COLORS from '../../constants/colors'
import { formatPublishDate } from '../../lib/utils'
import Loader from '../../components/Loader'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function index() {
  const { token } = useAuthStore()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchBooks = async (pageNum=1, refresh=false) => {
      try {
        if (refresh) {
          setRefreshing(true)
        } else if ( pageNum === 1) {
          setLoading(true)
        }
        const response = await fetch(`${API_URL}/api/books?page=${pageNum}&limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message || '获取失败')

        const uniqueBooks = refresh || pageNum === 1 
        ? data.books 
        : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) => 
          [...books, ...data.books].find((book) => book._id === id))

        setBooks(uniqueBooks)

        setHasMore(pageNum < data.totalPages)
        setPage(pageNum)
      } catch (error) {
        console.log('无法获取书籍',error)
      } finally {
        if (refresh) {
          await sleep(800)
          setRefreshing(false)
        } else {
          setLoading(false)
        }
      }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleLoadMore = async () => {
   if (hasMore && !loading && !refreshing) {
     await sleep(1000)
     await fetchBooks(page + 1)
   } 
  }
  
  const renderItem = ({item}) => {
       console.log(item.image)
        const transformedImageUrl = item.image.replace(
    '/upload/',
    '/upload/f_jpg,q_auto/' // 添加格式和质量变换参数
  );
  console.log("Transformed Image URL:", transformedImageUrl)
    return (
      <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={{ uri: transformedImageUrl }}
        style={styles.bookImage} contentFit='cover'

          // 添加 onError prop
          onError={(error) => {
            console.log("Image Load Error:", error.nativeEvent.error);
            // 这里会打印出具体的加载错误信息
          }}
      />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>发布时间:{formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
    )
  
  }

  const renderRatingStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? '#f4b400' : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      )
    }
    return stars
  }
   
  if (loading) return <Loader />
  
  return (
    <View style={styles.container}>

      
      <FlatList 
      data={books}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}

      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>书虫🐛</Text>
          <Text style={styles.headerSubtitle}>发现你喜欢的书籍👇</Text>
        </View>
      }

      refreshControl={
        <RefreshControl refreshing={refreshing} 
        onRefresh={() => fetchBooks(1, true)} 
        colors={[COLORS.primary]}
        tintColor={COLORS.primary}
        />
      }

      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}


      ListFooterComponent={
        hasMore && books.length > 0 ? (
          <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
        ) : null
      }

      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons 
          name='book-outline'
          size={60}
          color={COLORS.textSecondary}
          />
          <Text style={styles.emptyText}>暂无书籍</Text>
          <Text style={styles.emptySubtext}>添加你的第一本书籍</Text>
        </View>
      }
      />
    </View>
  )
}