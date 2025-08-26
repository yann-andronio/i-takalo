// src/data/UserData.ts
export interface UserDataI {
  id: string;
  username: string;
  email: string;
  profileImage: any;
  followers: number;
}

const defaultProfileImage = require('../assets/images/HeroSectionImage/p1.png');

export const UserData: UserDataI[] = [
  {
    id: '1',
    username: 'JohnDoe',
    email: 'john@example.com',
    profileImage: defaultProfileImage,
    followers: 120,
  },
  {
    id: '2',
    username: 'JaneSmith',
    email: 'jane@example.com',
    profileImage: defaultProfileImage,
    followers: 95,
  },
  {
    id: '3',
    username: 'Alex92',
    email: 'alex92@example.com',
    profileImage: defaultProfileImage,
    followers: 80,
  },
  {
    id: '4',
    username: 'Lila_M',
    email: 'lila.m@example.com',
    profileImage: defaultProfileImage,
    followers: 45,
  },
  {
    id: '5',
    username: 'Tommy77',
    email: 'tommy77@example.com',
    profileImage: defaultProfileImage,
    followers: 200,
  },
  {
    id: '6',
    username: 'SophiaK',
    email: 'sophia.k@example.com',
    profileImage: defaultProfileImage,
    followers: 150,
  },
  {
    id: '7',
    username: 'Mike_L',
    email: 'mike.l@example.com',
    profileImage: defaultProfileImage,
    followers: 65,
  },
  {
    id: '8',
    username: 'EmmaStar',
    email: 'emma.star@example.com',
    profileImage: defaultProfileImage,
    followers: 310,
  },
  {
    id: '9',
    username: 'ChrisB',
    email: 'chris.b@example.com',
    profileImage: defaultProfileImage,
    followers: 72,
  },
  {
    id: '10',
    username: 'Nina_Dev',
    email: 'nina.dev@example.com',
    profileImage: defaultProfileImage,
    followers: 185,
  },
];
