import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  withSpring
} from 'react-native-reanimated';
// import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Constantes de thème
const colors = {
  primary: '#f5c998',
  white: '#fff',
  black: '#000',
  danger: '#D12600',
  gray: {
    500: '#6b7280',
    600: '#4b5563',
    800: '#1f2937',
    900: '#111827',
  },
};

const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

const sizes = {
  title: 40,
  h2: 24,
  h3: 18,
  body: 14,
  radius: 16,
};

const spacings = {
  s: 8,
  m: 18,
};

// Composant Balance avec animation
const Balance = ({ scrollY }: { scrollY: Animated.SharedValue<number> }) => {
  const startHeight = 160;
  const endHeight = 60;
  const scrollRange = Platform.OS === 'ios' ? 140 : 180;

  const data = {
    amount: 226,
    revenue: 0,
    currency: '€',
    percentage: '0,00 %',
    date: '1 jour',
  };

  // Style animé pour la vue étendue
  const expandedViewStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollRange * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, scrollRange],
      [0, -20],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Style animé pour le header
  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, scrollRange],
        [startHeight, endHeight],
        Extrapolation.CLAMP
      ),
      borderBottomColor: interpolateColor(
        scrollY.value,
        [0, scrollRange],
        ['transparent', colors.gray[500]]
      ),
      borderBottomWidth: interpolate(
        scrollY.value,
        [0, scrollRange],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  // Style animé pour la vue réduite
  const collapsedViewStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [scrollRange * 0.5, scrollRange],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  // Style animé pour le montant
  const amountStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, scrollRange],
      [1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, headerStyle]}>
      {/* Vue étendue (quand on est en haut) */}
      <Animated.View style={[styles.expandedView, expandedViewStyle]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Patrimoine brut</Text>
          {/* <Icon name="chevron-down" size={16} color="rgba(255,255,255,0.7)" /> */}
        </View>

        <View style={styles.amountRow}>
          <Animated.Text style={[styles.amount, amountStyle]}>
            {data.amount} {data.currency}
          </Animated.Text>
          <View style={styles.progressBar} />
        </View>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statItem,
              {
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: spacings.s,
                borderRadius: 999,
                paddingVertical: spacings.s,
              },
            ]}
          >
            <Text style={styles.statLabel}>{data.date}</Text>
            {/* <Icon
              name="chevron-down"
              size={12}
              color="rgba(255,255,255,0.5)"
            /> */}
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {data.revenue} {data.currency}
            </Text>
            <Text style={styles.statPercentage}>{data.percentage}</Text>
            {/* <Icon
              name="information-circle-outline"
              size={18}
              color="rgba(255,255,255,0.3)"
            /> */}
          </View>
        </View>
      </Animated.View>

      {/* Vue réduite (quand on scrolle) */}
      <Animated.View style={[styles.collapsedView, collapsedViewStyle]}>
        <Text style={styles.collapsedAmount}>
          {data.amount} {data.currency}
        </Text>
        <View style={styles.collapsedStats}>
          <Text style={styles.collapsedChange}>0 {data.currency}</Text>
          <Text style={styles.collapsedPercentage}>{data.percentage}</Text>
          {/* <Icon
            name="information-circle-outline"
            size={14}
            color="rgba(255,255,255,0.5)"
          /> */}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// Composant principal
const CollapsibleHeaderAnimation = () => {
  const scrollY = useSharedValue(0);

  const scrollRange = Platform.OS === 'ios' ? 140 : 180;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onEndDrag: () => {
      // Si scrollY est plus de la moitié de la distance, on collapse
      const positions = [0, scrollRange * 0.5, scrollRange];
      let closest = positions.reduce((prev, curr) =>
        Math.abs(curr - scrollY.value) < Math.abs(prev - scrollY.value) ? curr : prev
      );
      scrollY.value = withSpring(closest, { damping: 20, stiffness: 150 });
      
    },
  });
  
  const TOP_BAR_HEIGHT = 60;

  return (
    <View style={styles.screenContainer}>
      {/* Top Bar */}
      <View
        style={{
          height: TOP_BAR_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacings.m,
          backgroundColor: '#0c0611',
        }}
      >
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(225, 225, 225, 0.1)',
            borderRadius: 999,
            height: 40,
            width: 40,
          }}
          onPress={() => console.log('Profile pressed')}
        >
          {/* <Icon name="person-outline" size={24} color={colors.white} /> */}
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            gap: spacings.s,
            alignItems: 'center',
          }}
        >
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              width: 30,
            }}
            onPress={() => console.log('Eye pressed')}
          >
            {/* <Icon name="eye-outline" size={24} color={colors.white} /> */}
          </Pressable>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.primary,
              padding: spacings.s,
              borderRadius: 999,
              gap: spacings.s,
            }}
            onPress={() => console.log('Upgrade pressed')}
          >
            {/* <Icon name="diamond-outline" size={24} color={colors.black} /> */}
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>
              METTRE À NIVEAU
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Balance Header */}
      <Balance scrollY={scrollY} />

      {/* ScrollView avec contenu */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacings.m,
          gap: spacings.s,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Message d'authentification */}
        <View style={styles.authMessage}>
          {/* <Icon name="close-circle" size={20} color={colors.danger} /> */}
          <Text style={styles.authText}>Authentification requise</Text>
        </View>

        {/* Contenu de démo */}
        {[...Array(20)].map((_, index) => (
          <View key={index} style={styles.contentCard}>
            <Text style={styles.contentTitle}>Élément {index + 1}</Text>
            <Text style={styles.contentDescription}>
              Description de l'élément {index + 1}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0c0611',
  },
  container: {
    padding: spacings.s,
    overflow: 'hidden',
    backgroundColor: '#0c0611',
  },
  expandedView: {
    flex: 1,
  },
  collapsedView: {
    position: 'absolute',
    top: 15,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: sizes.h3,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amount: {
    fontSize: sizes.title,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  progressBar: {
    width: '30%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.s,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.s,
  },
  statLabel: {
    fontSize: sizes.body,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statValue: {
    fontSize: sizes.body,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  statPercentage: {
    fontSize: sizes.body,
    fontFamily: fonts.regular,
    color: colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacings.s / 2,
    paddingVertical: spacings.s / 2,
    borderRadius: sizes.radius / 4,
  },
  collapsedAmount: {
    fontSize: sizes.h2,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  collapsedStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.s,
  },
  collapsedChange: {
    fontSize: sizes.body,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  collapsedPercentage: {
    fontSize: sizes.body,
    fontFamily: fonts.regular,
    color: colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacings.s / 2,
    paddingVertical: spacings.s / 2,
    borderRadius: sizes.radius / 4,
  },
  authMessage: {
    borderWidth: 1,
    borderColor: colors.gray[800],
    padding: spacings.m * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.s,
    borderRadius: sizes.radius / 2,
    backgroundColor: 'rgba(209, 38, 0, 0.1)',
  },
  authText: {
    fontSize: sizes.body,
    color: colors.white,
    fontFamily: fonts.regular,
  },
  contentCard: {
    backgroundColor: '#1e1e1e',
    padding: spacings.m,
    borderRadius: sizes.radius / 2,
    marginBottom: spacings.s,
  },
  contentTitle: {
    fontSize: sizes.h3,
    color: colors.white,
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: sizes.body,
    color: colors.gray[500],
    fontFamily: fonts.regular,
  },
});

export default CollapsibleHeaderAnimation;