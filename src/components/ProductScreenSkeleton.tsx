import React, { useEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const SkeletonBox = ({ width: w, height: h, borderRadius = 8, style = {} }: any) => {
  const translateX = useSharedValue(-w);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(w, { duration: 1200, easing: Easing.linear }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const gradientColors = ['#E0E0E0', '#F5F5F5', '#E0E0E0']; // effet shimmer
  const baseColor = '#E0E0E0';

  return (
    <View
      style={[
        {
          width: w,
          height: h,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            flex: 1,
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, width: w * 2 }}
        />
      </Animated.View>
    </View>
  );
};

export default function ProductScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero Image */}
        <SkeletonBox
          width={width}
          height={400}
          borderRadius={0}
          style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        />

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title */}
          <View style={styles.titleSection}>
            <SkeletonBox width="80%" height={32} borderRadius={8} style={{ marginBottom: 12 }} />
            <SkeletonBox width="40%" height={24} borderRadius={6} />
          </View>

          {/* Location & Date */}
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

        {/* Suggestions */}
        <View style={styles.suggestionsSection}>
          <SkeletonBox width={200} height={28} borderRadius={6} style={{ marginBottom: 24 }} />
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
  container: { flex: 1, backgroundColor: 'white' },
  scrollView: { flex: 1, backgroundColor: 'white' },
  contentSection: { padding: 24, marginTop: -32, backgroundColor: 'white' },
  titleSection: { marginBottom: 24 },
  locationDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginBottom: 24,
  },
  descriptionSection: { marginBottom: 24 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  suggestionsSection: { padding: 24, paddingTop: 32, backgroundColor: '#F9FAFB' },
  suggestionCards: { flexDirection: 'row' },
});
