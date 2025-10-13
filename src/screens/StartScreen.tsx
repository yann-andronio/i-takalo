import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions, Animated, StyleSheet } from 'react-native';
import { StartScreenData } from '../data/StartScreenData';
import { Marquee } from '@animatereactnative/marquee';
import LoginBottomSheet from '../components/modal/LoginBottomSheet';

interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  const leftColumn = StartScreenData.slice(0, 3);
  const rightColumn = StartScreenData.slice(3, 6);

  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const bottomContentOpacity = useRef(new Animated.Value(0)).current;
  const bottomContentTranslate = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
  }, []);

  const handleOpenBottomSheet = () => {
    setShowBottomSheet(true);
  };

  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false);
  };

  const handleNavigateToLogin = () => {
    setShowBottomSheet(false);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
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
        style={styles.backgroundImage}
      />

      <Animated.View
        style={[
          styles.bottomContent,
          {
            opacity: bottomContentOpacity,
            transform: [{ translateY: bottomContentTranslate }],
          },
        ]}
      >
        <Text style={[styles.title, { fontSize: width * 0.12 }]}>i-takalo</Text>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Plateforme de tendance juvénile,</Text>
          <Text style={styles.subtitle}>là où l'envie rencontre le style</Text>
        </View>

        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonTextLogin}>S'inscrire sur iTakalo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleOpenBottomSheet}
        >
          <Text style={styles.buttonTextRegister}>J'ai déjà un compte</Text>
        </TouchableOpacity>
      </Animated.View>

      <LoginBottomSheet
        visible={showBottomSheet}
        onClose={handleCloseBottomSheet}
        onNavigateToLogin={handleNavigateToLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 10,
    gap: 12,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
  },
  subtitleContainer: {
    marginBottom: 16,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
  },
  buttonLogin: {
    backgroundColor: '#FEF094',
    borderColor: "#FEF094",
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 5,
  },
  buttonTextLogin: {
    color: '#000',
    fontWeight: '500',
    fontSize: 15,
  },
  buttonRegister: {
    backgroundColor: 'transparent',
    borderColor: "#FEF094",
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 5,
  },
  buttonTextRegister: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
});

export default StartScreen;