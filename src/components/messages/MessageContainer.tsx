import { StyleSheet, Text, View, Image, Pressable, Modal } from "react-native";
import React, { useEffect, useContext, useState, useRef } from "react";
import { colors } from "../../constants/theme";
import { AuthContext } from "../../context/AuthContext";
import { Check, Checks } from "phosphor-react-native";

const MessageContainer = ({
  item,
  index,
  previousMessage,
  lastMessage,
  onMessageAppear,
}: {
  item: any;
  index: number;
  previousMessage?: any | null;
  lastMessage?: any | null;
  onMessageAppear?: (messageId: string) => void;
}) => {
  const { user } = useContext(AuthContext);
  const [showReactions, setShowReactions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const messageRef = useRef<View>(null);

  useEffect(() => {
    if (item.sender.id !== user?.id && !item.is_read && onMessageAppear) {
      onMessageAppear(item.id);
    }
  }, [item.id, item.is_read, item.sender.id, user?.id, onMessageAppear]);

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
    messageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY - 95,
        left: isMyMessage ? pageX + 15 : pageX,
      });
      setShowReactions(true);
    });
  };

  const handleReactionSelect = (reaction: string) => {
    console.log("Réaction sélectionnée:", reaction);
    setShowReactions(false);
  };

  const isMyMessage = item.sender.id === user?.id;

  // --- Gestion du timestamp ---
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

  const reactions = [
    { emoji: "👍", name: "like" },
    { emoji: "❤️", name: "heart" },
    { emoji: "😂", name: "funny" },
    { emoji: "😮", name: "wow" },
    { emoji: "😢", name: "sad" },
    { emoji: "🙏", name: "pray" },
    { emoji: "👏", name: "clap" },
  ];

  return (
    <View>
      {showTimestamp && (
        <View style={styles.timeSeparatorContainer}>
          <Text style={styles.timestamp}>{timestampLabel}</Text>
        </View>
      )}

      {/* Modal avec le menu de réactions */}
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
            {reactions.map((reaction) => (
              <Pressable
                key={reaction.name}
                style={styles.reactionButton}
                onPress={() => handleReactionSelect(reaction.name)}
              >
                <Text style={styles.emojiText}>{reaction.emoji}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Pressable
        ref={messageRef}
        onLongPress={handleLongPress}
        delayLongPress={300}
      >
        <View style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.friendMessage,
          showTriangle && (isMyMessage ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }),
          addSpacing && { marginTop: 12 },
          isMyMessage ? { paddingRight: 55 } : { paddingRight: 40 }
        ]}>
          
          <Text style={isMyMessage ? styles.myMessageText : styles.friendMessageText}>
            {item.content}
          </Text>

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
              {item.is_read ? 
                <Checks size={15} color={colors.primary} weight="bold" />
                : <Check size={13} color={colors.neutral500} weight="bold" />
              }
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default MessageContainer;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
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
  messageContainer: {
    maxWidth: "80%",
    paddingHorizontal: 13,
    paddingVertical: 7,
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
});