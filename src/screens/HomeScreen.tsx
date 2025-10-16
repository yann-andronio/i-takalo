import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import FakeSearchBar from '../components/FakeSearchBar';
import FakeSearchBarAfterOpacity from '../components/FakeSearchBarAfterOpacity';
import FilterBarDons from '../components/FilterBarDons';
import FilterModalForm from '../components/FilterModalForm';
import { ProductContext } from '../context/ProductContext';
import { useScroll } from '../context/ScrollContext';

const SEARCHBAR_HEIGHT = 72;
const FADE_START_OFFSET = 150;

export default function HomeScreen() {
  const {
    allProducts,
    echangeProducts,
    loading,
    fetchProducts,
    fetchFilteredProductsDonation,
  } = useContext(ProductContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [isselectfilterDonation, setIsSelectfilterDonation] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { setIsTabVisible } = useScroll();

  const { width } = Dimensions.get('window');


/*   animation de dispation nle customtabbar*/  

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      if (currentY > lastScrollY.value + 5) {
        runOnJS(setIsTabVisible)(false);
      } else if (currentY < lastScrollY.value - 5) {
        runOnJS(setIsTabVisible)(true);
      }

      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
  });

  /* animation de searchbarfake */
  const searchBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, SEARCHBAR_HEIGHT], [1, 0], Extrapolate.CLAMP),
  }));

  const replacementStyle = useAnimatedStyle(() => ({
    opacity: interpolate( scrollY.value, [FADE_START_OFFSET, SEARCHBAR_HEIGHT + FADE_START_OFFSET], [0, 1], Extrapolate.CLAMP),
  }));

  const handleApplyFiltersBarDonation = (filters: any) => {
    setIsSelectfilterDonation(filters.category);
    fetchFilteredProductsDonation(filters);
  };

/*   const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
 */
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />

      <View className="  relative">
      <View className="px-6 pt-5 relative">
        <Animated.View style={searchBarStyle} className="w-full">
          <FakeSearchBar onFilterPress={() => setModalVisible(true)} />
        </Animated.View>

        <Animated.View
          style={[replacementStyle, { position: 'absolute', top: 6, right: 6, flexDirection: 'row', justifyContent: 'flex-end' }]}
        >
          <FakeSearchBarAfterOpacity onFilterPress={() => setModalVisible(true)} />
        </Animated.View>
        </View>

        <View className="mb-4 ml-5 -mt-5">
          <FilterBarDons
            isselectfilterDonation={isselectfilterDonation}
            onApplyFilters={handleApplyFiltersBarDonation}
          />
        </View>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
       /*  refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#03233A']} />
        } */
      >
        <View className="px-6">
          <HeroSection />
        </View>

        <Text className="text-xl font-bold text-gray-800 mb-2 px-6">
          Produits d'échanges
        </Text>

        {loading ? (
          <View className="items-center justify-center p-6">
            <ActivityIndicator size="large" color="#03233A" />
            <Text className="mt-2 text-gray-500">Chargement...</Text>
          </View>
        ) : echangeProducts.length > 0 ? (
          <FlatList
            data={echangeProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductCard item={item} cardWidth={width * 0.43} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10, marginBottom: 20 }}
          />
        ) : (
          <View className="items-center justify-center p-4">
            <Text className="text-lg text-gray-500 text-center">
              Aucun produit trouvé pour cette catégorie.
            </Text>
          </View>
        )}

        <Text className="text-xl font-bold text-gray-800 mb-2 px-6">
          Tous les produits
        </Text>

        <View className="px-6 mb-24">
          <FlatList
            data={allProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductCard item={item} cardWidth={width * 0.43} />}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            scrollEnabled={false}
          />
        </View>
      </Animated.ScrollView>

      <FilterModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApplyFilters={() => {}}
      />
    </SafeAreaView>
  );
}
