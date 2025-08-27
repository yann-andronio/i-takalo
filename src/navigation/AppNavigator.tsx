// src/navigation/AppNavigator.tsx
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';

const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  /* const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />; 
  } */

  return (
    /*     mila averina avadika aveo
     */ <NavigationContainer>
      {user ? <AuthNavigator /> :<MainNavigator /> }
    </NavigationContainer>
  );
};

export default AppNavigator;
