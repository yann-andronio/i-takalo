import React from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ProductDataI } from '../data/ProductData';

const { height, width } = Dimensions.get('window');

type ProductScreenRouteProp = RouteProp<{  Product: { item: ProductDataI };},'Product'>;

export default function ProductScreen() {
  const route = useRoute<ProductScreenRouteProp>();
  const { item } = route.params;

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="w-full mb-4 rounded-2xl overflow-hidden">
        <Image
          source={item.image}
          style={{ width: width - 32, height: height * 0.5 }}
          resizeMode="cover"
        />
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-1">{item.name}</Text>
      <Text className="text-lg text-gray-600 mb-2">{item.status}</Text>
      <Text className="text-xl font-bold text-[#03233A] mb-4">
        {item.price}
      </Text>
      <Text className="text-gray-500">👍 {item.likes} likes</Text>
    </ScrollView>
  );
}
