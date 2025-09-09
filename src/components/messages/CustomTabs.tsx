import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { colors, spacingY } from "../../constants/theme";
import { verticalScale } from "../../utils/styling";
import * as Icons from "phosphor-react-native";

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabbarIcons: any = {
    index: (isFocused: boolean) => (
      <Icons.ChatCircle
        size={verticalScale(25)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.neutral200 : colors.neutral600}
      />
    ),
    notifications: (isFocused: boolean) => (
      <Icons.Bell
        size={verticalScale(25)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.neutral200 : colors.neutral600}
      />
    ),
    profile: (isFocused: boolean) => (
      <Icons.User
        size={verticalScale(25)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.neutral200 : colors.neutral600}
      />
    ),
  };
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.neutral200 : colors.neutral600 },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS == "ios" ? verticalScale(90) : verticalScale(70),
    backgroundColor: colors.black,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral800,
    borderTopWidth: 1,
  },
  tabbarItem: {
    marginBottom: Platform.OS == "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: verticalScale(10),
    fontWeight: "500",
    marginTop: verticalScale(4),
    textAlign: "center",
  },
});
