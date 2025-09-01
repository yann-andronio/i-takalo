import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ProductDataI } from '../context/ProductContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  TagIcon,
  ChatTeardropTextIcon,
  HeartIcon,
  CubeTransparentIcon,
  ClockCounterClockwiseIcon,
  UserIcon,
} from 'phosphor-react-native';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

type ProductScreenRouteProp = RouteProp<
  { Product: { item: ProductDataI } },
  'Product'
>;

export default function ProductScreen() {
  const navigation = useNavigation();
  const route = useRoute<ProductScreenRouteProp>();
  const { item } = route.params;
  const { users } = useContext(UserContext); 
  const { user } = useContext(AuthContext); 

  const author = users.find(i => i.id === item.author);
  const profileImageSource = author?.image ? { uri: author.image } : null;
 

  /* const handlePhonePress = () => {
    Linking.openURL(`tel:${item.telphone}`);
  }; */

  const handleARPress = () => {
    console.log(
      'Activation de la réalité augmentée pour le produit :',
      item.title,
    );
  };


  const handleMessagePress = () => {
    console.log("Envoi d'un message au vendeur :", author);
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionLimit = 100;

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const displayedDescription = showFullDescription
    ? item.description
    : item.description?.slice(0, descriptionLimit) +
      (item.description && item.description.length > descriptionLimit
        ? '...'
        : '');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Product Image Section */}
        <View className="w-full h-[400px] relative">
          <Image
            source={{ uri: item.image }}
            style={{ width: width, height: '100%' }}
            resizeMode="cover"
            className="rounded-b-3xl"
          />

          <View className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

          <View className="absolute top-6 left-6 right-6 flex-row justify-between items-center z-10">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-3 rounded-full bg-white/30 backdrop-blur-sm shadow"
            >
              <ArrowLeftIcon size={24} color="white" weight="bold" />
            </TouchableOpacity>

            <TouchableOpacity className="p-3 rounded-full bg-white/30 backdrop-blur-sm shadow">
              <HeartIcon size={24} color="#EF4444" weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Details Section */}
        <View className="bg-white p-6 -mt-8 rounded-t-3xl shadow-lg">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-extrabold text-gray-900 mb-1">
                {item.title}
              </Text>
              <Text className="text-xl font-semibold text-gray-700">
                {item.price} Ar
              </Text>
            </View>
            <View className="flex-row items-center bg-gray-100 p-2 rounded-lg">
              <TagIcon size={18} color="#4B5563" weight="bold" />
              <Text className="text-sm text-gray-600 ml-1 font-medium">
                {item.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPinIcon size={16} color="#4b5563" />
              <Text className="text-sm text-gray-600 ml-2">
                {item.adresse}
                adresse
              </Text>
            </View>
            <View className="flex-row items-center">
              <ClockCounterClockwiseIcon size={16} color="#4b5563" />
              <Text className="text-sm text-gray-600 ml-2">
                Publié le {formatDate(item.created_at)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <HeartIcon size={16} color="#4b5563" weight="bold" />
            <Text className="text-sm text-gray-600 ml-2 font-medium">
              {item.likes} likes
            </Text>
          </View>

          {author && (
            <View className="flex-row items-center mb-6 p-4 bg-gray-100 rounded-xl">
          
              {profileImageSource ? (
                <Image
                  source={profileImageSource}
                  className="w-14 h-14 rounded-full mr-4 border-2 border-white"
                />
              ) : (
                <View className="w-14 h-14 rounded-full mr-4 border-2 border-white bg-gray-300 justify-center items-center">
                  <UserIcon size={32} color="white" weight="bold" />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {author?.first_name}
                </Text>
                <Text className="text-sm text-gray-500">{author?.email}</Text>
              </View>
              <TouchableOpacity
                /* onPress={handlePhonePress} */
                className="p-3 bg-gray-200 rounded-full"
              >
                <PhoneIcon size={20} color="#000" weight="bold" />
              </TouchableOpacity>
            </View>
          )}

          {/* Description Section avec VP / VM" */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Description
            </Text>

            <Text className="text-gray-600 leading-6">
              {displayedDescription}
            </Text>

            {item.description && item.description.length > descriptionLimit && (
              <TouchableOpacity onPress={toggleDescription}>
                <Text className="text-black mt-1 font-semibold">
                  {showFullDescription ? 'Voir moins' : 'Voir plus'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/*  Buttons  principale*/}
          <View className="flex-row items-center justify-between gap-4">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center p-4 bg-gray-200 rounded-xl"
              onPress={handleARPress}
            >
              <CubeTransparentIcon size={20} color="#000" weight="bold" />
              <Text className="text-base font-bold text-black ml-2">
                Voir en AR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center p-4 bg-[#FEF094] rounded-xl"
              onPress={handleMessagePress}
            >
              <ChatTeardropTextIcon size={20} color="#000" weight="bold" />
              <Text className="text-base font-bold text-black ml-2">
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
