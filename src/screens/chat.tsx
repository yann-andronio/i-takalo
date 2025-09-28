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
} from 'react-native';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { colors } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSocketService from '../services/websocket';
import { Message, Conversation, User } from '../types/ModelTypes';
import {
  getConversationMessages,
  getOrCreateConversation,
} from '../services/fetchData';
import { AuthContext } from '../context/AuthContext';
import MessageTypingAnimation from '../components/messages/MessageTypingAnimation';
import { FlashList } from '@shopify/flash-list';
import MessageInput from '../components/messages/MessageInput';
import MessageContainer from '../components/messages/MessageContainer';
import MessageVocal from '../components/messages/MessageVocal';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { API_SOCKET_URL } from '@env';
import ProductDetailsInMessage from '../components/ProductDetailsInMessage';

type ChatScreenRouteProp = RouteProp<
  { Chat: { conversationId: string; participant: any; produit: any } },
  'Chat'
>;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();

  const { participant } = route.params;
  const { produit } = route.params;

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
  const flashListRef = useRef<FlashList<any>>(null); // ✅ ref pour FlashList
  const [loading, setLoading] = useState(true);

  const { user, token } = useContext(AuthContext);

  const [authError, setAuthError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [messageText, setMessageText] = useState('');

  const fetchPreviousMessages = async () => {
    setLoading(true);
    try {
      const conv = await getOrCreateConversation(String(id));
      setConversation(conv);

      if (conv && conv.id) {
        const msgs = await getConversationMessages(conv.id);
        setMessages(msgs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la conversation :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousMessages();
  }, [id]);

  useEffect(() => {
    if (!token) {
      console.error("Pas de token d'authentification disponible");
      return;
    }

    if (conversation?.id) {
      const wsUrl = `${API_SOCKET_URL}/ws/chat/${conversation.id}/?token=${token}`;
      console.log('Connexion WebSocket avec URL:', wsUrl);

      wsRef.current = new WebSocketService(wsUrl);
      wsRef.current.setOnOpenCallback(() => {
        setIsConnected(true);
        console.log('WebSocket connecté');
      });

      wsRef.current.setOnCloseCallback(() => {
        setIsConnected(false);
        console.log('WebSocket déconnecté');
      });

      wsRef.current.setOnMessageCallback(data => {
        const parsedData = JSON.parse(data);

        if (parsedData.type == 'typing_status') {
          setPeerIsTyping(parsedData.is_typing);
          return;
        }

        if (parsedData.type == 'read_receipt') {
          setMessages(prev =>
            prev.map(message =>
              message.id == parsedData.message_id
                ? { ...message, is_read: true }
                : message,
            ),
          );
          return;
        }

        const newMessage: Message = {
          id: parsedData.message_id || Date.now().toString(),
          conversation: conversation.id,
          sender: conversation.participants.find(
            p => p.id == parsedData.sender_id,
          ) as User,
          content: parsedData.message,
          timestamp: parsedData.timestamp,
          is_read: false,
        };

        setMessages(prev => [...prev, newMessage]);

        if (parsedData.sender_id != user?.id) {
          sendReadReceipt(parsedData.message_id);
        }
      });

      wsRef.current.connect();

      return () => {
        wsRef.current?.disconnect();
      };
    }
  }, [conversation, user?.id, token]);

  // useEffect(() => {
  //   if (messages && flashListRef.current) {
  //     setTimeout(() => {
  //       flashListRef.current.scrollToEnd();
  //     }, 0);
  //   }
  // }, [messages]);
  useEffect(() => {
    if (messages.length > 0 && flashListRef.current) {
      setTimeout(() => {
        try {
          flashListRef.current.scrollToIndex({
            index: messages.length - 1,
            animated: true,
            viewPosition: 1,
          });
        } catch (error) {
          console.log('Erreur scroll FlashList:', error);
        }
      }, 50); // délai très court
    }
  }, [messages]);

  const sendReadReceipt = useCallback(
    (messageId: string) => {
      if (isConnected && wsRef.current && messageId) {
        wsRef.current.sendMessage(
          JSON.stringify({
            type: 'read_receipt',
            message_id: messageId,
          }),
        );
      }
    },
    [isConnected],
  );

  const markAllMessagesAsRead = useCallback(() => {
    if (!isConnected || !wsRef.current) return;

    const unreadMessages = messages.filter(
      msg => !msg.is_read && msg.sender.id != String(user?.id),
    );

    unreadMessages.forEach(msg => {
      sendReadReceipt(msg.id);
    });
  }, [messages, user?.id, isConnected, sendReadReceipt]);

  useEffect(() => {
    if (isConnected && !loading) {
      markAllMessagesAsRead();
    }
  }, [isConnected, loading, markAllMessagesAsRead]);

  const sendTypingStatus = useCallback(
    (typing: boolean) => {
      if (isConnected && wsRef.current) {
        wsRef.current.sendMessage(
          JSON.stringify({
            type: 'typing_status',
            is_typing: typing,
          }),
        );
      }
    },
    [isConnected],
  );

  const handleMessageChange = useCallback(
    (text: string) => {
      setMessageText(text);

      const shouldDisable = text.trim() == '';
      if (shouldDisable != isButtonDisabled) {
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
    [isTyping, isButtonDisabled, sendTypingStatus],
  );

  const sendMessage = useCallback(() => {
    const trimmedMessage = messageText.trim();
    if (trimmedMessage == '') return;

    setIsTyping(false);
    sendTypingStatus(false);

    wsRef.current?.sendMessage(
      JSON.stringify({
        message: trimmedMessage,
      }),
    );

    setMessageText('');
    setIsButtonDisabled(true);
  }, [messageText, sendTypingStatus]);

  const handleStopRecording = useCallback((uri: string | null) => {
    setIsRecording(false);

    if (uri) {
      console.log("URI de l'enregistrement:", uri);
    }
  }, []);

  const handleRecordingPress = useCallback(() => {
    if (!isRecording) {
      setIsRecording(true);
    }
  }, [isRecording]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="black" weight="bold" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image
            source={{
              uri: image,
            }}
            style={styles.avatar}
          />
          <View>
            <Text className="text-lg font-bold ml-3 text-[#03233A]">
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.neutral800} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
        <ProductDetailsInMessage produits={produit} />
          <FlashList
            ref={flashListRef}
            data={[...messages]}
            renderItem={({ item, index }) => {
              console.log('item_image_new', item.sender.image);
              return (
                <MessageContainer
                  item={item}
                  index={index}
                  previousMessage={index > 0 ? messages[index - 1] : null}
                  lastMessage={
                    messages.length > 0 ? messages[messages.length - 1] : null
                  }
                  onMessageAppear={messageId => {
                    if (!item.is_read && item.sender.id != String(user?.id)) {
                      sendReadReceipt(messageId);
                    }
                  }}
                />
              );
            }}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContainer}
            estimatedItemSize={30}
            automaticallyAdjustKeyboardInsets={true}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 0,
            }}
          />

          {peerIsTyping && (
            <MessageTypingAnimation
              dotColor={colors.neutral300}
              backgroundColor="#03233A"
            />
          )}
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 90 : 70}
      >
        {isRecording ? (
          <MessageVocal onStopRecording={handleStopRecording} />
        ) : (
          <MessageInput
            messageInputRef={messageInputRef}
            onChangeText={handleMessageChange}
            isButtonDisabled={isButtonDisabled}
            onSendMessage={sendMessage}
            onTakePicture={() => console.log('teste')}
            onPickImage={() => console.log('teste')}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  backButton: {
    marginRight: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
