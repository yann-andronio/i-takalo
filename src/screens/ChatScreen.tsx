import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef, useContext } from "react";
import { colors } from "../constants/theme";
import { getConversations } from "../services/fetchData";
import ConversationItem from "../components/messages/ConversationItem";
import WebSocketService from "../services/websocket";
import { AuthContext } from '../context/AuthContext';

import { User, Conversation, Message } from "../types/ModelTypes";


const ChatScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  const wsRef = useRef<WebSocketService | null>(null);


  const fetchConversations = async () => {
    await getConversations()
      .then((data) => setConversations(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des conversations :", err)
      );
  };

  useEffect(() => {
    fetchConversations();
  }, []);
  

  useEffect(() => {
    // if (!session?.access) {
    //   console.error("Pas de token d'authentification disponible");
    //   return;
    // }
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiZW1haWwiOiJqdWxpb2ZhcmFsYWh5MjNAZ21haWwuY29tIiwidHlwZSI6IlVTRVIiLCJmaXJzdF9uYW1lIjoiSnVsaW8iLCJsYXN0X25hbWUiOiJsYXN0X25hbWUiLCJ0ZWxudW1iZXIiOm51bGwsImltYWdlIjoiaHR0cHM6Ly9weW5xZHVvYmVwYXdqaXdlbWdibS5zdXBhYmFzZS5jby9zdG9yYWdlL3YxL29iamVjdC9wdWJsaWMvcHJvZmlsX3VzZXJzLzczYzFmNmRlLWEyNjQtNDVjNS1hZDJkLTMxMGE1YjNjY2QwZV9sb2cucG5nPyIsImV4cCI6MTc1NzY3NjcxMiwib3JpZ19pYXQiOjE3NTc0MTc1MTJ9.a9-9mfwqY_phe1cFcY0VkyZkvv8LKqh5RueFjMM-54s"

    const wsUrl = `wss://ultimately-computing-earned-attendance.trycloudflare.com/ws/notifications/?token=${token}`;
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
