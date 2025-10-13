import React, { useEffect } from 'react';
import { View, Text, Dimensions, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Définitions de couleurs (ajustées pour la compatibilité Tailwind ou utilisées via style prop si non définies)
const PRIMARY_COLOR_HEX = '#083B58'; // Couleur principale foncée
const ACCENT_YELLOW_HEX = '#FEF094'; // Jaune d'accent
const DARK_TEXT_HEX = '#1F2937'; 

const TRANSITION_DURATION = 1200; // Durée totale de l'animation en ms (1.2s)

// --- Composant Simulé : HomeScreen (le fond) ---
const HomeScreenMock = () => (
  <View className="flex-1 justify-center items-center bg-gray-50 p-6">
    <Text style={{ color: PRIMARY_COLOR_HEX }} className="text-5xl font-extrabold mb-4">
      Bienvenue ! 🎉
    </Text>
    <Text className="text-lg text-gray-600 text-center">
      Votre expérience est maintenant personnalisée et prête.
    </Text>
  </View>
);

export default function TransitionScreen({ navigation }) {
  // Valeurs partagées pour contrôler l'animation de la boîte de masquage
  const boxScale = useSharedValue(1);
  const boxOpacity = useSharedValue(1);

  useEffect(() => {
    // Étape 1: Déclencher l'animation
    boxScale.value = withSequence(
      // Réduction et zoom out (dure 70% du temps)
      withTiming(0.01, { 
        duration: TRANSITION_DURATION * 0.7, 
        easing: Easing.in(Easing.ease) 
      }),
      // Maintien à zéro (dure 30% du temps, pour assurer la fin de la transition)
      withTiming(0, { duration: TRANSITION_DURATION * 0.3 }) 
    );

    boxOpacity.value = withTiming(0, { duration: TRANSITION_DURATION });

    // Étape 2: Naviguer vers l'écran d'accueil réel après la fin de l'animation
    const timeoutId = setTimeout(() => {
      // 💡 Remplacez ceci par votre logique de navigation réelle
      // Exemple: navigation.replace('HomeScreen'); 
      Alert.alert("Terminé", "La navigation vers l'écran d'accueil réel se produirait ici.");
    }, TRANSITION_DURATION + 100); 

    return () => clearTimeout(timeoutId);
  }, []);

  // --- Style Animé pour la Boîte de Masquage ---
  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: boxScale.value },
      // Petite rotation pour l'effet "carte qui s'envole"
      { rotate: `${interpolate(boxScale.value, [1, 0.5, 0], [0, 5, 10])}deg` }, 
    ],
    opacity: boxOpacity.value,
    // La couleur de fond est gérée ici car elle doit être injectée dans le style animé
    backgroundColor: PRIMARY_COLOR_HEX, 
  }));

  // --- Style Animé pour le Logo (Affiché brièvement) ---
  const animatedLogoStyle = useAnimatedStyle(() => ({
    // Le logo apparaît quand la boîte se réduit (scale de 1 à 0.5), puis disparaît.
    opacity: interpolate(boxScale.value, [1, 0.5, 0.1], [0, 1, 0], 'clamp'),
    transform: [
        { scale: interpolate(boxScale.value, [1, 0.5, 0.1], [0.8, 1, 0.5], 'clamp') }
    ]
  }));

  return (
    <SafeAreaView className="flex-1">
        
      {/* 1. L'écran d'accueil final (toujours visible en arrière-plan) */}
      <HomeScreenMock />

      {/* 2. La Boîte qui exécute l'animation de masquage */}
      <Animated.View 
        style={[
          animatedBoxStyle,
          // Nous utilisons les styles pour la taille et la position car elles dépendent de Dimensions.get('window')
          {
            position: 'absolute',
            width: width * 1.5, // Plus large que l'écran
            height: height * 1.5,
          }
        ]}
        className="rounded-full justify-center items-center" // Tailwind pour le style et le centrage du contenu
      >
        {/* Logo/Texte qui apparaît au milieu de la transition */}
        <Animated.View style={animatedLogoStyle}>
            <Text 
                style={{ color: ACCENT_YELLOW_HEX }} 
                className="text-4xl font-extrabold tracking-widest"
            >
                START
            </Text>
        </Animated.View>
      </Animated.View>

    </SafeAreaView>
  );
}