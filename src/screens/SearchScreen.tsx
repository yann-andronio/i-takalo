import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductDataI, ProductContext } from '../context/ProductContext';
import { UserI, UserContext } from '../context/UserContext'; 
import ProductCard from '../components/products/ProductCard';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import { SearchUtils } from '../utils/SearchUtils';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';


export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'article' | 'user'>('article');
  const navigation = useNavigation();

  const { allProducts } = useContext(ProductContext);
  const { users } = useContext(UserContext); 

  const filteredArticles = SearchUtils<ProductDataI>(allProducts, search, ['title' , 'category']);
  const filteredUsers = SearchUtils<UserI>(users, search, ['first_name', 'email']);

  const resultCount = searchType === 'article' ? filteredArticles.length : filteredUsers.length;

  const { width } = Dimensions.get('window');
  

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-5">
      <View className="flex-row items-center gap-5 mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full bg-gray-100">
              <ArrowLeftIcon size={24} color="black" weight="bold" />
          </TouchableOpacity>
          
          <View className="flex-1"> 
              <SearchBar onChangeText={setSearch} />
          </View>
      </View>

      <View className="flex-row justify-center mb-2 gap-5 ">
        <TouchableOpacity
          className={`py-3 rounded-full flex-1 items-center justify-center ${searchType === 'article' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setSearchType('article')}
        >
          <Text className={`${searchType === 'article' ? 'text-white' : 'text-[#03233A]'} font-normal`}>
            Articles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`py-3 rounded-full flex-1 items-center justify-center ${searchType === 'user' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setSearchType('user')}
        >
          <Text className={`${searchType === 'user' ? 'text-white' : 'text-[#03233A]'} font-normal`}>
            Utilisateurs
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text className="pl-2 text-start text-gray-500 mb-2 mt-2">
        {resultCount} résultat{resultCount > 1 ? 's' : ''}
      </Text>
      
      <View className="flex-1 rounded-2xl overflow-hidden">
        {searchType === 'article' ? (
          <FlatList
            key="articles"
            data={filteredArticles}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <ProductCard item={item} cardWidth={width * 0.43}/>}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
            ListEmptyComponent={
              <View className="w-full items-center justify-center mt-20">
                <Text className="text-gray-500 text-lg">
                  Aucun article trouvé
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            key="users"
            data={filteredUsers}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <UserCard item={item} />}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="w-full items-center justify-center mt-20">
                <Text className="text-gray-500 text-lg">
                  Aucun utilisateur trouvé
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}