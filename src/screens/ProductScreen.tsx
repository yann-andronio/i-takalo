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
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// L'interface ProductDataI est maintenant mise à jour pour avoir 'images: string[]'
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
  DotsThreeIcon,
  ImageSquare, // Ajout de ImageSquare pour le placeholder
} from 'phosphor-react-native';
import { AuthContext } from '../context/AuthContext';
import { UserContext, UserI } from '../context/UserContext';
import PopUpProduct from '../components/popup/PopUpProduct';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListChatnavigatorScreen } from '../types/Types';

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
  const { item } = route.params; // item contient maintenant item.images[]
  const { user } = useContext(AuthContext);

  const [author, setAuthor] = useState<UserI | undefined>(undefined);
  const { fetchAuthorById } = useContext(UserContext);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true); // État pour le chargement des images du carrousel

  const [showPopup, setShowPopup] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // --- NOUVELLES LOGIQUES ---
  const hasImages = item.images && item.images.length > 0;
  const initialImageLoaded = hasImages ? false : true; // Si pas d'images, on considère le "chargement" terminé
  // --- FIN NOUVELLES LOGIQUES ---


  useEffect(() => {
    // Si il y a des images, on met le loading à true, sinon à false
    setLoadingImage(hasImages ? true : false); 
    
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
  }, [item.author, hasImages]); // Dépendance à hasImages pour la réinitialisation

  // ... (Le reste des fonctions est inchangé)
  
  if (loadingAuthor) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#FEF094" />
        <Text className="mt-4 text-gray-600">
          Chargement des détails de l'auteur...
        </Text>
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
      produit : item
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        
        {/* --- DÉBUT : CARROUSEL D'IMAGES --- */}
        <View className="w-full h-[400px] relative">
          
          {/* Carrousel des Images */}
          {hasImages ? (
            <ScrollView 
                horizontal 
                pagingEnabled 
                showsHorizontalScrollIndicator={true} 
                className="w-full h-full"
                onContentSizeChange={() => setLoadingImage(false)} // Indique que le contenu est chargé
            >
              {item.images.map((imageUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={{ width: width, height: '100%' }} // Chaque image prend toute la largeur
                  resizeMode="cover"
                  className="rounded-b-3xl"
                  // onLoadEnd={() => setLoadingImage(false)} // Peut être commenté si on utilise onContentSizeChange
                />
              ))}
            </ScrollView>
          ) : (
            // Placeholder si aucune image n'est présente
            <View className="items-center justify-center w-full h-full bg-gray-200 rounded-b-3xl">
              <ImageSquare size={50} color="#6B7280" weight="light" />
              <Text className="mt-2 text-gray-500 text-sm">Aucune photo disponible</Text>
            </View>
          )}

          {/* Loader superposé au début du chargement des images */}
          {hasImages && loadingImage && (
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
        {/* --- FIN : CARROUSEL D'IMAGES --- */}

        {/* --- DÉTAILS DU PRODUIT (Le reste du code est inchangé) --- */}
        <View className="p-6 -mt-8 bg-white shadow-lg rounded-t-3xl">
          {/* ... (Contenu du produit inchangé) */}
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="mb-1 text-3xl font-extrabold text-gray-900">
                {item.title}
              </Text>
              <Text className="text-xl font-semibold text-gray-700">
                {item.price} Ar
              </Text>
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
              <Text className="ml-2 text-sm text-gray-600">
                {item.adresse}
                adresse
              </Text>
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
              {item.likes.length} likes {/* Assurez-vous d'utiliser item.likes.length */}
            </Text>
          </View>

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

          {/* Description Section avec VP / VM" */}
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
      </ScrollView>
    </SafeAreaView>
  );
}