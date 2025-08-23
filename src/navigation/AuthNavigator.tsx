// navigation/AuthNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../auth/LoginScreen";
import RegisterScreen from "../auth/RegisterScreen.tsx";
import StartScreen from "../screens/StartScreen.tsx";


const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="Start" component={StartScreen} />
   
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
