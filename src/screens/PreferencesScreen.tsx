import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated'; 
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES_DATA } from '../data/PreferenceData';
import { PreferenceCard } from '../components/PreferenceCard';
import { InfoIcon, ArrowRight } from 'phosphor-react-native'; 

// --- Palette de Couleurs du Thème ---
const PRIMARY_COLOR = '#083B58';
const ACCENT_YELLOW = '#FEF094'; 
const DARK_TEXT = '#1F2937';
const LIGHT_GREY = '#F9FAFB'; 
const ERROR_RED = '#EF4444'; 

const validationSchema = yup.object().shape({
  preferences: yup
    .array()
    .min(1, 'Sélectionnez au moins une catégorie pour personnaliser votre expérience.')
    .of(yup.string())
    .required(),
});

export default function PreferencesScreen() {

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      preferences: [],
    },
  });

  const preferences = watch('preferences');
  const isContinueEnabled = preferences.length > 0;
  const totalCategories = CATEGORIES_DATA.length;
  const minSelections = 1;

  const onSubmit = (data:any) => {
    console.log(data);
  };

  const handleInfoPress = () => {
      Alert.alert(
          "À propos de vos préférences",
          "C'est ici que vous sélectionnez les domaines d'intérêt ! Cela nous permet de vous proposer des articles, des échanges et des donations parfaitement adaptés à vos passions.",
          [{ text: "Compris" }]
      );
  };


  return (
    <SafeAreaView className="flex-1 bg-white">

        {/* --- En-tête */}
        <View className="px-5 pt-6 pb-2 flex-row items-start justify-between">
            <View className='flex-1 pr-4'>
                <Text style={{ color: PRIMARY_COLOR }} className="text-2xl font-bold">
                    Vos Centres d'Intérêt
                </Text>
                <Text className="text-base text-gray-500 mt-1">
                    Choisissez au moins 1 catégorie pour commencer.
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleInfoPress}
                className="p-3 rounded-full bg-white border border-gray-200"
            >
                <InfoIcon size={20} color={PRIMARY_COLOR} weight="bold" />
            </TouchableOpacity>

        </View>

        {/* --- Affichage de l'Erreur */}
        {errors.preferences && (
            <Animated.View
                entering={FadeInUp}
                exiting={FadeOutDown}
                style={{ backgroundColor: ERROR_RED }}
                className="mx-5 my-3 p-3 rounded-lg flex-row items-center justify-center shadow-sm"
            >
                <Text className="text-white text-sm font-semibold">
                    {errors.preferences.message}
                </Text>
            </Animated.View>
        )}

        <Controller
            control={control}
            name="preferences"
            render={({ field: { onChange, value } }) => (
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 150 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-row flex-wrap justify-between">
                        {CATEGORIES_DATA.map((item) => {
                            const isSelected = value.includes(item.name);

                            const toggleCategory = () => {
                                const newPreferences = isSelected ? value.filter(name => name !== item.name): [...value, item.name];
                                onChange(newPreferences);
                            };

                            return (
                                <PreferenceCard
                                    key={item.name}
                                    item={item}
                                    isSelected={isSelected}
                                    toggleCategory={toggleCategory}
                                />
                            );
                        })}

                       {/* Éléments fantômes pour l'alignement */}
                       {CATEGORIES_DATA.length % 3 === 1 && <View className="w-[30%] mb-4" />}
                       {CATEGORIES_DATA.length % 3 === 1 && <View className="w-[30%] mb-4" />}
                       {CATEGORIES_DATA.length % 3 === 2 && <View className="w-[30%] mb-4" />}
                    </View>
                </ScrollView>
            )}
        />

        {/* --- Bouton de confirmation  --- */}
        <Animated.View
            style={{ backgroundColor: 'white' }}
            className="absolute bottom-0 left-0 right-0 pt-3 pb-8 px-5 border-t border-gray-100 shadow-2xl shadow-gray-300"
        >
            <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm text-gray-500 font-medium">
                    Sélections:
                </Text>
                <Text style={{ color: PRIMARY_COLOR }} className="text-base font-extrabold">
                    {preferences.length} / {totalCategories}
                </Text>
            </View>

            <TouchableOpacity
                className={`rounded-full overflow-hidden`}
                activeOpacity={isContinueEnabled ? 0.8 : 1}
                onPress={handleSubmit(onSubmit)}
                disabled={!isContinueEnabled}
            >
                <View
                    style={{ backgroundColor: isContinueEnabled ? ACCENT_YELLOW : "#E5E7EB" }}
                    className={`py-4 px-6 items-center justify-center flex-row ${isContinueEnabled ? 'opacity-100' : 'opacity-70'}`}
                >
                    <Text
                        style={{ color: isContinueEnabled ? PRIMARY_COLOR : DARK_TEXT }}
                        className="text-lg font-extrabold mr-2"
                    >
                        {isContinueEnabled ? `Continuer` : `Sélectionnez ${minSelections - preferences.length} de plus`}
                    </Text>
                    {isContinueEnabled && <ArrowRight size={22} color={PRIMARY_COLOR} weight="bold" />}
                </View>
            </TouchableOpacity>
        </Animated.View>
    </SafeAreaView>
  );
}