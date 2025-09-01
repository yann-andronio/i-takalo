import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductData, ProductDataI } from '../data/ProductData';
import ProductCard from '../components/ProductCard';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import { SearchUtils } from '../utils/SearchUtils';
import DonationAdForm from '../components/DonationAdForm';
import ProductSellForm from '../components/ProductSellForm';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProductAdScreen() {
     const navigation = useNavigation();
     const [searchType, setSearchType] = useState<'donation' | 'vente'>('donation');



  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-5">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={()=>navigation.goBack()}  className="p-2 rounded-full bg-gray-100">
            <ArrowLeftIcon size={24} color="black" weight="bold" />
          </TouchableOpacity>
           <Text className="text-lg font-bold ml-5">Ajout article</Text>
         </View>
         

      <View className="flex-row justify-center mb-5 mt-2 gap-5 ">
        <TouchableOpacity
          className={` py-3 rounded-full flex-1 items-center justify-center ${searchType === 'donation' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setSearchType('donation')}
        >
          <Text className={`${searchType === 'donation' ? 'text-white' : 'text-[#03233A]'} font-normal `}>
            donations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={` py-3 rounded-full flex-1 items-center justify-center  ${searchType === 'vente' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setSearchType('vente')}
        >
          <Text className={`${searchType === 'vente' ? 'text-white' : 'text-[#03233A]'} font-normal`} >
            vente
          </Text>
        </TouchableOpacity>
      </View>


      {
        searchType === "donation"  ?  <DonationAdForm/>:<ProductSellForm/>
      }
     
    </SafeAreaView>
  );
}
