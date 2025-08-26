import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeroSection from '../components/HeroSection';
import { ProductData, ProductDataI } from '../data/ProductData';
import ProductCard from '../components/ProductCard';
import FakeSearchBar from '../components/FakeSearchBar';
import FilterModalForm from '../components/FilterModalForm';

export default function HomeScreen() {
  const [ProductDta, SetProductData] = useState<ProductDataI[]>(ProductData);
  const [modalVisible, setModalVisible] = useState(false);

  const [filterproductjiaby, setfilterproductjiaby] = useState<any>(null); 

 
  const handleApplyFilters = (filters: any) => {
    console.log('Filtres reçus par HomeScren:', filters);
    setfilterproductjiaby(filters);
  };
  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <StatusBar hidden={false} translucent backgroundColor="transparent" />

      <FakeSearchBar onFilterPress={() => setModalVisible(true)} />

      <View className="flex-1    rounded-2xl overflow-hidden">
        <FlatList
          data={ProductDta}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ProductCard item={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <>
              <View className="mt-4 mb-6">
                <HeroSection />
              </View>

              <Text className="text-xl font-bold text-gray-800 mb-2">
                Top Produits
              </Text>
            </>
          }
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
