import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../constants/colors'

const SafeScreen = ({children}) => {
    const insets = useSafeAreaInsets()
  return (
    <View style={[style.container, {paddingTop: insets.top}]}>
      {children}
    </View>
  )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    }
})
export default SafeScreen