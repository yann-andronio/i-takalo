import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, CaretRightIcon, UserIcon, IconProps, SignOutIcon,} from 'phosphor-react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamListProfilnavigatorScreen } from '../types/Types';
import { AuthContext } from '../context/AuthContext';
import { mainMenuItems, otherMenuItems, MenuItemData } from '../data/MenuProfilData'

export type ProfilStackNavigation = NavigationProp<RootStackParamListProfilnavigatorScreen>;

interface MenuItemProps {
  title: string;
  icon: React.ReactElement<IconProps>;
  onPress: () => void;
}

const MenuItem = ({ title, icon, onPress }: MenuItemProps) => (
  <TouchableOpacity
    className="flex-row items-center justify-between py-4 border-b border-gray-200"
    onPress={onPress}
  >
    <View className="flex-row items-center">
      <View className="mr-4">{icon}</View>
      <Text className="text-base text-[#03233A]">{title}</Text>
    </View>
    <CaretRightIcon size={20} color="gray" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<ProfilStackNavigation>();
  const { user, logout } = useContext(AuthContext);
  const hasProfilimage = user?.image && user.image.length > 0;

  const renderMenuItem = ({ item }: { item: MenuItemData }) => (
    <MenuItem title={item.title} icon={item.icon} onPress={() => item.onPress(navigation)} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <View className="flex-row items-center px-6 mt-4 mb-5 ">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full bg-gray-100">
            <ArrowLeftIcon size={24} color="black" weight="bold" />
          </TouchableOpacity>
          <Text className="text-lg font-bold ml-5">Profil</Text>
        </View>

      <ScrollView className="flex-1 px-6">


      
        <TouchableOpacity className="bg-white flex-row items-center rounded-2xl w-full  shadow-md mb-8" onPress={() => navigation.navigate("TrueProfilUserAccess")}>
          {hasProfilimage ? (
            <Image
              source={{ uri: user.image }}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-100 items-center justify-center">
              <UserIcon size={30} color="gray" weight="light" />
            </View>
          )}

          <View className="flex-1 ml-4 overflow-hidden">
            <Text
              className="text-lg font-bold text-gray-800"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.first_name} {user?.last_name}
            </Text>
            <Text
              className="text-sm text-gray-500"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.email}
            </Text>
          </View>

          <TouchableOpacity >
            <CaretRightIcon size={25} color="black" weight="bold" />
          </TouchableOpacity>
        </TouchableOpacity>

      
        <FlatList
          data={mainMenuItems}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          className="mb-4"
          scrollEnabled={false}
        />

     
        <Text className="text-base font-bold text-gray-500 mt-4 mb-2">Autres</Text>

        <FlatList
          data={otherMenuItems}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          className="mb-4"
          scrollEnabled={false}
        />
        
        <TouchableOpacity
          className="flex-row bg-[#FEF094] w-full flex items-center px-6 py-3 rounded-full justify-center gap-3"
          onPress={logout}
        >
          <SignOutIcon size={24} color="#000" weight="bold" />
          <Text className="text-lg font-bold text-black">Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}