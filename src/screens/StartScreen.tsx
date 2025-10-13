import React, {useEffect, useRef} from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { StartScreenData } from '../data/StartScreenData';
import { Marquee } from '@animatereactnative/marquee';
interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const leftColumn = StartScreenData.slice(0, 3);
  const rightColumn = StartScreenData.slice(3, 6);



  const bottomContentOpacity = useRef(new Animated.Value(0)).current;
  const bottomContentTranslate = useRef(new Animated.Value(50)).current;

  // Refs pour suivre les indices
  const leftIndexRef = useRef(0);
  const rightIndexRef = useRef(0);

  useEffect(() => {
    // Animation du contenu en bas
    Animated.parallel([
      Animated.timing(bottomContentOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bottomContentTranslate, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [])
  return (
    <View className="flex-1 w-full relative">
      <View className="flex-row justify-between p-5 z-0">
        <Marquee
          speed={0.5} 
          spacing={20}
          direction="vertical"
          reverse={false} 
        >
          <View className="flex justify-center items-center flex-col">
            {leftColumn.map((item, index) => (
              <Image
                key={index}
                source={item.image}
                className="mb-4"
                resizeMode="contain"
              />
            ))}
          </View>
        </Marquee>
        <Marquee
          speed={0.5} 
          spacing={20}
          direction="vertical"
          reverse={true} 
        >
          <View className="flex flex-col justify-center items-center gap-2">
            {rightColumn.map((item, index) => (
              <Image
                key={index}
                source={item.image}
                className="mb-4"
                resizeMode="contain"
              />
            ))}
          </View>
        </Marquee>
      </View>

      <Image
        source={require('../assets/images/StartImageScreen/blueeffect.png')}
        resizeMode="cover"
        className="absolute w-full h-full z-0"
      />

      {/* <View className="absolute flex gap-3 bottom-12 w-full px-5 z-10 ">
        <Text
          className="font-bold text-white"
          style={{ fontSize: width * 0.12 }}
        >
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
          onPress={() => navigation.replace('Login')}
        >
          <Text className="text-black font-bold text-lg">Commencer</Text>
        </TouchableOpacity>
      </View> */}
      <Animated.View
        className="absolute flex gap-3 bottom-12 w-full px-5 z-10"
        style={{
          opacity: bottomContentOpacity,
          transform: [{ translateY: bottomContentTranslate }],
        }}
      >
        <Text className="font-bold text-white" style={{ fontSize: width * 0.12 }}>
          i-takalo
        </Text>
        <View className="mb-4">
          <Text className="text-white text-xl">
            Plateforme de tendance juvénile,
          </Text>
          <Text className="text-white text-xl">
            là où l'envie rencontre le style
          </Text>
        </View>

        <TouchableOpacity
          className="bg-[#FEF094] w-full flex items-center px-6 py-3 rounded-full"
          onPress={() => navigation.replace('Login')}
        >
          <Text className="text-black font-bold text-lg">Commencer</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default StartScreen;
