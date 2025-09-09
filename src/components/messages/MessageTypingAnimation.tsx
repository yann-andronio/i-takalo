import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  SharedValue,
} from "react-native-reanimated";
import { colors } from "../../constants/theme";

interface Props {
  dotColor?: string;
  backgroundColor?: string;
}

const MessageTypingAnimation: React.FC<Props> = ({
  dotColor = colors.neutral600,
  backgroundColor = colors.neutral200,
}) => {
  // Créer 3 valeurs animées pour les 3 points
  const dot1TranslateY = useSharedValue(0);
  const dot2TranslateY = useSharedValue(0);
  const dot3TranslateY = useSharedValue(0);

  useEffect(() => {
    const animateDot = (value: SharedValue<number>, delay: number) => {
      value.value = withRepeat(
        withSequence(
          withDelay(
            delay,
            withTiming(-8, { duration: 200, easing: Easing.ease })
          ),
          withTiming(0, { duration: 200, easing: Easing.ease }),
          withDelay(600 - delay - 400, withTiming(0, { duration: 0 }))
        ),
        -1 // -1 = répétition infinie
      );
    };

    // Démarrer les animations avec des délais différents
    animateDot(dot1TranslateY, 0);
    animateDot(dot2TranslateY, 100);
    animateDot(dot3TranslateY, 200);

    return () => {
      // Arrêter les animations en réinitialisant les valeurs
      dot1TranslateY.value = 0;
      dot2TranslateY.value = 0;
      dot3TranslateY.value = 0;
    };
  }, []);

  // Styles animés pour chaque point
  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1TranslateY.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2TranslateY.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3TranslateY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View
        style={[styles.dot, { backgroundColor: dotColor }, dot1Style]}
      />
      <Animated.View
        style={[styles.dot, { backgroundColor: dotColor }, dot2Style]}
      />
      <Animated.View
        style={[styles.dot, { backgroundColor: dotColor }, dot3Style]}
      />
    </View>
  );
};

export default MessageTypingAnimation;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 18,
    alignSelf: "flex-start",
    marginLeft: 16,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 2,
    borderRadius: 4,
  },
});
