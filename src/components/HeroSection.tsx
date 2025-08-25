import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function HeroSection() {
  return (
    <View className="flex-row bg-[#FFEDD5] rounded-2xl mt-5 p-6 shadow-md">
      
      <View className="flex-[2] justify-center">
        <Text className="text-xl font-bold text-[#9F7126] mb-2">
          Découvrez tous nos articles en vogue
        </Text>
     
        <TouchableOpacity className="bg-[#9F7126] px-4 py-2 justify-center items-center  rounded-full shadow self-start">
          <Text className="text-white font-semibold">Découvrir</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-[1] items-center justify-center">
        <Image
          source={require('../assets/images/HeroSectionImage/p1.png')}
          className="w-full h-32 rounded-xl"
          resizeMode="contain"
        />
      </View>

    </View>
  );
}
