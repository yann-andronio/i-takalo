// src/components/UserCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { UserPlusIcon, UserIcon } from 'phosphor-react-native'; 
import { UserI } from '../context/UserContext'; 

interface UserCardProps {
  item: UserI;
}

export default function UserCard({ item }: UserCardProps) {
  
  const profileImageSourceUse = item.image ? { uri: item.image } : null;

  return (
    <View className="bg-white flex-row items-center rounded-2xl w-[100%] m-2 p-4 shadow-md">
      
      {profileImageSourceUse ? (
        <Image
          source={profileImageSourceUse}
          className="w-16 h-16 rounded-full border-2 border-gray-200"
          resizeMode="cover"
        />
      ) : (
        <View className="w-12 h-12 rounded-full border-2 border-gray-200 bg-gray-100 items-center justify-center">
          <UserIcon size={30} color="gray" weight="light" />
        </View>
      )}
      
      <View className="flex-1 ml-4 overflow-hidden">
        <Text 
          className="text-lg font-bold text-gray-800"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.first_name}
        </Text>
        <Text 
          className="text-sm text-gray-500"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.email}
        </Text>
      </View>
      
      <TouchableOpacity className="bg-colorbtn flex-row items-center gap-2 px-4 ml-8 py-2 rounded-full">
        <UserPlusIcon size={18} color="black" weight="bold" />
        <Text className="text-black font-semibold text-sm">Suivre</Text>
      </TouchableOpacity>
    </View>
  );
}