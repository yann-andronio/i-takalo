import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { HeroSectionData as HeroData } from '../data/HeroSectionData';
const { width } = Dimensions.get('window');

export default function HeroSection() {
  const [heroItems, setHeroItems] = useState(HeroData);

  return (
    <View className="">
      <Carousel
        loop
        width={width * 0.9}
        height={200}
        autoPlay
        autoPlayInterval={4000}
        data={heroItems}
        renderItem={({ item, index }) => (
          <View
            key={index}
            className="rounded-2xl shadow-lg p-2 overflow-hidden"
            style={{ height: 200 }}
          >
       
            <Image
              source={item.image}
              className="w-full h-full rounded-2xl"
              resizeMode="cover"
            />

               <View className="absolute inset-y-0 left-6 justify-center w-1/2">
              <Text className="text-xl font-bold text-[#03233A] mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-[#03233A] mb-3 ">
                {item.subtitle}
              </Text>
              <TouchableOpacity className="bg-[#03233A] px-4 py-2 rounded-full shadow self-start">
                <Text className="text-white font-semibold">Découvrir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
