import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { memo, useContext } from "react";
import { colors } from "../../constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamListChatnavigatorScreen } from "../../types/Types";
import { Conversation } from "../../types/ModelTypes";

type ChatNavigationProp = NativeStackNavigationProp<
  RootStackParamListChatnavigatorScreen,
  "Chat"
>;


const ConversationItem = ({
  conversation,
  index,
}: {
  conversation: Conversation;
  index: number;
}) => {
  const navigation = useNavigation<ChatNavigationProp>();

  const { user } = useContext(AuthContext);

  if (!conversation) {
    console.warn("⚠️ Conversation vide !");
    return null;
  }

  // Trouver le participant qui n'est pas l'utilisateur connecté
  const participant =
    conversation.participants?.find((p) => p?.id != String(user?.id))

    console.log("conversation.participants", conversation.participants)
    console.log("user?.id", user?.id)
    console.log("participant", participant)

  // Obtenir le dernier message de la conversation
  const lastMessage =
    conversation.messages?.length > 0
      ? conversation.messages[conversation.messages.length - 1]
      : null;

  // Vérifier si le dernier message est non lu et n'est pas de l'utilisateur connecté
  const isUnread = lastMessage
    ? !lastMessage.is_read && lastMessage.sender?.id !== String(user?.id)
    : false;

  // Déterminer le message à afficher
  const getDisplayMessage = () => {
    if (!conversation.messages?.length) return "Aucun message";

    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      const msg = conversation.messages[i];
      if (msg?.sender?.id !== String(user?.id)) {
        return msg?.content || "Message vide";
      }
    }

    return (
      "Vous: " +
      (conversation.messages[conversation.messages.length - 1]?.content ||
        "Message vide")
    );
  };

  const displayMessage = getDisplayMessage();

  // Calculer l'heure relative
  const getRelativeTime = (timestamp: string) => {
    if (!timestamp) return "";
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return "À l'instant";
    if (diffHours === 1) return "Il y a 1h";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffHours < 48) return "Hier";
    return `Il y a ${Math.floor(diffHours / 24)}j`;
  };

  const timeAgo = lastMessage?.timestamp
    ? getRelativeTime(lastMessage.timestamp)
    : "";

  const handlePress = () => {
    navigation.navigate("Chat", {
      conversationId: conversation.id,
      participant: participant,
    });
    console.log("👉 Conversation ouverte avec:", participant);
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(500)
        .springify()
        .damping(14)}
    >
      <Pressable style={styles.container} onPress={handlePress}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              participant?.image
                ? { uri: participant.image }
                : require("../../assets/images/ProfileScreenImage/undefined.jpeg")
            }
            style={styles.avatar}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.name, isUnread && styles.unreadText]}
              numberOfLines={1}
            >
              {participant?.first_name ?? "Inconnu"}{" "}
              {participant?.last_name ?? ""}
            </Text>
            <Text style={[styles.time, isUnread && styles.unreadText]}>
              {timeAgo}
            </Text>
          </View>

          <View style={styles.messageRow}>
            <Text
              style={[styles.message, isUnread && styles.unreadText]}
              numberOfLines={1}
            >
              {displayMessage}
            </Text>

            {isUnread && <View style={styles.unreadIndicator} />}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default memo(ConversationItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.neutral400,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: colors.neutral400,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 14,
    color: colors.neutral500,
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    color: colors.neutral800,
    fontWeight: "600",
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
