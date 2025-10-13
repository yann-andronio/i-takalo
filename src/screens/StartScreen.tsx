import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import { StartScreenData } from '../data/StartScreenData';
import { Marquee } from '@animatereactnative/marquee';
import LoginBottomSheet from '../components/modal/auth/LoginBottomSheet';
import RegisterBottomSheet from '../components/modal/auth/RegisterBottomSheet';

interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const leftColumn = StartScreenData.slice(0, 3);
  const rightColumn = StartScreenData.slice(3, 6);

  // Gestion du BottomSheet
  const [visibleSheet, setVisibleSheet] = useState<'login' | 'register' | null>(null);
  const bottomSheetTranslate = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Animation du contenu du bas
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

  // --- OPEN / CLOSE BottomSheet ---
  const openBottomSheet = (type: 'login' | 'register') => {
    setVisibleSheet(type);
    Animated.parallel([
      Animated.timing(bottomSheetTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeBottomSheet = () => {
    Animated.parallel([
      Animated.timing(bottomSheetTranslate, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisibleSheet(null);
    });
  };

  return (
    <View style={styles.container}>
      {/* --- Défilement vertical des images --- */}
      <View style={styles.marqueeContainer}>
        <Marquee speed={0.5} spacing={20} direction="vertical">
          <View style={styles.imageColumn}>
            {leftColumn.map((item, index) => (
              <Image key={index} source={item.image} style={styles.image} resizeMode="contain" />
            ))}
          </View>
        </Marquee>

        <Marquee speed={0.5} spacing={20} direction="vertical" reverse>
          <View style={styles.imageColumn}>
            {rightColumn.map((item, index) => (
              <Image key={index} source={item.image} style={styles.image} resizeMode="contain" />
            ))}
          </View>
        </Marquee>
      </View>

      {/* --- Effet de fond --- */}
      <Image
        source={require('../assets/images/StartImageScreen/blueeffect.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      {/* --- Contenu inférieur --- */}
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

        <TouchableOpacity style={styles.buttonLogin} onPress={() => openBottomSheet('register')}>
          <Text style={styles.buttonTextLogin}>S'inscrire sur iTakalo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister} onPress={() => openBottomSheet('login')}>
          <Text style={styles.buttonTextRegister}>J'ai déjà un compte</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* --- Affichage dynamique du bon BottomSheet --- */}
      {visibleSheet === 'login' && (
        <LoginBottomSheet
          visible
          onClose={closeBottomSheet}
          bottomSheetTranslate={bottomSheetTranslate}
          backdropOpacity={backdropOpacity}
          navigation={navigation}
        />
      )}
      {visibleSheet === 'register' && (
        <RegisterBottomSheet
          visible
          onClose={closeBottomSheet}
          bottomSheetTranslate={bottomSheetTranslate}
          backdropOpacity={backdropOpacity}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', position: 'relative' },
  marqueeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 0,
  },
  imageColumn: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  image: { marginBottom: 16 },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', zIndex: 0 },
  bottomContent: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 10,
    gap: 12,
  },
  title: { fontWeight: 'bold', color: 'white' },
  subtitleContainer: { marginBottom: 16 },
  subtitle: { color: 'white', fontSize: 18 },
  buttonLogin: {
    backgroundColor: '#FEF094',
    borderColor: '#FEF094',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 5,
  },
  buttonTextLogin: { color: '#000', fontWeight: '500', fontSize: 15 },
  buttonRegister: {
    backgroundColor: 'transparent',
    borderColor: '#FEF094',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 5,
  },
  buttonTextRegister: { color: '#fff', fontWeight: '500', fontSize: 15 },
});

export default StartScreen;
