import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useRef } from "react";
import { colors } from "../../constants/theme";
import {
  Camera,
  Microphone,
  PaperPlaneRight,
  Image,
} from "phosphor-react-native";

interface MessageInputProps {
  messageInputRef: React.RefObject<TextInput>;
  onChangeText: (text: string) => void;
  isButtonDisabled: boolean;
  onSendMessage: () => void;
  onTakePicture: () => void;
  onPickImage: () => void;
  onRecordPress: () => void;
  value?: string;
}

const MessageInput = ({
  isButtonDisabled,
  onSendMessage,
  onTakePicture,
  onPickImage,
  onRecordPress,
  onChangeText,
  messageInputRef,
  value = "",
}: MessageInputProps) => {
  // Ne re-render que si ces props changent
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.sendButton} onPress={onTakePicture}>
        <Camera size={24} color={colors.white} weight="fill" />
      </TouchableOpacity>
      <TextInput
        ref={messageInputRef}
        style={styles.textInput}
        placeholder="Écrivez un message..."
        onChangeText={onChangeText}
        value={value}
        multiline
        placeholderTextColor={colors.neutral400}
      />
      {value.trim() ? (
        <TouchableOpacity
          style={[
            styles.sendButton,
            isButtonDisabled ? styles.sendButtonDisabled : {},
          ]}
          onPress={onSendMessage}
          disabled={isButtonDisabled}
        >
          <PaperPlaneRight
            size={24}
            color={isButtonDisabled ? colors.neutral400 : colors.white}
            weight="fill"
          />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.emojiButton} onPress={onRecordPress}>
            <Microphone size={24} color={colors.neutral500} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.emojiButton} onPress={onPickImage}>
            <Image size={24} color={colors.neutral500} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default memo(MessageInput);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: colors.neutral800,
    backgroundColor: colors.black,
  },
  emojiButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.neutral700,
    color: colors.neutral300,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral200,
  },
});
