import { View, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { MagnifyingGlassIcon, FadersHorizontalIcon } from 'phosphor-react-native';

interface SearchBarProps {
  onChangeText: (text: string) => void;
}

export default function SearchBar({ onChangeText }: SearchBarProps) {
  return (
    <View className="w-full flex-row gap-5 items-center">
      <View className="flex-row items-center bg-[#F9F9F9] w-[87%] border border-[#C2C2C2]  rounded-xl px-3  shadow-md">
        <MagnifyingGlassIcon size={21} weight="bold" color="#9F9F9F" />
        <TextInput
          placeholder="Rechercher un article ou un membre"
          placeholderTextColor="#9F9F9F"
          className="flex-1 bg-[#F9F9F9] text-black ml-2 text-[14px]"
          onChangeText={onChangeText} 
        />
      </View>
 
    </View>
  );
}
