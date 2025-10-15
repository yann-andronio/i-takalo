import React, { FunctionComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { CheckCircle } from 'phosphor-react-native';

// --- Couleurs ---
const PRIMARY_COLOR = '#083B58';
const ACCENT_YELLOW = '#f1d78a';
const TEXT_DARK = '#1E293B';
const BG_LIGHT = '#FFFFFF';

interface PreferenceCardProps {
  item: { name: string; icon: FunctionComponent<any> };
  isSelected: boolean;
  toggleCategory: () => void;
}

export function PreferenceCard({ item, isSelected, toggleCategory }: PreferenceCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
    toggleCategory();
  };

  const IconComponent = item.icon;

  return (
    <Animated.View
      style={animatedStyle}
      className="w-[31%] mb-4"
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="rounded-2xl items-center justify-center p-4"
        style={{
          backgroundColor: isSelected ? PRIMARY_COLOR : BG_LIGHT,
          borderWidth: isSelected ? 0 : 1,
          borderColor: isSelected ? PRIMARY_COLOR : '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="relative mb-1">
          <View
            className={`rounded-full p-3 ${
              isSelected ? 'bg-white/20' : 'bg-[#f9fafb]'
            }`}
          >
            <IconComponent
              size={26}
              color={isSelected ? ACCENT_YELLOW : PRIMARY_COLOR}
              weight="bold"
            />
          </View>

          {isSelected && (
            <View className="absolute -top-1 -right-1">
              <CheckCircle size={20} color={ACCENT_YELLOW} weight="fill" />
            </View>
          )}
        </View>

        <Text
          className={`text-center text-[12px] mt-1 ${
            isSelected ? 'text-white font-semibold' : 'text-[#1E293B]'
          }`}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
