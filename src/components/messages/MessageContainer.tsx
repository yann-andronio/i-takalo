import { StyleSheet, Text, View, TouchableOpacity, Pressable, Modal, Vibration, Animated, Image } from "react-native";
import React, { useEffect, useContext, useState, useRef } from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { colors } from "../../constants/theme";
import { AuthContext } from "../../context/AuthContext";
import { Check, Checks, ArrowBendUpLeft, Clock } from "phosphor-react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import ReplyMessageDisplay from "./ReplyMessageDisplay";
import MessageImages from './MessageImages';

const MessageContainer = ({
  item,
  index,
  previousMessage,
  lastMessage,
  onMessageAppear,
  onReactionSelect,
  currentUserId,
  onSwipeReply,
}: {
  item: any;
  index: number;
  previousMessage?: any | null;
  lastMessage?: any | null;
  onMessageAppear?: (messageId: string) => void;
  onReactionSelect?: (messageId: string, reaction: string) => void;
  currentUserId?: string;
  onSwipeReply?: (message: any) => void;
}) => {
  const { user } = useContext(AuthContext);
  const [showReactions, setShowReactions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const messageRef = useRef<View>(null);

  // Animation pour le swipe
  const translateX = useRef(new Animated.Value(0)).current;
  const replyIconOpacity = useRef(new Animated.Value(0)).current;

  // Animation refs pour chaque réaction
  const animatedValues = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (item.sender.id !== user?.id && !item.is_read && onMessageAppear) {
      onMessageAppear(item.id);
    }
  }, [item.id, item.is_read, item.sender.id, user?.id, onMessageAppear]);

  // Animation au montage du menu
  useEffect(() => {
    if (showReactions) {
      animatedValues.forEach(anim => anim.setValue(0));
      
      const animations = animatedValues.map((anim, index) => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 200,
          delay: index * 30,
          useNativeDriver: true,
        })
      );

      Animated.stagger(0, animations).start();
    }
  }, [showReactions]);

  const onGestureEvent = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    const isMyMessage = item.sender.id === user?.id;
    
    // Ne bouger que pendant le geste actif
    if (state === State.ACTIVE) {
      // Limiter le mouvement selon le type de message
      if (isMyMessage) {
        // Mon message : glisser vers la gauche (valeur négative)
        const limitedTranslation = Math.max(Math.min(translationX, 0), -80);
        translateX.setValue(limitedTranslation);
      } else {
        // Message ami : glisser vers la droite (valeur positive)
        const limitedTranslation = Math.min(Math.max(translationX, 0), 80);
        translateX.setValue(limitedTranslation);
      }

      // Animer l'opacité de l'icône
      const progress = Math.min(Math.abs(translateX._value) / 80, 1);
      replyIconOpacity.setValue(progress);
    } else {
      // Dès que le geste n'est plus actif, revenir à 0
      translateX.setValue(0);
      replyIconOpacity.setValue(0);
    }
  };

  const onHandlerStateChange = (event: any) => {
    const { state, translationX } = event.nativeEvent;
    
    if (state === State.END) {
      const threshold = 60;
      const isMyMessage = item.sender.id === user?.id;

      // Vérifier si le swipe est suffisant
      const shouldReply = isMyMessage 
        ? translationX < -threshold 
        : translationX > threshold;

      if (shouldReply) {
        // Déclencher l'action de réponse
        ReactNativeHapticFeedback.trigger("impactMedium", {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
        
        if (onSwipeReply) {
          onSwipeReply(item);
        }
      }
    }
    
    // Revenir à 0 immédiatement pour tous les états de fin
    if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      translateX.setValue(0);
      replyIconOpacity.setValue(0);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fr-FR", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLongPress = () => {
    Vibration.vibrate(50);
    ReactNativeHapticFeedback.trigger("impactMedium", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    messageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY - 95,
        left: isMyMessage ? pageX + 15 : pageX,
      });
      setShowReactions(true);
    });
  };

  const handleReactionSelect = (reaction: string) => {
    if (onReactionSelect) {
      onReactionSelect(item.id, reaction);
    }
    setShowReactions(false);
  };

  const getUserReaction = () => {
    if (!item.reactions || !currentUserId) return null;
    
    for (const [emoji, userIds] of Object.entries(item.reactions)) {
      if (Array.isArray(userIds) && userIds.includes(String(currentUserId))) {
        return emoji;
      }
    }
    return null;
  };

  const getAllReactions = () => {
    if (!item.reactions) return [];
    
    return Object.entries(item.reactions)
      .filter(([_, userIds]: [string, any]) => Array.isArray(userIds) && userIds.length > 0)
      .map(([emoji, userIds]: [string, any]) => ({
        emoji,
        count: userIds.length,
        hasUserReacted: userIds.includes(String(currentUserId)),
      }));
  };

  const isMyMessage = item.sender.id === user?.id;
  const userReaction = getUserReaction();
  const allReactions = getAllReactions();

  let showTimestamp = false;
  let timestampLabel = "";

  if (!previousMessage) {
    showTimestamp = true;
    const currentTime = new Date(item.timestamp);
    const today = new Date();

    if (currentTime.toDateString() === today.toDateString()) {
      timestampLabel = formatTime(item.timestamp);
    } else {
      timestampLabel = formatDateTime(item.timestamp);
    }
  } else {
    const currentTime = new Date(item.timestamp);
    const prevTime = new Date(previousMessage.timestamp);

    const timeDiff = currentTime.getTime() - prevTime.getTime();
    const currentDay = currentTime.toDateString();
    const prevDay = prevTime.toDateString();
    const today = new Date().toDateString();

    if (currentDay !== prevDay) {
      showTimestamp = true;
      timestampLabel =
        currentDay === today
          ? formatTime(item.timestamp)
          : formatDateTime(item.timestamp);
    } else if (timeDiff > 30 * 60 * 1000) {
      showTimestamp = true;
      timestampLabel =
        currentDay === today
          ? formatTime(item.timestamp)
          : formatDateTime(item.timestamp);
    }
  }
  
  const addSpacing =
    previousMessage && previousMessage.sender.id !== item.sender.id && !showTimestamp; 

  const showTriangle = (addSpacing || showTimestamp);

  const REACTIONS = [
    { emoji: "👍", name: "like" },
    { emoji: "❤️", name: "heart" },
    { emoji: "😂", name: "funny" },
    { emoji: "😮", name: "wow" },
    { emoji: "😢", name: "sad" },
    { emoji: "🙏", name: "pray" },
    { emoji: "👏", name: "clap" },
  ];
  const [isPressing, setIsPressing] = useState(false);
  
  return (
    <View>
      {showTimestamp && (
        <View style={styles.timeSeparatorContainer}>
          <Text style={styles.timestamp}>{timestampLabel}</Text>
        </View>
      )}

      <Modal transparent visible={showReactions} animationType="fade" onRequestClose={() => setShowReactions(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowReactions(false)}>
          <View 
            style={[
              styles.reactionMenu,
              {
                position: "absolute",
                top: menuPosition.top,
                left: menuPosition.left,
              }
            ]}
          >
            {REACTIONS.map((reaction, idx) => {
              const animatedStyle = {
                opacity: animatedValues[idx],
                transform: [
                  {
                    translateY: animatedValues[idx].interpolate({
                      inputRange: [0, 1],
                      outputRange: [15, 0],
                    }),
                  },
                  {
                    scale: animatedValues[idx].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              };

              return (
                <Animated.View key={reaction.name} style={animatedStyle}>
                  <Pressable
                    style={[
                      styles.reactionButton,
                      userReaction === reaction.emoji && {
                        backgroundColor: colors.gray,
                        marginHorizontal: 1,
                        borderRadius: 15
                      }
                    ]}
                    onPress={() => handleReactionSelect(reaction.emoji)}
                  >
                    <Text style={styles.emojiText}>{reaction.emoji}</Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </Pressable>
      </Modal>
      
      <View style={styles.swipeContainer}>
        {/* Icône de réponse en arrière-plan */}
        {!isPressing &&
          <Animated.View 
            style={[
              styles.replyIconContainer,
              isMyMessage ? styles.replyIconRight : styles.replyIconLeft,
              { opacity: replyIconOpacity }
            ]}
          >
            <ArrowBendUpLeft size={24} color={colors.neutral400} weight="bold" />
          </Animated.View>
        }
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-50, 50]}
          activeOffsetY={[-5, 5]}
          failOffsetY={[-10, 10]}
        >
          <Animated.View style={{ transform: [{ translateX }] }}>
            <Pressable
              ref={messageRef}
              onLongPress={handleLongPress}
              delayLongPress={300}
              onPressIn={() => setIsPressing(true)}
              onPressOut={() => setIsPressing(false)}
            >
              <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessage : styles.friendMessage,
                showTriangle && (isMyMessage ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }),
                addSpacing && { marginTop: 12 },
                allReactions.length > 0 && { marginBottom: 22 },
                isPressing && { opacity: 0.7 } 
              ]}>
                
                {/* Affichage du message cité */}
                {item.reply_to && (
                  <ReplyMessageDisplay
                    replyTo={item.reply_to}
                    isMyMessage={isMyMessage}
                    currentUserId={currentUserId}
                  />
                )}

                {/* Affichage des images avec indicateur de chargement */}
                <MessageImages 
                  images={item.images || []} 
                  isUploading={item.isUploading}
                  onImagePress={(index) => {
                    // TODO: Ouvrir la galerie d'images en plein écran
                    console.log('Image pressed:', index);
                  }}
                />


                <View style={[
                  {paddingHorizontal: 13},
                  isMyMessage ? { paddingRight: 55 } : { paddingRight: 40 }
                ]}>
                  <Text style={isMyMessage ? styles.myMessageText : styles.friendMessageText}>
                    {item.content}
                  </Text>
                </View>

                

                {showTriangle && <View style={
                  isMyMessage ? styles.triangleRight : styles.triangleLeft
                } />}
                
                <View style={isMyMessage ? styles.myMessageFooter : styles.friendMessageFooter}>
                  <Text style={isMyMessage ? styles.myMessageTime : styles.friendMessageTime}>
                    {formatTime(item.timestamp)}
                  </Text>
                </View>

                {isMyMessage && (
                  <View style={[styles.readStatusDot]}>
                    {
                      item.isUploading ? 
                        <Clock size={15} color={colors.neutral500} weight="bold" />
                      :
                      item.is_read ? 
                        <Checks size={15} color={colors.primary} weight="bold" />
                        : <Check size={13} color={colors.neutral500} weight="bold" />
                    }
                  </View>
                )}
              </View>
              {allReactions.length > 0 && (
                <View style={[
                  styles.reactionBubbleContainer,
                  isMyMessage ? styles.reactionBubbleMymessage : styles.reactionBubbleFriendmessage
                ]}>
                  <View style={[styles.reactionBubble]}>
                    {allReactions.map((reaction, idx) => (
                      <View key={idx}>
                        <Text style={styles.reactionEmojiSmall}>{reaction.emoji}</Text>
                        {reaction.count > 1 && (
                          <Text style={styles.reactionCount}>{reaction.count}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
                )
              }
            </Pressable>
          </Animated.View>
        </PanGestureHandler>

      </View>
    </View>
  );
};

export default MessageContainer;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  swipeContainer: {
    position: "relative",
  },
  replyIconContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: -1,
  },
  replyIconLeft: {
    left: 10,
  },
  replyIconRight: {
    right: 10,
  },
  reactionBubbleContainer: {
    flexDirection: "row",
    gap: 4,
  },
  reactionBubble: {
    backgroundColor: colors.gray,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  reactionBubbleHighlight: {
    backgroundColor: colors.gray,
    borderColor: colors.white,
  },
  reactionEmojiSmall: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.neutral700,
  },
  reactionBubbleMymessage: {    
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  reactionBubbleFriendmessage: {    
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  
  triangleRight: {
    position: "absolute",
    right: -6,   
    top: 0,
    width: 0,
    height: 0,
    borderTopColor: "transparent",
    borderLeftWidth: 10,
    borderLeftColor: "#FEF094",
    borderBottomWidth: 11,
    borderBottomColor: "transparent",
  },
  triangleLeft: {
    position: "absolute",
    left: -6,
    top: 0,
    width: 0,
    height: 0,
    borderTopColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "#F5F5F5",
    borderBottomWidth: 11,
    borderBottomColor: "transparent",
  },    
  // messageContainer: {
  //   minWidth: "60%",  // Largeur minimale
  //   maxWidth: "85%",  // Augmenté de 80% à 85%
  //   paddingVertical: 4,
  //   borderRadius: 12,
  //   marginBottom: 2,
  // },
  messageContainer: {
    maxWidth: "85%",
    // paddingHorizontal: 13,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 2,
  },
  avatar: {
    width: 14,
    height: 14,
    borderRadius: 20,
    marginRight: 12,
    position: "absolute",
    right: -47,
    bottom: -19
  },
  myMessage: {
    backgroundColor: "#FEF094",
    alignSelf: "flex-end",
  },
  friendMessage: {
    backgroundColor: colors.gray,
    alignSelf: "flex-start",
  },
  myMessageText: {
    fontSize: 15,
    color: "#03233A",
  },
  friendMessageText: {
    fontSize: 15,
    color: "#03233A",
  },
  myMessageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    position: "absolute",
    right: 25,
    bottom: 5
  },
  friendMessageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    position: "absolute",
    right: 8,
    bottom: 5
  },
  myMessageTime: {
    fontSize: 10,
    color: colors.neutral500,
  },
  friendMessageTime: {
    fontSize: 10,
    color: colors.neutral500,
  },
  timestamp: {
    fontSize: 13,
    color: colors.neutral600,
  },
  readStatusDot: {
    width: 13,
    height: 13,
    borderRadius: 8,
    position: "absolute",
    right: 8,
    bottom: 6
  },
  readStatusDotRead: {
    backgroundColor: colors.green,
  },
  readStatusDotUnread: {
    backgroundColor: colors.neutral500,
  },
  timeSeparatorContainer: {
    alignSelf: "center",
    marginVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  timeSeparatorText: {
    fontSize: 12,
    color: colors.neutral600,
  },
  reactionMenu: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 9999,
  },
  reactionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emojiText: {
    fontSize: 25,
  },



  imagesContainer: {
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  singleImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  multipleImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridImageContainer: {
    width: '48%',
    height: 120,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});