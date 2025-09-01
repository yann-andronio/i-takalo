// src/data/UserData.ts
export interface UserI {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: 'USER' | 'ADMIN';
  // Note: 'followers' n'est pas dans l'interface UserI, il a donc été retiré du tableau
  // Note: 'profileImage' n'est pas dans l'interface UserI, il a donc été retiré du tableau
}

export const UserData: UserI[] = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    type: 'USER',
  },
  {
    id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    type: 'USER',
  },
  {
    id: 3,
    first_name: 'Alex',
    last_name: 'Jackson',
    email: 'alex92@example.com',
    type: 'USER',
  },
  {
    id: 4,
    first_name: 'Lila',
    last_name: 'M',
    email: 'lila.m@example.com',
    type: 'USER',
  },
  {
    id: 5,
    first_name: 'Tommy',
    last_name: 'Finch',
    email: 'tommy77@example.com',
    type: 'USER',
  },
  {
    id: 6,
    first_name: 'Sophia',
    last_name: 'K',
    email: 'sophia.k@example.com',
    type: 'USER',
  },
  {
    id: 7,
    first_name: 'Mike',
    last_name: 'Lee',
    email: 'mike.l@example.com',
    type: 'USER',
  },
  {
    id: 8,
    first_name: 'Emma',
    last_name: 'Star',
    email: 'emma.star@example.com',
    type: 'USER',
  },
  {
    id: 9,
    first_name: 'Chris',
    last_name: 'Brown',
    email: 'chris.b@example.com',
    type: 'USER',
  },
  {
    id: 10,
    first_name: 'Nina',
    last_name: 'Dev',
    email: 'nina.dev@example.com',
    type: 'USER',
  },
];