import { View, TouchableOpacity } from 'react-native';
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
  
    <View className="flex-row items-center gap-3"> 
      <TouchableOpacity
        onPress={handlePress}
        className="p-3 bg-gray-100 rounded-full shadow-sm"
      >
        <MagnifyingGlassIcon size={24} weight="bold" color="#03233A" />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onFilterPress}
        className="p-3 bg-gray-100 rounded-full shadow-sm"
      >
        <FadersHorizontalIcon size={24} weight="bold" color="#03233A" />
      </TouchableOpacity>
      
    </View>
  );
}