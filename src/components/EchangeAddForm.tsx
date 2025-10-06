import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator} from 'react-native';
import React, { useCallback, useState, useContext } from 'react';
import { PlusIcon, XCircleIcon } from 'phosphor-react-native'; 
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, NavigationProp, useFocusEffect} from '@react-navigation/native';
import * as yup from 'yup';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';
import { RootStackParamListMainNavigatorTab } from '../types/Types';
import API from '../api/Api';
import { ProductContext, ProductDataI } from '../context/ProductContext';

const ECHANGE_CATEGORIES = [
  'T_SHIRT',
  'PANTALON',
  'ROBE',
  'CHAUSSURE',
  'VESTE',
];

type FormData = {
  title: string;
  category: string;
  description: string; 
  adresse: string;
};

const ValidationSchema: yup.ObjectSchema<FormData> = yup.object({
  title: yup.string().required('Le titre est requis.'),
  category: yup.string().required('La catégorie est requise.'),
  description: yup.string().required("La description de l'article est requise."),
  adresse: yup.string().required("L'adresse est requise."),
});

export default function EchangeAddForm() {
  const navigation =useNavigation<NavigationProp<RootStackParamListMainNavigatorTab>>();
  const { addProduct } = useContext(ProductContext);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 
  const [motsClesRecherches, setMotsClesRecherches] = useState<string[]>([]);
  const [saisieMotCle, setSaisieMotCle] = useState<string>('');
  const [controlAfficheErrorContreEchange, setControlAfficheErrorContreEchange] = useState(false); 
 

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

/*ilaigna kofa miova onglet nle user na miala @ composant ty de reinitialiset champ jiaby */  
useFocusEffect(
    useCallback(() => {
      reset();
      setSelectedImage(null);
      setMotsClesRecherches([]); 
      setSaisieMotCle('');
      setControlAfficheErrorContreEchange(false)
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
        console.log(`utilisateur annule l' import  d'image picker`);
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

 
  const addKeyword = () => {
    const keyword = saisieMotCle.trim().toUpperCase();
    if (keyword && !motsClesRecherches.includes(keyword)) {
      setMotsClesRecherches([...motsClesRecherches, keyword]);
      setSaisieMotCle('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setMotsClesRecherches(
      motsClesRecherches.filter(keyword => keyword !== keywordToRemove),
    );
  };
 

  const handleAddEchange: SubmitHandler<FormData> = async data => {

    setControlAfficheErrorContreEchange(true); 
    if (!selectedImage) {
      Alert.alert(
        'Erreur',
        'Veuillez sélectionner une image pour votre échange.',
      );
      return;
    }
    
    
    if (motsClesRecherches.length === 0) {
      Alert.alert(
        'Erreur',
        "Veuillez ajouter au moins un mot-clé de contre-échange (ce que vous recherchez).",
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', 'ECHANGE');
      const keywordString = motsClesRecherches.join(', ');
      const fullDescription = `${data.description} | Mots-clés recherchés : ${keywordString}`;
      formData.append('description', fullDescription);

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
    

      console.log('Échange créé:', response.data);
      const newEchange = response.data as ProductDataI;
      addProduct(newEchange);

      Alert.alert('Succès', 'Votre échange a été ajouté.', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            setSelectedImage(null);
            setMotsClesRecherches([]); 
            navigation.navigate('Accueil', { screen: 'AccueilMain' });
          },
        },
      ]);
    } catch (error: any) {
      console.log(
        'Erreur création échange:',
        error.response?.data || error.message,
      );
      Alert.alert('Erreur', "Impossible d'ajouter l'échange");
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
        className=" h-[250] bg-gray-100 rounded-lg justify-center items-center border border-dashed border-gray-300 mb-5 overflow-hidden"
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-full rounded-lg"
            resizeMode="contain"
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
          Titre de votre article<Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border rounded-lg p-3 text-black ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Mon vieux T-Shirt de marque"
              placeholderTextColor="#6B7280"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.title && (
          <Text className="text-red-500 mt-1">{errors.title.message}</Text>
        )}

        {/* --- Catégorie --- */}
        <Text className="text-base font-bold mb-2 mt-5">
          Catégorie<Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap  gap-3 items-center">
              {ECHANGE_CATEGORIES.map(category => (
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

        {/* --- Description de l'article PROPOSÉ --- */}
        <Text className="text-base font-bold mb-2 mt-5">
          Description de votre article<Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border rounded-lg p-3 h-24 text-black ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Décrivez l'état, la taille, la couleur et les caractéristiques de l'article que vous proposez."
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

       
        <Text className="text-base font-bold mb-2 mt-5">
          Mots-clés recherchés en échange<Text className="text-red-500">*</Text>
        </Text>
        
     
        <View className="flex-row items-center mb-3">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3 text-black"
            placeholder="Ex: 'Livre de cuisine' ou 'Casquette'"
            placeholderTextColor="#6B7280"
            onChangeText={setSaisieMotCle}
            value={saisieMotCle}
            onSubmitEditing={addKeyword} 
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={addKeyword}
            className={`p-3 ml-2 rounded-full ${
              saisieMotCle.trim() ? 'bg-black' : 'bg-gray-400'
            }`}
            disabled={!saisieMotCle.trim()}
          >
            <PlusIcon size={20} color="white" weight="bold" />
          </TouchableOpacity>
        </View>

      
        {motsClesRecherches.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-2">
            {motsClesRecherches.map((keyword, index) => (
              <View
                key={index}
                className="flex-row items-center bg-[#FEF094] rounded-full px-3 py-1.5"
              >
                <Text className="text-black font-semibold text-sm mr-1">
                  {keyword}
                </Text>
                <TouchableOpacity onPress={() => removeKeyword(keyword)}>
                  <XCircleIcon size={16} color="black" weight="bold" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
          {motsClesRecherches.length === 0 && controlAfficheErrorContreEchange && (
          <Text className="text-red-500 mt-1">
            Veuillez ajouter au moins un mot-clé de contre-échange.
          </Text>
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
      </View>

      <TouchableOpacity
        className={`rounded-full p-4 items-center mt-5 ${
          loading ? 'bg-gray-400' : 'bg-[#FEF094]'
        }`}
        onPress={handleSubmit(handleAddEchange)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black text-base font-bold">
            Ajouter l'échange
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}