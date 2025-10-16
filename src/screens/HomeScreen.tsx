import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/products/ProductCard';
import ProductFullCard from '../components/products/ProductFullCard';
import FakeSearchBar from '../components/FakeSearchBar';
import FilterModalForm from '../components/FilterModalForm';
import FilterBarDons from '../components/FilterBarDons';
import { ProductContext } from '../context/ProductContext';
import { DotsThreeVertical } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const {
    allProducts,
    fetchFilteredProductsDonation,
    echangeProducts,
    loading,
    loadingMore,
    hasMore,
    fetchProducts,
    fetchMoreProducts,
  } = useContext(ProductContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [isselectfilterDonation, setIsSelectfilterDonation] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleApplyFilters = useCallback((filters: any) => {
    console.log('Filtres vente reçus par HomeScren:', filters);
  }, []);

  const handleApplyFiltersBarDonation = useCallback((filters: any) => {
    console.log('Filtres de donation reçus par HomeScren:', filters);
    setIsSelectfilterDonation(filters.category);
    fetchFilteredProductsDonation(filters);
  }, [fetchFilteredProductsDonation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  // ✅ Optimisation: Mémoïser les fonctions de calcul
  const getRowType = useCallback((index: number) => {
    const cycleSize = 8;
    const positionInCycle = index % cycleSize;
    return positionInCycle < 6 ? 'double' : 'full';
  }, []);

  const getMarginTop = useCallback((index: number) => {
    if (index === 0) return 0;
    
    const currentType = getRowType(index);
    const previousType = getRowType(index - 1);
    
    if (currentType === 'full' && previousType === 'full') return 40;
    if (currentType === 'full' && previousType === 'double') return 50;
    if (currentType === 'double' && previousType === 'full') return 50;
    return 5;
  }, [getRowType]);

  const shouldShowPourVous = useCallback((index: number) => {
    if (index === 0) return false;
    const currentType = getRowType(index);
    const previousType = getRowType(index - 1);
    return currentType === 'double' && previousType === 'full';
  }, [getRowType]);

  // ✅ Header component mémoïsé
  const ListHeaderComponent = useMemo(() => (
    <>
      <View className="p-6 pt-0">
        <FakeSearchBar onFilterPress={() => setModalVisible(true)} />
      </View>

      <View className="">
        <HeroSection />
      </View>

      <View className="mb-4 px-2">
        <FilterBarDons
          isselectfilterDonation={isselectfilterDonation}
          onApplyFilters={handleApplyFiltersBarDonation}
        />
      </View>

      <Text className="text-xl font-bold font-jakarta text-gray-800 mb-2 px-6">
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
        Tous les produits
      </Text>
    </>
  ), [loading, echangeProducts, isselectfilterDonation, handleApplyFiltersBarDonation]);

  // ✅ Footer component mémoïsé
  const ListFooterComponent = useMemo(() => {
    if (loadingMore) {
      return (
        <View className="items-center justify-center py-4">
          <ActivityIndicator size="small" color="#03233A" />
          <Text className="mt-2 text-gray-500 text-sm">
            Chargement de plus de produits...
          </Text>
        </View>
      );
    }

    if (!hasMore && allProducts.length > 0) {
      return (
        <View className="items-center justify-center py-6 mb-20">
          <Text className="text-gray-500 text-sm">
            Vous avez vu tous les produits disponibles
          </Text>
        </View>
      );
    }

    return <View style={{ height: 100 }} />;
  }, [loadingMore, hasMore, allProducts.length]);

  // ✅ Render item optimisé avec useCallback
  const renderItem = useCallback(({ item, index }) => {
    const type = getRowType(index);
    const marginTop = getMarginTop(index);
    const showPourVous = shouldShowPourVous(index);
    
    if (type === 'full') {
      return (
        <View style={{ marginTop, paddingHorizontal: 5 }}>
          <ProductFullCard
            item={item}
            cardWidth={width - 15}
          />
        </View>
      );
    } else {
      const nextItem = allProducts[index + 1];
      const isFirstInPair = index % 2 === 0;
      
      if (!isFirstInPair) return <View style={{ height: 0 }} />;
      
      return (
        <View style={{ paddingHorizontal: 5 }}>
          {showPourVous && (
            <View style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: marginTop,
              marginBottom: 15,
              paddingHorizontal: 5,
            }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                Pour vous
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-white rounded-md"
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 6
                }}
                onPress={() => console.log("Option cliqué")}
              >
                <DotsThreeVertical
                  size={20}
                  color='#03233A'
                  weight='bold'
                />
              </TouchableOpacity>
            </View>
          )}
          
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: showPourVous ? 0 : marginTop,
              gap: 5,
            }}
          >
            <ProductCard
              item={item}
              cardWidth={(width - 15) / 2}
            />
            {nextItem && (
              <ProductCard
                item={nextItem}
                cardWidth={(width - 15) / 2}
              />
            )}
          </View>
        </View>
      );
    }
  }, [allProducts, getRowType, getMarginTop, shouldShowPourVous]);

  return (
    <SafeAreaView className="flex-1 bg-white font-jakarta">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />

      {/* ✅ CHANGEMENT MAJEUR: Une seule FlashList pour tout */}
      <FlashList
        data={allProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        estimatedItemSize={250}
        
        // ✅ Header avec tous les éléments du haut
        ListHeaderComponent={ListHeaderComponent}
        
        // ✅ Footer avec les indicateurs de chargement
        ListFooterComponent={ListFooterComponent}
        
        // ✅ Pagination optimisée
        onEndReached={() => {
          if (!loadingMore && hasMore) {
            fetchMoreProducts();
          }
        }}
        onEndReachedThreshold={0.5}
        
        // ✅ Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#03233A']}
          />
        }
        
        showsVerticalScrollIndicator={false}
        
        // ✅ Optimisations de performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={5}
      />

      <FilterModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}