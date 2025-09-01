import { IconProps, MagnifyingGlassIcon, InfoIcon, ChartLineIcon, HeartIcon, FileTextIcon} from 'phosphor-react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamListProfilnavigatorScreen } from '../types/Types';
import React from 'react';

export interface MenuItemData {
  id: string;
  title: string;
  icon: React.ReactElement<IconProps>;
  onPress: (navigation: NavigationProp<RootStackParamListProfilnavigatorScreen>) => void;
}

export const mainMenuItems: MenuItemData[] = [
  {
    id: '1',
    title: 'Articles favoris',
    icon: <HeartIcon size={24} color="#03233A" />,
    onPress: (navigation) => navigation.navigate('FavoriteProduct'),
  },
  {
    id: '2',
    title: 'Dashboard',
    icon: <ChartLineIcon size={24} color="#03233A" />,
    onPress: (navigation) => navigation.navigate('Dashboard'),
  },
];

export const otherMenuItems: MenuItemData[] = [
  {
    id: '3',
    title: 'Politique de sécurité',
    icon: <MagnifyingGlassIcon size={24} color="#03233A" />,
    onPress: (navigation) => navigation.navigate('ConfidentialityScreen'),
  },
  {
    id: '4',
    title: 'Conditions d\'utilisation',
    icon: <FileTextIcon size={24} color="#03233A" />,
    onPress: (navigation) => navigation.navigate('ConditionToUse'),
  },
  {
    id: '5',
    title: 'À propos de iTakalo',
    icon: <InfoIcon size={24} color="#03233A" />,
    onPress: (navigation) => navigation.navigate('About'),
  },
];