import React from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { StartScreenData } from '../data/startscreendata/StartScreenData';

interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const leftColumn = StartScreenData.slice(0, 3);
  const rightColumn = StartScreenData.slice(3, 6);

  return (
    <View className="flex-1 w-full relative">
      <View className="flex-row justify-between p-5 z-0">
        <View className="flex flex-col justify-between">
          {leftColumn.map((item, index) => (
            <Image
              key={index}
              source={item.image}
              className="mb-4"
              resizeMode="contain"
            />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {rightColumn.map((item, index) => (
            <Image
              key={index}
              source={item.image}
              className="mb-4"
              resizeMode="contain"
            />
          ))}
        </View>
      </View>

      <Image
        source={require('../assets/images/StartImageScreen/blueeffect.png')}
        resizeMode="cover"
        className="absolute w-full h-full z-0"
      />

      <View className="absolute flex gap-3 bottom-12 w-full px-5 z-10 ">
        <Text className="font-bold text-white"style={{ fontSize: width * 0.12 }}>
          i-takalo
        </Text>
        <View className="mb-4">
          <Text className=" text-white text-xl">
            Plateforme de tendance juvénile,
          </Text>
          <Text className=" text-white text-xl">
            là où l’envie rencontre le style
          </Text>
        </View>

        <TouchableOpacity
          className="bg-[#FEF094] w-full flex items-center px-6 py-3 rounded-full"
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-black font-bold text-lg">Commencer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartScreen;
