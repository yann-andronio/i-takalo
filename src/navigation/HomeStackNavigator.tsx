// src/navigation/HomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductScreen from '../screens/ProductScreen';
import ConversationScreen from '../screens/ConversationScreen';
import Chat from '../screens/chat';
import ValidationTransactionScreen from '../screens/ValidationTransactionScreen';
import TransitionScreen from '../screens/TransitionScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="Transition" component={TransitionScreen} /> 
      <Stack.Screen name="AccueilMain" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ValidationTransaction" component={ValidationTransactionScreen} />

    </Stack.Navigator>
  );
}
