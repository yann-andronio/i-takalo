// weight : mi modifier epaisseur d' icone 
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HouseIcon, ShoppingCartIcon, CubeIcon, ChatIcon, UserIcon } from 'phosphor-react-native';

import HomeScreen from '../screens/HomeScreen';
import ProductAdScreen from '../screens/ProductAdScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

const tabScreens = [
  { name: 'Home', component: HomeScreen, icon: HouseIcon },
  { name: 'Cart', component: WalletScreen, icon: ShoppingCartIcon },
  { name: 'Products', component: ProductAdScreen, icon: CubeIcon },
  { name: 'Profile', component: ChatScreen, icon: ChatIcon },
  { name: 'Settings', component: ProfileScreen, icon: UserIcon },
];

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          padding: 8,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#9f7126',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {tabScreens.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          options={{
            tabBarIcon: ({ color }) => (
              <item.icon color={color} size={28} weight="regular" />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainNavigator;
