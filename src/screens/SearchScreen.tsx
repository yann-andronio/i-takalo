import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductDataI } from '../context/ProductContext';
import { UserI } from '../context/UserContext'; 
import ProductCard from '../components/products/ProductCard';
import ProductFullCard from '../components/products/ProductFullCard';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDebounce } from '../hooks/useDebounce';

const API_BASE_URL = 'https://distances-eau-attempt-impose.trycloudflare.com'; 

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'article' | 'user'>('article');
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<ProductDataI[]>([]);
  const [inverseArticles, setInverseArticles] = useState<ProductDataI[]>([]);
  const [users, setUsers] = useState<UserI[]>([]);
  
  const navigation = useNavigation();
  const debouncedSearch = useDebounce(search, 500);

  const { width } = Dimensions.get('window');

  // Fonction pour rechercher les articles
  const searchArticles = async (query: string) => {
    if (!query.trim()) {
      setArticles([]);
      setInverseArticles([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/products/?title=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Récupère les résultats normaux et inversés
      setArticles(data.dataset || []);
      setInverseArticles(data.search_inverse || []);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'articles:', error);
      setArticles([]);
      setInverseArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rechercher les utilisateurs
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/members/?first_name=${encodeURIComponent(query)}`);
      const data = await response.json();
      setUsers(data.dataset);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour lancer la recherche après le debounce
  useEffect(() => {
    if (searchType === 'article') {
      searchArticles(debouncedSearch);
    } else {
      searchUsers(debouncedSearch);
    }
  }, [debouncedSearch, searchType]);

  // Réinitialiser les résultats quand on change de type
  useEffect(() => {
    if (debouncedSearch) {
      if (searchType === 'article') {
        searchArticles(debouncedSearch);
      } else {
        searchUsers(debouncedSearch);
      }
    }
  }, [searchType]);

  // Préparer les sections pour les articles
  const articleSections = [];
  if (articles.length > 0) {
    articleSections.push({
      title: 'Résultats directs',
      data: articles,
      isInverse: false,
    });
  }
  if (inverseArticles.length > 0) {
    articleSections.push({
      title: 'Recherche inversée',
      data: inverseArticles,
      isInverse: true,
    });
  }

  const resultCount = searchType === 'article' 
    ? articles.length + inverseArticles.length 
    : users.length;

  // Rendu d'une section d'articles
  const renderArticleSection = ({ section }: { section: { title: string; data: ProductDataI[]; isInverse: boolean } }) => (
    <View className="mb-4" style={{marginTop: 20}}>
      <Text className="text-lg font-semibold text-[#03233A] mb-3 px-2">
        {section.title}
      </Text>
      {section.isInverse ? (
        // Pour la recherche inversée : ProductFullCard en pleine largeur
        <View>
          {section.data.map((item) => (
            <View key={item.id.toString()} style={{ marginBottom: 25 }}>
              <ProductFullCard item={item} cardWidth={width - 20} />
            </View>
          ))}
        </View>
      ) : (
        // Pour les résultats directs : ProductCard en deux colonnes
        <View className="flex-row flex-wrap justify-between">
          {section.data.map((item, index) => (
            <View key={item.id.toString()} style={{ width: width * 0.43, marginBottom: 12 }}>
              <ProductCard item={item} cardWidth={width * 0.43} />
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-3 py-5">
      <View className="flex-row items-center gap-5 mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full bg-gray-100">
          <ArrowLeftIcon size={24} color="black" weight="bold" />
        </TouchableOpacity>
        
        <View className="flex-1"> 
          <SearchBar onChangeText={setSearch} />
        </View>
      </View>

      <View className="flex-row justify-center mb-2 gap-5">
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
      
      <View className="flex-row items-center justify-between pl-2 mb-2 mt-2">
        <Text className="text-start text-gray-500">
          {resultCount} résultat{resultCount > 1 ? 's' : ''}
        </Text>
        {loading && <ActivityIndicator size="small" color="#03233A" />}
      </View>
      
      <View className="flex-1 overflow-hidden" style={{borderRadius: 7}}>
        {searchType === 'article' ? (
          <SectionList
            sections={articleSections}
            keyExtractor={(item, index) => item.id.toString() + index}
            renderItem={() => null}
            renderSectionHeader={renderArticleSection}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <View className="w-full items-center justify-center mt-20">
                <Text className="text-gray-500 text-lg">
                  {loading ? 'Recherche en cours...' : search ? 'Aucun article trouvé' : 'Tapez pour rechercher'}
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            key="users"
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <UserCard item={item} />}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="w-full items-center justify-center mt-20">
                <Text className="text-gray-500 text-lg">
                  {loading ? 'Recherche en cours...' : search ? 'Aucun utilisateur trouvé' : 'Tapez pour rechercher'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}