import { Pressable, Image, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { User } from "@/types";
import Animated, { FadeInRight } from "react-native-reanimated";
import { colors } from "../../constants/theme";

const FriendsConnectedfriend = ({
  index,
  friend,
}: {
  index: number;
  friend: User;
}) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(500)
        .springify()
        .damping(14)}
      style={styles.container}
    >
      <Pressable style={styles.pressableContainer}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: friend.avatar_url }} style={styles.avatar} />
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: friend.status
                    ? colors.green
                    : colors.neutral400,
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {friend.first_name}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default memo(FriendsConnectedfriend);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  pressableContainer: {
    alignItems: "center",
    width: "100%",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 6,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.black,
    borderRadius: 10,
    padding: 3,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.neutral200,
    textAlign: "center",
    maxWidth: 80,
  },
});
