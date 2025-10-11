import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { X } from "phosphor-react-native";
import { colors } from "../../constants/theme";

interface ReplyPreviewProps {
  replyingTo: {
    id: string;
    content: string;
    sender: {
      first_name: string;
      last_name: string;
    };
  } | null;
  onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ replyingTo, onCancel }) => {
  if (!replyingTo) return null;

  return (
    <View style={styles.container}>
      <View style={styles.replyBar} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.replyingToText}>
            Répondre à {replyingTo.sender.first_name}
          </Text>
          <Text style={styles.messagePreview} numberOfLines={1}>
            {replyingTo.content}
          </Text>
        </View>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={20} color={colors.neutral600} weight="bold" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReplyPreview;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.gray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  replyBar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  replyingToText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 2,
  },
  messagePreview: {
    fontSize: 13,
    color: colors.neutral600,
  },
  closeButton: {
    padding: 4,
  },
});