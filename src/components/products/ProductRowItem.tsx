import React, { memo } from 'react';
import { View, Dimensions } from 'react-native';
import ProductCard from './ProductCard';
import ProductFullCard from './ProductFullCard';
import PourVousSection from './PourVousSection';
import { ProductDataI } from '../../context/ProductContext';

const { width } = Dimensions.get('window');

interface ProductRowItemProps {
  item: ProductDataI;
  index: number;
  allProducts: ProductDataI[];
  type: 'full' | 'double';
  marginTop: number;
  showPourVous: boolean;
}

const ProductRowItem = memo(({
  item,
  index,
  allProducts,
  type,
  marginTop,
  showPourVous,
}: ProductRowItemProps) => {
  if (type === 'full') {
    return (
      <View style={{ marginTop, paddingHorizontal: 5 }}>
        <ProductFullCard
          item={item}
          cardWidth={width - 10}
        />
      </View>
    );
  }

  // Type double
  const nextItem = allProducts[index + 1];
  const isFirstInPair = index % 2 === 0;
  
  if (!isFirstInPair) {
    return <View style={{ height: 0 }} />;
  }
  
  return (
    <View style={{ paddingHorizontal: 5 }}>
      {showPourVous && <PourVousSection marginTop={marginTop} />}
      
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: showPourVous ? 0 : marginTop,
          gap: 5,
        }}
      >
        <ProductCard
          item={item}
          cardWidth={(width - 15) / 2}
        />
        {nextItem && (
          <ProductCard
            item={nextItem}
            cardWidth={(width - 15) / 2}
          />
        )}
      </View>
    </View>
  );
});

ProductRowItem.displayName = 'ProductRowItem';

export default ProductRowItem;
