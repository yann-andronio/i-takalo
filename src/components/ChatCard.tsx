import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ChatUserI } from '../screens/ChatScreen';

interface ChatItemProps {
  item: ChatUserI;
  onPress: () => void;
}

export default function ChatCard({ item, onPress }: ChatItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 rounded-xl mb-2 ${!item.islu ? 'bg-white' : 'bg-gray-50'}`}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
      }}
    >
      <View className="relative mr-3">
        <Image
          source={item.avatar}
          className="w-12 h-12 rounded-full"
        />
      </View>

      <View className="flex-1">
        <Text className={`font-semibold text-base ${!item.islu ? 'text-[#03233A]' : 'text-gray-700'}`}>
          {item.name}
        </Text>
        <Text
          className={`text-sm ${!item.islu ? 'font-medium text-[#03233A]' : 'text-gray-500'}`}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {!item.islu && (
        <View className="w-2 h-2 bg-blue-500 rounded-full ml-3" />
      )}
    </TouchableOpacity>
  );
}