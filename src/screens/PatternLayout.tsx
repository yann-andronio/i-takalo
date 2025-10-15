import React, { useMemo } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

// ✅ MÉTHODE OPTIMISÉE - Calcul à la volée sans transformation de données
export const OptimizedSixThenOneLayout = ({ allProducts }) => {
  // Fonction pour déterminer le type de ligne en fonction de l'index
  const getRowType = (index: number) => {
    // Calculer la position dans le cycle (7-9 produits par cycle)
    const cycleSize = 8; // 6 produits + 1 ou 2 pleines (moyenne)
    const positionInCycle = index % cycleSize;
    
    // Les 6 premiers sont en double (indices 0-5)
    if (positionInCycle < 6) {
      return 'double';
    }
    // Les suivants sont en pleine largeur
    return 'full';
  };

  // Générer un seed stable basé sur l'ID du produit
  const getRandomFromSeed = (productId: string | number) => {
    const seed = typeof productId === 'string' 
      ? productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : productId;
    return (seed % 10) > 5; // Retourne true ou false de manière déterministe
  };

  return (
    <View style={{ paddingHorizontal: 5, marginBottom: 100 }}>
      <FlatList
        data={allProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const type = getRowType(index);
          
          if (type === 'full') {
            return (
              <View style={{ marginBottom: 5 }}>
                <ProductCard 
                  item={item} 
                  cardWidth={width - 10} 
                />
              </View>
            );
          } else {
            // Double - on affiche 2 cartes côte à côte
            const nextItem = allProducts[index + 1];
            const isFirstInPair = index % 2 === 0;
            
            if (!isFirstInPair) return null; // Ne rendre que la première carte de la paire
            
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
            );
          }
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        removeClippedSubviews={true} // ✅ Améliore les performances
        maxToRenderPerBatch={10} // ✅ Limite le nombre d'items rendus par batch
        updateCellsBatchingPeriod={50} // ✅ Réduit la fréquence de mise à jour
        windowSize={5} // ✅ Réduit le nombre d'items gardés en mémoire
      />
    </View>
  );
};

// ✅ MEILLEURE APPROCHE : Transformation avec seed stable
export const StableSixThenOneLayout = ({ allProducts }) => {
  const transformedData = useMemo(() => {
    const result: any[] = [];
    let i = 0;
    let cycleCount = 0;

    while (i < allProducts.length) {
      // Créer 3 lignes de 2 cartes (total 6 cartes)
      let rowsCreated = 0;
      while (rowsCreated < 3 && i < allProducts.length) {
        if (i + 1 < allProducts.length) {
          result.push({
            type: 'double',
            items: [allProducts[i], allProducts[i + 1]],
            id: `double-${i}`,
          });
          i += 2;
        } else {
          result.push({
            type: 'single',
            items: [allProducts[i]],
            id: `single-${i}`,
          });
          i++;
        }
        rowsCreated++;
      }

      // Utiliser cycleCount pour déterminer 1 ou 2 cartes (stable)
      const numberOfFullCards = cycleCount % 2 === 0 ? 1 : 2;
      
      for (let j = 0; j < numberOfFullCards && i < allProducts.length; j++) {
        result.push({
          type: 'full',
          items: [allProducts[i]],
          id: `full-${i}`,
        });
        i++;
      }
      
      cycleCount++;
    }

    return result;
  }, [allProducts]);

  return (
    <View style={{ paddingHorizontal: 5, marginBottom: 100 }}>
      <FlatList
        data={transformedData}
        keyExtractor={(item) => item.id}
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
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10} // ✅ Limite le rendu initial
      />
    </View>
  );
};

// ✅ VERSION AVEC ScrollView ACTIVÉ (RECOMMANDÉ pour beaucoup de produits)
export const ScrollableSixThenOneLayout = ({ allProducts }) => {
  const transformedData = useMemo(() => {
    const result: any[] = [];
    let i = 0;
    let cycleCount = 0;

    while (i < allProducts.length) {
      let rowsCreated = 0;
      while (rowsCreated < 3 && i < allProducts.length) {
        if (i + 1 < allProducts.length) {
          result.push({
            type: 'double',
            items: [allProducts[i], allProducts[i + 1]],
            id: `double-${i}`,
          });
          i += 2;
        } else {
          result.push({
            type: 'single',
            items: [allProducts[i]],
            id: `single-${i}`,
          });
          i++;
        }
        rowsCreated++;
      }

      const numberOfFullCards = cycleCount % 2 === 0 ? 1 : 2;
      
      for (let j = 0; j < numberOfFullCards && i < allProducts.length; j++) {
        result.push({
          type: 'full',
          items: [allProducts[i]],
          id: `full-${i}`,
        });
        i++;
      }
      
      cycleCount++;
    }

    return result;
  }, [allProducts]);

  return (
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      <FlatList
        data={transformedData}
        keyExtractor={(item) => item.id}
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
        scrollEnabled={true} // ✅ ACTIVÉ pour la virtualisation
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        windowSize={3}
        getItemLayout={(data, index) => ({
          length: 288 + 5, // hauteur carte + gap
          offset: (288 + 5) * index,
          index,
        })}
      />
    </View>
  );
};