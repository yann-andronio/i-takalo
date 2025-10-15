import { View, TouchableOpacity, Text } from 'react-native';
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

export default function FakeSearchBarAfterOpacity({ onFilterPress }: Props) {
  const navigation =
    useNavigation<NavigationProp<RootStackParamListHomenavigatorScreen>>();

  const handlePress = () => {
    navigation.navigate('Search');
  };

  return (
    <View className="flex-row items-center justify-between w-full">
      <Text
        className="text-2xl font-extrabold  text-[#192A6B]"
        style={{
          letterSpacing: 0.6,
        }}
      >
        Itakalo
      </Text>

      <View className="flex-row items-center gap-6">
        <TouchableOpacity
          onPress={handlePress}
          className="p-3 bg-gray-100 rounded-full shadow-sm"
          activeOpacity={0.8}
        >
          <MagnifyingGlassIcon size={20} weight="bold" color="#03233A" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onFilterPress}
          className="p-3 bg-gray-100 rounded-full shadow-sm"
          activeOpacity={0.8}
        >
          <FadersHorizontalIcon size={20} weight="bold" color="#03233A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
