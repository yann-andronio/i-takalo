import React, { createContext, useState, useEffect } from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import API from "../api/Api";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: "USER" | "ADMIN";
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) =>Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);


/* amelioration : logique de sauvegarde de token  */  

const login = async (email: string, password: string) => {
  setLoading(true)
  try {
    const res = await API.post("/api/v1/auth/login/", { email, password });
    const { token, member } = res.data;
    await EncryptedStorage.setItem("accessToken", token);    
    await EncryptedStorage.setItem("user", JSON.stringify(member));
    setUser(member);
    console.log("connexion réussi  !", member);
    return true;
  } catch (error: any) {
    console.log("Erreur login :", error|| "Erreur réseau"); 
    return false
  } finally {
    setLoading(false); 
  }
};


  const register = async (data: any) => {
    setLoading(true)
    try {
      await API.post("/api/v1/auth/register/", {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
          type: 'USER', 
       
      });
          console.log("vita inscription !",);
      return true
    } catch (error: any) {
       console.log("Erreur login :", error || "Erreur réseau"); 
      return false
    }finally{
      setLoading(false)
    }
  };

  const logout = async () => {
    await EncryptedStorage.removeItem("accessToken");
    await EncryptedStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
