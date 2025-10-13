import React from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { ShoppingCartIcon, ArrowsClockwiseIcon, GiftIcon} from 'phosphor-react-native';

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={['#0a2a43', '#04293A', '#064663']}
      className="flex-1 items-center justify-center px-6"
    >
      <StatusBar hidden />

      <Animated.View
        entering={ZoomIn.duration(1000)}
        exiting={FadeOut.duration(500)}
        className="w-48 h-48 rounded-full overflow-hidden mb-4"
      >
        <Image
          source={require('../assets/images/Logo/pdp.jpeg')}
          resizeMode="contain"
          className="w-full h-full"
        />
      </Animated.View>

      <Animated.Text
        entering={FadeIn.delay(800).duration(1000)}
        className="text-[#f1d78a] text-4xl font-extrabold tracking-wide mb-2 text-center"
      >
Vos biens, vos choix    </Animated.Text>

      <Animated.Text
        entering={FadeIn.delay(1000).duration(1000)}
        className="text-white text-lg text-center mb-6 px-4"
      >
        Vente, Échange et Donation de produits en toute simplicité
      </Animated.Text>

      <Animated.View
        entering={FadeIn.delay(1300).duration(1000)}
        className="flex-row justify-around w-full max-w-md"
      >
        <View className="items-center">
          <ShoppingCartIcon size={36} color="#f1d78a" weight="bold" />
          <Text className="text-white mt-2 text-lg font-semibold">Vente</Text>
        </View>

        <View className="items-center">
          <ArrowsClockwiseIcon size={36} color="#f1d78a" weight="bold" />
          <Text className="text-white mt-2 text-lg font-semibold">Échange</Text>
        </View>

        <View className="items-center">
          <GiftIcon size={36} color="#f1d78a" weight="bold" />
          <Text className="text-white mt-2 text-lg font-semibold">Donation</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
