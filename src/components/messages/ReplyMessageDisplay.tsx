import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../../constants/theme";

interface ReplyMessageDisplayProps {
  replyTo: {
    id: string;
    content: string;
    sender: {
      first_name: string;
      last_name: string;
      id: string;
    };
  };
  isMyMessage: boolean;
  currentUserId?: string;
  onPress?: () => void;
}

const ReplyMessageDisplay: React.FC<ReplyMessageDisplayProps> = ({
  replyTo,
  isMyMessage,
  currentUserId,
  onPress,
}) => {
  const isMyReply = replyTo.sender.id === currentUserId;

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isMyMessage ? styles.myReplyContainer : styles.friendReplyContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.replyBar,
        isMyMessage ? styles.myReplyBar : styles.friendReplyBar
      ]} />
      <View style={styles.textContainer}>
        <Text style={[
          styles.senderName,
          isMyMessage ? styles.mySenderName : styles.friendSenderName
        ]}>
          {isMyReply ? "Vous" : replyTo.sender.first_name}
        </Text>
        <Text 
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.friendMessageText
          ]} 
          numberOfLines={2}
        >
          {replyTo.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReplyMessageDisplay;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  myReplyContainer: {
    backgroundColor: "rgba(254, 240, 148, 0.5)",
  },
  friendReplyContainer: {
    backgroundColor: "rgba(245, 245, 245, 0.7)",
  },
  replyBar: {
    width: 3,
    borderRadius: 2,
    marginRight: 6,
  },
  myReplyBar: {
    backgroundColor: "#03233A",
  },
  friendReplyBar: {
    backgroundColor: colors.neutral400,
  },
  textContainer: {
    flex: 1,
  },
  senderName: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  mySenderName: {
    color: "#03233A",
  },
  friendSenderName: {
    color: colors.neutral700,
  },
  messageText: {
    fontSize: 12,
  },
  myMessageText: {
    color: "#03233A",
  },
  friendMessageText: {
    color: colors.neutral600,
  },
});