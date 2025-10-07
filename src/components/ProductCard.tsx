import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { ProductDataI, ProductContext } from '../context/ProductContext';
import { HeartIcon, ImageSquareIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListHomenavigatorScreen } from '../types/Types';
import { AuthContext } from '../context/AuthContext';
import { UserContext, UserI } from '../context/UserContext';

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
 
/* like*/

  const { user } = useContext(AuthContext); 
  const { ToggleLike } = useContext(ProductContext); 
  const [isLiking, setIsLiking] = useState(false)

  const [isImageLoading, setIsImageLoading] = useState(true);
  
  
  const [author, setAuthor] = useState<UserI | undefined>(undefined);
  const [loadingAuthor, setLoadingAuthor] = useState(true);

 
  const mainImageUri = item.images && item.images.length > 0 ? item.images[0] : null; 


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


  const hasImage = !!mainImageUri; 

  // Déterminer si le user courant a liké
  const isLiked = user && item.likes.includes(user.id); 
   const handleLikePress = async () => {
    if (!user || isLiking) return; 

    setIsLiking(true);
    await ToggleLike(item.id); 
    setIsLiking(false);
  };

  return (
    <TouchableOpacity
      className="w-48 overflow-hidden bg-white shadow-lg rounded-2xl"
      onPress={() => navigation.navigate('Product', { item })}
      activeOpacity={0.8}
    >
      <ImageBackground
       
        source={hasImage ? { uri: mainImageUri } : undefined} 
        className="justify-between w-full h-72"
        resizeMode="cover"
        onLoadEnd={() => setIsImageLoading(false)}
        style={!hasImage ? { backgroundColor: '#E5E7EB' } : undefined} 
      >
        
        {(isImageLoading && hasImage) || loadingAuthor ? (
        
          <View className="absolute inset-0 items-center justify-center bg-gray-200">
            <ActivityIndicator size="large" color="#03233A" />
          </View>
        ) : !hasImage ? (
         
          <View className="absolute inset-0 items-center justify-center">
            <ImageSquareIcon size={50} color="#6B7280" weight="light" />
            <Text className="mt-2 text-gray-500 text-xs">Pas de photo</Text>
          </View>
      
        ) : null}

        
        {!(isImageLoading || loadingAuthor) && (
          <View
            className="absolute items-center justify-center overflow-hidden border-2 border-white rounded-full top-4 left-4 w-11 h-11"
            style={{ backgroundColor: isSaleProduct ? '#F3F4F6' : '#03233A' }}
          >
            { profileImageSource && (
              <Image
                source={profileImageSource}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </View>
        )}

        {/* Superposition dégradée fond */}
        {hasImage && (
            <Image
                source={linearImageSource}
                resizeMode="cover"
                className="absolute bottom-0 z-10 w-full h-full"
            />
        )}


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
            {item.type === 'ECHANGE' ? (
              <Text className="text-base font-normal text-yellow-200">
                Echange
              </Text>
            ) : (
              <Text className="text-lg font-bold text-white">
                {item.price} Ar
              </Text>
            )}

            <TouchableOpacity 
              className="flex-row items-center bg-white rounded-md p-[5px]"
              onPress={handleLikePress}
              disabled={isLiking} 
            >
              {isLiking ? (
                <ActivityIndicator size="small" color="#03233A" />
              ) : (
                <HeartIcon 
                  size={20} 
                  color={isLiked ? 'red' : '#03233A'} 
                  weight={isLiked ? 'fill' : 'regular'} 
                />
              )}
              
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