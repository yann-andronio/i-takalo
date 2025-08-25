import { View, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import {  MagnifyingGlassIcon } from 'phosphor-react-native';
import { FadersHorizontalIcon } from 'phosphor-react-native';

export default function SearchBar() {
  return (
    <View className="w-full flex-row gap-5 items-center  ">
      <View className="flex-row items-center bg-[#F9F9F9] w-full border border-[#C2C2C2] flex-1  rounded-xl px-3 py-1 shadow-md">
        <MagnifyingGlassIcon size={24} weight="bold" color="#9F9F9F" />

        <TextInput
          placeholder="Rechercher "
          placeholderTextColor="#9F9F9F"
          className="flex-1  bg-[#F9F9F9] ml-2 text-[16px]"
        />
      </View>
      <TouchableOpacity className='  items-center  '>
        <FadersHorizontalIcon size={24} weight='bold' color="#000000"/>
      </TouchableOpacity>
    </View>
  );
}
