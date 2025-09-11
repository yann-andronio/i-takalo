import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";
import { colors } from "../../constants/theme";
import { AuthContext } from "../../context/AuthContext";

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


  const isMyMessage = item.sender.id === user?.id;


  // --- Gestion du timestamp ---
  let showTimestamp = false;
  let timestampLabel = "";

  if (!previousMessage) {
    // premier message => affiche date ou heure selon le jour
    showTimestamp = true;

    const currentTime = new Date(item.timestamp);
    const today = new Date();

    if (currentTime.toDateString() === today.toDateString()) {
      // ✅ si c'est aujourd'hui, on affiche uniquement l'heure
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
      // ✅ si c'est aujourd'hui => affiche seulement l'heure
      timestampLabel =
        currentDay === today
          ? formatTime(item.timestamp)
          : formatDateTime(item.timestamp);
    } else if (timeDiff > 30 * 60 * 1000) {
      // plus de 30 minutes
      showTimestamp = true;
      // ✅ même logique ici
      timestampLabel =
        currentDay === today
          ? formatTime(item.timestamp)
          : formatDateTime(item.timestamp);
    }
  }
  
  const addSpacing =
  previousMessage && previousMessage.sender.id !== item.sender.id && !showTimestamp; 

  return (
    <View>
        {showTimestamp && (
          <View style={styles.timeSeparatorContainer}>
            <Text style={styles.timestamp}>{timestampLabel}</Text>
          </View>
        )}

      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.friendMessage,
          addSpacing && { marginTop: 12 },
        ]}
      >
        <Text style={isMyMessage ? styles.myMessageText : styles.friendMessageText}>
          {item.content}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={isMyMessage ? styles.myMessageTime : styles.friendMessageTime}>
            {formatTime(item.timestamp)}
          </Text>
          {isMyMessage && (
            <View style={styles.readStatusContainer}>
              <Text style={styles.readStatusText}>
                {
                  lastMessage.id === item.id && (item.is_read ? "Lu" : "Envoyé")
                }
              </Text>
              <View
                style={[
                  styles.readStatusDot,
                  item.is_read
                    ? styles.readStatusDotRead
                    : styles.readStatusDotUnread,
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};


export default MessageContainer;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 3,
  },
  myMessage: {
    backgroundColor: "#FEF094",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  friendMessage: {
    backgroundColor: "#03233A",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  myMessageText: {
    fontSize: 16,
    color: "#03233A",
  },
  friendMessageText: {
    fontSize: 16,
    color: colors.white,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  myMessageTime: {
    fontSize: 12,
    color: "#03233A",
  },
  friendMessageTime: {
    fontSize: 12,
    color: colors.white,
  },
  readStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  readStatusText: {
    fontSize: 12,
    color: "#03233A",
    // marginRight: 4,
    position: "absolute",
    bottom: -33,
    right: -10
  },
  readStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  readStatusDotRead: {
    backgroundColor: colors.green,
  },
  readStatusDotUnread: {
    backgroundColor: colors.neutral500,
  },

  // 👇 style pour le séparateur d'heure
  timeSeparatorContainer: {
    alignSelf: "center",
    marginVertical: 10,
    paddingHorizontal: 12,
    // paddingVertical: 15,
    // backgroundColor: colors.neutral200,
    borderRadius: 12,
  },
  timeSeparatorText: {
    fontSize: 12,
    color: colors.neutral600,
  },
});
