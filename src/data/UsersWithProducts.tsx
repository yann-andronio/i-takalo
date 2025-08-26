export interface ProductDataI {
  id: string;
  name: string;
  category: string;
  genre: 'Homme' | 'Femme' | 'Unisexe';
  style: string;
  size: string[];
  price: string;
  season?: string;
  description?: string;
  likes: number;
  image: any;
}

export interface UserDataI {
  id: string;
  username: string;
  email: string;
  profileImage: any;
  followers: number;
  products: ProductDataI[];
}

const defaultProfileImage = require('../assets/images/HeroSectionImage/p1.png');

export const UsersWithProducts: UserDataI[] = [
  {
    id: '1',
    username: 'JohnDoe',
    email: 'john@example.com',
    profileImage: defaultProfileImage,
    followers: 120,
    products: [
      {
        id: '1',
        name: 'Pull en laine',
        category: 'Vêtements',
        genre: 'Homme',
        style: 'Casual',
        size: ['S', 'M', 'L'],
        price: 'Ar 25 000',
        season: 'Hiver',
        description: 'Pull chaud en laine, parfait pour l’hiver',
        likes: 120,
        image: require('../assets/images/productCardImage/1.png'),
      },
      {
        id: '2',
        name: 'T-shirt coton',
        category: 'Vêtements',
        genre: 'Femme',
        style: 'Sport',
        size: ['M', 'L'],
        price: 'Ar 15 000',
        season: 'Été',
        description: 'T-shirt léger et confortable',
        likes: 75,
        image: require('../assets/images/productCardImage/3.png'),
      },
    ],
  },
  {
    id: '2',
    username: 'JaneSmith',
    email: 'jane@example.com',
    profileImage: defaultProfileImage,
    followers: 95,
    products: [
      {
        id: '3',
        name: 'Montre digitale',
        category: 'Accessoires',
        genre: 'Unisexe',
        style: 'Sport',
        size: [],
        price: 'Ar 45 000',
        season: undefined,
        description: 'Montre résistante à l’eau avec chronomètre',
        likes: 95,
        image: require('../assets/images/productCardImage/2.png'),
      },
      {
        id: '4',
        name: 'Sac à dos',
        category: 'Accessoires',
        genre: 'Homme',
        style: 'Casual',
        size: [],
        price: 'Ar 35 000',
        season: undefined,
        description: 'Sac à dos spacieux pour les activités quotidiennes',
        likes: 50,
        image: require('../assets/images/productCardImage/4.png'),
      },
    ],
  },
  {
    id: '3',
    username: 'Alex92',
    email: 'alex92@example.com',
    profileImage: defaultProfileImage,
    followers: 80,
    products: [
      {
        id: '5',
        name: 'Chaussures sport',
        category: 'Chaussures',
        genre: 'Femme',
        style: 'Sport',
        size: ['38', '39', '40'],
        price: 'Ar 55 000',
        season: undefined,
        description: 'Chaussures légères et confortables pour le sport',
        likes: 65,
        image: require('../assets/images/productCardImage/5.png'),
      },
      {
        id: '6',
        name: 'Veste en jean',
        category: 'Vêtements',
        genre: 'Unisexe',
        style: 'Casual',
        size: ['M', 'L'],
        price: 'Ar 60 000',
        season: 'Printemps',
        description: 'Veste en jean de haute qualité, indémodable',
        likes: 85,
        image: require('../assets/images/productCardImage/6.png'),
      },
    ],
  },
];
