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
import { colors } from '../../constants/theme';

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

export default function ChatScreenSkeleton() {
  return (
    <ScrollView style={styles.scrollView}>
        {
          [1,2,3,].map((key)=>
          (
          <View key={key} style={styles.authorCard}>
            <SkeletonBox width={56} height={56} borderRadius={28} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <SkeletonBox width="60%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonBox width="80%" height={16} borderRadius={4} />
            </View>
            <SkeletonBox width={48} height={48} borderRadius={24} />
          </View>
          ))
        }
        
    </ScrollView>
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
    paddingHorizontal: 10,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.gray,
    borderRadius: 7,
    marginBottom: 18,
  },
});