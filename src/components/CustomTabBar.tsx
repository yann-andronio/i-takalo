import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, ImageBackground,} from 'react-native';
import { HouseIcon, ChatIcon, WalletIcon, UserIcon, PlusIcon,} from 'phosphor-react-native';

const { width } = Dimensions.get('window');
const HEIGHT_SIZE = width * 0.17; // hauteur de la barre
const BAR_WIDTH = width * 0.9;

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<Props> = ({ state, descriptors, navigation }) => {
  return (
    <View className=" bg-white h-[11%] absolute bottom-0 w-[100%] justify-center items-center ">
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
            if (!isFocused) navigation.navigate(route.name);
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
                  Sell
                </Text>
              </View>
            );
          }

          const renderIcon = () => {
            switch (label) {
              case 'Home':
                return (
                  <HouseIcon size={28} color={isFocused ? '#FEF094' : '#fff'} />
                );
              case 'Chat':
                return (
                  <ChatIcon size={28} color={isFocused ? '#FEF094' : '#fff'} />
                );
              case 'Wallet':
                return (
                  <WalletIcon
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
