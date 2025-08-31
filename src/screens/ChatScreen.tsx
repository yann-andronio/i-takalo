import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import ChatCard from '../components/ChatCard';
import { RootStackParamListChatnavigatorScreen, RootStackParamListMainNavigatorTab } from '../types/Types';

export interface ChatUserI {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  islu: boolean;
  avatar: any;
}

const chatUsersData: ChatUserI[] = [
  {
    id: '1',
    name: 'Martin RAKOTONANDRASANA',
    lastMessage: 'Afaka miady varotra tsara ianao. Teneno ny vidiny dia mirampirahaharaha isika.',
    time: '12:30',
    islu: false,
    avatar: require('../assets/images/productCardImage/1.png'),
  },
  {
    id: '2',
    name: 'Gilbert RASOANATROANDRO',
    lastMessage: 'Mbola misy maromararo raha mbola haka ianao...',
    time: 'Hier',
    islu: true,
    avatar: require('../assets/images/productCardImage/1.png'),
  },
  {
    id: '3',
    name: 'Clara Boutique',
    lastMessage: 'Efa iany tompoho fa mbola miandry arrivage manaraka indray vao misy...',
    time: '2 jours',
    islu: false,
    avatar: require('../assets/images/productCardImage/1.png'),
  },
  {
    id: '4',
    name: 'Sophie DUPONT',
    lastMessage: 'Je suis intéressée par votre article.',
    time: '1h',
    islu: false,
    avatar: require('../assets/images/productCardImage/1.png'),
  },
  {
    id: '5',
    name: 'Marc ANTOINE',
    lastMessage: 'Ok, je prends.',
    time: '30 min',
    islu: true,
    avatar: require('../assets/images/productCardImage/1.png'),
  },
];

type ChatStackNavigation = NavigationProp<RootStackParamListChatnavigatorScreen>;
export default function ChatScreen() {
  const navigation = useNavigation<ChatStackNavigation>();
  const [users, setUsers] = useState<ChatUserI[]>(chatUsersData);
  const [filter, setFilter] = useState<'nonlus' | 'lus'>('nonlus');

  const filteredUsers = users.filter(user =>
    filter === 'lus' ? user.islu : !user.islu
  );

  const handleOpenConversation = (userId: string) => {
    console.log(`misokatra ny firesahana amin i ${userId}`);
    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, islu: true } : u)
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white py-5">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View className="flex-row items-center mb-5 px-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full bg-gray-100">
          <ArrowLeftIcon size={24} color="black" weight="bold" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-5">Message</Text>
      </View>

      <View className="flex-row justify-center mb-5 mt-2 gap-5 px-5 ">
        <TouchableOpacity
          className={`py-3 rounded-full flex-1 items-center justify-center ${filter === 'lus' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setFilter('lus')}
        >
          <Text className={`${filter === 'lus' ? 'text-white' : 'text-[#03233A]'} font-normal `}>
            lus
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`py-3 rounded-full flex-1 items-center justify-center  ${filter === 'nonlus' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setFilter('nonlus')}
        >
          <Text className={`${filter === 'nonlus' ? 'text-white' : 'text-[#03233A]'} font-normal`} >
            non lus
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatCard
            item={item}
            onPress={() => {
              handleOpenConversation(item.id);
              navigation.navigate("Conversation"); 
            }}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}