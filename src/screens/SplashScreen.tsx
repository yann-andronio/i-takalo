import { View, Text, ImageBackground } from 'react-native'
import React from 'react'

export default function SplashScreen() {
  return (
    <ImageBackground
      source={require('../../assets/images/1.png')}
      resizeMode='contain'
      className="flex-1 w-full "
    >
      <Text className="text-white text-2xl font-bold">Splash Screen</Text>
    </ImageBackground>
  )
}
