import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/theme';

interface MessageImagesProps {
  images: string[];
  isUploading?: boolean;
  onImagePress?: (index: number) => void;
}

const MessageImages: React.FC<MessageImagesProps> = ({ 
  images, 
  isUploading = false,
  onImagePress 
}) => {
  if (!images || images.length === 0) return null;

  // Une seule image
  if (images.length === 1) {
    return (
      <View style={styles.imagesContainer}>
        <TouchableOpacity
          onPress={() => onImagePress?.(0)}
          disabled={isUploading}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: images[0] }}
              style={styles.singleImage}
              resizeMode="cover"
            />
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <View style={styles.uploadingContent}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.uploadingText}>Envoi en cours...</Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Plusieurs images (grille)
  return (
    <View style={styles.imagesContainer}>
      <View style={styles.multipleImagesGrid}>
        {images.slice(0, 4).map((imageUri: string, idx: number) => (
          <TouchableOpacity
            key={idx}
            onPress={() => onImagePress?.(idx)}
            style={styles.gridImageContainer}
            disabled={isUploading}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: imageUri }}
                style={styles.gridImage}
                resizeMode="cover"
              />
              
              {/* Overlay pour "+X images" */}
              {idx === 3 && images.length > 4 && (
                <View style={styles.moreImagesOverlay}>
                  <Text style={styles.moreImagesText}>
                    +{images.length - 4}
                  </Text>
                </View>
              )}
              
              {/* Overlay de chargement */}
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  {idx === 0 && (
                    <View style={styles.uploadingContent}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.uploadingTextSmall}>Envoi...</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagesContainer: {
    // marginTop: 8,
    // marginBottom: 4,
    paddingLeft: 4,
    paddingRight: 3
  },
  imageWrapper: {
    position: 'relative',
  },
  singleImage: {
    width: 150,
    height: 200,
    borderRadius: 12,
  },
  multipleImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridImageContainer: {
    width: '49%',
    height: 120,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingContent: {
    alignItems: 'center',
    gap: 8,
  },
  uploadingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadingTextSmall: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default MessageImages;