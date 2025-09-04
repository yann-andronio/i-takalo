import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  HeartIcon,
  MoneyIcon,
  BellRingingIcon,
  DotsThreeIcon,
} from 'phosphor-react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamListChatnavigatorScreen } from '../types/Types';
import PopUpNotifications from '../components/popup/PopUpNotifications';

type ChatStackNavigation =
  NavigationProp<RootStackParamListChatnavigatorScreen>;
type NotificationType = 'notifNewProduct' | 'like' | 'transaction';

interface NotificationI {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  isRead: boolean;
}

const staticNotifications: NotificationI[] = [
  {
    id: 1,
    type: 'notifNewProduct',
    message: 'Nouveau produit ajouté zalahy aii',
    time: 'Il y a 2h',
    isRead: false,
  },
  {
    id: 2,
    type: 'like',
    message: 'Misy olona nanao like pub cahier !',
    time: 'Hier',
    isRead: false,
  },
  {
    id: 3,
    type: 'transaction',
    message: 'Transaction ok',
    time: 'Il y a 3 jours',
    isRead: true,
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation<ChatStackNavigation>();
  const [notifications, setNotifications] =
    useState<NotificationI[]>(staticNotifications);
  const [filter, setFilter] = useState<'nonlus' | 'lus'>('nonlus');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedNotifId, setSelectedNotifId] = useState<number | null>(null);

  const filteredNotifications = notifications.filter(notif =>
    filter === 'lus' ? notif.isRead : !notif.isRead,
  );

  const getIcon = (type: NotificationType, active: boolean) => {
    const color = active ? '#03233A' : '#6B7280';
    switch (type) {
      case 'notifNewProduct':
        return <BellRingingIcon size={28} color={color} weight="fill" />;
      case 'like':
        return <HeartIcon size={28} color={color} weight="fill" />;
      case 'transaction':
        return <MoneyIcon size={28} color={color} weight="fill" />;
      default:
        return null;
    }
  };

  const handlePressNotification = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif)),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white py-5">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="flex-row items-center mb-5 px-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeftIcon size={24} color="black" weight="bold" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-5">Notifications</Text>
      </View>

      <View className="flex-row justify-center mb-5 mt-2 gap-5 px-5">
        <TouchableOpacity
          className={`py-3 rounded-full flex-1 items-center justify-center ${
            filter === 'nonlus' ? 'bg-[#03233A]' : 'bg-gray-200'
          }`}
          onPress={() => setFilter('nonlus')}
        >
          <Text
            className={`${
              filter === 'nonlus' ? 'text-white' : 'text-[#03233A]'
            } font-normal`}
          >
            Non lus
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`py-3 rounded-full flex-1 items-center justify-center ${
            filter === 'lus' ? 'bg-[#03233A]' : 'bg-gray-200'
          }`}
          onPress={() => setFilter('lus')}
        >
          <Text
            className={`${
              filter === 'lus' ? 'text-white' : 'text-[#03233A]'
            } font-normal`}
          >
            Lus
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePressNotification(item.id)}
            className={`flex-row items-center p-4 mb-3 rounded-xl ${
              item.isRead ? 'bg-gray-100' : 'bg-blue-50'
            }`}
          >
            <View className="bg-white rounded-full p-2">
              {getIcon(item.type, !item.isRead)}
            </View>
            <View className="ml-3 flex-1">
              <Text
                className={`text-base font-medium ${
                  item.isRead ? 'text-gray-600' : 'text-gray-900'
                }`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.message}
              </Text>
              <Text className="text-sm text-gray-400 mt-1">{item.time}</Text>
            </View>

            <TouchableOpacity
              className="p-3 rounded-full"
              onPress={() => {
                if (selectedNotifId === item.id && showPopup) {
                  setShowPopup(false);
                } else {
                  setSelectedNotifId(item.id);
                  setShowPopup(true);
                }
              }}
            >
              <DotsThreeIcon size={24} color="black" weight="bold" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />

      {showPopup && selectedNotifId !== null && (
        <PopUpNotifications
          setShowPopup={setShowPopup}
          notificationId={selectedNotifId}
        />
      )}
    </SafeAreaView>
  );
}
