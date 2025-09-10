import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";
import { colors } from "../../constants/theme";
import { AuthContext } from "../../context/AuthContext";

const MessageContainer = ({
  item,
  index,
  onMessageAppear,
}: {
  item: any;
  index: number;
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

  return (
    <View
      style={[
        styles.messageContainer,
        item.sender.id === user?.id ? styles.myMessage : styles.friendMessage,
      ]}
    >
      <Text style={[
        item.sender.id === user?.id ? styles.myMessageText : styles.friendMessageText,
      ]}>{item.content}</Text>
      <View style={styles.messageFooter}>
        <Text style={[
          item.sender.id === user?.id ? styles.myMessageTime : styles.friendMessageTime,
        ]}>
          {formatTime(item.timestamp)}
        </Text>
        {item.sender.id === user?.id && (
          <View style={styles.readStatusContainer}>
            <Text style={styles.readStatusText}>
              {item.is_read ? "Lu" : "Envoyé"}
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
    marginRight: 4,
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
});
