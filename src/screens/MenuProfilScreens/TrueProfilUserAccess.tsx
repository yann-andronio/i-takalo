import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { ProfilStackNavigation } from '../ProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import AnnoncesByUser from '../../components/AnnoncesByUser';
import InformationUser from '../../components/InformationUser';
import { ProductContext } from '../../context/ProductContext'; 

export default function TrueProfilUserAccess() {
  const [selecttype, setselecttype] = useState<'Annonces' | 'Informations'>(
    'Annonces',
  );
  const navigation = useNavigation<ProfilStackNavigation>();
  const { user } = useContext(AuthContext);
  const { products } = useContext(ProductContext);
  const userProducts = products.filter(product => product.author === user?.id);
  const Nbpub = userProducts.length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="flex-row items-center px-6 mt-4 mb-5">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeftIcon size={24} color="black" weight="bold" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-5">
          {user?.first_name} {user?.last_name}
        </Text>
      </View>

      <View className="flex-row justify-center gap-5 px-6 ">
        <TouchableOpacity
          className={` py-3 rounded-full flex-1 items-center justify-center ${
            selecttype === 'Annonces' ? 'bg-[#03233A]' : 'bg-gray-200'
          }`}
          onPress={() => setselecttype('Annonces')}
        >
          <Text
            className={`${
              selecttype === 'Annonces' ? 'text-white' : 'text-[#03233A]'
            } font-normal `}
          >
            Annonces
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={` py-3 rounded-full flex-1 items-center justify-center  ${
            selecttype === 'Informations' ? 'bg-[#03233A]' : 'bg-gray-200'
          }`}
          onPress={() => setselecttype('Informations')}
        >
          <Text
            className={`${
              selecttype === 'Informations' ? 'text-white' : 'text-[#03233A]'
            } font-normal`}
          >
            Informations
          </Text>
        </TouchableOpacity>
      </View>
      
    
      {selecttype === 'Annonces' && (
        <Text className="pl-7 text-start text-gray-500 mt-5 mb-3">
          {Nbpub} Publication{Nbpub > 1 ? 's' : ''}
        </Text>
      )}

     
      {selecttype === 'Annonces' ? (
        <AnnoncesByUser userProducts={userProducts} />
      ) : (
        <InformationUser />
      )}
    </SafeAreaView>
  );
}