import React, { useRef, useState, useEffect, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { colors } from "../../constants/theme";

interface MessageVocalProps {
  onStopRecording: (uri: string | null) => void;
}

const MessageVocal = memo(({ onStopRecording }: MessageVocalProps) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Démarrer l'animation pulsante dès le montage du composant
  useEffect(() => {
    startPulseAnimation();
    startRecording();

    return () => {
      stopPulseAnimation();
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  // Vérifier les permissions d'enregistrement audio
  const checkRecordingPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Erreur lors de la vérification des permissions:", error);
      return false;
    }
  };

  // Configurer l'enregistrement audio
  const setupRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });
    } catch (error) {
      console.error("Erreur lors de la configuration audio:", error);
    }
  };

  // Démarrer l'enregistrement
  const startRecording = async () => {
    const hasPermission = await checkRecordingPermissions();

    if (!hasPermission) {
      alert(
        "Vous devez autoriser l'accès au microphone pour enregistrer de l'audio"
      );
      onStopRecording(null);
      return;
    }

    await setupRecording();

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setRecordingDuration(0);

      // Démarrer le timer pour la durée
      recordingTimer.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du démarrage de l'enregistrement:", error);
      alert("Impossible de démarrer l'enregistrement");
      onStopRecording(null);
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = async () => {
    if (!recording) {
      onStopRecording(null);
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Arrêter le timer
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }

      // Appeler le callback avec l'URI de l'enregistrement
      onStopRecording(uri);

      // Réinitialiser les états
      setRecording(null);
    } catch (error) {
      console.error("Erreur lors de l'arrêt de l'enregistrement:", error);
      onStopRecording(null);
    }
  };

  // Fonctions pour l'animation
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    if (pulseAnim) {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  };

  // Formater la durée (secondes -> MM:SS)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <View style={styles.recordingContainer}>
      <Animated.View
        style={[
          styles.recordingIndicator,
          { transform: [{ scale: pulseAnim }] },
        ]}
      />
      <Text style={styles.recordingText}>
        Enregistrement en cours... {formatDuration(recordingDuration)}
      </Text>
      <TouchableOpacity
        style={styles.stopRecordingButton}
        onPress={stopRecording}
      >
        <Text style={styles.stopRecordingButtonText}>Terminer</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  recordingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.rose,
    marginRight: 8,
  },
  recordingText: {
    flex: 1,
    color: colors.neutral800,
    fontSize: 14,
  },
  stopRecordingButton: {
    backgroundColor: colors.neutral200,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stopRecordingButtonText: {
    color: colors.neutral800,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default MessageVocal;
