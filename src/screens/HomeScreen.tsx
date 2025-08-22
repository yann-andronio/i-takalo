import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold mb-6">HomeScreen</Text>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold text-lg">Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}
