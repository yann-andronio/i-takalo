import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useState, useContext } from 'react';
import { PlusIcon } from 'phosphor-react-native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import * as yup from 'yup';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';

import { RootStackParamListMainNavigatorTab } from '../types/Types';
import API from '../api/Api';
import { ProductContext, ProductDataI } from '../context/ProductContext'; // Import de ProductContext

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

export default function DonationAdForm() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamListMainNavigatorTab>>();
  const { addProduct } = useContext(ProductContext);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setSelectedImage(null);
    }, [reset]),
  );

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 400,
      maxWidth: 400,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
        Alert.alert('Erreur', "Impossible de sélectionner l'image.");
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        if (source) {
          setSelectedImage(source);
        }
      }
    });
  };

  const handleAddDonation: SubmitHandler<FormData> = async data => {
    if (!selectedImage) {
      Alert.alert(
        'Erreur',
        'Veuillez sélectionner une image pour votre donation.',
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', 'DONATION');
      formData.append('description',data.description || 'Pas de description fournie.',);
      formData.append('category', data.category);
      formData.append('adresse', data.adresse);

      const filename = selectedImage.split('/').pop();
      const fileType = selectedImage.substring(
        selectedImage.lastIndexOf('.') + 1,
      );

      formData.append('image', {
        uri: selectedImage,
        name: filename,
        type: `image/${fileType}`,
      });

      const response = await API.post('/api/v1/products/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Donation créée:', response.data);
      const newDonation = response.data as ProductDataI;
      addProduct(newDonation);

      Alert.alert('Succès', 'Votre donation a été ajoutée.', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            setSelectedImage(null);
            navigation.navigate('Home', { screen: 'HomeMain' });
          },
        },
      ]);
    } catch (error: any) {
      console.log(
        'Erreur création donation:',
        error.response?.data || error.message,
      );
      Alert.alert('Erreur', "Impossible d'ajouter la donation");
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
      <TouchableOpacity
        onPress={handleImagePicker}
        className=" max-h-[65%] min-h-[150] bg-gray-100 rounded-lg justify-center items-center border border-dashed border-gray-300 mb-5 overflow-hidden"
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <>
            <PlusIcon size={30} color="#666" weight="bold" />
            <Text className="mt-2 text-gray-600">Ajouter photo</Text>
          </>
        )}
      </TouchableOpacity>

      <View className="mb-5">
        <Text className="text-base font-bold mb-2">
          Titre<Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border rounded-lg p-3 text-black ${errors.title ? 'border-red-500' : 'border-gray-300'
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
                  className={`
                                          rounded-full mb-2 px-4 py-2
                                          ${value === category
                      ? 'bg-black'
                      : 'bg-gray-200'
                    }
                                      `}
                >
                  <Text
                    className={`text-center font-bold ${value === category ? 'text-white' : 'text-black'
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
              className={`border rounded-lg p-3 text-black ${errors.adresse ? 'border-red-500' : 'border-gray-300'
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
              className={`border rounded-lg p-3 h-24 text-black ${errors.description ? 'border-red-500' : 'border-gray-300'
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

      <TouchableOpacity
        className={`rounded-full p-4 items-center mt-5 ${loading ? 'bg-gray-400' : 'bg-[#FEF094]'
          }`}
        onPress={handleSubmit(handleAddDonation)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black text-base font-bold">Ajouter</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
