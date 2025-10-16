import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProductAdScreen from '../screens/ProductAdScreen';
import WalletScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

import CustomTabBar from '../components/CustomTabBar';
import HomeStackNavigator from './HomeStackNavigator';
import ChatStackNavigator from './ChatStackNavigator';
import ProfilStackNavigator from './ProfilStackNavigator';
import CustomTabBar2 from '../components/CustomTabBar2';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar2 {...props} />}
    >
      <Tab.Screen name="Accueil" component={HomeStackNavigator} />
      <Tab.Screen name="Message" component={ChatStackNavigator} />
      <Tab.Screen name="Sell" component={ProductAdScreen} />
      <Tab.Screen name="Notification" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfilStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
