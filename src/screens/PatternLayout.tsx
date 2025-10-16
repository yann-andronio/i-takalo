import React, { useMemo } from 'react';
import { View, FlatList, Dimensions, Text, TouchableOpacity } from 'react-native';
import ProductCard from '../components/products/ProductCard';
import ProductFullCard from '../components/products/ProductFullCard';
import { DotsThreeVertical, } from 'phosphor-react-native';
import { FlashList } from '@shopify/flash-list';

const { width } = Dimensions.get('window');


//  MÉTHODE OPTIMISÉE - Calcul à la volée sans transformation de données
export const OptimizedSixThenOneLayout = ({ allProducts }) => {
    // Fonction pour déterminer le type de ligne en fonction de l'index
    const getRowType = (index: number) => {
      const cycleSize = 8;
      const positionInCycle = index % cycleSize;
      
      if (positionInCycle < 6) {
        return 'double';
      }
      return 'full';
    };
  
    //  Fonction pour calculer l'espacement en fonction des types adjacents
    const getMarginTop = (index: number) => {
      if (index === 0) return 0;
      
      const currentType = getRowType(index);
      const previousType = getRowType(index - 1);
      
      // Full après Full = 100px
      if (currentType === 'full' && previousType === 'full') {
        return 40;
      }
      
      // Full après Double = 50px
      if (currentType === 'full' && previousType === 'double') {
        return 50;
      }
      
      // Double après Full = 10px (l'espacement sera géré par le titre)
      if (currentType === 'double' && previousType === 'full') {
        return 50;
      }
      
      // Double après Double = 5px
      return 5;
    };
  
    //  Fonction pour vérifier si on doit afficher "Pour vous"
    const shouldShowPourVous = (index: number) => {
      if (index === 0) return false;
      
      const currentType = getRowType(index);
      const previousType = getRowType(index - 1);
      
      // Afficher "Pour vous" si c'est une double après une full
      return currentType === 'double' && previousType === 'full';
    };
  
    return (
      <View style={{ paddingHorizontal: 5, marginBottom: 100 }}>
        <FlashList
        data={allProducts}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={200} // Ajustez selon la taille moyenne de vos items
        renderItem={({ item, index }) => {
            const type = getRowType(index);
            const marginTop = getMarginTop(index);
            const showPourVous = shouldShowPourVous(index);
            
            if (type === 'full') {
            return (
                <View style={{ marginTop }}>
                <ProductFullCard
                    item={item}
                    cardWidth={width - 15}
                />
                </View>
            );
            } else {
            // Double - on affiche 2 cartes côte à côte
            const nextItem = allProducts[index + 1];
            const isFirstInPair = index % 2 === 0;
            
            if (!isFirstInPair) return null;
            
            return (
                <View>
                {/* Afficher "Pour vous" si nécessaire */}
                {showPourVous && (
                    <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: marginTop,
                    marginBottom: 15,
                    paddingHorizontal: 5,
                    }}>
                    <Text
                        style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        color: '#000',
                        }}
                    >
                        Pour vous
                    </Text>
                    <TouchableOpacity
                        className="flex-row items-center bg-white rounded-md"
                        style={{
                        paddingVertical: 2,
                        paddingHorizontal: 6
                        }}
                        onPress={() => console.log("Option cliqué")}
                    >
                        <DotsThreeVertical
                        size={20}
                        color='#03233A'
                        weight='bold'
                        />
                    </TouchableOpacity>
                    </View>
                )}
                
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
            }
        }}
        showsVerticalScrollIndicator={false}
        // scrollEnabled={false} // ⚠️ À retirer si vous voulez que la liste soit scrollable
        />
      </View>
    );
};

//  MEILLEURE APPROCHE : Transformation avec seed stable
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
        initialNumToRender={10} //  Limite le rendu initial
      />
    </View>
  );
};

//  VERSION AVEC ScrollView ACTIVÉ (RECOMMANDÉ pour beaucoup de produits)
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
        scrollEnabled={true} //  ACTIVÉ pour la virtualisation
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