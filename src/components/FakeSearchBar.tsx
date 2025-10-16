import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  FadersHorizontalIcon,
  MagnifyingGlassIcon,
} from 'phosphor-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamListHomenavigatorScreen } from '../types/Types';

type Props = {
  onFilterPress: () => void;
};

export default function FakeSearchBar({ onFilterPress }: Props) {
  const navigation =
    useNavigation<NavigationProp<RootStackParamListHomenavigatorScreen>>();

  const handlePress = () => {
    navigation.navigate('Search');
  };

  return (
    <View className="px-1">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={handlePress}
          className="flex-row items-center bg-[#F9F9F9] border border-[#C2C2C2] flex-1 rounded-xl px-3 py-[2.5%] shadow-md mr-4"
        >
          <MagnifyingGlassIcon size={21} weight="bold" color="#9F9F9F" />
          <Text className="flex-1 ml-2 text-base text-[#9F9F9F]">
            Recherche article et autres...
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onFilterPress}>
          <FadersHorizontalIcon size={24} weight="bold" color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
