import { ImageSourcePropType } from 'react-native';

export type CarouselItem = {
  title: string;
  subtitle?: string;
  background?: string;
  image: ImageSourcePropType; 
};

export const HeroSectionData: CarouselItem[] = [
  {
    title: `Mode éthique`,
    subtitle: 'Échange & don de vêtements',
    background: '#E02222',
    image: require('../assets/images/banner/1t.png'), 
  },
  {
    title: 'Électronique responsable',
    subtitle: 'Réparé, recyclé, réutilisé',
    background: 'blue',
    image: require('../assets/images/banner/2t.png'), 
  },
  {
    title: 'Maison durable',
    subtitle: 'Appareils réutilisés',
    background: 'grey',
    image: require('../assets/images/banner/3t.png'), 
  },
];
