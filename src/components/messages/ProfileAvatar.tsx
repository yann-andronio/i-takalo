import React, { useState } from "react";
import { StyleSheet, Image, View, ActivityIndicator } from "react-native";
import { User } from "phosphor-react-native";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  size?: number;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  size = 120,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "#f0f0f0",
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.8)",
    },
    placeholderContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (!avatarUrl || hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderContainer}>
          <User size={size * 0.6} weight="thin" color="#666" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: avatarUrl }}
        style={styles.image}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0D8ABC" />
        </View>
      )}
    </View>
  );
};

export default ProfileAvatar;
