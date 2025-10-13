import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import { ActivityIndicator, View } from 'react-native';
import { red } from 'react-native-reanimated/lib/typescript/Colors';
const AppNavigator = () => {
  const { user , loadingtoken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />; 
  }



if (loadingtoken) {
    return (
      <View className=' flex-1 bg-[#FEF094] justify-center items-center'>
        <ActivityIndicator size="large" color={"white"} />
      </View>
    );
  }
  return (
    /*     mila averina avadika aveo
     */ <NavigationContainer>
      {user ? <MainNavigator  /> : <AuthNavigator /> }
    </NavigationContainer>
  );
};

export default AppNavigator;
