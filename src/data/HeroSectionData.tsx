import { ImageSourcePropType } from 'react-native';

export type CarouselItem = {
  title: string;
  subtitle: string;
  background?: string;
  image: ImageSourcePropType; 
};

export const HeroSectionData: CarouselItem[] = [
  {
    title: 'Promo 1',
    subtitle: 'Les tendances du moment',
    background: '#E02222',
   image: require('../assets/images/productCardImage/1.png'),
  },
  {
    title: 'Promo 2',
    subtitle: 'Nouveautés à découvrir',
    background: 'blue',
   image: require('../assets/images/productCardImage/2.png'),
  },
  {
    title: 'Promo 3',
    background: 'grey',
    subtitle: 'Offres spéciales',
   image: require('../assets/images/productCardImage/3.png'),
  },
];
