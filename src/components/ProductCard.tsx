import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { ProductDataI } from '../data/ProductData';
import { HeartIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Types';
import { UserData } from '../data/UserData'; // 👈 importer les users

interface ProductCardProps {
  item: ProductDataI;
}

type ProductCardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Product'>;

export default function ProductCard({ item }: ProductCardProps) {
  const navigation = useNavigation<ProductCardNavigationProp>();

  const user = UserData.find(u => u.id === item.userId);

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl w-[48%] shadow-lg overflow-hidden"
      onPress={() => navigation.navigate('Product', { item })}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={item.image}
        className="w-full h-72 justify-between"
        resizeMode="cover"
      >
        {user && (
          <View className="absolute top-4 left-4 w-12 h-12 rounded-full border-2 border-white overflow-hidden">
            <Image
              source={user.profileImage}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        <Image
          source={require('../assets/images/productCardImage/linear.png')}
          resizeMode="cover"
          className="absolute w-full h-full z-0"
        />

        <View className="absolute inset-x-0 bottom-0 p-4 ">
          <View className="flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-base font-bold text-white mb-1">
                {item.name}
              </Text>
              <Text className="text-sm text-white opacity-80">{item.status}</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg font-bold text-white">{item.price}</Text>

            <TouchableOpacity className="flex-row items-center bg-white rounded-md p-[2px]">
              <HeartIcon size={16} color="#ef4444" />
              <Text className="text-xs text-black ml-1">{item.likes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
