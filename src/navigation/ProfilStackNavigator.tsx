import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/ProfileScreen';
import ConfidentialityScreen from '../screens/MenuProfilScreens/ConfidentialityScreen';
import About from '../screens/MenuProfilScreens/About';
import ConditionToUse from '../screens/MenuProfilScreens/ConditionToUse';
import Dashboard from '../screens/MenuProfilScreens/Dashboard';
import FavoriteProduct from '../screens/MenuProfilScreens/FavoriteProduct';
import TrueProfilUserAccess from '../screens/MenuProfilScreens/TrueProfilUserAccess';
import ProductAdScreen from '../screens/ProductAdScreen';
import ProductScreen from '../screens/ProductScreen';

const Stack = createNativeStackNavigator();

export default function ProfilStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfilMain" component={ProfileScreen} />
      <Stack.Screen name="TrueProfilUserAccess" component={TrueProfilUserAccess} />
      <Stack.Screen name="FavoriteProduct" component={FavoriteProduct} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="ConfidentialityScreen" component={ConfidentialityScreen} />
      <Stack.Screen name="ConditionToUse" component={ConditionToUse} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}