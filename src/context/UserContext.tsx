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
  fetchAuthorById: (authorId: number) => Promise<UserI | undefined>;
}

export const UserContext = createContext<UserContextType>({
  users: [],
  loadingUsers: false,
  fetchUsers: () => {},
  updateUserInList: () => {},
  fetchAuthorById: async () => undefined,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserI[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await API.get('/api/v1/members/');
      const fetchallUsers = res.data.dataset as UserI[];
      /* const regularUsers = fetchallUsers.filter(user => user.type === 'USER'); */
      setUsers(fetchallUsers);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fonction pour charger un utilisateur manquant par ID
  const fetchAuthorById = async (authorId: number): Promise<UserI | undefined> => {
 
    const existingUser = users.find(u => u.id === authorId);
    if (existingUser) {
      return existingUser;
    }

    try {
      const res = await API.get(`/api/v1/members/${authorId}`);
      const newAuthor = res.data as UserI;

    
      setUsers(prevUsers => {
        // Double vérification au cas où un autre appel l'aurait déjà ajouté
        if (prevUsers.some(u => u.id === newAuthor.id)) {
          return prevUsers;
        }
        return [...prevUsers, newAuthor];
      });

      console.log(`Auteur ID ${authorId} chargé et mis en cache.`);
      return newAuthor;
    } catch (err) {
      console.error(`Erreur critique: Auteur ID ${authorId} introuvable.`, err);
      return undefined;
    }
  };

  // Met à jour un utilisateur dans le tableau "users"
  const updateUserInList = (updatedUser: UserI) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u)),
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loadingUsers,
        fetchUsers,
        updateUserInList,
        fetchAuthorById, 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
