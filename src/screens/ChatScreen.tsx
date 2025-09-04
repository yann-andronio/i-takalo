import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, UserIcon } from 'phosphor-react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import ChatCard from '../components/ChatCard';
import { RootStackParamListChatnavigatorScreen } from '../types/Types';
import { UserContext } from '../context/UserContext';
import { ProductContext } from '../context/ProductContext';
import { UserI } from '../context/UserContext';

export interface ChatUserI {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  islu: boolean;
  image: string;
}

const staticConversations = [
  {
    olonahiresahanaId: 14,
    productId: 46,
    lastMessage: 'Efa iany tompoho fa mbola miandry arrivage manaraka indray vao misy...',
    time: '2 jours',
    islu: false,
  },
  {
    olonahiresahanaId: 15,
    productId: 34,
    lastMessage: 'Mbola misy maromararo raha mbola haka ianao...',
    time: 'Hier',
    islu: true,
  },
];

type ChatStackNavigation = NavigationProp<RootStackParamListChatnavigatorScreen>;

export default function ChatScreen() {
  const navigation = useNavigation<ChatStackNavigation>();
  const { users } = useContext(UserContext);
  const { allProducts } = useContext(ProductContext);

  // mirenvoyer et modification donne nle olona hiresahana 
  const initialConversations: ChatUserI[] = staticConversations.map((conv, index) => {
    const olonahiresahana = users.find(u => u.id === conv.olonahiresahanaId);
    return {
      id: `${conv.olonahiresahanaId}-${index}`,
      name: olonahiresahana?.last_name || 'Utilisateur inconnu',
      lastMessage: conv.lastMessage,
      time: conv.time,
      islu: conv.islu,
      image: olonahiresahana?.image || '',
    };
  });


  const [conversations, setConversations] = useState<ChatUserI[]>(initialConversations);
  const [filter, setFilter] = useState<'nonlus' | 'lus'>('nonlus');

  const filteredUsers = conversations.filter(user =>
    filter === 'lus' ? user.islu : !user.islu
  );

  const handleOpenConversation = (conversationId: string) => {

    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId ? { ...conv, islu: true } : conv
      )
    );
    navigation.navigate("Conversation");
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
          className={`py-3 rounded-full flex-1 items-center justify-center  ${filter === 'nonlus' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setFilter('nonlus')}
        >
          <Text className={`${filter === 'nonlus' ? 'text-white' : 'text-[#03233A]'} font-normal`} >
            Non lus
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`py-3 rounded-full flex-1 items-center justify-center ${filter === 'lus' ? 'bg-[#03233A]' : 'bg-gray-200'}`}
          onPress={() => setFilter('lus')}
        >
          <Text className={`${filter === 'lus' ? 'text-white' : 'text-[#03233A]'} font-normal `}>
            Lus
          </Text>
        </TouchableOpacity>


      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatCard
            item={item}
            onPress={() => handleOpenConversation(item.id)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}