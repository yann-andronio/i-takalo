import React, { FunctionComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { CheckCircle } from 'phosphor-react-native'; 

interface PreferenceCardProps {
    item: { name: string; icon: FunctionComponent<any>; };
    isSelected: boolean;
    toggleCategory: () => void;
}

// --- Palette de Couleurs ---
const PRIMARY_COLOR = '#083B58';
const ACCENT_YELLOW = '#FEF094';
const DARK_TEXT = '#1F2937';
const INACTIVE_BG = '#F9FAFB';
const BORDER_COLOR = '#E5E7EB'; 

export function PreferenceCard({ item, isSelected, toggleCategory }: PreferenceCardProps) {

    // --- Animations de Clic (Reanimated) " ---
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
    };
    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        toggleCategory();
    };

    const IconComponent = item.icon;

    const cardBackgroundColor = isSelected ? PRIMARY_COLOR : INACTIVE_BG;
    const iconColor = isSelected ? ACCENT_YELLOW : PRIMARY_COLOR; 
    const textColor = isSelected ? 'white' : DARK_TEXT;

    return (
        <Animated.View
            className="w-[30%] mb-4"
        >
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                className="flex-1"
            >
                <Animated.View
                    style={[
                        {
                            backgroundColor: cardBackgroundColor,
                            borderColor: isSelected ? PRIMARY_COLOR : BORDER_COLOR,
                            borderWidth: isSelected ? 0 : 1,
                            shadowColor: isSelected ? PRIMARY_COLOR : 'transparent',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: isSelected ? 0.3 : 0,
                            shadowRadius: 6,
                            elevation: isSelected ? 8 : 1,
                        },
                        animatedStyle,
                    ]}
                    className="rounded-xl p-3 items-center justify-center h-32 relative"
                >
                    {isSelected && (
                        <View className="absolute top-[-8px] right-[-8px] z-10">
                            <CheckCircle size={28} weight="fill" color={ACCENT_YELLOW} />
                        </View>
                    )}

                    <View className={`rounded-full p-2 mb-2 ${isSelected ? 'bg-white/10' : 'bg-white'}`}>
                        <IconComponent size={28} color={iconColor} weight="bold" />
                    </View>

                    <Text
                        style={{ color: textColor }}
                        className={`text-center text-xs leading-4 mt-1 ${isSelected ? 'font-extrabold' : 'font-semibold'}`}
                        numberOfLines={2}
                    >
                        {item.name}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
}