import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (data: FilterFormData) => void;
};

interface FilterFormData {
  types:string,
  category: string;
  genre: string;
  style: string;
  taille: string;
  saison: string;
  minPrice: string;
  maxPrice: string;
}


const filterOptions = {
  types:['Vente' , "Donation"],
  category: ['T-shirt', 'pantalon', 'robe', 'chaussure', 'veste'],
  genre: ['homme', 'femme', 'enfant'],
  style: ['sport', 'vintage', 'streetwear', 'classique', 'chic'],
  taille: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  saison: ['été', 'hiver', 'printemps', 'automne'],
};

// Compos du btn filtre
const FilterButton = ({ label, isSelected, onPress }: { label: string; isSelected: boolean; onPress: () => void }) => (
  <TouchableOpacity
    className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-black border-black' : 'border-gray-300'}`}
    onPress={onPress}
  >
    <Text className={isSelected ? 'text-white' : 'text-gray-600'}>{label}</Text>
  </TouchableOpacity>
);

export default function FilterModalForm({ visible, onClose, onApplyFilters }: Props) {
  const [types, setTypes] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [genre, setGenre] = useState<string>('all');
  const [style, setStyle] = useState<string>('all');
  const [taille, setTaille] = useState<string>('all');
  const [saison, setSaison] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

 
  useEffect(() => {
    if (!visible) {
      clearFilters();
    }
  }, [visible]);

  const togglefilter = (state: string, setState: (value: string) => void, option: string) => {
    setState(state === option ? 'all' : option);
  };

  const filtreoamizay = () => {
    const data: FilterFormData = {
      types:types ,
      category: category,
      genre: genre,
      style: style,
      taille: taille,
      saison: saison,
      minPrice: minPrice,
      maxPrice: maxPrice,
    };
    onApplyFilters(data);
    onClose();
  };

  const clearFilters = () => {
    setTypes('all')
    setCategory('all')
    setGenre('all')
    setStyle('all')
    setTaille('all')
    setSaison('all')
    setMinPrice('')
    setMaxPrice('')
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end items-center bg-black/50">
        <View className="bg-white rounded-t-2xl p-6 w-full max-h-[90%]">
          
          <View className="flex-row items-center justify-between mb-4">
            <View className='flex-row items-center justify-center gap-4'>
                <TouchableOpacity onPress={onClose} className="p-2">
                     <Text className="text-2xl">✕</Text>
                 </TouchableOpacity>
                 <Text className="text-xl font-bold text-center ">Filtre</Text>
            </View>
            <TouchableOpacity onPress={clearFilters}>
              <Text className="text-gray-500 text-lg">Effacer tout</Text>
            </TouchableOpacity>
          </View>
          
       
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} >
            
            {/* Section Types */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 capitalize">Par Type</Text>
              <View className="flex-row flex-wrap gap-2">
                {filterOptions.types.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    isSelected={types === option}
                    onPress={() => togglefilter(types, setTypes, option)}
                  />
                ))}
              </View>
            </View>

            {/* Section Catégorie */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 capitalize">Par catégorie</Text>
              <View className="flex-row flex-wrap gap-2">
                {filterOptions.category.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    isSelected={category === option}
                    onPress={() => togglefilter(category, setCategory, option)}
                  />
                ))}
              </View>
            </View>

            {/* Section Genre */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 capitalize">Par genre</Text>
              <View className="flex-row flex-wrap gap-2">
                {filterOptions.genre.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    isSelected={genre === option}
                    onPress={() => togglefilter(genre, setGenre, option)}
                  />
                ))}
              </View>
            </View>

            {/* Section Style */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 capitalize">Par style</Text>
              <View className="flex-row flex-wrap gap-2">
                {filterOptions.style.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    isSelected={style === option}
                    onPress={() => togglefilter(style, setStyle, option)}
                  />
                ))}
              </View>
            </View>
            
            {/* Section Taille */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 capitalize">Par taille</Text>
              <View className="flex-row flex-wrap gap-2">
                {filterOptions.taille.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    isSelected={taille === option}
                    onPress={() => togglefilter(taille, setTaille, option)}
                  />
                ))}
              </View>
            </View>

            {/* Section Prix */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 capitalize">Par prix</Text>
              <View className="flex-row justify-center gap-5">
                <TextInput
                  className="border border-gray-300 rounded-md p-3 flex-1"
                  placeholder="minimum"
                  placeholderTextColor={"#6B7280"}
                  keyboardType="numeric"
                  onChangeText={setMinPrice}
                  value={minPrice}
                />
                <TextInput
                  className="border border-gray-300 rounded-md p-3 flex-1"
                  placeholderTextColor={"#6B7280"}
                  placeholder="maximum"
                  keyboardType="numeric"
                  onChangeText={setMaxPrice}
                  value={maxPrice}
                />
              </View>
            </View>
            
            {/* Section Saison */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 capitalize">Par saison</Text>
              <View className="flex-row flex-wrap gap-2">
                {filterOptions.saison.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    isSelected={saison === option}
                    onPress={() => togglefilter(saison, setSaison, option)}
                  />
                ))}
              </View>
            </View>

          </ScrollView>
          
          <TouchableOpacity
            onPress={filtreoamizay}
            className="mt-4 bg-[#FEF094] py-4 rounded-full"
          >
            <Text className="text-black font-bold text-center text-lg">Appliquer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}