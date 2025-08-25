import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FadersHorizontalIcon,
  MagnifyingGlassIcon,
} from 'phosphor-react-native';
import HeroSection from '../components/HeroSection';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView className=" flex-1 bg-white p-6">
      <View className="w-full flex-row gap-5 items-center  ">
        <View className="flex-row items-center bg-[#F9F9F9] w-full border border-[#C2C2C2] flex-1  rounded-xl px-3 py-1 shadow-md">
          <MagnifyingGlassIcon size={24} weight="bold" color="#9F9F9F" />

          <TextInput
            placeholder="Rechercher "
            placeholderTextColor="#9F9F9F"
            className="flex-1  bg-[#F9F9F9] ml-2 text-[16px]"
          />
        </View>
        <TouchableOpacity className="  items-center  ">
          <FadersHorizontalIcon size={24} weight="bold" color="#000000" />
        </TouchableOpacity>
      </View>

      <View>
          <HeroSection />
      </View>

      {/*  <TouchableOpacity
        onPress={logout}
        className="bg-red-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold text-lg">Se déconnecter</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
