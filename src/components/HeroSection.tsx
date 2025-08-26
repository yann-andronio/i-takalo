import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { HeroSectionData as HeroData } from '../data/HeroSectionData';

const { width } = Dimensions.get('window');

export default function HeroSection() {
  const [heroItems, setHeroItems] = useState(HeroData);

  return (
    <View className="mt-5">
      <Carousel
        loop
        width={width * 0.9}
        height={180}
        autoPlay
        autoPlayInterval={3500}
        data={heroItems}
        renderItem={({ item, index }) => (
          <View
            key={index}
            className={`flex-row bg-[${item.background}] rounded-2xl pl-4 shadow-lg`}
            style={{ height: 180, backgroundColor: item.background }}
          >
            <View className="flex-[1] justify-center pr-2">
              <Text className="text-xl font-bold text-[#9F7126] mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-700 mb-3">
                {item.subtitle}
              </Text>
              <TouchableOpacity className="bg-[#9F7126] px-4 py-2 rounded-full shadow self-start">
                <Text className="text-white font-semibold">Découvrir</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-[1] justify-center items-center">
              <Image
                source={item.image}
                className="w-full h-full rounded-tr-2xl rounded-br-2xl"
                resizeMode="cover"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}
