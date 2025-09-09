import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef, useContext } from "react";
// import {
//   MagnifyingGlass,
//   NotePencil,
// } from "phosphor-react-native";
import { colors } from "../constants/theme";
import { getFriendsOnlineData, getConversations } from "../services/fetchData";
import FriendsConnectedItem from "../components/messages/FriendsConnectedItem";
import ConversationItem from "../components/messages/ConversationItem";
import WebSocketService from "../services/websocket";
// import { useSession } from "../context/AuthContext";
import { AuthContext } from '../context/AuthContext';

import EncryptedStorage from "react-native-encrypted-storage";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  avatar_url: string;
  status: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface Message {
  id: string;
  conversation: string;
  sender: User;
  content: string;
  timestamp: string;
  is_read: boolean;
}


const ChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friendsOnline, setFriendsOnline] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  const wsRef = useRef<WebSocketService | null>(null);

  const fetchFriends = async () => {
    await getFriendsOnlineData()
      .then((data) => {
        const onlineFriends = data.filter((friend) => friend.status === true);
        setFriendsOnline(onlineFriends);
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des amis :", err)
      );
  };

  const fetchConversations = async () => {
    await getConversations()
      .then((data) => setConversations(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des conversations :", err)
      );
  };

  useEffect(() => {
    fetchFriends();
    fetchConversations();
  }, []);
  

  // const getToken = async () => {
  //   return await EncryptedStorage.getItem("accessToken");

  // }
  useEffect(() => {
    // if (!session?.access) {
    //   console.error("Pas de token d'authentification disponible");
    //   return;
    // }
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiZW1haWwiOiJqdWxpb2ZhcmFsYWh5MjNAZ21haWwuY29tIiwidHlwZSI6IlVTRVIiLCJmaXJzdF9uYW1lIjoiSnVsaW8iLCJsYXN0X25hbWUiOiJsYXN0X25hbWUiLCJ0ZWxudW1iZXIiOm51bGwsImltYWdlIjoiaHR0cHM6Ly9weW5xZHVvYmVwYXdqaXdlbWdibS5zdXBhYmFzZS5jby9zdG9yYWdlL3YxL29iamVjdC9wdWJsaWMvcHJvZmlsX3VzZXJzLzczYzFmNmRlLWEyNjQtNDVjNS1hZDJkLTMxMGE1YjNjY2QwZV9sb2cucG5nPyIsImV4cCI6MTc1NzY3NjcxMiwib3JpZ19pYXQiOjE3NTc0MTc1MTJ9.a9-9mfwqY_phe1cFcY0VkyZkvv8LKqh5RueFjMM-54s"

    const wsUrl = `wss://vegetarian-rehabilitation-turn-load.trycloudflare.com/ws/notifications/?token=${token}`;
    console.log("Connexion WebSocket de notifications avec URL:", wsUrl);

    wsRef.current = new WebSocketService(wsUrl);
    wsRef.current.setOnOpenCallback(() => {
      console.log("WebSocket de notifications connecté");
    });

    wsRef.current.setOnMessageCallback((data) => {
      const parsedData = JSON.parse(data);
      console.log("Notification reçue:", parsedData);

      if (parsedData.type === "new_message") {
        handleNewMessage(parsedData);
      }
    });

    wsRef.current.connect();

    return () => {
      wsRef.current?.disconnect();
    };
  // }, [session?.access, user?.id]);
  }, [user?.id]);

  const handleNewMessage = (notification: any) => {
    const { conversation_id, message_id, sender_id, content, timestamp } =
      notification;

    setConversations((prevConversations) => {
      const updatedConversations = [...prevConversations];

      const conversationIndex = updatedConversations.findIndex(
        (conv) => conv.id === conversation_id
      );

      if (conversationIndex !== -1) {
        const updatedConversation = {
          ...updatedConversations[conversationIndex],
        };

        const newMessage: Message = {
          id: message_id,
          conversation: conversation_id,
          sender: updatedConversation.participants.find(
            (p) => p.id === sender_id
          ) as User,
          content: content,
          timestamp: timestamp,
          is_read: sender_id === user?.id,
        };

        if (updatedConversation.messages) {
          updatedConversation.messages = [
            newMessage,
            ...updatedConversation.messages,
          ];
        } else {
          updatedConversation.messages = [newMessage];
        }

        updatedConversation.updated_at = timestamp;

        updatedConversations[conversationIndex] = updatedConversation;

        updatedConversations.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        return updatedConversations;
      }

      fetchConversations();
      return prevConversations;
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchConversations();
    setIsRefreshing(false);
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <View style={styles.contentContainer}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          {/* <MagnifyingGlass
            size={20}
            color={colors.neutral400}
            style={styles.searchIcon}
          /> */}
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor={colors.neutral400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View>
          {friendsOnline.length > 0 ? (
            <FlatList
              data={friendsOnline}
              keyExtractor={(item) => item.id}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              renderItem={({ item, index }) => {
                return <FriendsConnectedItem friend={item} index={index} />;
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 15, paddingHorizontal: 12 }}
            />
          ) : (
            <Text style={styles.emptyListText}>
              Aucun ami en ligne pour le moment
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 10,
            marginHorizontal: 12,
          }}
        >
          <Text style={styles.sectionTitle}>Conversations</Text>
          {/* <NotePencil size={24} color={colors.neutral200} /> */}
        </View>

        <FlatList
          data={conversations}
          renderItem={({ item, index }) => (
            <ConversationItem conversation={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.neutral800]}
              tintColor={colors.neutral800}
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          contentContainerStyle={{ gap: 5, paddingHorizontal: 12 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral700,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 48,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: colors.neutral200,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.neutral200,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    color: colors.neutral400,
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 12,
    fontStyle: "italic",
  },
});
