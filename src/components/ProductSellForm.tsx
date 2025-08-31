import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useCallback } from 'react';
import { Plus, PlusIcon } from 'phosphor-react-native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import * as yup from 'yup';

import { RootStackParamListMainNavigatorTab } from '../types/Types';
import API from '../api/Api';

type FormData = {
    title: string;
    category: string;
    description?: string;
    price: number;
    adresse: string;
    telphone?: string;
};

const ValidationSchema: yup.ObjectSchema<FormData> = yup.object({
    title: yup.string().required('Le titre est requis.'),
    category: yup.string().required('La catégorie est requise.'),
    description: yup.string().optional(), 
    price: yup.number().typeError('Le prix doit être un nombre.').required('Le prix est requis.').min(0, 'Le prix ne peut pas être négatif.'),
    adresse: yup.string().required("L'adresse est requise."),
    telphone: yup.string().optional(), 
});

export default function ProductSellForm() {
    const navigation = useNavigation<NavigationProp<RootStackParamListMainNavigatorTab>>();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(ValidationSchema),
    });

    useFocusEffect(
        useCallback(() => {
            reset();
        }, [reset])
    );

const handleAddProduct: SubmitHandler<FormData> = async (data) => {
  try {
    const response = await API.post("/api/v1/products/create/", {
      title: data.title,
      type: "SALE", // type vente
      description: data.description,
      price: data.price,
      category: data.category,
      adresse: data.adresse,
      telphone: data.telphone,
    });

    console.log("Produit créé:", response.data);

    Alert.alert(
      "Succès",
      "Votre produit a été mis en vente.",
      [
        {
          text: "OK",
          onPress: () => {
            reset();
            navigation.navigate('Home', {
                screen: 'HomeMain',
              });
          },
        },
      ]
    );
  } catch (error: any) {
    console.log("Erreur création produit:", error.response?.data || error.message);
    Alert.alert("Erreur", "Impossible de créer le produit");
  }
};


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            className="flex-1 bg-white p-5"
        >
            <View className="h-[150] bg-gray-100 rounded-lg justify-center items-center border border-dashed border-gray-300 mb-5">
                <PlusIcon size={30} color="#666" weight="bold" />
                <Text className="mt-2 text-gray-600">Ajouter photo</Text>
            </View>

            <View className="mb-5">
                {/* titre */}
                <Text className="text-base font-bold mb-2">Titre<Text className="text-red-500">*</Text></Text>
                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`border rounded-lg p-3 text-black ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Titre de l'article"
                            placeholderTextColor="#6B7280"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.title && <Text className="text-red-500 mt-1">{errors.title.message}</Text>}

                {/* cat */}
                <Text className="text-base font-bold mb-2 mt-5">Catégorie<Text className="text-red-500">*</Text></Text>
                <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`border rounded-lg p-3 text-black ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Ex : Vêtements, Électronique, Livres"
                            placeholderTextColor="#6B7280"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.category && <Text className="text-red-500 mt-1">{errors.category.message}</Text>}

                {/* desc */}
                <Text className="text-base font-bold mb-2 mt-5">Description</Text>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`border rounded-lg p-3 h-24 text-black ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Décrivez l'état de l'article, ses caractéristiques, etc."
                            placeholderTextColor="#6B7280"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline
                            textAlignVertical="top"
                        />
                    )}
                />
                {errors.description && <Text className="text-red-500 mt-1">{errors.description.message}</Text>}

                {/* Prix */}
                <Text className="text-base font-bold mb-2 mt-5">Prix (en Ar)<Text className="text-red-500">*</Text></Text>
                <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`border rounded-lg p-3 text-black ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Ex : 25000"
                            placeholderTextColor="#6B7280"
                            onBlur={onBlur}
                            onChangeText={text => onChange(parseInt(text, 10))}
                            value={value ? value.toString() : ''}
                            keyboardType="numeric"
                        />
                    )}
                />
                {errors.price && <Text className="text-red-500 mt-1">{errors.price.message}</Text>}

                {/* Adresse */}
                <Text className="text-base font-bold mb-2 mt-5">Adresse<Text className="text-red-500">*</Text></Text>
                <Controller
                    control={control}
                    name="adresse"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`border rounded-lg p-3 text-black ${errors.adresse ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Ville ou quartier"
                            placeholderTextColor="#6B7280"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.adresse && <Text className="text-red-500 mt-1">{errors.adresse.message}</Text>}

                {/* Num tel */}
                <Text className="text-base font-bold mb-2 mt-5">Numéro de téléphone</Text>
                <Controller
                    control={control}
                    name="telphone"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`border rounded-lg p-3 text-black ${errors.telphone ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Ex : 06 12 34 56 78"
                            placeholderTextColor="#6B7280"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="phone-pad"
                        />
                    )}
                />
                {errors.telphone && <Text className="text-red-500 mt-1">{errors.telphone.message}</Text>}
            </View>

            <TouchableOpacity
                className="bg-[#FEF094] rounded-full p-4 items-center mt-5"
                onPress={handleSubmit(handleAddProduct)}
            >
                <Text className="text-black text-base font-bold">Mettre en vente</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}