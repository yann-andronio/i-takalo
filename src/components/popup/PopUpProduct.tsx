import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { PencilSimpleLineIcon,CheckCircleIcon, ShareNetworkIcon, TrashIcon } from 'phosphor-react-native';
import React, { useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamListMainNavigatorTab } from '../../types/Types'; 

interface PopUpProductProps {
  setShowPopup: (val: boolean) => void;
  productId: number; 
}

export default function PopUpProduct({ setShowPopup, productId }: PopUpProductProps) {
  const { deleteProduct } = useContext(ProductContext);
  const navigation = useNavigation<NavigationProp<RootStackParamListMainNavigatorTab>>();

  const handleDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer ce produit ?",
      [
        { text: "Annuler" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            deleteProduct(productId);
            setShowPopup(false);
            navigation.navigate("Home", { screen: "HomeMain" });
          } 
        },
      ]
    );
  };

  const actions = [
    {
      title: 'Modifier',
      icon: <PencilSimpleLineIcon size={20} color="#4B5563" weight="bold" />,
      onPress: () => {
        setShowPopup(false);
     
      },
      textClass: 'text-gray-700',
      bgHover: 'hover:bg-gray-100'
    },
    {
      title: 'Partager',
      icon: <ShareNetworkIcon size={20} color="#4B5563" weight="bold" />,
      onPress: () => {
        setShowPopup(false);
     
      },
      textClass: 'text-gray-700',
      bgHover: 'hover:bg-gray-100'
    },
    {
      title: 'Marquer comme vendu',
      icon: <CheckCircleIcon size={20} color="#10B981" weight="bold" />,
      onPress: () => {
        setShowPopup(false);
        console.log('Marquer comme vendu'); 
      },
      textClass: 'text-green-600',
      bgHover: 'hover:bg-green-50'
    },
    {
      title: 'Supprimer',
      icon: <TrashIcon size={20} color="#EF4444" weight="bold" />,
      onPress: handleDelete,
      textClass: 'text-red-500',
      bgHover: 'hover:bg-red-50'
    },
  ];

  return (
    <View className="absolute right-0 top-14 bg-white rounded-xl shadow-lg py-2 z-30 w-44 border border-gray-200">
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          className={`flex-row items-center px-4 py-2 ${action.bgHover} rounded-lg`}
          onPress={action.onPress}
        >
          {action.icon}
          <Text className={`ml-3 font-medium text-sm ${action.textClass}`}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
