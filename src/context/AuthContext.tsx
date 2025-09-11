import React, { createContext, useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import API from '../api/Api';

export interface UserI {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: 'USER' | 'ADMIN';
  image?: string; 
  telnumber?: string; 
}

interface AuthContextProps {
  user: UserI | null;
  token: string | null;
  loading: boolean;
  loadingtoken: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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
  register: async () => false,
  logout: async () => {},
  updateUser: () => {}, 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserI | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingtoken, setloadingtoken] = useState(true);

  useEffect(() => {
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

    loadUserFromStorageByToken();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await API.post('/api/v1/auth/login/', { email, password });
      const { token, member } = res.data;

      await EncryptedStorage.setItem('accessToken', token);
      await EncryptedStorage.setItem('user', JSON.stringify(member));

      setToken(token);
      setUser(member);

      console.log('connexion réussi !', member);
      return true;
    } catch (error: any) {
      console.log('Erreur login :', error || 'Erreur réseau');
      return false;
    } finally {
      setLoading(false);
    }
  };

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
      console.log('Erreur register :', error || 'Erreur réseau');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('refreshToken');
    await EncryptedStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

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
        register, 
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
