import React, { useContext, useState, useEffect } from 'react'; // Import de useEffect
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { ProductDataI } from '../context/ProductContext';
import { HeartIcon, HandHeartIcon, UserIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListHomenavigatorScreen } from '../types/Types';
import { AuthContext } from '../context/AuthContext';
import { UserContext, UserI } from '../context/UserContext'; // Import de UserI
import API from '../api/Api'; // Import de l'API

interface ProductCardProps {
  item: ProductDataI;
}

type ProductCardNavigationProp = NativeStackNavigationProp<
  RootStackParamListHomenavigatorScreen,
  'Product'
>;

export default function ProductCard({ item }: ProductCardProps) {
  const navigation = useNavigation<ProductCardNavigationProp>();

  const { users , fetchAuthorById } = useContext(UserContext);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [author, setAuthor] = useState<UserI | undefined>(undefined);
  const [loadingAuthor, setLoadingAuthor] = useState(true);

  useEffect(() => {
    const loadAuthor = async () => {
      if (item.author === undefined || item.author === null) {
        setAuthor(undefined);
        setLoadingAuthor(false);
        return;
      }
      setLoadingAuthor(true);
  
      const fetchedAuthor = await fetchAuthorById(item.author);
      setAuthor(fetchedAuthor);
      setLoadingAuthor(false);
    };
    loadAuthor();
   
  }, [item.author , users]);

  const profileImageSource = author?.image ? { uri: author.image } : null;
  const isSaleProduct = item.type === 'SALE';
  const linearImageSource = require('../assets/images/productCardImage/linear2.png');

  return (
    <TouchableOpacity
      className="w-48 overflow-hidden bg-white shadow-lg rounded-2xl"
      onPress={() => navigation.navigate('Product', { item })}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: item.image }}
        className="justify-between w-full h-72"
        resizeMode="cover"
        onLoadEnd={() => setIsImageLoading(false)}
      >
        {(isImageLoading || loadingAuthor) && (
          <View className="absolute inset-0 items-center justify-center bg-gray-200">
            <ActivityIndicator size="large" color="#03233A" />
          </View>
        )}

        {!(isImageLoading || loadingAuthor) && (
          <View
            className="absolute items-center justify-center overflow-hidden border-2 border-white rounded-full top-4 left-4 w-11 h-11"
            style={{ backgroundColor: isSaleProduct ? '#F3F4F6' : '#03233A' }}
          >
            {isSaleProduct && profileImageSource ? (
              <Image
                source={profileImageSource}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : isSaleProduct ? (
              <View className="items-center justify-center w-full h-full bg-gray-100">
                <UserIcon size={22} color="gray" weight="light" />
              </View>
            ) : (
              <HandHeartIcon size={28} color="white" weight="light" />
            )}
          </View>
        )}

        {/* Superposition dégradée fond */}
        <Image
          source={linearImageSource}
          resizeMode="cover"
          className="absolute bottom-0 z-10 w-full h-full"
        />

        <View className="absolute inset-x-0 bottom-0 z-20 p-4">
          <View className="flex-row items-end justify-between ">
            <View className="flex-1">
              <Text className="mb-1 text-base font-bold text-white">
                {item.title}
              </Text>
              <Text className="text-sm text-white opacity-80">
                {item.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            {item.type === 'DONATION' ? (
              <Text className="text-base font-normal text-yellow-200">
                Donation
              </Text>
            ) : (
              <Text className="text-lg font-bold text-white">
                {item.price} Ar
              </Text>
            )}

            <TouchableOpacity className="flex-row items-center bg-white rounded-md p-[5px]">
              <HeartIcon size={20} color="#03233A" />
              <Text className="ml-1 text-xs text-black">
                {item.likes.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
