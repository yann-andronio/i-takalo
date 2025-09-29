import { ImageSourcePropType } from 'react-native';

export interface ProductDataI {
  id: number;
  title: string;
  image: string;
  type: 'SALE' | 'DONATION';
  description?: string;
  author?: number;
  likes: number[];
  created_at: String;
  price?:number
}

export const ProductData: ProductDataI[] = [
  {
    id: 1,
    title: 'Pull en laine',
    image: require('../assets/images/productCardImage/1.png'),
    type: 'SALE',
    description:
      'Pull chaud en laine, coupe unisexe, idéal pour l’hiver. Ce pull est fabriqué avec des fibres de laine de haute qualité pour vous offrir confort et chaleur tout au long de la saison froide.',
    author: 7, // exemple d'ID d'auteur
    likes: [1, 5, 8], // tableau d'IDs de likes,
    created_at: '2025-08-31T17:27:06.855246Z',
  },
  {
    id: 2,
    title: 'Montre digitale',
    image: require('../assets/images/productCardImage/2.png'),
    type: 'SALE',
    description: 'Montre digitale avec affichage LED et alarme.',
    author: 7,
    likes: [10, 15],
    created_at: '2025-08-31T17:27:06.855246Z',
  },
  {
    id: 3,
    title: 'T-shirt coton',
    image: require('../assets/images/productCardImage/3.png'),
    type: 'DONATION',
    description: 'T-shirt 100% coton, respirant et confortable.',
    author: 7,
    likes: [],
    created_at: '2025-08-31T17:27:06.855246Z',
  },
  {
    id: 4,
    title: 'Sac à dos',
    image: require('../assets/images/productCardImage/4.png'),
    type: 'DONATION',
    description: 'Sac à dos résistant, 20L, poches multiples.',
    author: 7,
    likes: [2],
    created_at: '2025-08-31T17:27:06.855246Z',
  },
  {
    id: 5,
    title: 'Chaussures sport',
    image: require('../assets/images/productCardImage/5.png'),
    type: 'DONATION',
    description: 'Chaussures légères, semelle antidérapante.',
    author: 7,
    likes: [3, 7, 9],
    created_at: '2025-08-31T17:27:06.855246Z',
  },
  {
    id: 6,
    title: 'Table en bois',
    image: require('../assets/images/productCardImage/1.png'),
    type: 'SALE',
    description: 'Table en bois massif, idéale pour la salle à manger.',
    author: 7,
    likes: [4],
    created_at: '2025-08-31T17:27:06.855246Z',
  },
];
