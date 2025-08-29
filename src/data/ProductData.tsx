export interface ProductDataI {
  id: string;
  titre: string;
  category: string;
  description?: string;
  price: string;
  likes: number;
  adresse: string;
  telphone: string;
  image: any;
  userId: string;
}

export const ProductData: ProductDataI[] = [
  {
    id: '1',
    titre: 'Pull en laine',
    category: 'Vêtements',
    description:'Pull chaud en laine, coupe unisexe, idéal pour l’hiver. Ce pull est fabriqué avec des fibres de laine de haute qualité pour vous offrir confort et chaleur tout au long de la saison froide. Son design élégant et moderne s’adapte à toutes les occasions, que ce soit pour une sortie décontractée, une journée au bureau ou un événement spécial. Les finitions soignées garantissent durabilité et style. Facile à entretenir, ce pull se lave à la main ou en machine selon les instructions, tout en conservant sa forme et sa douceur. Disponible en plusieurs tailles et couleurs pour convenir à tous les goûts. Parfait pour compléter votre garde-robe et rester au chaud avec style.',
    price: 'Ar 25 000',
    likes: 120,
    adresse: 'Antananarivo, Analakely',
    telphone: '034 12 345 67',
    image: require('../assets/images/productCardImage/1.png'),
    userId: '1',
  },
  {
    id: '2',
    titre: 'Montre digitale',
    category: 'Accessoires',
    description: 'Montre digitale avec affichage LED et alarme.',
    price: 'Ar 45 000',
    likes: 95,
    adresse: 'Antananarivo, Ankorondrano',
    telphone: '032 45 678 90',
    image: require('../assets/images/productCardImage/2.png'),
    userId: '2',
  },
  {
    id: '3',
    titre: 'T-shirt coton',
    category: 'Vêtements',
    description: 'T-shirt 100% coton, respirant et confortable.',
    price: 'Ar 15 000',
    likes: 75,
    adresse: 'Antsirabe, Mahazoarivo',
    telphone: '033 98 765 43',
    image: require('../assets/images/productCardImage/3.png'),
    userId: '1',
  },
  {
    id: '4',
    titre: 'Sac à dos',
    category: 'Accessoires',
    description: 'Sac à dos résistant, 20L, poches multiples.',
    price: 'Ar 35 000',
    likes: 50,
    adresse: 'Fianarantsoa, Tanambao',
    telphone: '034 11 223 44',
    image: require('../assets/images/productCardImage/4.png'),
    userId: '3',
  },
  {
    id: '5',
    titre: 'Chaussures sport',
    category: 'Chaussures',
    description: 'Chaussures légères, semelle antidérapante.',
    price: 'Ar 55 000',
    likes: 65,
    adresse: 'Toamasina, Bazary Be',
    telphone: '032 22 333 44',
    image: require('../assets/images/productCardImage/5.png'),
    userId: '4',
  },
];
