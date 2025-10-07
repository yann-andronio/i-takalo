import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  ProductDataI,
  ProductSuggestionI,
  ProductContext,
} from '../context/ProductContext';
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
  DotsThreeIcon,
  ImageSquareIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from 'phosphor-react-native';
import { AuthContext } from '../context/AuthContext';
import { UserContext, UserI } from '../context/UserContext';
import PopUpProduct from '../components/popup/PopUpProduct';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListChatnavigatorScreen } from '../types/Types';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

type ProductScreenRouteProp = RouteProp<
  { Product: { item: ProductDataI } },
  'Product'
>;

type ChatNavigationProp = NativeStackNavigationProp<
  RootStackParamListChatnavigatorScreen,
  'Chat'
>;

export default function ProductScreen() {
  const navigation = useNavigation<ChatNavigationProp>();
  const route = useRoute<ProductScreenRouteProp>();

  const initialItem = route.params.item;
  const { user } = useContext(AuthContext);

  const { fetchAuthorById } = useContext(UserContext);
  const { fetchProductById } = useContext(ProductContext);

  const [productData, setProductData] = useState<ProductDataI | undefined>(
    initialItem,
  );

  const [author, setAuthor] = useState<UserI | undefined>(undefined);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  // --- state for index actif de pagination ---
  const [activeIndex, setActiveIndex] = useState(0);

  const item = productData || initialItem;

  const suggestionProducts = (item.suggestions || []) as ProductSuggestionI[];

  console.log('Suggestions azo:', suggestionProducts);

  const [showPopup, setShowPopup] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const heroItems = item.images || [];
  const hasImages = heroItems.length > 0;

  useEffect(() => {
    setLoadingCarousel(hasImages);

    const loadData = async () => {
      // 1. Charger les détails complets du produit (pour les suggestions)
      setLoadingProduct(true);
      const fullProduct = await fetchProductById(initialItem.id);

      if (fullProduct) {
        setProductData(fullProduct);
        setLoadingAuthor(true);
        if (fullProduct.author === undefined || fullProduct.author === null) {
          setAuthor(undefined);
          setLoadingAuthor(false);
        } else {
          const fetchedAuthor = await fetchAuthorById(fullProduct.author);
          setAuthor(fetchedAuthor);
          setLoadingAuthor(false);
        }
      } else {
        setLoadingAuthor(false);
      }
      setLoadingProduct(false);
    };
    loadData();
  }, [initialItem.id, fetchProductById, fetchAuthorById, hasImages]);

  if (loadingProduct || loadingAuthor) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#FEF094" />
        <Text className="mt-4 text-gray-600">Chargement des détails...</Text>
      </SafeAreaView>
    );
  }

  const profileImageSource = author?.image ? { uri: author.image } : null;
  const handlePhonePress = () => {
    Linking.openURL(`tel:${author?.telnumber || '0342290407'}`);
  };

  const descriptionLimit = 100;

  const isTomponProduct = user?.id === item.author;

  const handleARPress = () => {
    console.log(
      'Activation de la réalité augmentée pour le produit :',
      item.title,
    );
  };

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

  const handlePressMessage = () => {
    navigation.navigate('Chat', {
      conversationId: '1',
      participant: author,
      produit: item,
    });
  };

  const handleSuggestionPress = (suggestion: ProductSuggestionI) => {
    navigation.push('Product' as any, {
      item: suggestion,
    });
  };
  const isEchange = item.type === 'ECHANGE';
  const isDonation = item.type === 'DONATION';
  const isSale = item.type === 'SALE';

  const handleImageLoadEnd = () => {
    setLoadingCarousel(false);
  };

  const linearImageSource = require('../assets/images/productCardImage/linear2.png');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="w-full h-[400px] relative">
          {/* Carrousel des Images */}
          {hasImages ? (
            <View className="w-full h-full">
              <Carousel
                loop
                width={width}
                height={400}
                autoPlay
                autoPlayInterval={4000}
                data={heroItems}
                /* achaqu fois miova sary*/
                onSnapToItem={index => {
                  setActiveIndex(index);
                  if (loadingCarousel) {
                    setLoadingCarousel(false);
                  }
                }}
                renderItem={({ item: imageUri, index }) => (
                  <Image
                    key={index}
                    source={{ uri: imageUri }}
                    style={{ width: width, height: '100%' }}
                    resizeMode="cover"
                    className="rounded-b-3xl"
                    onLoadEnd={index === 0 ? handleImageLoadEnd : undefined}
                  />
                )}
              />

              {/* --- Pagination --- */}
              <View className=" absolute  bottom-20  w-full  flex-row  justify-center  space-x-2">
                {heroItems.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 mx-3 rounded-full ${
                      index === activeIndex ? 'bg-white' : 'bg-gray-400/50'
                    }`}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View className="items-center justify-center w-full h-full bg-gray-200 rounded-b-3xl">
              <ImageSquareIcon size={50} color="#6B7280" weight="light" />
              <Text className="mt-2 text-gray-500 text-sm">
                Aucune photo disponible
              </Text>
            </View>
          )}

          {hasImages && loadingCarousel && (
            <View className="absolute inset-0 items-center justify-center bg-gray-200 rounded-b-3xl">
              <ActivityIndicator size="large" color="#03233A" />
            </View>
          )}

          {/* Dégradé supérieur et Boutons (positionnés au-dessus du carrousel) */}
          <View className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

          <View className="absolute z-10 flex-row items-center justify-between top-6 left-6 right-6">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="p-3 bg-gray-100 rounded-full shadow backdrop-blur-sm"
            >
              <ArrowLeftIcon size={24} color="black" weight="bold" />
            </TouchableOpacity>

            <View className="flex-row items-center space-x-2">
              {isTomponProduct ? (
                <View className="relative">
                  <TouchableOpacity
                    className="p-3 bg-gray-100 rounded-full shadow backdrop-blur-sm"
                    onPress={() => setShowPopup(!showPopup)}
                  >
                    <DotsThreeIcon size={24} color="black" weight="bold" />
                  </TouchableOpacity>

                  {showPopup && (
                    <PopUpProduct
                      setShowPopup={setShowPopup}
                      productId={item.id}
                    />
                  )}
                </View>
              ) : (
                <TouchableOpacity className="p-3 rounded-full shadow bg-white/30 backdrop-blur-sm">
                  <HeartIcon size={24} color="#EF4444" weight="bold" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* --- FIN : carrousel D'IMAGES --- */}

        <View className="p-6 -mt-8 bg-white shadow-lg rounded-t-3xl">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="mb-1 text-3xl font-extrabold text-gray-900">
                {item.title}
              </Text>
              <View className="flex-row items-center mt-1">
                {isSale && (
                  <>
                    <Text className="ml-2 text-xl font-bold text-gray-700">
                      {item.price} Ar
                    </Text>
                  </>
                )}
                {isDonation && (
                  <>
                    <HeartIcon size={22} color="#EF4444" weight="bold" />
                    <Text className="ml-2 text-xl font-bold text-gray-700">
                      Donation (Gratuit)
                    </Text>
                  </>
                )}
                {isEchange && (
                  <>
                    <HandshakeIcon size={22} color="#F59E0B" weight="bold" />
                    <Text className="ml-2 text-xl font-bold text-gray-700">
                      Échange
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View className="flex-row items-center p-2 bg-gray-100 rounded-lg">
              <TagIcon size={18} color="#4B5563" weight="bold" />
              <Text className="ml-1 text-sm font-medium text-gray-600">
                {item.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPinIcon size={16} color="#4b5563" />
              <Text className="ml-2 text-sm text-gray-600">{item.adresse}</Text>
            </View>
            <View className="flex-row items-center">
              <ClockCounterClockwiseIcon size={16} color="#4b5563" />
              <Text className="ml-2 text-sm text-gray-600">
                Publié le {formatDate(item.created_at)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <HeartIcon size={16} color="#4b5563" weight="bold" />
            <Text className="ml-2 text-sm font-medium text-gray-600">
              {item.likes.length} likes
            </Text>
          </View>
          {/* ... (Section Author, Echange, Description) ... */}

          {author && (
            <View className="flex-row items-center p-4 mb-6 bg-gray-100 rounded-xl">
              {profileImageSource ? (
                <Image
                  source={profileImageSource}
                  className="mr-4 border-2 border-white rounded-full w-14 h-14"
                />
              ) : (
                <View className="items-center justify-center mr-4 bg-gray-300 border-2 border-white rounded-full w-14 h-14">
                  <UserIcon size={32} color="white" weight="bold" />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {author.first_name}
                </Text>
                <Text className="text-sm text-gray-500">{author.email}</Text>
              </View>
              <TouchableOpacity
                onPress={handlePhonePress}
                className="p-3 bg-gray-200 rounded-full"
              >
                <PhoneIcon size={20} color="#000" weight="bold" />
              </TouchableOpacity>
            </View>
          )}

          {/* Section Recherché en échange  */}
          {isEchange &&
            item.mots_cles_recherches &&
            item.mots_cles_recherches.length > 0 && (
              <View className="mb-8 px-3 py-4 rounded-2xl bg-gradient-to-br from-[#fff8e1] to-[#fff2cc] border border-[#03233A]/40 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <Text className="ml-3 text-lg font-extrabold text-[#212529]">
                    Recherché en échange
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {item.mots_cles_recherches.map((keyword, index) => (
                    <View
                      key={index}
                      className="px-4 py-1.5 rounded-full bg-[#212529]/5 border border-[#9f7126]/20 backdrop-blur-sm"
                    >
                      <Text className="text-sm font-semibold text-[#03233A] tracking-wide">
                        {keyword.toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          <View className="mb-6">
            <Text className="mb-2 text-xl font-bold text-gray-800">
              Description
            </Text>

            <Text className="leading-6 text-gray-600">
              {displayedDescription}
            </Text>

            {item.description && item.description.length > descriptionLimit && (
              <TouchableOpacity onPress={toggleDescription}>
                <Text className="mt-1 font-semibold text-black">
                  {showFullDescription ? 'Voir moins' : 'Voir plus'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Buttons  principale*/}
          <View className="flex-row items-center justify-between gap-4">
            <TouchableOpacity
              className="flex-row items-center justify-center flex-1 p-4 bg-gray-200 rounded-xl"
              onPress={handleARPress}
            >
              <CubeTransparentIcon size={20} color="#000" weight="bold" />
              <Text className="ml-2 text-base font-bold text-black">
                Voir en AR
              </Text>
            </TouchableOpacity>
            {!isTomponProduct && (
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center p-4 bg-[#FEF094] rounded-xl"
                onPress={handlePressMessage}
              >
                <ChatTeardropTextIcon size={20} color="#000" weight="bold" />
                <Text className="ml-2 text-base font-bold text-black">
                  Message
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* suugestion */}
        {suggestionProducts.length > 0 && (
          <View className="p-6 pt-8 bg-gray-50">
            <Text className="mb-6 text-2xl font-extrabold text-gray-900">
              Suggestions pour vous
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              className="flex-row px-[0.2rem] py-3"
            >
              {suggestionProducts.map(suggestion => {
                const izyAtakalo = item.type === 'ECHANGE';
                const izyOmena = item.type === 'DONATION';
                const izyAmidy = item.type === 'SALE';
                const firstImage = suggestion.images?.[0];
                const authorProfileImage = suggestion.author_image
                  ? { uri: suggestion.author_image }
                  : null;
                return (
                  <TouchableOpacity
                    key={suggestion.id}
                    className="w-44 h-64 mr-3 bg-white rounded-xl shadow-lg overflow-hidden "
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <ImageBackground
                      source={{ uri: firstImage }}
                      className="w-full relative h-full"
                      resizeMode="cover"
                    >
                      
                      <View className="absolute top-3 right-3 z-20 p-1 bg-white rounded-full shadow-md">
                        {authorProfileImage ? (
                          <Image
                            source={authorProfileImage}
                            className="w-8 h-8 rounded-full border border-gray-100"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center justify-center w-8 h-8 bg-gray-300 rounded-full border border-gray-100">
                            <UserIcon size={18} color="white" weight="bold" />
                          </View>
                        )}
                      </View>
                      <Image
                        source={linearImageSource}
                        resizeMode="cover"
                        className="absolute  bottom-0 w-full h-full opacity-90"
                      />
                      <View className="p-3 flex-1 justify-end">
                        <View className="mb-2 flew justify-between items-center flex-row">
                          <View className=" flex-1">
                            <Text
                              className="text-base font-extrabold text-white mb-0.5 shadow-md"
                              numberOfLines={2}
                            >
                              {suggestion.title}
                            </Text>
                            <Text className="text-xs font-medium text-gray-200">
                              {suggestion.category}
                            </Text>
                          </View>
                          <View className="flex-1">
                            {izyAtakalo && (
                              <View className="flex-row items-center self-end bg-white p-1 rounded-lg">
                                <HandshakeIcon
                                  size={17}
                                  color="#F59E0B"
                                  weight="bold"
                                />
                              </View>
                            )}

                            {izyAmidy && (
                              <View className="flex-row items-center self-end bg-white p-1 rounded-lg">
                                <ShoppingCartIcon
                                  size={22}
                                  color="#F59E0B"
                                  weight="bold"
                                />
                              </View>
                            )}
                          </View>
                        </View>

                        <View className="flex-row items-end justify-between mt-1">
                          <View className="flex-row items-center">
                            {/*  {izyAmidy && (
                              <Text className="text-xl font-extrabold text-yellow-300">
                                {suggestion.price}
                              </Text>
                            )} */}

                            {/* {izyAtakalo && (
                              <View className="flex-row items-center self-end bg-white p-1 rounded-lg">
                                <HandshakeIcon
                                  size={22}
                                  color="#FCD34D"
                                  weight="bold"
                                />
                                <Text className="ml-1 text-base font-bold text-yellow-300">
                                  Échange
                                </Text> 
                              </View>
                            )} */}

                            {izyOmena && (
                              <Text className="text-xl font-extrabold text-white">
                                Gratuit
                              </Text>
                            )}
                          </View>

                          {/*  <Text
                            className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase self-end ${
                              suggestion.type === 'SALE'
                                ? 'bg-red-500 text-white' 
                                : suggestion.type === 'DONATION'
                                ? 'bg-blue-500 text-white' 
                                : 'bg-yellow-500 text-white' 
                            }`}
                          >
                            {suggestion.type}
                          </Text> */}
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
