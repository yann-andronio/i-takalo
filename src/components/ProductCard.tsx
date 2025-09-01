import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { ProductDataI } from '../context/ProductContext';
import { HeartIcon, HandHeartIcon, UserIcon } from 'phosphor-react-native'; 
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListHomenavigatorScreen } from '../types/Types';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';

interface ProductCardProps {
  item: ProductDataI;
}

type ProductCardNavigationProp = NativeStackNavigationProp<
  RootStackParamListHomenavigatorScreen,
  'Product'
>;

export default function ProductCard({ item }: ProductCardProps) {
  const navigation = useNavigation<ProductCardNavigationProp>();
  const { users } = useContext(UserContext);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const author = users.find(user => user.id === item.author);
  const profileImageSource = author?.image ? { uri: author.image } : null;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl w-48 shadow-lg overflow-hidden"
      onPress={() => navigation.navigate('Product', { item })}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={isImageLoading ? require('../assets/images/productCardImage/linear.png') : { uri: item.image }}
        className="w-full h-72 justify-between"
        resizeMode="cover"
        onLoadEnd={() => setIsImageLoading(false)}
      >
        {/* Affich profil na icône */}
        {item.type === 'SALE' ? (
          <View className="absolute top-4 left-4 w-11 h-11 rounded-full border-2 border-white overflow-hidden items-center justify-center">
            {profileImageSource ? (
              <Image
                source={profileImageSource}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gray-100 items-center justify-center">
                <UserIcon size={22} color="gray" weight="light" />
              </View>
            )}
          </View>
        ) : (
          <View className="absolute top-4 left-4 w-11 h-11 rounded-full border-2 border-white overflow-hidden items-center justify-center bg-[#E5B891]">
            <HandHeartIcon size={28} color="white" weight="bold" />
          </View>
        )}

        {/* Superposition dégradée fond t@ mario */}
        <Image
          source={require('../assets/images/productCardImage/linear.png')}
          resizeMode="cover"
          className="absolute w-full h-full z-10"
        />

       
        <View className="absolute inset-x-0 bottom-0 p-4 z-20">
          <View className="flex-row items-end justify-between ">
            <View className="flex-1">
              <Text className="text-base font-bold text-white mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-white opacity-80">
                {item.category}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg font-bold text-white">{item.price} Ar</Text>

            <TouchableOpacity className="flex-row items-center bg-white rounded-md p-[2px]">
              <HeartIcon size={16} color="#ef4444" />
              <Text className="text-xs text-black ml-1">{item.likes.length}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}