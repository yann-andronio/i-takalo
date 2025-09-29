import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { ArrowLeftIcon, Tag } from 'phosphor-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamListChatnavigatorScreen } from '../types/Types';
import { CashPayment } from '../components/CashPayment';
import MobileMoneyPayment from '../components/MobileMoneyPayment';

type ModePaiement = 'mobilemoney' | 'liquide';

export default function ValidationTransactionScreen() {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<RootStackParamListChatnavigatorScreen, 'ValidationTransaction'>
    >();
  const { produit } = route.params;
  const isSale = produit.type === 'SALE';
  const formattedPrice = produit.price
    ? Number(produit.price).toLocaleString('fr-FR')
    : '0';
  const [selectedModePayement, setselectedModePayement] =
    useState<ModePaiement>('mobilemoney');

  const total = isSale ? Number(produit.price) : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
    
      <View className="flex-row items-center  gap-4 px-6 py-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 bg-gray-100 rounded-full"
        >
          <ArrowLeftIcon size={22} color="black" weight="bold" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">
          Validation transaction
        </Text>
        <View className="w-8" />
      </View>

      <View className="p-4 mx-6 mt-6 bg-white border shadow-md rounded-2xl border-gray-50">
        <View className="flex-row items-start">
          <Image
            source={{ uri: produit.image }}
            className="w-24 h-24 mr-4 rounded-xl"
            resizeMode="cover"
          />

          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Tag size={16} color="#6B7280" />
              <Text className="ml-1 text-sm font-semibold text-gray-500">
                Article :
                <Text className="font-bold text-gray-800">
                  {' '}
                  {produit.title}
                </Text>
              </Text>
            </View>

            <Text className="mt-1 text-2xl font-extrabold text-gray-900">
              {isSale ? `Ar ${formattedPrice}` : 'Donation'}
            </Text>

            <Text className="text-xs font-medium text-gray-400">
              {isSale ? "Prix de l'article" : "Confirmation d'intérêt"}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View className="px-6 mt-8">
          <Text className="mb-3 text-base font-semibold text-gray-700">
             Mode de paiement
          </Text>

          <View className="flex-row gap-5">
            {(['mobilemoney', 'liquide'] as ModePaiement[]).map(mode => (
              <TouchableOpacity
                key={mode}
                onPress={() => setselectedModePayement(mode)}
                className={`flex-1 py-3 rounded-xl border ${
                  selectedModePayement === mode
                    ? 'bg-[#03233A] border-[#03233A]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    selectedModePayement === mode
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {mode === 'mobilemoney'
                    ? 'Mobile Money'
                    : 'Paiement en liquide'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedModePayement === 'mobilemoney' ? (
          <MobileMoneyPayment />
        ) : (
          <View className="px-6 mt-5 ">
            <CashPayment />
          </View>
        )}
      </ScrollView>
      {/*  {isSale && (
        <View className="p-5 mx-6 mt-10 border border-gray-100 rounded-2xl bg-gray-50">
          <Text className="mb-3 text-base font-bold text-gray-800">
            Résumé de la commande
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Sous-total</Text>
            <Text className="text-sm font-semibold text-gray-800">
              Ar {formattedPrice}
            </Text>
          </View>


          <View className="flex-row justify-between pt-3 mt-3 border-t border-gray-200">
            <Text className="text-base font-bold text-gray-900">Total</Text>
            <Text className="text-base font-extrabold text-[#03233A]">
              Ar {total.toLocaleString('fr-FR')}
            </Text>
          </View>
        </View>
      )} */}

      {/* BOUTON CONFIRMATION */}
    </SafeAreaView>
  );
}
