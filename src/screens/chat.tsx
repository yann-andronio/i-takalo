import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import { ArrowLeft } from "phosphor-react-native";
import { colors } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import WebSocketService from "../services/websocket";
import { Message, Conversation, User } from "../types/ModelTypes";
import {
  getConversationMessages,
  getOrCreateConversation,
} from "../services/fetchData";
import { AuthContext } from '../context/AuthContext';
import MessageTypingAnimation from "../components/messages/MessageTypingAnimation";
import { FlashList } from "@shopify/flash-list";
import MessageInput from "../components/messages/MessageInput";
import MessageContainer from "../components/messages/MessageContainer";
import MessageVocal from "../components/messages/MessageVocal";
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';


type ChatScreenRouteProp = RouteProp<
  { Chat: { conversationId: string; participant: any } },
  'Chat'
>;


const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();

  const { conversationId, participant } = route.params;
  // const params = useLocalSearchParams();
  // const id = params.id as string;
  // const first_name = params.first_name as string;
  // const last_name = params.last_name as string;
  // const image = params.image as string;
  // const status = params.status === "true";

  const id = participant?.id;
  const first_name = participant?.first_name;
  const last_name = participant?.last_name;
  const image = participant?.image;
  const status = true;


  const [conversation, setConversation] = useState<Conversation | null>(null);
  const messageInputRef = useRef<TextInput>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocketService | null>(null);
  const flatListRef = useRef<FlashList<any>>(null);
  const [loading, setLoading] = useState(true);
  // const { session, user } = useSession();
  const { user } = useContext(AuthContext);

  const [authError, setAuthError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [messageText, setMessageText] = useState("");

  const fetchPreviousMessages = async () => {
    setLoading(true);
    try {
      // Obtenir ou créer la conversation
      // const conv = await getOrCreateConversation(id as string);
      const conv = await getOrCreateConversation(String(id));
      setConversation(conv);

      // Charger les messages
      if (conv && conv.id) {
        const msgs = await getConversationMessages(conv.id);
        setMessages(msgs);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la conversation :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousMessages();
  }, [id]);

  useEffect(() => {
    // if (!session?.access) {
    //   console.error("Pas de token d'authentification disponible");
    //   return;
    // }

    if (conversation?.id) {
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiZW1haWwiOiJqdWxpb2ZhcmFsYWh5MjNAZ21haWwuY29tIiwidHlwZSI6IlVTRVIiLCJmaXJzdF9uYW1lIjoiSnVsaW8iLCJsYXN0X25hbWUiOiJsYXN0X25hbWUiLCJ0ZWxudW1iZXIiOm51bGwsImltYWdlIjoiaHR0cHM6Ly9weW5xZHVvYmVwYXdqaXdlbWdibS5zdXBhYmFzZS5jby9zdG9yYWdlL3YxL29iamVjdC9wdWJsaWMvcHJvZmlsX3VzZXJzLzczYzFmNmRlLWEyNjQtNDVjNS1hZDJkLTMxMGE1YjNjY2QwZV9sb2cucG5nPyIsImV4cCI6MTc1NzY3NjcxMiwib3JpZ19pYXQiOjE3NTc0MTc1MTJ9.a9-9mfwqY_phe1cFcY0VkyZkvv8LKqh5RueFjMM-54s"

      const wsUrl = `wss://ultimately-computing-earned-attendance.trycloudflare.com/ws/chat/${conversation.id}/?token=${token}`;
      console.log("Connexion WebSocket avec URL:", wsUrl);

      wsRef.current = new WebSocketService(wsUrl);
      wsRef.current.setOnOpenCallback(() => {
        setIsConnected(true);
        console.log("WebSocket connecté");
      });

      wsRef.current.setOnCloseCallback(() => {
        setIsConnected(false);
        console.log("WebSocket déconnecté");
      });

      wsRef.current.setOnMessageCallback((data) => {
        const parsedData = JSON.parse(data);

        // Gérer les différents types de messages
        if (parsedData.type === "typing_status") {
          setPeerIsTyping(parsedData.is_typing);
          return;
        }

        // Gérer les accusés de lecture
        if (parsedData.type === "read_receipt") {
          // Mettre à jour le statut de lecture du message correspondant
          setMessages((prev) =>
            prev.map((message) =>
              message.id === parsedData.message_id
                ? { ...message, is_read: true }
                : message
            )
          );
          return;
        }

        // Gérer les messages normaux (code existant)
        const newMessage: Message = {
          id: parsedData.message_id || Date.now().toString(),
          conversation: conversation.id,
          sender: conversation.participants.find(
            (p) => p.id === parsedData.sender_id
          ) as User,
          content: parsedData.message,
          timestamp: parsedData.timestamp,
          is_read: false,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Si nous sommes le destinataire, envoyer immédiatement un accusé de lecture
        if (parsedData.sender_id !== user?.id) {
          sendReadReceipt(parsedData.message_id);
        }
      });

      wsRef.current.connect();

      return () => {
        wsRef.current?.disconnect();
      };
    }
  // }, [conversation, session?.access, user?.id]);
}, [conversation, user?.id]);

  // Nouvelle fonction pour envoyer un accusé de lecture
  const sendReadReceipt = useCallback(
    (messageId: string) => {
      if (isConnected && wsRef.current && messageId) {
        wsRef.current.sendMessage(
          JSON.stringify({
            type: "read_receipt",
            message_id: messageId,
          })
        );
      }
    },
    [isConnected]
  );

  // Fonction pour marquer tous les messages non lus comme lus lorsque l'utilisateur consulte la conversation
  const markAllMessagesAsRead = useCallback(() => {
    if (!isConnected || !wsRef.current) return;

    // Trouver les messages non lus qui ne sont pas de nous
    const unreadMessages = messages.filter(
      (msg) => !msg.is_read && msg.sender.id !== String(user?.id)
      
    );

    // Envoyer un accusé de lecture pour chaque message
    unreadMessages.forEach((msg) => {
      sendReadReceipt(msg.id);
    });
  }, [messages, user?.id, isConnected, sendReadReceipt]);

  // Appeler cette fonction lorsque l'utilisateur consulte activement la conversation
  useEffect(() => {
    if (isConnected && !loading) {
      markAllMessagesAsRead();
    }
  }, [isConnected, loading, markAllMessagesAsRead]);

  // Fonction pour envoyer l'état de saisie, maintenant statique
  const sendTypingStatus = useCallback(
    (typing: boolean) => {
      if (isConnected && wsRef.current) {
        wsRef.current.sendMessage(
          JSON.stringify({
            type: "typing_status",
            is_typing: typing,
          })
        );
      }
    },
    [isConnected] // Dépend uniquement de isConnected
  );

  // Gérer le changement du texte de message
  const handleMessageChange = useCallback(
    (text: string) => {
      // Stocker le texte dans l'état
      setMessageText(text);

      const shouldDisable = text.trim() === "";
      if (shouldDisable !== isButtonDisabled) {
        setIsButtonDisabled(shouldDisable);
      }

      if (!isTyping) {
        setIsTyping(true);
        sendTypingStatus(true);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTypingStatus(false);
      }, 2000);
    },
    [isTyping, isButtonDisabled, sendTypingStatus]
  );

  const sendMessage = useCallback(() => {
    const trimmedMessage = messageText.trim();
    if (trimmedMessage === "") return;

    setIsTyping(false);
    sendTypingStatus(false);

    wsRef.current?.sendMessage(
      JSON.stringify({
        message: trimmedMessage,
      })
    );

    // Réinitialiser le texte
    setMessageText("");
    setIsButtonDisabled(true);
  }, [messageText, sendTypingStatus]);

  console.log("RENDU");

  

  // Gérer la fin de l'enregistrement
  const handleStopRecording = useCallback(
    (uri: string | null) => {
      setIsRecording(false);

      if (uri) {
        console.log("URI de l'enregistrement:", uri);
        // Ici vous pouvez traiter l'audio (l'envoyer via WebSocket, etc.)

        // Si vous voulez envoyer l'audio via WebSocket:
        // if (isConnected && wsRef.current) {
        //   wsRef.current.sendMessage(
        //     JSON.stringify({
        //       type: "audio",
        //       audio_uri: uri
        //     })
        //   );
        // }
      }
    },
    [isConnected]
  );

  // Toggle enregistrement - version simplifiée
  const handleRecordingPress = useCallback(() => {
    if (isRecording) {
      // Ne fait rien ici, car l'arrêt est géré par le composant MessageVocal
    } else {
      setIsRecording(true);
    }
  }, [isRecording]);

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête du chat */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.neutral200} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image
            source={{
              uri: image,
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.headerName}>
              {first_name} {last_name}
            </Text>
          </View>
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: status ? colors.green : colors.neutral400,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Zone des messages avec indicateur de chargement */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.neutral800} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            ref={flatListRef}
            // data={[...messages].reverse()}
            data={[...messages]}
            // inverted={true}
            renderItem={({ item, index }) => (
              <MessageContainer
                item={item}
                index={messages.length - 1 - index}
                onMessageAppear={(messageId) => {
                  // Envoyer l'accusé de lecture quand un message non lu apparaît
                  if (!item.is_read && item.sender.id !== String(user?.id)) {
                    sendReadReceipt(messageId);
                  }
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContainer}
            estimatedItemSize={200}
            automaticallyAdjustKeyboardInsets={true}
            onEndReached={() => {
              console.log("Charger des messages plus anciens");
            }}
            onEndReachedThreshold={0.1}
          />
          {peerIsTyping && (
            <MessageTypingAnimation
              dotColor={colors.neutral500}
              backgroundColor={colors.neutral800}
            />
          )}
        </View>
      )}

      {/* Zone de saisie */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 70}
      >
        {isRecording ? (
          <MessageVocal onStopRecording={handleStopRecording} />
        ) : (
          <MessageInput
            messageInputRef={messageInputRef}
            onChangeText={handleMessageChange}
            isButtonDisabled={isButtonDisabled}
            onSendMessage={sendMessage}
            onTakePicture={()=>console.log("teste")}
            onPickImage={()=>console.log("teste")}
            onRecordPress={handleRecordingPress}
            value={messageText}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  backButton: {
    marginRight: 20,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral200,
  },
  headerStatus: {
    fontSize: 14,
    color: colors.neutral500,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    left: 30,
    backgroundColor: colors.black,
    borderRadius: 10,
    padding: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  messagesContainer: {
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    color: colors.neutral600,
    fontSize: 16,
    textAlign: "center",
  },
  authErrorContainer: {
    backgroundColor: colors.rose,
    padding: 10,
    alignItems: "center",
  },
  authErrorText: {
    color: colors.black,
    fontWeight: "500",
  },
  recordingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    backgroundColor: colors.black,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.rose,
    marginRight: 8,
  },
  recordingText: {
    flex: 1,
    color: colors.neutral800,
    fontSize: 14,
  },
  stopRecordingButton: {
    backgroundColor: colors.neutral200,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stopRecordingButtonText: {
    color: colors.neutral800,
    fontSize: 12,
    fontWeight: "600",
  },
});
