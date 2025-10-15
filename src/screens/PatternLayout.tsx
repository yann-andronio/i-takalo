import React, { useMemo } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

// Fonction pour transformer les données en format adapté au layout
const transformDataForLayout = (products: any[]) => {
  const result: any[] = [];
  let i = 0;

  while (i < products.length) {
    // Alterner aléatoirement ou selon un pattern
    const shouldBeFullWidth = Math.random() > 0.5; // 50% de chance
    
    // Ou utiliser un pattern fixe :
    // const shouldBeFullWidth = result.length % 2 === 0;

    if (shouldBeFullWidth && i < products.length) {
      // Une carte pleine largeur
      result.push({
        type: 'full',
        items: [products[i]],
      });
      i++;
    } else if (i + 1 < products.length) {
      // Deux cartes côte à côte
      result.push({
        type: 'double',
        items: [products[i], products[i + 1]],
      });
      i += 2;
    } else if (i < products.length) {
      // S'il reste une seule carte
      result.push({
        type: 'single',
        items: [products[i]],
      });
      i++;
    }
  }

  return result;
};

// Composant pour le HomeScreen
export const DynamicProductList = ({ allProducts }) => {
  const transformedData = useMemo(
    () => transformDataForLayout(allProducts),
    [allProducts]
  );

  return (
    <View style={{ paddingHorizontal: 5, marginBottom: 100 }}>
      <FlatList
        data={transformedData}
        keyExtractor={(item, index) => `row-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'full') {
            // Une carte pleine largeur
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={width - 10} 
                />
              </View>
            );
          } else if (item.type === 'double') {
            // Deux cartes côte à côte
            return (
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  marginBottom: 5,
                  gap: 5,
                }}
              >
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 15) / 2} 
                />
                <ProductCard 
                  item={item.items[1]} 
                  cardWidth={(width - 15) / 2} 
                />
              </View>
            );
          } else {
            // Une seule carte (si nombre impair)
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 15) / 2} 
                />
              </View>
            );
          }
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

// VARIANTE 2 : Pattern fixe (1 pleine, 2 petites, 1 pleine, 2 petites...)
export const PatternLayout = ({ allProducts }) => {
  const transformedData = useMemo(() => {
    const result: any[] = [];
    let i = 0;
    let patternIndex = 0;

    while (i < allProducts.length) {
      // Pattern : full, double, full, double...
      const shouldBeFullWidth = patternIndex % 2 === 0;

      if (shouldBeFullWidth && i < allProducts.length) {
        result.push({
          type: 'full',
          items: [allProducts[i]],
        });
        i++;
      } else if (i + 1 < allProducts.length) {
        result.push({
          type: 'double',
          items: [allProducts[i], allProducts[i + 1]],
        });
        i += 2;
      } else if (i < allProducts.length) {
        result.push({
          type: 'single',
          items: [allProducts[i]],
        });
        i++;
      }

      patternIndex++;
    }

    return result;
  }, [allProducts]);

  return (
    <View style={{ paddingHorizontal: 5, marginBottom: 100 }}>
      <FlatList
        data={transformedData}
        keyExtractor={(item, index) => `row-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'full') {
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={width - 10} 
                />
              </View>
            );
          } else if (item.type === 'double') {
            return (
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  marginBottom: 5,
                  gap: 5,
                }}
              >
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 15) / 2} 
                />
                <ProductCard 
                  item={item.items[1]} 
                  cardWidth={(width - 15) / 2} 
                />
              </View>
            );
          } else {
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 15) / 2} 
                />
              </View>
            );
          }
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

// VARIANTE 3 : 2 cartes, puis 1 pleine, répété
export const TwoThenOneLayout = ({ allProducts }) => {
  const transformedData = useMemo(() => {
    const result: any[] = [];
    let i = 0;

    while (i < allProducts.length) {
      // D'abord deux cartes côte à côte
      if (i + 1 < allProducts.length) {
        result.push({
          type: 'double',
          items: [allProducts[i], allProducts[i + 1]],
        });
        i += 2;
      } else if (i < allProducts.length) {
        result.push({
          type: 'single',
          items: [allProducts[i]],
        });
        i++;
        continue;
      }

      // Puis une carte pleine largeur
      if (i < allProducts.length) {
        result.push({
          type: 'full',
          items: [allProducts[i]],
        });
        i++;
      }
    }

    return result;
  }, [allProducts]);

  return (
    <View style={{ paddingHorizontal: 5, marginBottom: 100 }}>
      <FlatList
        data={transformedData}
        keyExtractor={(item, index) => `row-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'full') {
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={width - 10} 
                />
              </View>
            );
          } else if (item.type === 'double') {
            return (
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  marginBottom: 5,
                  gap: 5,
                }}
              >
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 15) / 2} 
                />
                <ProductCard 
                  item={item.items[1]} 
                  cardWidth={(width - 15) / 2} 
                />
              </View>
            );
          } else {
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 15) / 2} 
                />
              </View>
            );
          }
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

// VARIANTE 4 : 6 cartes (3 lignes de 2) puis 1 carte pleine largeur
export const SixThenOneLayout = ({ allProducts }) => {
  const transformedData = useMemo(() => {
    const result: any[] = [];
    let i = 0;

    while (i < allProducts.length) {
      // Créer 3 lignes de 2 cartes (total 6 cartes)
      let rowsCreated = 0;
      while (rowsCreated < 3 && i < allProducts.length) {
        if (i + 1 < allProducts.length) {
          // Deux cartes côte à côte
          result.push({
            type: 'double',
            items: [allProducts[i], allProducts[i + 1]],
          });
          i += 2;
        } else {
          // S'il reste une seule carte
          result.push({
            type: 'single',
            items: [allProducts[i]],
          });
          i++;
        }
        rowsCreated++;
      }

      // Puis une carte pleine largeur (si disponible)
      if (i < allProducts.length) {
        result.push({
          type: 'full',
          items: [allProducts[i]],
        });
        i++;
      }
    }

    return result;
  }, [allProducts]);

  return (
    <View style={{ paddingHorizontal: 5, marginBottom: 100, }}>
      <FlatList
        data={transformedData}
        keyExtractor={(item, index) => `row-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'full') {
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={width - 15} 
                />
              </View>
            );
          } else if (item.type === 'double') {
            return (
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  marginBottom: 5,
                  gap: 5,
                }}
              >
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 20) / 2} 
                />
                <ProductCard 
                  item={item.items[1]} 
                  cardWidth={(width - 20) / 2} 
                />
              </View>
            );
          } else {
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item.items[0]} 
                  cardWidth={(width - 15) / 2} 
                />
              </View>
            );
          }
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};