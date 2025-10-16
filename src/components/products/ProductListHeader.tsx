import React, { memo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import HeroSection from '../HeroSection';
import ProductCard from './ProductCard';
import FakeSearchBar from '../FakeSearchBar';
import FilterBarDons from '../FilterBarDons';
import { ProductDataI } from '../../context/ProductContext';

const { width } = Dimensions.get('window');

interface ProductListHeaderProps {
  loading: boolean;
  echangeProducts: ProductDataI[];
  isselectfilterDonation: string;
  onFilterPress: () => void;
  onApplyFiltersBarDonation: (filters: any) => void;
}

const ProductListHeader = memo(({
  loading,
  echangeProducts,
  isselectfilterDonation,
  onFilterPress,
  onApplyFiltersBarDonation,
}: ProductListHeaderProps) => {
  return (
    <>
      <View className="p-6 pt-0">
        <FakeSearchBar onFilterPress={onFilterPress} />
      </View>

      <View>
        <HeroSection />
      </View>

      <View className="mb-4 px-2">
        <FilterBarDons
          isselectfilterDonation={isselectfilterDonation}
          onApplyFilters={onApplyFiltersBarDonation}
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
  );
});

ProductListHeader.displayName = 'ProductListHeader';

export default ProductListHeader;