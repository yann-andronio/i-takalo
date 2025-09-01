// context/UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';
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

interface UserContextType {
  users: UserI[];
  loadingUsers: boolean;
  fetchUsers: () => void;
}

export const UserContext = createContext<UserContextType>({
  users: [],
  loadingUsers: false,
  fetchUsers: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserI[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await API.get("/api/v1/members/");
      const fetchedUsers = res.data.dataset as UserI[];
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, loadingUsers, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};