import React from 'react';
import { 
  View, 
  Image, 
  StatusBar, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';


const { height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={['#0a2a43', '#04293A', '#064663']}
      style={styles.container}
    >
      <StatusBar hidden />

      <View style={styles.centerContent}>
        
        <Animated.View
          entering={FadeIn.duration(800).delay(200)}
          exiting={FadeOut.duration(600)}
          style={styles.logoContainer}
        >
          <Image
            source={require('../assets/images/Logo/logo_splashScreen.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </Animated.View>
      </View>
      

      <View style={styles.lottieContainer}>
        {/* <LottieView
          source={require('../assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        /> */}
        <ActivityIndicator size={33} color="#fff" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    width: 260,
    height: 260,
    borderRadius: 130,
    overflow: 'hidden',
    position: "absolute",
    top: height * 0.40 - 130,
  },

  logo: {
    width: '100%',
    height: '100%',
  },

  lottieContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  // lottie: {
  //   width: 150,
  //   height: 150,
  // },
});
