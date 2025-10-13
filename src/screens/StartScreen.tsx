import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions, Animated, StyleSheet, Modal, TextInput } from 'react-native';
import { StartScreenData } from '../data/StartScreenData';
import { Marquee } from '@animatereactnative/marquee';

interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const leftColumn = StartScreenData.slice(0, 3);
  const rightColumn = StartScreenData.slice(3, 6);

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const bottomSheetTranslate = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

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

  const openBottomSheet = () => {
    setShowBottomSheet(true);
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
      setShowBottomSheet(false);
    });
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
          onPress={openBottomSheet}
        >
          <Text style={styles.buttonTextRegister}>J'ai déjà un compte</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="none"
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.modalContainer}>
          
          <Animated.View 
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity 
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={closeBottomSheet}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: bottomSheetTranslate }],
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeBottomSheet}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.handleBar} />
            
            <Text style={styles.bottomSheetTitle}>Se connecter à iTakalo</Text>
            

            <TouchableOpacity style={styles.googleButton}>
              <Image
                source={{ uri: 'https://www.google.com/favicon.ico' }}
                style={styles.socialIcon}
              />
              <Text style={styles.googleButtonText}>Continuer avec Google</Text>
            </TouchableOpacity>
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.facebookButton}>
              <View style={styles.facebookIconContainer}>
                <Text style={styles.facebookIcon}>f</Text>
              </View>
              <Text style={styles.facebookButtonText}>Continuer avec Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
            >
              <Text style={styles.connexionEmail}>Continuer avec une adresse e-mail</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  // Bottom Sheet Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    // minHeight: 400,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
    position: "absolute",
    top: -10
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  connexionEmail: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },

  







  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 24,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#666',
    fontWeight: '300',
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 35,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 12,
    // marginBottom: 16,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 30,
  },
  facebookIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  facebookIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  facebookButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  emailButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: 15,
    color: '#009688',
    fontWeight: '500',
  },
});

export default StartScreen;