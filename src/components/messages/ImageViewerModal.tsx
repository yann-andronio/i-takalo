import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import { X } from 'phosphor-react-native';
import { colors } from '../../constants/theme';
import { FlatList } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageViewerModalProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  images,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);
  const hasScrolledToInitial = useRef(false);

  // Synchroniser currentIndex quand initialIndex change
  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Réinitialiser quand le modal s'ouvre/ferme
  React.useEffect(() => {
    if (visible) {
      hasScrolledToInitial.current = false;
    }
  }, [visible]);

  // Scroller vers l'index initial après le montage
  React.useEffect(() => {
    if (visible && flatListRef.current && images.length > 0) {
      const targetIndex = initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0;
      
      // Attendre que la FlatList soit complètement montée
      const scrollTimer = setTimeout(() => {
        try {
          if (!hasScrolledToInitial.current) {
            flatListRef.current?.scrollToIndex({
              index: targetIndex,
              animated: false,
              viewPosition: 0,
            });
            
            // Activer le tracking après un délai
            setTimeout(() => {
              hasScrolledToInitial.current = true;
            }, 400);
          }
        } catch (error) {
          console.log('Erreur scroll initial:', error);
          // Fallback avec scrollToOffset
          try {
            flatListRef.current?.scrollToOffset({
              offset: targetIndex * SCREEN_WIDTH,
              animated: false,
            });
            setTimeout(() => {
              hasScrolledToInitial.current = true;
            }, 400);
          } catch (e) {
            hasScrolledToInitial.current = true;
          }
        }
      }, 150);

      return () => clearTimeout(scrollTimer);
    }
  }, [visible, initialIndex, images.length]);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    // Ignorer les changements avant que le scroll initial soit terminé
    if (viewableItems.length > 0 && hasScrolledToInitial.current) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        {/* Header avec bouton fermer */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color="#fff" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        {/* Galerie d'images */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `image-${index}`}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
          onScrollToIndexFailed={(info) => {
            // Fallback si scrollToIndex échoue
            setTimeout(() => {
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: false,
              });
            }, 100);
          }}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
        />

        {/* Indicateurs de pagination (points) */}
        {images.length > 1 && (
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
  },
  counter: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pagination: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default ImageViewerModal;