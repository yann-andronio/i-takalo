import React, { useEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SkeletonBox = ({ width: w, height: h, borderRadius = 8, style = {} }: any) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 5000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0.3, 1], [0.3, 0.6]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: w,
          height: h,
          backgroundColor: '#E5E7EB',
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export default function ProductScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Image Section */}
        <SkeletonBox
          width={width}
          height={400}
          borderRadius={0}
          style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        />

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <SkeletonBox width="80%" height={32} borderRadius={8} style={{ marginBottom: 12 }} />
            <SkeletonBox width="40%" height={24} borderRadius={6} />
          </View>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <SkeletonBox width={100} height={36} borderRadius={8} />
          </View>

          {/* Location and Date */}
          <View style={styles.locationDateRow}>
            <SkeletonBox width="45%" height={20} borderRadius={4} />
            <SkeletonBox width="45%" height={20} borderRadius={4} />
          </View>

          {/* Likes */}
          <SkeletonBox width={80} height={20} borderRadius={4} style={{ marginBottom: 24 }} />

          {/* Author Card */}
          <View style={styles.authorCard}>
            <SkeletonBox width={56} height={56} borderRadius={28} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <SkeletonBox width="60%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonBox width="80%" height={16} borderRadius={4} />
            </View>
            <SkeletonBox width={48} height={48} borderRadius={24} />
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <SkeletonBox width={120} height={24} borderRadius={6} style={{ marginBottom: 12 }} />
            <SkeletonBox width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonBox width="95%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonBox width="85%" height={16} borderRadius={4} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <SkeletonBox width={(width - 64) / 2} height={56} borderRadius={16} />
            <SkeletonBox width={(width - 64) / 2} height={56} borderRadius={16} />
          </View>
        </View>

        {/* Suggestions Section */}
        <View style={styles.suggestionsSection}>
          <SkeletonBox width={200} height={28} borderRadius={6} style={{ marginBottom: 24 }} />

          {/* Suggestion Cards */}
          <View style={styles.suggestionCards}>
            {[1, 2, 3].map(item => (
              <SkeletonBox
                key={item}
                width={176}
                height={256}
                borderRadius={16}
                style={{ marginRight: 12 }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentSection: {
    padding: 24,
    marginTop: -32,
    backgroundColor: 'white',
  },
  titleSection: {
    marginBottom: 24,
  },
  categoryBadge: {
    position: 'absolute',
    right: 24,
    top: 24,
  },
  locationDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginBottom: 24,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  suggestionsSection: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: '#F9FAFB',
  },
  suggestionCards: {
    flexDirection: 'row',
  },
});