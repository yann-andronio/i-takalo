/* submithandle migaranti comptabilite  avec yup.ObjectSchema<FormData> = yup.object({ */
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useCallback } from 'react';
import { Plus, PlusIcon } from 'phosphor-react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import * as yup from 'yup';

import { RootStackParamListMainNavigatorTab } from '../types/Types';


type FormData = {
    category: string;
    description?: string; 
    adresse: string;
    telphone: string;
};


const ValidationSchema: yup.ObjectSchema<FormData> = yup.object({
    category: yup.string().required('La catégorie est requise.'),
    description: yup.string().optional(), //  facultatif
    adresse: yup.string().required("L'adresse est requise."),
    telphone: yup.string().required('Le numéro de téléphone est requis.'),
});

export default function DonationAdForm() {
    const navigation = useNavigation<NavigationProp<RootStackParamListMainNavigatorTab>>();

   
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(ValidationSchema),
    });


     useFocusEffect(
        useCallback(() => {
            // Réinitialise le formulaire à chaque fois que l'écran est focalisé
            reset();
        }, [reset])
    );

    const handleAddDonation: SubmitHandler<FormData> = (data) => {
        console.log('Donation validée:', data);
        
        Alert.alert(
            'Succès',
            'Votre donation a été ajoutée. Vous allez être redirigé vers la page d\'accueil.',
            [{
                text: 'OK',
                onPress: () => {
                    reset(); 
                    navigation.navigate('Home');
                },
            }]
        );
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
                {/* cat */}
                <Text className="text-base font-bold mb-2">Catégorie<Text className="text-red-500">*</Text></Text>
                <TextInput
                    className={`border rounded-lg p-3 text-black ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex : Vêtement, Meuble, Jouet"
                    placeholderTextColor="#6B7280"
                    onChangeText={value => setValue('category', value)}
                    {...register('category')}
                />
                {errors.category && <Text className="text-red-500 mt-1">{errors.category.message}</Text>}

                {/* Adresse */}
                <Text className="text-base font-bold mb-2 mt-5">Adresse<Text className="text-red-500">*</Text></Text>
                <TextInput
                    className={`border rounded-lg p-3 text-black ${errors.adresse ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ville ou quartier"
                    placeholderTextColor="#6B7280"
                    onChangeText={value => setValue('adresse', value)}
                    {...register('adresse')}
                />
                {errors.adresse && <Text className="text-red-500 mt-1">{errors.adresse.message}</Text>}

                {/* Num tel */}
                <Text className="text-base font-bold mb-2 mt-5">Numéro de téléphone<Text className="text-red-500">*</Text></Text>
                <TextInput
                    className={`border rounded-lg p-3 text-black ${errors.telphone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex : 06 12 34 56 78"
                    placeholderTextColor="#6B7280"
                    onChangeText={value => setValue('telphone', value)}
                    keyboardType="phone-pad"
                    {...register('telphone')}
                />
                {errors.telphone && <Text className="text-red-500 mt-1">{errors.telphone.message}</Text>}

                {/* desc */}
                <Text className="text-base font-bold mb-2 mt-5">Description</Text>
                <TextInput
                    className={`border rounded-lg p-3 h-24 text-black ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Décrivez l'état de l'article, ses caractéristiques, etc."
                    placeholderTextColor="#6B7280"
                    onChangeText={value => setValue('description', value)}
                    multiline
                    textAlignVertical="top"
                    {...register('description')}
                />
                {errors.description && <Text className="text-red-500 mt-1">{errors.description.message}</Text>}
            </View>

            <TouchableOpacity
                className="bg-[#FEF094] rounded-full p-4 items-center mt-5"
                onPress={handleSubmit(handleAddDonation)}
            >
                <Text className="text-black text-base font-bold">Ajouter</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}