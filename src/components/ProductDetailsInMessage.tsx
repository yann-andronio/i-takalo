import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { ProductDataI } from '../context/ProductContext'; 
interface ProductDetailsInMessageProps {
  produits: ProductDataI; 
}

export default function ProductDetailsInMessage({ produits: produit }: ProductDetailsInMessageProps) {
    
    if (!produit) {
    return null; 
  }

  return (
    <View className="flex-row items-center justify-between p-4 m-4 border border-gray-200 rounded-xl">
      <Image
        source={{ uri: produit.image }}
        className="w-16 h-16 mr-3 rounded-lg"
      />
      
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-800">
          {produit.title || 'Article'}
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          {produit.price ? `Ar ${produit.price}` : 'Donation'}
        </Text>
      </View>
      <TouchableOpacity className="py-2 px-4 rounded-full bg-[#03233A]">
        <Text className="font-semibold text-white">Acheter</Text>
      </TouchableOpacity>
    </View>
  );
}