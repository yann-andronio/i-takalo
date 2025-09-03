import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StatusBar, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeroSection from '../components/HeroSection';
import { ProductData, ProductDataI } from '../data/ProductData';
import ProductCard from '../components/ProductCard';
import FakeSearchBar from '../components/FakeSearchBar';
import FilterModalForm from '../components/FilterModalForm';
import FilterBarDons from '../components/FilterBarDons';
import { ProductContext } from '../context/ProductContext';

export default function HomeScreen() {
  const { allProducts, fetchFilteredProductsDonation, donationProducts , saleProducts } =
    useContext(ProductContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [filterproductjiaby, setfilterproductjiaby] = useState<any>(null);
  const [isselectfilterDonation, setIsSelectfilterDonation] =useState<string>('all');

  const handleApplyFilters = (filters: any) => {
    console.log('Filtres vente reçus par HomeScren:', filters);
    setfilterproductjiaby(filters);
  };
  const handleApplyFiltersBarDonation = (filters: any) => {
    console.log('Filtres de donation reçus par HomeScren:', filters);
    setIsSelectfilterDonation(filters.category);
    fetchFilteredProductsDonation(filters);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />

      <View className="p-6">
        <FakeSearchBar onFilterPress={() => setModalVisible(true)} />
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 ">
          <HeroSection />
        </View>

        <View className="mb-4 px-6">
          <FilterBarDons
            isselectfilterDonation={isselectfilterDonation}
            onApplyFilters={handleApplyFiltersBarDonation}
          />
        </View>

        <Text className="text-xl font-bold text-gray-800 mb-2 px-6">
          Produits de Dons
        </Text>

        {donationProducts.length > 0 ? (
          <FlatList
            data={donationProducts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <ProductCard item={item} />}
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
          Produits en vente
        </Text>

        <View className="px-6">
          <FlatList
            data={saleProducts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <ProductCard item={item} />}
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
      </ScrollView>

      <FilterModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}
