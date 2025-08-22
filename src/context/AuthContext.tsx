import React, { createContext, useState } from 'react';

interface AuthContextProps {
  user: any;
  login: (email: string, password: string) => void;
  register: (data: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = (email: string, password: string) => {
    console.log('Login info:', { email, password });
    setUser({ email }); 
  };

  const register = (data: any) => {
    console.log('Register info:', data);
    setUser({ ...data }); 
  };

  const logout = () => {
    console.log('Logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
