import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Info } from 'phosphor-react-native';
import { CATEGORIES_DATA } from '../data/PreferenceData';
import { PreferenceCard } from '../components/PreferenceCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const PRIMARY_COLOR = '#083B58';
const ACCENT_YELLOW = '#FEF094';
const DARK_TEXT = '#1F2937';

const MAX_SELECTIONS = 5;
const HEADER_HEIGHT = 80; 
const validationSchema = yup.object().shape({
  preferences: yup
    .array()
    .min(1, 'Sélectionnez au moins une préférence.')
    .required(),
});

export default function PreferencesScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { preferences: [] },
  });

  const preferences = watch('preferences');

  // --- Scroll animation ---
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT], [1, 0]),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT],
          [0, -HEADER_HEIGHT],
        ),
      },
    ],
  }));

  // --- Progress bar + others sticky ---
  const barAnimatedStyle = useAnimatedStyle(() => {
    const top =
      scrollY.value > HEADER_HEIGHT ? 0 : HEADER_HEIGHT - scrollY.value;
    return {
      position: 'absolute',
      top,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      zIndex: 10,
    };
  });

  // --- Progress width ---
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming((preferences.length / MAX_SELECTIONS) * 100, {
      duration: 400,
    });
  }, [preferences.length]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 100], [0, 100])}%`,
    backgroundColor: '#083B58',
  }));

  const onSubmit = (data: any) => {
    console.log(data)
  };

  const handleInfoPress = () => {
    Alert.alert(
      'À propos de vos préférences',
      'Sélectionnez jusqu’à 5 centres d’intérêt pour personnaliser votre fil d’actualités et vos recommandations.',
      [{ text: 'OK, compris ✅' }],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View
        style={headerAnimatedStyle}
        className="px-5 pt-6 pb-2 flex-row items-start justify-between bg-white z-10"
      >
        <View className="flex-1 pr-4">
          <Text
            style={{ color: PRIMARY_COLOR }}
            className="text-3xl font-extrabold"
          >
          Sélectionnez Vos Préférences ✨
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleInfoPress}
          className="p-3 rounded-full bg-white border border-gray-200 shadow-sm"
        >
          <Info size={22} color={PRIMARY_COLOR} weight="bold" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={barAnimatedStyle}
        className="px-5 pt-2 pb-2 border-b border-gray-100"
      >
        <Text className="text-base text-gray-500">
          Choisissez jusqu’à{' '}
          <Text className="font-semibold text-gray-800">{MAX_SELECTIONS}</Text>{' '}
          domaines qui vous inspirent.
        </Text>

        <View className="mt-3 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            style={progressAnimatedStyle}
            className="h-3 rounded-full"
          />
        </View>
        <Text className="text-sm text-gray-600 mt-1 text-right font-medium">
          {preferences.length} / {MAX_SELECTIONS} sélectionné
          {preferences.length > 1 ? 's' : ''}
        </Text>
      </Animated.View>

      {errors.preferences && (
        <View className="mx-5 my-3 p-3 rounded-lg bg-red-100 border border-red-300">
          <Text className="text-red-700 font-semibold text-center">
            ⚠️ {errors.preferences.message}
          </Text>
        </View>
      )}

      <Controller
        control={control}
        name="preferences"
        render={({ field: { onChange, value } }) => (
          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 80,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row flex-wrap justify-between">
              {CATEGORIES_DATA.map(item => {
                const isSelected = value.includes(item.name);
                const toggleCategory = () => {
                  if (isSelected) {
                    onChange(value.filter(name => name !== item.name));
                  } else {
                    if (value.length >= MAX_SELECTIONS) {
                      Alert.alert(
                        'Limite atteinte 🚫',
                        `Vous pouvez sélectionner au maximum ${MAX_SELECTIONS} préférences.`,
                        [{ text: 'OK' }],
                      );
                      return;
                    }
                    onChange([...value, item.name]);
                  }
                };
                return (
                  <PreferenceCard
                    key={item.name}
                    item={item}
                    isSelected={isSelected}
                    toggleCategory={toggleCategory}
                  />
                );
              })}

              {CATEGORIES_DATA.length % 3 === 1 && (
                <View className="w-[30%] mb-4" />
              )}
              {CATEGORIES_DATA.length % 3 === 1 && (
                <View className="w-[30%] mb-4" />
              )}
              {CATEGORIES_DATA.length % 3 === 2 && (
                <View className="w-[30%] mb-4" />
              )}
            </View>
          </Animated.ScrollView>
        )}
      />

      <View className="absolute bottom-0 left-0 right-0 pt-3 pb-8 px-5 border-t border-gray-100 bg-white shadow-2xl">
        <TouchableOpacity
          activeOpacity={preferences.length > 0 ? 0.8 : 1}
          onPress={handleSubmit(onSubmit)}
          disabled={preferences.length === 0}
          className="rounded-full overflow-hidden"
        >
          <View
            style={{
              backgroundColor:
                preferences.length > 0 ? ACCENT_YELLOW : '#E5E7EB',
            }}
            className="py-4 px-6 items-center justify-center flex-row"
          >
            <Text
              style={{
                color: preferences.length > 0 ? DARK_TEXT : DARK_TEXT,
              }}
              className="text-lg font-extrabold mr-2"
            >
              {preferences.length > 0
                ? 'Continuer →'
                : `Sélectionnez au moins 1 préférence`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
