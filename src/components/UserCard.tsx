// src/components/UserCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {  UserPlusIcon } from 'phosphor-react-native'; // Icône pour "Suivre"
import { UserDataI } from '../data/UserData';

interface UserCardProps {
  item: UserDataI;
}

export default function UserCard({ item }: UserCardProps) {
  return (
    <View className="bg-white flex-row items-center rounded-2xl w-[100%] m-2 p-4 shadow-md">
      
   
      <Image
        source={item.profileImage}
        className="w-16 h-16 rounded-full border-2 border-gray-200"
        resizeMode="cover"
      />

    
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold text-gray-800">{item.username}</Text>
        <Text className="text-sm text-gray-500">{item.email}</Text>
      </View>

   
      <TouchableOpacity className="bg-colorbtn flex-row items-center gap-2 px-4 py-2 rounded-full">
        <UserPlusIcon size={18} color="black" weight="bold" />
        <Text className="text-black font-semibold text-sm">Suivre</Text>
      </TouchableOpacity>
    </View>
  );
}
