import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const [filterproductjiaby, setfilterproductjiaby] = useState<any>(null);
  const [filterproductdonation, setfilterfilterproductdonation] =
    useState<any>(null);
  const [isselectfilterDonation, setIsSelectfilterDonation] =
    useState<string>('all');

  const handleApplyFilters = (filters: any) => {
    console.log('Filtres vente reçus par HomeScren:', filters);
    setfilterproductjiaby(filters);
  };
  const handleApplyFiltersBarDonation = (filters: any) => {
    console.log('Filtres de donation reçus par HomeScren:', filters);
    setfilterfilterproductdonation(filters);
    setIsSelectfilterDonation(filters.category);
  };


  const {products} = useContext( ProductContext)

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />
      <Text onPress={logout}>se deconnecter</Text>

      <FakeSearchBar onFilterPress={() => setModalVisible(true)} />

      <View className="flex-1 rounded-2xl overflow-hidden">
        
        {/* FlatList verticale principale */}
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <ProductCard item={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={() => (
            <View>
              <HeroSection />

              <View className="mb-4">
                <FilterBarDons
                  isselectfilterDonation={isselectfilterDonation}
                  onApplyFilters={handleApplyFiltersBarDonation}
                />
              </View>

              <Text className="text-xl font-bold text-gray-800 mb-2">
                Produit de Dons
              </Text>

              <FlatList
                data={products.filter(p => p.type === 'DONATION')}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <ProductCard item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 10,
                  marginBottom: 20,
                }}
              />

              <Text className="text-xl font-bold text-gray-800 mb-2">
                Produit en vente
              </Text>
            </View>
          )}
        />
      </View>

      <FilterModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}
