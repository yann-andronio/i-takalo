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
  updateUserInList: (updatedUser: UserI) => void;
}

export const UserContext = createContext<UserContextType>({
  users: [],
  loadingUsers: false,
  fetchUsers: () => {},
  updateUserInList: () => {},
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
      const fetchedUsers = res.data.dataset as UserI[];  /* mifetch user jiaby */
      const regularUsers = fetchedUsers.filter(user => user.type === 'USER');
      setUsers(regularUsers);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  //  fonction qui met à jour un utilisateur dans le tableau "users" mampiactualise donne jiaby any a l'instant
  const updateUserInList = (updatedUser: UserI) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, loadingUsers, fetchUsers, updateUserInList }}>
      {children}
    </UserContext.Provider>
  );
};