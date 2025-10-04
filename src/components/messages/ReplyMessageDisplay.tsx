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
}

const ReplyMessageDisplay: React.FC<ReplyMessageDisplayProps> = ({
  replyTo,
  isMyMessage,
  currentUserId,
}) => {
  const isMyReply = replyTo.sender.id === currentUserId;

  return (
    <View 
      style={[
        styles.container,
        isMyMessage ? styles.myReplyContainer : styles.friendReplyContainer
      ]}
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
          ellipsizeMode="tail"
        >
          {replyTo.content}
        </Text>
      </View>
    </View>
  );
};

export default ReplyMessageDisplay;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 4,
    borderRadius: 8,
    marginBottom: 4,
    minWidth: 150,
  },
  myReplyContainer: {
    backgroundColor: "#FFF4A9",
  },
  friendReplyContainer: {
    backgroundColor: "#FAFAFA",
  },
  replyBar: {
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
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
    paddingVertical: 6,
    paddingRight: 8, // Ajout d'un padding droit
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
    color: colors.neutral600,
  },
  friendMessageText: {
    color: colors.neutral600,
  },
});