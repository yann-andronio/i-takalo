import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { memo } from "react";
import { colors } from "../../constants/theme";
import {
  Microphone,
  PaperPlaneRightIcon,
  CameraIcon,
  SmileyIcon,
  PaperclipIcon,
  X,
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
  selectedImages?: string[];
  onRemoveImage?: (index: number) => void;
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
  selectedImages = [],
  onRemoveImage,
}: MessageInputProps) => {
  return (
    <View className="bg-white border-t border-gray-200">
      {/* Prévisualisation des images */}
      {selectedImages.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="p-2 border-b border-gray-200"
        >
          {selectedImages.map((uri, index) => (
            <View key={index} className="mr-2 relative">
              <Image
                source={{ uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => onRemoveImage?.(index)}
                className="absolute -top-1 -right-1 bg-black rounded-full p-1"
              >
                <X size={12} color="white" weight="bold" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Zone de saisie */}
      <View className="flex-row items-end p-4 justify-center">
        <View className="flex-row items-end gap-2 mr-3 mb-2">
          <TouchableOpacity onPress={onPickImage}>
            <PaperclipIcon size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onTakePicture}>
            <CameraIcon size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <View
          style={styles.textContainer}
          className="flex-row flex-1 items-end px-4 w-full rounded-xl text-black"
        >
          <TextInput
            ref={messageInputRef}
            placeholder="Écrivez un message..."
            onChangeText={onChangeText}
            value={value}
            multiline
            placeholderTextColor={colors.neutral400}
            className="flex-1 text-base text-gray-800 min-h-[40px] max-h-[120px] text-top"
          />
          <TouchableOpacity className="ml-2 mb-1 self-end pb-1">
            <SmileyIcon size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {value.trim() || selectedImages.length > 0 ? (
          <TouchableOpacity
            onPress={onSendMessage}
            disabled={isButtonDisabled && selectedImages.length === 0}
            className="ml-2 p-3 bg-[#03233A] rounded-full self-end"
          >
            <PaperPlaneRightIcon size={19} color="white" weight="bold" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.emojiButton} onPress={onRecordPress}>
            <Microphone size={24} color={colors.neutral500} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(MessageInput);

const styles = StyleSheet.create({
  emojiButton: {
    padding: 8,
  },
  textContainer: {
    backgroundColor: colors.gray,
    borderRadius: 50,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});