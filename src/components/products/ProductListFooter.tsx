import React, { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface ProductListFooterProps {
  loadingMore: boolean;
  hasMore: boolean;
  productsCount: number;
}

const ProductListFooter = memo(({
  loadingMore,
  hasMore,
  productsCount,
}: ProductListFooterProps) => {
  if (loadingMore) {
    return (
      <View className="items-center justify-center py-4">
        <ActivityIndicator size="small" color="#03233A" />
        <Text className="mt-2 text-gray-500 text-sm">
          Chargement de plus de produits...
        </Text>
      </View>
    );
  }

  if (!hasMore && productsCount > 0) {
    return (
      <View className="items-center justify-center py-6 mb-20">
        <Text className="text-gray-500 text-sm">
          Vous avez vu tous les produits disponibles
        </Text>
      </View>
    );
  }

  return <View style={{ height: 100 }} />;
});

ProductListFooter.displayName = 'ProductListFooter';

export default ProductListFooter;