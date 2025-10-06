import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  ScrollView,
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
export default function HomeScreen() {
  const {
    allProducts,
    fetchFilteredProductsDonation,
    donationProducts,
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

  return (
    <SafeAreaView className="flex-1 bg-white font-jakarta">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />

      <View className="p-6">
        <FakeSearchBar onFilterPress={() => setModalVisible(true)} />
      </View>


      <ScrollView
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
          Produits de Dons
        </Text>

        {loading ? (
          <View className="items-center justify-center p-6">
            <ActivityIndicator size="large" color="#03233A" />
            <Text className="mt-2 text-gray-500">Chargement...</Text>
          </View>
        ) : donationProducts.length > 0 ? (
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

        <View className="px-6 mb-24">
          <FlatList
            data={allProducts}
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
