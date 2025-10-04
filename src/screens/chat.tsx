import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
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
  Keyboard,
} from 'react-native';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { ArrowLeft, UserIcon } from 'phosphor-react-native';
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
import ReplyPreview from '../components/messages/ReplyPreview';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid'; 

// import { API_SOCKET_URL } from '@env';

const API_SOCKET_URL = "wss://mounting-draws-answering-extras.trycloudflare.com"
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
  const flashListRef = useRef<FlashList<any>>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false);

  const { user, token } = useContext(AuthContext);

  const [authError, setAuthError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [messageText, setMessageText] = useState('');

  // État pour gérer les réponses
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const fetchPreviousMessages = async () => {
    setLoading(true);
    try {
      const conv = await getOrCreateConversation(String(id));
      setConversation(conv);

      if (conv && conv.id) {
        const msgs = await getConversationMessages(conv.id);
        setMessages(msgs);
        if (msgs.length > 0) {
          setShouldScrollToEnd(true);
        }
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

  // Fonction pour gérer le scroll initial
  const handleFlashListLayout = useCallback(() => {
    if (shouldScrollToEnd && messages.length > 0) {
      setTimeout(() => {
        if (flashListRef.current) {
          try {
            flashListRef.current.scrollToIndex({
              index: messages.length - 1,
              animated: false,
              viewPosition: 1,
            });
            setShouldScrollToEnd(false);
            setIsFirstLoad(false);
          } catch (error) {
            console.log('Erreur scroll initial:', error);
            // Fallback: essayer scrollToEnd
            try {
              flashListRef.current?.scrollToEnd?.({ animated: false });
              setShouldScrollToEnd(false);
              setIsFirstLoad(false);
            } catch (e) {
              console.log('Erreur fallback scroll:', e);
            }
          }
        }
      }, 200);
    }
  }, [shouldScrollToEnd, messages.length]);

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
      
        if (parsedData.type == 'reaction') {
          setMessages(prev =>
            prev.map(message =>
              message.id == parsedData.message_id
                ? {
                    ...message,
                    reactions: parsedData.reactions || {},
                  }
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
          reactions: parsedData.reactions || {},
          reply_to: parsedData.reply_to || null,
          images: parsedData.images || [],
        };
      
        // Si c'est un message qu'on a envoyé, remplacer le message optimiste
        if (parsedData.sender_id == user?.id && parsedData.temp_id) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === parsedData.temp_id 
                ? { ...newMessage, isOptimistic: false }
                : msg
            )
          );
        } else {
          // Sinon, ajouter le nouveau message normalement
          setMessages(prev => [...prev, newMessage]);
        }
      
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

  // Scroll pour les nouveaux messages (après le premier chargement)
  useEffect(() => {
    if (messages.length > 0 && !isFirstLoad) {
      setTimeout(() => {
        if (flashListRef.current) {
          try {
            flashListRef.current.scrollToIndex({
              index: messages.length - 1,
              animated: true,
              viewPosition: 1,
            });
          } catch (error) {
            console.log('Erreur scroll FlashList:', error);
          }
        }
      }, 50);
    }
  }, [messages, isFirstLoad]);

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

  const sendReaction = useCallback(
    (messageId: string, reaction: string) => {
      if (isConnected && wsRef.current) {
        wsRef.current.sendMessage(
          JSON.stringify({
            type: 'reaction',
            message_id: messageId,
            reaction: reaction,
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


  // Dans le composant ChatScreen, ajoutez ces états
  const [selectedImages, setSelectedImages] = useState<string[]>([]);


  const handlePickImage = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 5, // Limite à 5 images
        includeBase64: true, // Important pour l'envoi
      },
      (response) => {
        if (response.didCancel) {
          console.log('Sélection annulée');
        } else if (response.errorCode) {
          console.log('Erreur:', response.errorMessage);
        } else if (response.assets) {
          const imageUris = response.assets
            .filter(asset => asset.uri)
            .map(asset => asset.uri as string);
          
          setSelectedImages(prev => [...prev, ...imageUris]);
        }
      }
    );
  }, []);

  // Fonction pour prendre une photo
  const handleTakePicture = useCallback(() => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Photo annulée');
        } else if (response.errorCode) {
          console.log('Erreur:', response.errorMessage);
        } else if (response.assets && response.assets[0]?.uri) {
          setSelectedImages(prev => [...prev, response.assets![0].uri as string]);
        }
      }
    );
  }, []);


  // Fonction pour retirer une image
  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);


  // Fonction utilitaire pour convertir en base64
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Erreur conversion base64:', error);
      throw error;
    }
  };

  const sendMessage = useCallback(async () => {
    const trimmedMessage = messageText.trim();
    if (trimmedMessage === '' && selectedImages.length === 0) return;
  
    setIsTyping(false);
    sendTypingStatus(false);
  
    try {
      // Générer un ID temporaire pour le message optimiste
      const tempMessageId = `temp_${Date.now()}`;
      
      // Créer un message optimiste avec les images locales
      const optimisticMessage: Message = {
        id: tempMessageId,
        conversation: conversation!.id,
        sender: user as User,
        content: trimmedMessage,
        timestamp: new Date().toISOString(),
        is_read: false,
        reactions: {},
        reply_to: replyingTo || null,
        images: selectedImages, // URLs locales des images
        isOptimistic: true, // Marqueur pour identifier les messages optimistes
        isUploading: true, // Nouveau marqueur pour l'état d'upload
      };
  
      // Ajouter immédiatement le message à la liste
      setMessages(prev => [...prev, optimisticMessage]);
  
      const messageData: any = {
        message: trimmedMessage,
        temp_id: tempMessageId, // Ajouter l'ID temporaire
      };
  
      // Ajouter l'ID du message auquel on répond
      if (replyingTo) {
        messageData.reply_to_id = replyingTo.id;
      }
  
      // Convertir les images en base64
      if (selectedImages.length > 0) {
        const base64Images = await Promise.all(
          selectedImages.map(uri => convertImageToBase64(uri))
        );
        messageData.images = base64Images;
      }
  
      // Envoyer le message
      wsRef.current?.sendMessage(JSON.stringify(messageData));
  
      // Réinitialiser les états
      setMessageText('');
      setSelectedImages([]);
      setIsButtonDisabled(true);
      setReplyingTo(null);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      // En cas d'erreur, retirer le message optimiste
      setMessages(prev => prev.filter(msg => !msg.isOptimistic));
    }
  }, [messageText, sendTypingStatus, replyingTo, selectedImages, conversation, user]);
  
  

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

  // Gérer le swipe pour répondre
  const handleSwipeReply = useCallback((message: Message) => {
    setReplyingTo(message);
    // Ouvrir le clavier
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  }, []);

  // Annuler la réponse
  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

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
          {image ? (
            <Image
              source={{
                uri: image,
              }}
              style={styles.avatar}
            />
          ) : (
            <View className="items-center justify-center mr-4 bg-gray-300 border-2 border-white rounded-full w-14 h-14">
              <UserIcon size={32} color="white" weight="bold" />
            </View>
          )}
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
                  onReactionSelect={(messageId, reaction) => {
                    sendReaction(messageId, reaction);
                  }}
                  onSwipeReply={handleSwipeReply}
                  currentUserId={user?.id}
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
            onLayout={handleFlashListLayout}
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
        {/* Aperçu du message auquel on répond */}
        <ReplyPreview
          replyingTo={replyingTo}
          onCancel={handleCancelReply}
        />

        {isRecording ? (
          <MessageVocal onStopRecording={handleStopRecording} />
        ) : (
          <MessageInput
            messageInputRef={messageInputRef}
            onChangeText={handleMessageChange}
            isButtonDisabled={isButtonDisabled}
            onSendMessage={sendMessage}
            onTakePicture={handleTakePicture}
            onPickImage={handlePickImage}
            onRecordPress={handleRecordingPress}
            value={messageText}
            selectedImages={selectedImages}
            onRemoveImage={handleRemoveImage}
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