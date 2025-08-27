import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { FadersHorizontalIcon, MagnifyingGlassIcon } from 'phosphor-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamListHomenavigatorScreen } from '../types/Types';

type Props = {
  onFilterPress: () => void;
};

export default function FakeSearchBar({ onFilterPress }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamListHomenavigatorScreen>>();

  const handlePress = () => {
    navigation.navigate('Search');
  };

  return (
    <View>
      <View className="w-full flex-row gap-5 items-center mb-4">
        <TouchableOpacity
          onPress={handlePress}
          className="flex-row items-center bg-[#F9F9F9] w-full border border-[#C2C2C2] flex-1 rounded-xl px-3 py-[9px] shadow-md"
        >
          <MagnifyingGlassIcon size={21} weight="bold" color="#9F9F9F" />
          <Text className="flex-1 ml-2 text-[14px] text-[#9F9F9F]">
            Rechercher un article ou un membre
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onFilterPress}>
          <FadersHorizontalIcon size={24} weight="bold" color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
