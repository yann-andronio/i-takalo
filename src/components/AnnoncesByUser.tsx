import { View, Text, FlatList } from 'react-native';
import React from 'react';
import ProductCard from './products/ProductCard';
import { ProductDataI } from '../context/ProductContext'; // Import du type

interface AnnoncesByUserProps {
    userallProducts: ProductDataI[];
}

export default function AnnoncesByUser({ userallProducts }: AnnoncesByUserProps) {

    return (
        <View className="flex-1 bg-white px-6">
            <View className="flex-1 rounded-2xl overflow-hidden">
                {userallProducts.length > 0 ? (
                    <FlatList
                        data={userallProducts}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <ProductCard item={item} />}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        columnWrapperStyle={{
                            justifyContent: 'space-between',
                            marginBottom: 12,
                        }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-500 text-lg">
                            Vous n'avez pas encore publié d'annonces.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}