import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const wp = (percentage: number): number => (width * percentage) / 100;
export const hp = (percentage: number): number => (height * percentage) / 100;