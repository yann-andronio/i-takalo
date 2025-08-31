import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { ProductDataI } from '../context/ProductContext';
import { HeartIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListHomenavigatorScreen } from '../types/Types';
import { AuthContext } from '../context/AuthContext';

interface ProductCardProps {
  item: ProductDataI;
}

type ProductCardNavigationProp = NativeStackNavigationProp<
  RootStackParamListHomenavigatorScreen,
  'Product'
>;

export default function ProductCard({ item }: ProductCardProps) {
  const navigation = useNavigation<ProductCardNavigationProp>();
  const { user } = useContext(AuthContext);
 /*  const isAuthor = user && item.author === user.id;
  const profileImageSource = user && user.profileImage ? { uri: user.profileImage } : ''; */
  /*  console.log("ITEM ===>", item) */

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl w-48 shadow-lg overflow-hidden"
      onPress={() => navigation.navigate('Product', { item })}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={require('../assets/images/productCardImage/linear.png')}
        className="w-full h-72 justify-between"
        resizeMode="cover"
      >
      {/*   {item.type === 'SALE' && isAuthor && (
          <View className="absolute top-4 left-4 w-12 h-12 rounded-full border-2 border-white overflow-hidden">
            <Image
              source={profileImageSource}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )} */}

        <Image
          source={{ uri: item.image }}
          resizeMode="cover"
          className="absolute w-full h-full z-0"
        />

        <View className="absolute inset-x-0 bottom-0 p-4 ">
          <View className="flex-row items-end justify-between ">
            <View className="flex-1">
              <Text className="text-base font-bold text-white mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-white opacity-80">
                {/*  {item.category} */}
                categorie
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg font-bold text-white">
              {/*{item.price} */}
              prix
            </Text>

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
