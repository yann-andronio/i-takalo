import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { PencilSimpleLineIcon, ShareNetworkIcon, TrashIcon } from 'phosphor-react-native';
import React from 'react';

interface PopUpNotificationsProps {
  setShowPopup: (val: boolean) => void;
  notificationId: number;
}

export default function PopUpNotifications({ setShowPopup, notificationId }: PopUpNotificationsProps) {

  const handleDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer cette notification ?",
      [
        { text: "Annuler" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            console.log("Suppression notif ID :", notificationId);
            setShowPopup(false);
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
      title: 'Supprimer',
      icon: <TrashIcon size={20} color="#EF4444" weight="bold" />,
      onPress: handleDelete,
      textClass: 'text-red-500',
      bgHover: 'hover:bg-red-50'
    },
  ];

  return (
    <View className="absolute right-5 bottom-20 bg-white rounded-xl shadow-lg py-2 z-30 w-44 border border-gray-200">
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
