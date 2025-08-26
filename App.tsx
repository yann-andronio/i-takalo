import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import "./global.css"; // NativeWind
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
// Masque le warning de SafeAreaView
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
]);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
