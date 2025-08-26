export interface ProductDataI {
  id: string; 
  name: string;
  status: string;
  price: string;
  likes: number;
  category: string; // catégorie ajoutée
  image: any;
  profileImage?: any;
}

const defaultImage = require('../assets/images/HeroSectionImage/p1.png');

export const ProductData: ProductDataI[] = [
  {
    id: '1',
    name: 'Pull en laine',
    status: 'Neuf',
    price: 'Ar 25 000',
    likes: 120,
    category: 'Vêtements',
    image: require('../assets/images/productCardImage/1.png'),
    profileImage: defaultImage,
  },
  {
    id: '2',
    name: 'Montre digitale',
    status: 'Neuf',
    price: 'Ar 45 000',
    likes: 95,
    category: 'Accessoires',
    image: require('../assets/images/productCardImage/2.png'),
    profileImage: defaultImage,
  },
  {
    id: '3',
    name: 'T-shirt coton',
    status: 'Neuf',
    price: 'Ar 15 000',
    likes: 75,
    category: 'Vêtements',
    image: require('../assets/images/productCardImage/3.png'),
    profileImage: defaultImage,
  },
  {
    id: '4',
    name: 'Sac à dos',
    status: 'Neuf',
    price: 'Ar 35 000',
    likes: 50,
    category: 'Accessoires',
    image: require('../assets/images/productCardImage/4.png'),
    profileImage: defaultImage,
  },
  {
    id: '5',
    name: 'Chaussures sport',
    status: 'Neuf',
    price: 'Ar 55 000',
    likes: 65,
    category: 'Chaussures',
    image: require('../assets/images/productCardImage/5.png'),
    profileImage: defaultImage,
  },
];
