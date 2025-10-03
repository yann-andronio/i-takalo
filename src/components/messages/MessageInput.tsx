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
  CameraIcon,
  SmileyIcon,
  PaperclipIcon,
  PaperPlaneRightIcon
} from "phosphor-react-native";

interface MessageInputProps {
  messageInputRef: React.RefObject<TextInput>;
  onChangeText: (text: string) => void;
  isButtonDisabled: boolean;
  onSendMessage: () => void;
  onTakePicture: () => void;
  onRecordPress: () => void;
  value?: string;
}

const MessageInput = ({
  isButtonDisabled,
  onSendMessage,
  onTakePicture,
  onRecordPress,
  onChangeText,
  messageInputRef,
  value = "",
}: MessageInputProps) => {
  return (
    <View className="flex-row items-end p-4 bg-white justify-center border-t border-gray-200">
      
      <View className="flex-row items-end gap-2 mr-3 mb-2">
        <TouchableOpacity>
          <PaperclipIcon size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <CameraIcon size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer} className={`flex-row flex-1 items-end px-4 w-full rounded-xl text-black`}>
        <TextInput
          ref={messageInputRef}
          placeholder="Écrivez un message..."
          onChangeText={onChangeText}
          value={value}
          multiline
          placeholderTextColor={colors.neutral400}
          className={`flex-1 text-base text-gray-800 min-h-[40px] max-h-[120px] text-top`}
        />
        <TouchableOpacity className="ml-2 mb-1 self-end pb-1">
          <SmileyIcon size={24} color="gray" />
        </TouchableOpacity>
      </View>
      
      {value.trim() ? (
        <TouchableOpacity
          onPress={onSendMessage}
          disabled={isButtonDisabled}
          className="ml-2  p-3 bg-[#03233A] rounded-full self-end"
        >
            <PaperPlaneRightIcon size={19} color="white" weight="bold" />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.emojiButton} onPress={onRecordPress}>
            <Microphone size={24} color={colors.neutral500} />
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
  textContainer: {
    backgroundColor: colors.gray,
    borderRadius: 50
  }
});
