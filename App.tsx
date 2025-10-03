import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css'; // NativeWind
import { LogBox } from 'react-native';
import { ProductProvider } from './src/context/ProductContext';
import { UserProvider } from './src/context/UserContext';
// Masque le warning de SafeAreaView
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);
import Toast from 'react-native-toast-message';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ProductProvider>
          <UserProvider>
            <AppNavigator />
            <Toast />
          </UserProvider>
        </ProductProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
