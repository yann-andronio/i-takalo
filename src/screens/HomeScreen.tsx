import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  // ScrollView n'est plus utilisé
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import FakeSearchBar from '../components/FakeSearchBar';
import FilterModalForm from '../components/FilterModalForm';
import FilterBarDons from '../components/FilterBarDons';
import { ProductContext } from '../context/ProductContext';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { MagnifyingGlass } from 'phosphor-react-native';
import FakeSearchBarAfterOpacity from '../components/FakeSearchBarAfterOpacity';



const SEARCHBAR_HEIGHT = 72; 
const FADE_START_OFFSET = 150; // Décalage en pixels avant que l'icône de remplacement ne commence à apparaître

export default function HomeScreen() {
  const {
    allProducts,
    fetchFilteredProductsDonation,
    donationProducts,
    echangeProducts,
    loading,
    fetchProducts,
  } = useContext(ProductContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [isselectfilterDonation, setIsSelectfilterDonation] =
    useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);


  const handleApplyFilters = (filters: any) => {
    console.log('Filtres vente reçus par HomeScren:', filters);
  };

  const handleApplyFiltersBarDonation = (filters: any) => {
    console.log('Filtres de donation reçus par HomeScren:', filters);
    setIsSelectfilterDonation(filters.category);
    fetchFilteredProductsDonation(filters);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts(); // recharge les produits
    setRefreshing(false);
  };

  const { width } = Dimensions.get('window');

  // --- Scroll animation ---
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  // --- Animation pour SearchBar (fade out) ---
  const searchBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SEARCHBAR_HEIGHT], // Disparaît complètement à 72px
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));

  // --- Animation pour le remplacement  ---
  const replacementStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [FADE_START_OFFSET, SEARCHBAR_HEIGHT + FADE_START_OFFSET], 
      [0, 1],                
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <SafeAreaView className="flex-1 bg-white font-jakarta">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />

      <View className="px-6 pt-6 relative"> 
        
        <Animated.View style={searchBarStyle} className="w-full">
          <FakeSearchBar onFilterPress={() => setModalVisible(true)} />
        </Animated.View>

      <Animated.View 
          style={replacementStyle} 
          className="absolute top-6 right-6 flex-row justify-end" 
        >
         <FakeSearchBarAfterOpacity onFilterPress={() => setModalVisible(true)}/>
        </Animated.View>
      </View>
    

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#03233A']}
          />
        }
      >
        <View className="px-6 ">
          <HeroSection />
        </View>

        <View className="mb-4 px-6">
          <FilterBarDons
            isselectfilterDonation={isselectfilterDonation}
            onApplyFilters={handleApplyFiltersBarDonation}
          />
        </View>

        <Text className="text-xl font-bold font-jakarta text-gray-800 mb-2 px-6">
          Produits d' échanges
        </Text>

        {loading ? (
          <View className="items-center justify-center p-6">
            <ActivityIndicator size="large" color="#03233A" />
            <Text className="mt-2 text-gray-500">Chargement...</Text>
          </View>
        ) : echangeProducts.length > 0 ? (
          <FlatList
            data={echangeProducts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard item={item} cardWidth={width * 0.43} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 10,
              marginBottom: 20,
            }}
     
          />
        ) : (
          <View className="items-center justify-center p-4">
            <Text className="text-lg text-gray-500 text-center">
              Aucun produit trouvé pour cette catégorie.
            </Text>
          </View>
        )}

        <Text className="text-xl font-bold text-gray-800 mb-2 px-6">
          Touts les produits
        </Text>

        <View className="px-6 mb-24">
          <FlatList
            data={allProducts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard item={item} cardWidth={width * 0.43} />
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
           scrollEnabled={false} 
          />
        </View>
      </Animated.ScrollView>

      <FilterModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}