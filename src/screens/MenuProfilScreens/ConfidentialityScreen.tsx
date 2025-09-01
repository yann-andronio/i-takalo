import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfilStackNavigation } from '../ProfileScreen';
import { confidentialityData } from '../../data/confidentialityData'; 

export default function ConfidentialityScreen() {
    const navigation = useNavigation<ProfilStackNavigation>();
    
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <View className="flex-row items-center px-6 mt-4 mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full bg-gray-100">
            <ArrowLeftIcon size={24} color="black" weight="bold" />
          </TouchableOpacity>
          <Text className="text-lg font-bold ml-5">{confidentialityData.mainTitle}</Text>
        </View>

        <ScrollView className="flex-1 px-6">
          {confidentialityData.sections.map((section, index) => (
            <View key={index} className="mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-2">{section.title}</Text>
              <Text className="text-base text-gray-600 leading-6">{section.content}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
}