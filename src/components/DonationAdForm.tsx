import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions, 
} from 'react-native';
import React, { useCallback, useState, useContext } from 'react';
import { PlusIcon, XCircleIcon, ImageSquare } from 'phosphor-react-native'; 
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import * as yup from 'yup';
import {
  launchImageLibrary,
  MediaType,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';

import { RootStackParamListMainNavigatorTab } from '../types/Types';
import API from '../api/Api';
import { ProductContext, ProductDataI } from '../context/ProductContext';

const DONATION_CATEGORIES = [
  'T_SHIRT',
  'PANTALON',
  'ROBE',
  'CHAUSSURE',
  'VESTE',
];

type FormData = {
  title: string;
  category: string;
  description?: string;
  adresse: string;
};

const ValidationSchema: yup.ObjectSchema<FormData> = yup.object({
  title: yup.string().required('Le titre est requis.'),
  category: yup.string().required('La catégorie est requise.'),
  description: yup.string().optional(),
  adresse: yup.string().required("L'adresse est requise."),
});

const IMAGE_ITEM_WIDTH = 120;
const MAX_IMAGE_LIMIT = 5;

export default function DonationAdForm() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamListMainNavigatorTab>>();
  const { addProduct } = useContext(ProductContext);

  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(ValidationSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      adresse: '',
    },
  });

  useFocusEffect(
    useCallback(() => {
      reset();
      setSelectedImages([]);
      setSubmittedAttempt(false);
    }, [reset]),
  );

  const handleImagePicker = () => {
    if (selectedImages.length >= MAX_IMAGE_LIMIT) {
      Alert.alert(
        'Limite atteinte',
        `Vous ne pouvez pas ajouter plus de ${MAX_IMAGE_LIMIT} images. Veuillez en supprimer pour en ajouter d'autres.`,
      );
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 1000, // Augmenter pour meilleure qualité mais attention au poids
      maxWidth: 1000,
      selectionLimit: MAX_IMAGE_LIMIT - selectedImages.length,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
        Alert.alert('Erreur', "Impossible de sélectionner l'image(s).");
      } else if (response.assets && response.assets.length > 0) {
        const newAssets = response.assets.filter(
          newAsset =>
            !selectedImages.some(
              existingAsset => existingAsset.uri === newAsset.uri,
            ),
        );
        setSelectedImages(prevImages => [...prevImages, ...newAssets]);
      }
    });
  };

  const removeImage = (uriToRemove: string) => {
    setSelectedImages(prevImages =>
      prevImages.filter(image => image.uri !== uriToRemove),
    );
  };

  const handleAddDonation: SubmitHandler<FormData> = async data => {
    setSubmittedAttempt(true);

    if (selectedImages.length === 0) {
      Alert.alert(
        'Erreur',
        'Veuillez sélectionner au moins une image pour votre donation.',
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', 'DONATION');
      formData.append(
        'description',
        data.description || 'Pas de description fournie.',
      );
      formData.append('category', data.category);
      formData.append('adresse', data.adresse);
      
     
      formData.append('price', '0'); 

      selectedImages.forEach(imageAsset => {
        if (imageAsset.uri && imageAsset.fileName && imageAsset.type) {
          const finalUri = imageAsset.uri; 
          const file = {
            uri: finalUri,
            name: imageAsset.fileName,
            type: imageAsset.type,
          };
          
          formData.append('images', file as any);
        }
      });

      console.log('--- ENVOI DE LA DONATION ---');

      const response = await API.post('/api/v1/products/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
/*         timeout: 60000, 
 */      });

      console.log('Donation créée:', response.data);
      const newDonation = response.data as ProductDataI;
      addProduct(newDonation);

      Alert.alert('Succès', 'Votre donation a été ajoutée.', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            setSelectedImages([]);
            setSubmittedAttempt(false);
            navigation.navigate('Accueil', { screen: 'AccueilMain' });
          },
        },
      ]);
    } catch (error: any) {
      console.error(
        'Erreur création donation (détails du serveur):',
        error.response?.data || error.message || error,
      );
      Alert.alert(
        'Erreur',
        error.response?.data?.message ||
          error.message ||
          "Impossible d'ajouter la donation (Erreur Réseau ou Timeout)",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white p-5"
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* SECTION SÉLECTION D'IMAGES */}
      <View
        className={`h-[150] bg-gray-100 rounded-lg justify-center items-center border border-dashed border-gray-300 mb-5 overflow-hidden p-2`}
      >
        {selectedImages.length === 0 ? (
          <TouchableOpacity
            onPress={handleImagePicker}
            className="w-full h-full justify-center items-center"
          >
            <PlusIcon size={30} color="#666" weight="bold" />
            <Text className="mt-2 text-gray-600">
              Ajouter photo(s) (Max {MAX_IMAGE_LIMIT})
            </Text>
          </TouchableOpacity>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full h-full"
          >
            {selectedImages.map(imageAsset => (
              <View
                key={imageAsset.uri}
                style={{ width: IMAGE_ITEM_WIDTH, height: '100%' }}
                className="relative mr-3 rounded-lg overflow-hidden"
              >
                <Image
                  source={{ uri: imageAsset.uri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => imageAsset.uri && removeImage(imageAsset.uri)}
                  className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-lg"
                >
                  <XCircleIcon size={20} color="#EF4444" weight="fill" />
                </TouchableOpacity>
              </View>
            ))}

            {selectedImages.length < MAX_IMAGE_LIMIT && (
              <TouchableOpacity
                onPress={handleImagePicker}
                style={{ width: IMAGE_ITEM_WIDTH, height: '100%' }}
                className="bg-gray-200 rounded-lg justify-center items-center border border-dashed border-gray-400"
              >
                <PlusIcon size={25} color="#4B5563" weight="bold" />
                <Text className="mt-1 text-gray-600 text-center text-xs">
                  Ajouter ({MAX_IMAGE_LIMIT - selectedImages.length} restantes)
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      {/* AFFICHAGE CONDITIONNEL DE L'ERREUR POUR LES IMAGES */}
      {selectedImages.length === 0 && submittedAttempt && (
        <Text className="text-red-500 mt-1">
          Veuillez sélectionner au moins une image.
        </Text>
      )}
      {selectedImages.length >= MAX_IMAGE_LIMIT && (
        <Text className="text-gray-500 mt-1 text-sm text-right">
          Limite de {MAX_IMAGE_LIMIT} images atteinte.
        </Text>
      )}

      {/* CHAMPS DE FORMULAIRE */}
      <View className="mb-5">
        <Text className="text-base font-bold mb-2">
          Titre<Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border rounded-lg p-3 text-black ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Titre de l'article"
              placeholderTextColor="#6B7280"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.title && (
          <Text className="text-red-500 mt-1">{errors.title.message}</Text>
        )}

        <Text className="text-base font-bold mb-2 mt-5">
          Catégorie<Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-3 items-center">
              {DONATION_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  onPress={() => onChange(category)}
                  className={`rounded-full mb-2 px-4 py-2 ${
                    value === category ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`text-center font-bold ${
                      value === category ? 'text-white' : 'text-black'
                    }`}
                  >
                    {category.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.category && (
          <Text className="text-red-500 mt-1">{errors.category.message}</Text>
        )}

        <Text className="text-base font-bold mb-2 mt-5">
          Adresse<Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          name="adresse"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border rounded-lg p-3 text-black ${
                errors.adresse ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ville ou quartier"
              placeholderTextColor="#6B7280"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.adresse && (
          <Text className="text-red-500 mt-1">{errors.adresse.message}</Text>
        )}

        <Text className="text-base font-bold mb-2 mt-5">Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border rounded-lg p-3 h-24 text-black ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Décrivez l'état de l'article, ses caractéristiques, etc."
              placeholderTextColor="#6B7280"
              onChangeText={onChange}
              value={value}
              multiline
              textAlignVertical="top"
            />
          )}
        />
        {errors.description && (
          <Text className="text-red-500 mt-1">
            {errors.description.message}
          </Text>
        )}
      </View>

      {/* BOUTON DE SOUMISSION */}
      <TouchableOpacity
        className={`rounded-full p-4 items-center mt-5 ${
          loading ? 'bg-gray-400' : 'bg-[#FEF094]'
        }`}
        onPress={handleSubmit(handleAddDonation)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black text-base font-bold">
            Ajouter la donation
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}