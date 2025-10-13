import React, { createContext, useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import API from '../api/Api';

export interface UserI {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: 'USER' | 'ADMIN';
  image?: string;
  telnumber?: string;
  profile_picture?: string;
  is_google_user?: boolean;
  username?: string;
}

interface AuthContextProps {
  user: UserI | null;
  token: string | null;
  loading: boolean;
  loadingtoken: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: UserI) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: false,
  loadingtoken: false,
  login: async () => false,
  loginWithGoogle: async () => false,
  register: async () => false,
  logout: async () => {},
  updateUser: () => {},
});

// ⚠️ Configuration Google Sign-In
const GOOGLE_WEB_CLIENT_ID = '82290075303-99d1t00h5nfc82af5fs8kf6dlm7vajlc.apps.googleusercontent.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserI | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingtoken, setloadingtoken] = useState(true);

  useEffect(() => {
    // Configuration de Google Sign-In
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    loadUserFromStorageByToken();
  }, []);

  const loadUserFromStorageByToken = async () => {
    try {
      const storedToken = await EncryptedStorage.getItem('accessToken');
      const userData = await EncryptedStorage.getItem('user');

      if (storedToken && userData) {
        setToken(storedToken);
        setUser(JSON.parse(userData));
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Erreur de loading de data for utilisateur :', error);
      setloadingtoken(false);
    } finally {
      setloadingtoken(false);
    }
  };

  // Connexion classique Email/Password
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await API.post('/api/v1/auth/login/', { email, password });
      const { token, member } = res.data;

      await EncryptedStorage.setItem('accessToken', token);
      await EncryptedStorage.setItem('user', JSON.stringify(member));

      setToken(token);
      setUser(member);

      console.log('Connexion réussie !', member);
      return true;
    } catch (error: any) {
      console.log('Erreur login :', error?.response?.data || 'Erreur réseau');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Vérifier les services Google Play
      await GoogleSignin.hasPlayServices();

      // Obtenir les informations utilisateur
      const userInfo = await GoogleSignin.signIn();
      console.log('✅ Google User Info:', userInfo);

      // Obtenir l'ID token
      const tokens = await GoogleSignin.getTokens();
      console.log('🔑 ID Token:', tokens.idToken);

      // Envoyer le token au backend Django
      const response = await API.post('/api/v1/auth/google/', {
        token: tokens.idToken,
      });

      console.log('✅ Réponse du serveur:', response.data);

      // Sauvegarder le JWT token et les infos utilisateur
      await EncryptedStorage.setItem('accessToken', response.data.token);
      await EncryptedStorage.setItem('user', JSON.stringify(response.data.member));

      setToken(response.data.token);
      setUser(response.data.member);

      console.log('Connexion Google réussie !', response.data.member);
      return true;
    } catch (error: any) {
      handleGoogleSignInError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Gestion des erreurs Google Sign-In
  const handleGoogleSignInError = (error: any) => {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('❌ Connexion Google annulée');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('⏳ Connexion Google en cours...');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('❌ Google Play Services non disponible');
    } else {
      console.error('❌ Erreur Google Sign-In:', error?.response?.data || error.message);
    }
  };

  // Inscription
  const register = async (data: any) => {
    setLoading(true);
    try {
      await API.post('/api/v1/auth/register/', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        type: 'USER',
      });
      console.log('Inscription réussie !');
      return true;
    } catch (error: any) {
      console.log('Erreur register :', error?.response?.data || 'Erreur réseau');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      // Déconnexion de Google si connecté avec Google
      if (user?.is_google_user) {
        await GoogleSignin.signOut();
      }

      await EncryptedStorage.removeItem('accessToken');
      await EncryptedStorage.removeItem('refreshToken');
      await EncryptedStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Mise à jour utilisateur
  const updateUser = (data: UserI) => {
    setUser(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loadingtoken,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};