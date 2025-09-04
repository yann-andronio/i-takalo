import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import {
  HouseIcon,
  UserIcon,
  PlusIcon,
  BellIcon,
  ChatCircleIcon,
} from 'phosphor-react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const HEIGHT_SIZE = width * 0.17;
const BAR_WIDTH = width * 0.9;

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<Props> = ({ state, descriptors, navigation }) => {
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
    'MessageMain'
  ];
    if (hiddenRoutes.includes(routeName)) return null;

  // raha anaty screen de conditon eto de miala le tabbar
 /*  if (
    routeName === 'Search' ||
    routeName === 'Product' ||
    routeName === 'Sell' ||
    routeName === 'Conversation' ||
    routeName === 'Profile' ||
    routeName === 'ProfilMain' ||
    routeName === 'Chat' ||
    routeName === 'ConfidentialityScreen' ||
    routeName === 'TrueProfilUserAccess'
  )
    return null; */

  return (
    <View className="  h-[11%] absolute bottom-0 w-[100%] justify-center items-center ">
      <ImageBackground
        source={require('../assets/images/HomeScreenImage/Subtract.png')}
        style={styles.container}
        imageStyle={styles.imageBackground}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === 'Home') {
              // Si on clique sur Home, réinitialiser le stack Home à HomeMain
              navigation.navigate('Home', { screen: 'HomeMain' });
            } else if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          // btext hoan btn sell izay mijanona anaty ImageBackground
          if (route.name === 'Sell') {
            return (
              <View key={index} style={styles.tabButton}>
                <Text
                  style={{
                    color: isFocused ? '#FEF094' : '#fff',
                    fontSize: 12,
                    marginTop: 25,
                  }}
                >
                  {/* Sell */}
                </Text>
              </View>
            );
          }

          const renderIcon = () => {
            switch (label) {
              case 'Accueil':
                return (
                  <HouseIcon size={28} color={isFocused ? '#FEF094' : '#fff'} />
                );
              case 'Message':
                return (
                  <ChatCircleIcon size={28} color={isFocused ? '#FEF094' : '#fff'} />
                );
              case 'Notification':
                return (
                  <BellIcon
                    size={28}
                    color={isFocused ? '#FEF094' : '#fff'}
                  />
                );
              case 'Profile':
                return (
                  <UserIcon size={28} color={isFocused ? '#FEF094' : '#fff'} />
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
            >
              {renderIcon()}
              <Text
                style={{ color: isFocused ? '#FEF094' : '#fff', fontSize: 12 }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}

        
      </ImageBackground>

      <Image
        source={require('../assets/images/HomeScreenImage/fotsybar.png')}
        className="absolute z-0"
      />
      {/* icon btn sell izay ivelany  ImageBackground*/}
      {state.routes.map((route: any, index: number) => {
        if (route.name === 'Sell') {
          const isFocused = state.index === index;
          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };
          return (
            <View key={index} style={styles.parentsellicon}>
              <TouchableOpacity style={styles.sellicon} onPress={onPress}>
                <PlusIcon size={36} weight="bold" color="#000000" />
              </TouchableOpacity>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    width: BAR_WIDTH,
    height: HEIGHT_SIZE,
    borderRadius: 500,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
     zIndex: 1,
  },
  imageBackground: {
    borderRadius: 500,
    resizeMode: 'cover',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentsellicon: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 55,
    alignItems: 'center',
  },
  sellicon: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#FEF094',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
});
