import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { HouseIcon, ChatIcon, BellIcon, UserIcon, PlusIcon } from 'phosphor-react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar2: React.FC<Props> = ({ state, descriptors, navigation }) => {
  const route = state.routes[state.index];
  const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

 
  const hiddenRoutes = [
    'Search',
    'Product',
    'Sell',
    'Conversation',
    'Profile',
    'ProfilMain',
    'Message',
    'ConfidentialityScreen',
    'TrueProfilUserAccess',
    'Notification',
    'MessageMain',
    'Chat'
  ];
  if (hiddenRoutes.includes(routeName)) return null;

  const activeColor = '#03233A';
  const inactiveColor = '#212529';

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            if (route.name === 'Home') {
              navigation.navigate('Home', { screen: 'HomeMain' });
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        const renderIcon = () => {
          switch (label) {
            case 'Accueil':
              return <HouseIcon size={24} color={isFocused ? activeColor : inactiveColor} />;
            case 'Message':
              return <ChatIcon size={24} color={isFocused ? activeColor : inactiveColor} />;
            case 'Notification':
              return <BellIcon size={24} color={isFocused ? activeColor : inactiveColor} />;
            case 'Profile':
              return <UserIcon size={24} color={isFocused ? activeColor : inactiveColor} />;
            case 'Sell':
              return (
                <View className='rounded-full' style={{backgroundColor:"#03233A", padding: 12, marginBottom: "-20"}}>
                  <PlusIcon size={24} color={isFocused ? activeColor : "#fff"} />;
                </View>
              );
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            {renderIcon()}
            <Text style={{ color: isFocused ? activeColor : inactiveColor, fontSize: 12 }}>
              {label !== "Sell" && label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
