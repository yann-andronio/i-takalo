import React, { useContext, useState, useCallback, useMemo } from 'react';
import { StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { ProductContext } from '../context/ProductContext';
import { useProductLayout } from '../hooks/useProductLayout';
import ProductListHeader from '../components/products/ProductListHeader';
import ProductListFooter from '../components/products/ProductListFooter';
import ProductRowItem from '../components/products/ProductRowItem';
import FilterModalForm from '../components/FilterModalForm';

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

  // Hook personnalisé pour la logique de layout
  const { getRowType, getMarginTop, shouldShowPourVous } = useProductLayout();

  // Callbacks optimisés
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

  const handleFilterPress = useCallback(() => {
    setModalVisible(true);
  }, []);

  // Header mémoïsé
  const ListHeaderComponent = useMemo(() => (
    <ProductListHeader
      loading={loading}
      echangeProducts={echangeProducts}
      isselectfilterDonation={isselectfilterDonation}
      onFilterPress={handleFilterPress}
      onApplyFiltersBarDonation={handleApplyFiltersBarDonation}
    />
  ), [loading, echangeProducts, isselectfilterDonation, handleApplyFiltersBarDonation]);

  // Footer mémoïsé
  const ListFooterComponent = useMemo(() => (
    <ProductListFooter
      loadingMore={loadingMore}
      hasMore={hasMore}
      productsCount={allProducts.length}
    />
  ), [loadingMore, hasMore, allProducts.length]);

  // Render item optimisé
  const renderItem = useCallback(({ item, index }) => {
    const type = getRowType(index);
    const marginTop = getMarginTop(index);
    const showPourVous = shouldShowPourVous(index);
    
    return (
      <ProductRowItem
        item={item}
        index={index}
        allProducts={allProducts}
        type={type}
        marginTop={marginTop}
        showPourVous={showPourVous}
      />
    );
  }, [allProducts, getRowType, getMarginTop, shouldShowPourVous]);

  return (
    <SafeAreaView className="flex-1 bg-white font-jakarta">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />

      <FlashList
        data={allProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        estimatedItemSize={250}
        
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        
        onEndReached={() => {
          if (!loadingMore && hasMore) {
            fetchMoreProducts();
          }
        }}
        onEndReachedThreshold={0.5}
        
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#03233A']}
          />
        }
        
        showsVerticalScrollIndicator={false}
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